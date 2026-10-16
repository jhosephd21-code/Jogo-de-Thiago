# 🚜 Fazenda do Thiago – Edição Grande

Minigame de fazenda feito com **HTML, CSS e JavaScript puro** (sem bibliotecas, sem instalação).

## Como abrir no VS Code

1. Extraia o arquivo `fazenda-thiago-grande.zip`.
2. No VS Code: **Arquivo → Abrir Pasta…** e escolha a pasta `fazenda-thiago-grande`.
3. Instale a extensão **Live Server** (Ritwick Dey).
4. Clique com o botão direito em `index.html` → **Open with Live Server**.

Também funciona dando duplo clique no `index.html`.

## O que tem no jogo

- **48 canteiros** (9 liberados no começo; compre os outros com moedas).
- **26 frutas e verduras**, liberadas por nível: trigo, cenoura, batata, milho, alface, tomate, morango, pepino, abóbora, cebola, berinjela, melancia, brócolis, pimenta, uva, abacaxi, pêssego, cereja, limão, pera, maçã, banana, manga, kiwi, coco e abacate.
- **6 animais**: galinha, vaca, ovelha, cabra, colmeia (mel) e porco.
- **Níveis sem limite**, com títulos (Iniciante, Aprendiz, Fazendeiro… até Rei da fazenda).
- **Melhorias**: adubo, regador turbo, barraca na feira e mãos de ouro (5 níveis cada).
- **20 conquistas** que dão moedas de bônus.
- **Pedidos da vila**, celeiro, ciclo de dia e noite, chuva, sons e salvamento automático.
  O jogo continua rodando por até 2 horas com a aba fechada.

## Como jogar

- Escolha uma **semente** (dá para filtrar por verduras ou frutas) e clique num canteiro vazio para **plantar**.
- Clique de novo no plantio para **regar** 💧 (cresce mais rápido).
- Quando o canteiro brilhar ✨, clique para **colher**.
- **Segure o mouse e arraste** sobre os canteiros para fazer vários de uma vez.
- Venda no **Celeiro** ou entregue **Pedidos** (pagam mais que o mercado).

## Estrutura

```
fazenda-thiago-grande/
├── index.html   → estrutura da página
├── style.css    → visual do jogo, animações e responsividade
├── script.js    → toda a lógica do jogo
└── README.md
```

## Como personalizar

Tudo fica no topo do `script.js`:

- **`CROPS`**: frutas e verduras (tipo, custo da semente, preço, tempo, XP, nível). Copie uma linha para criar uma nova.
- **`ANIMALS` e `PRODUCTS`**: animais, o que produzem e quanto vale.
- **`UPGRADES`** e **`ACHIEVEMENTS`**: melhorias e conquistas.
- **`COLS`, `ROWS`, `START_PLOTS`**: tamanho da fazenda.
- **`DAY_LENGTH`, `WATER_BOOST`**: duração do dia e força da rega.

O nome da fazenda pode ser trocado no jogo pelo botão ✏️. Para zerar o progresso, use o botão 🗑️.
