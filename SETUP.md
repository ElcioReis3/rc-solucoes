# RC Soluções — Guia de Setup

Este documento explica o que foi feito no projeto e o passo a passo para
colocá-lo no ar com Firebase (produtos, imagens, painel admin e empresas
parceiras).

## 1. O que mudou

- **Arquitetura em camadas** (equivalente a MVC no contexto Next.js):
  - `models/` — tipos de domínio (`Product`, `Category`/`SubCategory`,
    `PartnerCompany`, `PlanInfo`).
  - `services/` — acesso a dados (Firestore/Storage/Auth via Firebase Admin
    SDK, Stripe). É a única camada que fala com o Firebase/Stripe.
  - `app/` — rotas (Next.js App Router) = "controllers" + "views" da
    página pública e do painel admin. As páginas chamam os `services` e
    passam os dados para os `components`.
  - `components/` — camada de visualização (`ui/` genéricos do design
    system, `layout/` da landing page, `products/`, `partners/`, `admin/`).
  - `lib/` — utilitários e validação (zod).
- **Firebase**: Firestore (dados), Cloud Storage (imagens) e Authentication
  (login do admin).
- **Painel admin** em `/admin`: login com e-mail/senha, CRUD de produtos
  (até 3 fotos, com reordenação e capa, filtro, busca e paginação na
  listagem), CRUD de categorias/subcategorias, CRUD de empresas parceiras
  (logo + banner).
- **Categorias dinâmicas**: `category`/`subCategory` do produto não são mais
  valores fixos no código — são geridos pelo admin em `/admin/categories` e
  guardados no Firestore (coleções `categories`/`subcategories`). Os
  produtos guardam o *slug* da categoria/subcategoria, não um id, então o
  catálogo já importado continua funcionando (ver passo 6).
- **Limite de produtos + Stripe**: a conta começa com um limite de 100
  produtos cadastrados (ativos + inativos contam). Ao atingir o limite, o
  cadastro de novos produtos é bloqueado e o admin vê um botão para comprar
  mais 25 vagas via Stripe Checkout; um webhook confirma o pagamento e soma
  +25 ao limite automaticamente (sempre de 25 em 25). Ver passo 8.
- **Segurança**: toda leitura/escrita de produtos, categorias e parceiros
  acontece no servidor, com a Admin SDK (que ignora as regras do
  Firestore/Storage). Por isso `firestore.rules` e `storage.rules` bloqueiam
  100% do acesso vindo do navegador — o único uso do SDK client-side é o
  login (Firebase Auth).
- **Vitrine pública** (`/portfolio` e seção da home): busca os produtos
  ativos no Firestore, com filtro por categoria/subcategoria e carrossel
  automático (até 3 fotos) em cada produto.
- O catálogo estático antigo (`data/product.ts`) foi mantido **somente**
  como fonte para o script de importação (`scripts/seed-products.mjs`); o
  site não lê mais esse arquivo.

## 2. Criar o projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
   e crie um projeto (ou use o `rc-solucoes` que já aparece no seu print).
2. Ative os produtos:
   - **Firestore Database** → criar banco (modo produção).
   - **Storage** → ativar (anote o nome do bucket, ex.:
     `rc-solucoes.firebasestorage.app`).
   - **Authentication** → aba "Sign-in method" → ative **E-mail/senha**.
3. Em **Authentication → Users**, clique em "Adicionar usuário" e crie o
   primeiro admin (e-mail + senha). Não existe tela de cadastro no site —
   por segurança, admins só são criados pelo Console (ou depois, por outro
   admin, diretamente no Firebase).

## 3. Configurar as variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

- **Bloco `NEXT_PUBLIC_FIREBASE_*`**: em Configurações do projeto → Geral →
  "Seus apps" → app Web → "SDK setup and configuration" → Config.
- **Bloco `FIREBASE_*` (server-only)**: em Configurações do projeto →
  Contas de serviço → "Gerar nova chave privada" (baixa um JSON com
  `project_id`, `client_email` e `private_key` — copie cada um para a
  variável correspondente). `FIREBASE_STORAGE_BUCKET` é o mesmo bucket do
  passo anterior.

**Nunca** commite `.env.local` nem o JSON da conta de serviço (já estão no
`.gitignore`).

## 4. Instalar e rodar

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Painel admin: http://localhost:3000/admin/login (use o usuário criado no
  passo 2.3)

## 5. Publicar as regras de segurança

Com a [Firebase CLI](https://firebase.google.com/docs/cli) instalada e
logada (`firebase login`):

```bash
firebase use --add        # selecione o projeto na primeira vez
firebase deploy --only firestore:rules,storage:rules
```

## 6. Importar categorias e produtos que já existiam

Primeiro as categorias/subcategorias que o catálogo antigo usa (`limpeza`,
`expediente`, `papel`, `quimicos`, etc. — necessário para os produtos
importados a seguir não ficarem com uma categoria "órfã"):

```bash
node --env-file=.env scripts/seed-categories.mjs
```

Depois os 39 produtos que estavam fixos no código:

```bash
node --env-file=.env scripts/seed-products.mjs --dry-run   # confere o que será feito
node --env-file=.env scripts/seed-products.mjs             # importa de verdade
```

(`--env-file=.env` carrega as variáveis do passo 3 — necessário porque esses
scripts rodam fora do Next.js. Exige Node 20.6+; confira com `node -v`.)

Instruções completas em `scripts/SEED-SETUP.md`. Depois de importado, use o
painel `/admin/products` e `/admin/categories` para editar, adicionar mais
fotos (até 3 por produto), criar categorias novas ou cadastrar produtos.

## 7. Cadastrar as empresas parceiras

Em `/admin/partners`, clique em "Nova empresa" e envie a logo (imagem
quadrada) e o banner de cada parceiro. Elas aparecem automaticamente na
seção "Empresas Parceiras" da landing page (só as marcadas como "Visível").

## 8. Configurar o Stripe (vagas extras de produtos)

Só é necessário se/quando você quiser vender pacotes de +25 produtos. Sem
isso configurado, tudo o resto do site funciona normalmente — só o botão
"Comprar mais 25 vagas" não vai funcionar até esse passo ser feito.

1. Crie uma conta em [dashboard.stripe.com](https://dashboard.stripe.com)
   (pode começar em modo teste).
2. Em **Catálogo de produtos**, crie um produto (ex.: "Pacote +25 produtos")
   com um **Preço** único (o valor que você quiser cobrar). Copie o **Price
   ID** (começa com `price_...`) para `STRIPE_PRICE_ID_SLOT_PACK` no `.env`.
3. Em **Desenvolvedores → Chaves de API**, copie a **Chave secreta** para
   `STRIPE_SECRET_KEY`.
4. Configure o webhook:
   - **Em produção**: Desenvolvedores → Webhooks → Adicionar endpoint →
     URL `https://SEU-DOMINIO/api/stripe/webhook`, evento
     `checkout.session.completed`. Copie o "Signing secret" para
     `STRIPE_WEBHOOK_SECRET`.
   - **Em desenvolvimento local**, use a
     [Stripe CLI](https://stripe.com/docs/stripe-cli):
     ```bash
     stripe listen --forward-to localhost:3000/api/stripe/webhook
     ```
     Ela imprime um `whsec_...` — use esse valor em `STRIPE_WEBHOOK_SECRET`
     enquanto estiver testando localmente.
5. Teste: com o limite de produtos atingido, clique em "Comprar mais 25
   vagas" em `/admin/products`, complete o checkout (em modo teste, use o
   cartão `4242 4242 4242 4242`, qualquer data futura e CVC) e confirme que
   o limite subiu em +25.

O limite inicial (100 produtos) e o tamanho do pacote (25) estão em
`services/plan.service.ts` (`DEFAULT_PRODUCT_LIMIT` e `SLOT_PACK_SIZE`) —
mude ali se precisar de outros números.

## 9. Deploy

Qualquer provedor que rode Next.js (Vercel, por exemplo) funciona — é só
configurar as mesmas variáveis de ambiente do passo 3 no painel do provedor.
Não é necessário nenhum passo extra: as rotas que usam Firebase já estão
marcadas como dinâmicas (`export const dynamic = "force-dynamic"`), então o
build nunca tenta acessar o Firebase durante o build em si, só em tempo de
requisição.

## 10. Estrutura resumida

```
app/
  page.tsx                     → landing page (lê produtos/parceiros)
  portfolio/page.tsx           → catálogo público com filtros
  admin/
    login/page.tsx             → login (público)
    (dashboard)/layout.tsx     → protege tudo abaixo (verifica sessão)
    (dashboard)/products/      → CRUD de produtos (filtro + paginação + limite)
    (dashboard)/categories/    → CRUD de categorias/subcategorias
    (dashboard)/partners/      → CRUD de empresas parceiras
  api/auth/session/route.ts    → cria/remove o cookie de sessão
  api/stripe/checkout/route.ts → inicia o Stripe Checkout (+25 vagas)
  api/stripe/webhook/route.ts  → confirma pagamento e soma +25 ao limite

models/            → tipos (Product, Category/SubCategory, PartnerCompany, PlanInfo)
services/
  firebase/client.ts    → Firebase client SDK (só login)
  firebase/admin.ts     → Firebase Admin SDK (todo o resto)
  products.service.ts   → CRUD de produtos + upload de imagens
  categories.service.ts → CRUD de categorias/subcategorias
  partners.service.ts   → CRUD de parceiros + upload de imagens
  storage.service.ts    → upload/remoção de arquivos no Storage
  auth.service.ts       → sessão (cookie) e verificação de admin
  plan.service.ts        → contagem/limite de produtos
  stripe.service.ts      → Checkout Session + verificação de webhook

components/
  ui/          → design system (shadcn)
  layout/      → header, hero, seções da home
  products/    → card, carrossel, filtros, grid
  partners/    → seção pública de parceiros
  admin/       → sidebar, formulários, tabelas, gestor de categorias, botão de compra

proxy.ts (antigo middleware.ts) → bloqueia /admin/* sem cookie de sessão
firestore.rules / storage.rules → bloqueiam 100% do acesso client-side
scripts/        → importação do catálogo antigo (categorias + produtos) para o Firebase
```
