# Seed de produtos para o Firebase

Este script lê os produtos que já existem em `data/product.ts`, faz upload
de cada imagem para o **Cloud Storage** e grava os dados de cada produto na
coleção `products` do **Firestore**.

Rode **primeiro** `seed-categories.mjs` (os produtos referenciam categorias/
subcategorias que precisam existir antes) e depois `seed-products.mjs`.

Arquivos:

- `scripts/seed-categories.mjs` — cria as categorias/subcategorias
  (`limpeza`, `expediente`, `papel`, `quimicos`, etc.) que o catálogo antigo
  usa. Seguro rodar mais de uma vez (pula o que já existe).
- `scripts/extract-products.mjs` — converte `data/product.ts` em
  `scripts/data/products-seed.json` (já gerado; rode de novo só se
  `data/product.ts` mudar).
- `scripts/seed-products.mjs` — faz o upload das imagens + grava no Firestore.

## 1. Instalar as dependências do projeto

O `firebase-admin` agora também é usado pelo próprio app (painel admin), então
basta instalar as dependências normalmente:

```bash
npm install
```

## 2. Criar/obter a chave de serviço do Firebase

1. No [Console do Firebase](https://console.google.com/), abra o projeto
   `rc-solucoes` (o mesmo que aparece no print que você mandou).
2. Vá em **Configurações do projeto → Contas de serviço**.
3. Clique em **Gerar nova chave privada** e baixe o arquivo JSON.
4. Salve esse arquivo na raiz do projeto como `serviceAccountKey.json`
   (esse nome já está no `.gitignore` — **nunca** suba esse arquivo pro Git).

## 3. Definir as variáveis de ambiente

Mais simples: garanta que `FIREBASE_STORAGE_BUCKET` e
`GOOGLE_APPLICATION_CREDENTIALS=serviceAccountKey.json` estejam no seu
`.env` (ver `.env.example` na raiz) e rode os scripts com `--env-file`
(exige Node 20.6+, confira com `node -v`):

```bash
node --env-file=.env scripts/seed-categories.mjs
```

> O nome do bucket aparece no Console em **Storage**, geralmente no formato
> `SEU-PROJETO.firebasestorage.app` (ou `SEU-PROJETO.appspot.com` em
> projetos mais antigos). Confirme lá antes de rodar.

Alternativa sem `--env-file` (exportando na mão, vale só para a sessão atual
do terminal):

```bash
# Windows (PowerShell)
$env:FIREBASE_STORAGE_BUCKET="rc-solucoes.firebasestorage.app"
$env:GOOGLE_APPLICATION_CREDENTIALS="serviceAccountKey.json"

# Mac/Linux
export FIREBASE_STORAGE_BUCKET="rc-solucoes.firebasestorage.app"
export GOOGLE_APPLICATION_CREDENTIALS="serviceAccountKey.json"
```

## 4. Testar sem gravar nada (dry run)

```bash
node --env-file=.env scripts/seed-products.mjs --dry-run
```

Isso mostra, produto por produto, o que seria enviado ao Storage e gravado
no Firestore, sem tocar no Firebase de verdade. Use para conferir antes.

## 5. Rodar de verdade

```bash
node --env-file=.env scripts/seed-products.mjs
```

O script:

- Sobe cada imagem de `public/assets/images/images-produtos/...` para
  `products/{id}/image-1.jpg` no Storage;
- Grava em `products/{id}` no Firestore: `title`, `description`, `images`
  (array, pronta para os outros 2 slots que o painel admin vai preencher),
  `category`, `subCategory`, `active`, `order`, `createdAt`, `updatedAt`.
- É seguro rodar mais de uma vez: usa `merge: true`, então só atualiza os
  documentos existentes em vez de duplicar.

Se algum produto falhar (imagem faltando, permissão negada, etc.), o script
continua com os demais e mostra um resumo no final (quantos OK, quantos
falharam) — não para tudo por causa de um erro isolado.

## Regenerar o JSON de seed

Se você editar `data/product.ts` antes de rodar o seed, regenere o JSON:

```bash
node scripts/extract-products.mjs
```
