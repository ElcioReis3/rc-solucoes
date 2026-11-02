# Seed dos 49 produtos (fotos do WhatsApp) + ordenação por nome

## O que foi feito

1. **Analisei as 52 fotos** enviadas (zip "Rc Soluções") e identifiquei cada
   produto pelo rótulo/embalagem (marca, variante, tamanho). 3 fotos eram
   duplicatas do mesmo produto (`WA0039_1`, `WA0054(1)`, `WA0056(1)`) — essas
   foram descartadas, restando **49 produtos únicos**. Todos caem na
   categoria **Limpeza**, distribuídos nas subcategorias:
   - Químicos: 34 (detergentes, desinfetantes, água sanitária, álcool,
     inseticidas, odorizadores, lustra-móveis, etc.)
   - Utensílios: 11 (vassouras, esponjas, rodos, balde mop, escovas, pano)
   - Luvas: 2 (nitrilo e vinil)
   - Papel: 1 (papel higiênico)
   - Higiênicos: 1 (touca descartável)

2. **Criei um script de seed novo**, `scripts/seed-rc-products.mjs`, que lê
   `scripts/data/products-seed-rc.json` (título, descrição, categoria,
   subcategoria e imagem de cada um dos 49 produtos — já preenchido por mim),
   sobe cada foto pro Cloud Storage e grava o produto no Firestore no mesmo
   formato que o painel admin usa. É seguro rodar mais de uma vez: ele
   verifica pelo **título** se o produto já existe antes de criar, então
   nunca duplica.

3. **Troquei a ordenação dos produtos de "ordem de inserção" para
   "alfabética por nome"**, nos dois lugares que exibem a lista:
   - `services/products.service.ts` (catálogo público e lista do admin)
   - `components/products/product-grid.tsx` (agrupamento por
     categoria/subcategoria na vitrine)

   Agora, sempre que um produto for criado ou editado, ele aparece na
   posição alfabética correta automaticamente — não precisa reordenar nada
   na mão.

## Como aplicar

1. Extraia o zip entregue na raiz do seu projeto (ele já respeita a
   estrutura de pastas: `services/`, `components/`, `scripts/` e
   `public/assets/images/images-produtos-rc/` com as 49 fotos).
2. Rode `npm install` normalmente (nenhuma dependência nova).
3. Se ainda não rodou antes, rode primeiro o script de categorias:
   ```bash
   node --env-file=.env scripts/seed-categories.mjs
   ```
4. Confira antes de gravar de verdade (não grava nada no Firebase):
   ```bash
   node --env-file=.env scripts/seed-rc-products.mjs --dry-run
   ```
5. Rode de verdade:
   ```bash
   node --env-file=.env scripts/seed-rc-products.mjs
   ```
   Ao final ele mostra quantos produtos foram criados, quantos já existiam
   (pulados) e quantos falharam.

## Observações

- Os títulos e descrições foram escritos por mim a partir do que está
  escrito em cada embalagem/rótulo na própria foto — vale uma conferida
  rápida sua antes de divulgar, principalmente nos casos de variantes de
  fragrância (ex.: "Mirax Marine" x "Mirax Cristal").
- O produto "Sabão em Pó ALA 10x Multi Benefícios" juntava 3 fragrâncias
  numa única foto (Rosas e Flor de Lis, Cuidado do Coco, Lavanda) — cadastrei
  como **um produto só**, citando as fragrâncias na descrição. Se preferir
  3 produtos separados (uma fragrância por item), me avisa que eu separo.
- Depois de rodado o seed, qualquer ajuste fino (preço, atacado, trocar
  foto, editar texto) é feito normalmente pelo painel admin — os produtos
  seedados são indistinguíveis dos criados manualmente.
