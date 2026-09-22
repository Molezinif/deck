# Baralho Cigano

As 36 cartas do baralho cigano numa grade, como um feed. Toque numa carta para abrir a página dela: uma vitrine 3D (gire com o mouse ou o dedo, veja a luz refletir na carta) e a wiki completa, com significado, amor, trabalho, saúde e síntese.

![Grade de cartas e a página de uma carta aberta](docs/preview.png)

## Recursos

- Grade responsiva com as 36 cartas. As cartas entram em cascata e, no desktop, se inclinam em 3D seguindo o mouse, com um brilho que acompanha o ponteiro.
- Ao abrir uma carta, a miniatura voa até o centro da página (View Transitions) e a carta 3D chega de costas e vira, como numa tiragem. Ao fechar, ela volta para o lugar dela na grade.
- Página da carta: a carta flutua sobre a grade desfocada, com poeira dourada e sombra. Ela se inclina de leve na direção do mouse e gira ao arrastar. Ao soltar, assenta na face mais próxima, frente ou verso, e um giro rápido mantém o embalo.
- As setas ‹ › e as teclas ← → passam para a carta anterior ou a próxima.
- O botão de expandir aumenta a carta. No desktop e em paisagem, a carta fica ao lado do texto; no celular em pé, o texto sobe como uma folha por cima da carta.
- Fecha com o botão ×, com Esc, ou recolhendo a carta expandida.
- Com "reduzir movimento" ligado no sistema, as animações viram só transições de opacidade.

## Stack

| Área | Ferramentas |
| --- | --- |
| App | React 19, TypeScript, Vite |
| 3D | three.js, React Three Fiber, drei |
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
public/cards/thumbs/     miniaturas das artes, usadas na grade
src/
  App.tsx                estado da carta selecionada
  data/
    cards.json           conteúdo da wiki, na ordem do baralho
    cards.ts             junta o conteúdo com id e caminho da imagem
  useKeyDown.ts           atalhos de teclado (Esc, ← →)
  viewTransition.ts       anima a troca entre a grade e a carta, quando o navegador suporta
  components/
    Gallery/              a grade de cartas
    CardDetail/            a página de uma carta: carta 3D, navegação, expandir e conteúdo
    CardShowcase/          o canvas 3D em tela cheia, enquadrado no espaço que o layout reserva para a carta
    CardContent/           nome, palavras-chave e as seções da wiki (usado só por CardDetail)
    Card/
      Card.tsx             a carta 3D: formato, material, arraste, giro
      geometry.ts          formato da carta e proporção das artes
    SceneLighting/          luzes e reflexos, compartilhados pelas cenas 3D
tests/                    espelha a estrutura de src/
docs/                     imagens do README
```

Cada componente fica na sua própria pasta, com o seu teste no mesmo caminho dentro de `tests/`. O estado fica no `App`: a carta aberta e a carta para onde a animação volta ao fechar.

## Personalizando o baralho

### Imagens

Coloque as artes em `public/cards/` e aponte cada carta para o seu arquivo com o campo `image` em `src/data/cards.json`:

```json
{ "image": "cavaleiro1.webp", "name": "Cavaleiro", … }
```

Uma carta sem `image` usa a imagem provisória `NN.svg` (01 Cavaleiro … 36 Cruz). O verso é o `public/cards/back.svg`, referenciado em `src/components/CardShowcase/CardShowcase.tsx`.

A grade usa uma miniatura de cada arte, com o mesmo nome, em `public/cards/thumbs/`. A arte original só é baixada quando a carta abre. Para gerar as miniaturas:

```bash
for f in public/cards/*.webp; do cwebp -q 80 -resize 360 0 "$f" -o "public/cards/thumbs/$(basename "$f")"; done
```

A carta 3D segue a proporção das artes, 791×1169. Se as suas artes tiverem outra proporção, ajuste `ARTWORK_ASPECT` em `src/components/Card/geometry.ts` e o `aspect-ratio` nos CSS da grade e da página da carta.

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

O tipo `CardData` é inferido do JSON, então um campo novo já fica disponível no TypeScript. Para mostrá-lo, é só editar `src/components/CardContent/CardContent.tsx`.

### Ajustes finos

As constantes ficam no topo de cada arquivo:

| O quê | Onde |
| --- | --- |
| Velocidade da animação, sensibilidade do arraste, inclinação máxima, embalo do giro (`FLICK_MOMENTUM`), acabamento da carta (`FINISH`) e cor da borda (`EDGE_COLOR`) | `src/components/Card/Card.tsx` |
| Entrada da carta, flutuação, inclinação pelo mouse, poeira e sombra | `src/components/CardShowcase/CardShowcase.tsx` |
| Cores, fontes e curva das animações | `src/index.css` |
| Proporção, tamanho e raio dos cantos | `src/components/Card/geometry.ts` |
| Colunas, tamanho mínimo e inclinação da grade (`MAX_TILT_DEG`) | `src/components/Gallery/Gallery.css`, `src/components/Gallery/Gallery.tsx` |
| Tamanho da carta na página, desfoque do fundo e ponto de quebra do layout lado a lado | `src/components/CardDetail/CardDetail.css` |
| Cores, luzes e reflexos que a carta reflete | `src/components/SceneLighting/SceneLighting.tsx` |

## Testes

Os componentes 3D são testados com o React Three Test Renderer, que monta a cena sem WebGL e permite disparar eventos e avançar quadros. Os componentes HTML usam o Testing Library com jsdom.

## Créditos

- Arte das cartas: [Luiddy](https://www.instagram.com/luiddx/)
- Textos das cartas: [Isabelly](https://www.instagram.com/isay.rm/)
- Código: [Gabriel](https://www.instagram.com/molezinif/)

## Licença

Todos os direitos reservados. Veja [LICENSE](LICENSE).
