# Baralho Cigano 3D

As 36 cartas do baralho cigano dispostas numa mesa 3D. Clique numa carta para trazê-la para perto, gire-a com o mouse ou o dedo e leia a wiki dela: significado, amor, trabalho, saúde e síntese.

![Carta em foco com a wiki aberta](docs/preview.png)

## Recursos

- Mesa com as 36 cartas em 9 colunas × 4 fileiras, com câmera fixa.
- Carta em foco: ela sai da mesa, vem para a frente da câmera e o fundo desfoca (depth of field).
- Arraste para girar a carta e ver o verso; um brilho corre pela superfície enquanto ela gira.
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
public/cards/            imagens das cartas: 01.svg … 36.svg e back.svg
src/
  App.tsx                estado da carta selecionada
  data/
    cards.json           conteúdo da wiki, na ordem do baralho
    cards.ts             junta o conteúdo com id e caminho da imagem
  components/
    Table/               canvas, câmera, luzes, partículas e clique fora
    Deck/
      Deck.tsx           carrega as texturas e posiciona as cartas
      Card.tsx           uma carta: animação, hover, arraste e brilho
      layout.ts          posição de cada carta na mesa e em foco
      geometry.ts        formato da carta e textura do brilho
    BackgroundBlur/      desfoque do fundo com a carta em foco
    CardWiki/            painel com os dados da carta
tests/                   espelha a estrutura de src/
docs/                    imagens do README
```

Cada componente fica na sua própria pasta, com o seu teste no mesmo caminho dentro de `tests/`. O estado global é só o `selectedId` no `App`. O resto é derivado dele ou é estado local de cada carta.

## Personalizando o baralho

### Imagens

Substitua os arquivos em `public/cards/`:

- `01` a `36`: a frente de cada carta, na ordem tradicional (01 Cavaleiro … 36 Cruz).
- `back`: o verso, igual para todas.

Use a proporção 63:88. Imagens em 630×880 px são suficientes, porque na tela a carta nunca aparece maior que isso, e em WebP o arquivo fica pequeno. Para usar outro formato, troque a extensão em `src/data/cards.ts` (frentes) e em `src/components/Table/Table.tsx` (verso).

Se o seu baralho tiver outra proporção, ajuste `CARD_WIDTH` e `CARD_HEIGHT` em `src/components/Deck/geometry.ts`.

### Conteúdo

Edite `src/data/cards.json`. Cada entrada tem:

```json
{
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
| Velocidade da animação, sensibilidade do arraste, inclinação máxima, brilho | `src/components/Deck/Card.tsx` |
| Colunas, fileiras, espaçamento e posição de foco | `src/components/Deck/layout.ts` |
| Tamanho e raio dos cantos | `src/components/Deck/geometry.ts` |
| Intensidade do desfoque | `src/components/BackgroundBlur/BackgroundBlur.tsx` |
| Cores, luzes, partículas e câmera | `src/components/Table/Table.tsx` |

## Testes

Os componentes 3D são testados com o React Three Test Renderer, que monta a cena sem WebGL e permite disparar eventos e avançar quadros. Os componentes HTML usam o Testing Library com jsdom.

## Licença

Todos os direitos reservados. Veja [LICENSE](LICENSE).
