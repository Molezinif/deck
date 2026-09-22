# Baralho Cigano 3D

As 36 cartas do baralho cigano dispostas numa mesa 3D. Clique numa carta para trazê-la para perto, gire-a com o mouse ou o dedo e leia a wiki dela: significado, amor, trabalho, saúde e síntese.

![Carta em foco com a wiki aberta](docs/preview.png)

## Recursos

- Mesa com as 36 cartas em 9 colunas × 4 fileiras, com câmera fixa.
- Carta em foco: ela sai da mesa, vem para a frente da câmera e o fundo desfoca (depth of field).
- Arraste para girar a carta e ver o verso. O verniz das duas faces reflete as luzes do ambiente, e o reflexo muda com o ângulo, como numa carta de verdade.
- Wiki de cada carta, que fecha com clique fora, no × ou com Esc.
- Cartas com cantos arredondados e imagens trocáveis.

## Stack

| Área | Ferramentas |
| --- | --- |
| App | React 19, TypeScript, Vite |
| 3D | three.js, React Three Fiber, drei, postprocessing |
| Testes | Vitest, Testing Library, React Three Test Renderer |
| Qualidade | Biome (lint e formatação), Lefthook (git hooks) |

## Começando

Requisitos: Node.js 20.19+ ou 22.12+ e pnpm.

```bash
pnpm install
pnpm dev
```

O `pnpm install` também instala os git hooks.

## Comandos

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | Sobe o app em modo de desenvolvimento |
| `pnpm build` | Checa os tipos e gera o build de produção em `dist/` |
| `pnpm preview` | Serve o build de produção localmente |
| `pnpm test` | Roda os testes uma vez |
| `pnpm test:watch` | Roda os testes em modo watch |
| `pnpm lint` | Checa lint e formatação |
| `pnpm format` | Corrige lint e formatação |

A cada commit, o Lefthook roda o Biome nos arquivos em stage, a checagem de tipos e os testes.

## Estrutura

```
public/cards/            artes das cartas e o verso (back.svg)
src/
  App.tsx                estado da carta selecionada
  data/
    cards.json           conteúdo da wiki, na ordem do baralho
    cards.ts             junta o conteúdo com id e caminho da imagem
  components/
    Table/               canvas, câmera, luzes, reflexos, partículas e clique fora
    Deck/
      Deck.tsx           carrega as texturas e posiciona as cartas
      Card.tsx           uma carta: animação, hover, arraste e acabamento
      layout.ts          posição de cada carta na mesa e em foco
      geometry.ts        formato da carta
    BackgroundBlur/      desfoque do fundo com a carta em foco
    CardWiki/            painel com os dados da carta
tests/                   espelha a estrutura de src/
docs/                    imagens do README
```

Cada componente fica na sua própria pasta, com o seu teste no mesmo caminho dentro de `tests/`. O estado global é só o `selectedId` no `App`. O resto é derivado dele ou é estado local de cada carta.

## Personalizando o baralho

### Imagens

Coloque as artes em `public/cards/` e aponte cada carta para o seu arquivo com o campo `image` em `src/data/cards.json`:

```json
{ "image": "cavaleiro1.webp", "name": "Cavaleiro", … }
```

Uma carta sem `image` usa a imagem provisória `NN.svg` (01 Cavaleiro … 36 Cruz). O verso é o `back.svg`, e para trocar o arquivo edite `src/components/Table/Table.tsx`.

A carta 3D segue a proporção das artes, 791×1169. Se as suas artes tiverem outra proporção, ajuste `ARTWORK_ASPECT` em `src/components/Deck/geometry.ts`. Na tela a carta nunca aparece maior que uns 600 px de altura, então dá para reduzir as imagens para esse tamanho e salvar em WebP. Isso diminui bastante o download.

### Conteúdo

Edite `src/data/cards.json`. Cada entrada tem:

```json
{
  "image": "cavaleiro1.webp",
  "name": "Cavaleiro",
  "playingCard": "9 de copas",
  "keywords": ["notícias", "velocidade", "mensagem"],
  "meaning": "…",
  "love": "…",
  "work": "…",
  "health": "…",
  "synthesis": ["novidade", "velocidade", "aproximação"]
}
```

O tipo `CardData` é inferido do JSON, então um campo novo já fica disponível no TypeScript. Para mostrá-lo, é só editar `src/components/CardWiki/CardWiki.tsx`.

### Ajustes finos

As constantes ficam no topo de cada arquivo:

| O quê | Onde |
| --- | --- |
| Velocidade da animação, sensibilidade do arraste, inclinação máxima e acabamento da carta (`FINISH`: aspereza e verniz) | `src/components/Deck/Card.tsx` |
| Colunas, fileiras, espaçamento e posição de foco | `src/components/Deck/layout.ts` |
| Proporção, tamanho e raio dos cantos | `src/components/Deck/geometry.ts` |
| Intensidade do desfoque | `src/components/BackgroundBlur/BackgroundBlur.tsx` |
| Cores, luzes, softboxes que a carta reflete (`Lightformer`), partículas e câmera | `src/components/Table/Table.tsx` |

## Testes

Os componentes 3D são testados com o React Three Test Renderer, que monta a cena sem WebGL e permite disparar eventos e avançar quadros. Os componentes HTML usam o Testing Library com jsdom.

## Licença

Todos os direitos reservados. Veja [LICENSE](LICENSE).
