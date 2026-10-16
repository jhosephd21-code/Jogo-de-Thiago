"use strict";

/* =====================================================================
   FAZENDA DO THIAGO – EDIÇÃO GRANDE
   Dica: você pode mexer nos valores de CROPS, ANIMALS, UPGRADES e
   ACHIEVEMENTS logo abaixo para deixar o jogo mais fácil, mais difícil
   ou criar frutas, verduras e animais novos!
   ===================================================================== */

/* ============ CONFIGURAÇÃO ============ */
const SAVE_KEY = "fazenda-thiago-grande-v1";
const COLS = 8;
const ROWS = 6;
const TOTAL = COLS * ROWS;      // total de canteiros (48)
const START_PLOTS = 9;          // canteiros liberados no começo (3x3)
const DAY_LENGTH = 180;         // segundos para um dia completo
const OFFLINE_CAP = 7200;       // máximo de progresso offline (segundos)
const WATER_BOOST = 1.6;        // velocidade extra de plantas regadas
const BASE_BONUS_CHANCE = 0.12; // chance de colheita farta
const MAX_ANIMALS = 8;          // máximo de animais de cada tipo
const STOCK_PER_ANIMAL = 6;     // produtos que cada animal consegue guardar
const ORDER_SLOTS = 4;          // pedidos ao mesmo tempo

// type = "verdura" ou "fruta" | seed = custo da semente | price = preço de venda
// time = segundos para crescer | xp = experiência ao colher | level = nível para liberar
const CROPS = {
  trigo:     { name: "Trigo",      emoji: "🌾", type: "verdura", seed: 5,    price: 12,    time: 10,  xp: 2,   level: 1 },
  cenoura:   { name: "Cenoura",    emoji: "🥕", type: "verdura", seed: 10,   price: 24,    time: 20,  xp: 4,   level: 1 },
  batata:    { name: "Batata",     emoji: "🥔", type: "verdura", seed: 15,   price: 36,    time: 30,  xp: 6,   level: 2 },
  milho:     { name: "Milho",      emoji: "🌽", type: "verdura", seed: 20,   price: 50,    time: 40,  xp: 8,   level: 2 },
  alface:    { name: "Alface",     emoji: "🥬", type: "verdura", seed: 25,   price: 60,    time: 45,  xp: 9,   level: 3 },
  tomate:    { name: "Tomate",     emoji: "🍅", type: "verdura", seed: 35,   price: 85,    time: 60,  xp: 12,  level: 3 },
  morango:   { name: "Morango",    emoji: "🍓", type: "fruta",   seed: 60,   price: 150,   time: 90,  xp: 18,  level: 4 },
  pepino:    { name: "Pepino",     emoji: "🥒", type: "verdura", seed: 70,   price: 175,   time: 100, xp: 21,  level: 5 },
  abobora:   { name: "Abóbora",    emoji: "🎃", type: "verdura", seed: 100,  price: 260,   time: 150, xp: 30,  level: 6 },
  cebola:    { name: "Cebola",     emoji: "🧅", type: "verdura", seed: 130,  price: 330,   time: 170, xp: 35,  level: 7 },
  berinjela: { name: "Berinjela",  emoji: "🍆", type: "verdura", seed: 170,  price: 440,   time: 200, xp: 42,  level: 8 },
  melancia:  { name: "Melancia",   emoji: "🍉", type: "fruta",   seed: 230,  price: 600,   time: 240, xp: 52,  level: 9 },
  brocolis:  { name: "Brócolis",   emoji: "🥦", type: "verdura", seed: 300,  price: 800,   time: 280, xp: 62,  level: 10 },
  pimenta:   { name: "Pimenta",    emoji: "🌶️", type: "verdura", seed: 380,  price: 1000,  time: 320, xp: 74,  level: 11 },
  uva:       { name: "Uva",        emoji: "🍇", type: "fruta",   seed: 480,  price: 1300,  time: 360, xp: 88,  level: 12 },
  abacaxi:   { name: "Abacaxi",    emoji: "🍍", type: "fruta",   seed: 600,  price: 1650,  time: 400, xp: 104, level: 13 },
  pessego:   { name: "Pêssego",    emoji: "🍑", type: "fruta",   seed: 750,  price: 2100,  time: 440, xp: 122, level: 14 },
  cereja:    { name: "Cereja",     emoji: "🍒", type: "fruta",   seed: 920,  price: 2600,  time: 480, xp: 142, level: 15 },
  limao:     { name: "Limão",      emoji: "🍋", type: "fruta",   seed: 1150, price: 3300,  time: 510, xp: 165, level: 16 },
  pera:      { name: "Pera",       emoji: "🍐", type: "fruta",   seed: 1300, price: 3750,  time: 525, xp: 178, level: 17 },
  maca:      { name: "Maçã",       emoji: "🍎", type: "fruta",   seed: 1450, price: 4200,  time: 540, xp: 190, level: 18 },
  banana:    { name: "Banana",     emoji: "🍌", type: "fruta",   seed: 1800, price: 5300,  time: 570, xp: 220, level: 20 },
  manga:     { name: "Manga",      emoji: "🥭", type: "fruta",   seed: 2300, price: 6900,  time: 590, xp: 255, level: 22 },
  kiwi:      { name: "Kiwi",       emoji: "🥝", type: "fruta",   seed: 3000, price: 9200,  time: 600, xp: 290, level: 25 },
  coco:      { name: "Coco",       emoji: "🥥", type: "fruta",   seed: 4000, price: 12500, time: 600, xp: 330, level: 28 },
  abacate:   { name: "Abacate",    emoji: "🥑", type: "fruta",   seed: 5200, price: 16500, time: 600, xp: 400, level: 30 },
};

// every = segundos que 1 animal leva para produzir 1 item
const ANIMALS = {
  galinha: { name: "Galinha", emoji: "🐔", cost: 80,   level: 2,  every: 20, product: "ovo",    xp: 3 },
  vaca:    { name: "Vaca",    emoji: "🐄", cost: 300,  level: 4,  every: 35, product: "leite",  xp: 8 },
  ovelha:  { name: "Ovelha",  emoji: "🐑", cost: 700,  level: 6,  every: 50, product: "la",     xp: 15 },
  cabra:   { name: "Cabra",   emoji: "🐐", cost: 1400, level: 9,  every: 55, product: "queijo", xp: 24 },
  abelha:  { name: "Colmeia", emoji: "🐝", cost: 2500, level: 12, every: 60, product: "mel",    xp: 36 },
  porco:   { name: "Porco",   emoji: "🐖", cost: 4200, level: 15, every: 70, product: "bacon",  xp: 55 },
};

const PRODUCTS = {
  ovo:    { name: "Ovo",     emoji: "🥚", price: 10 },
  leite:  { name: "Leite",   emoji: "🥛", price: 40 },
  la:     { name: "Lã",      emoji: "🧶", price: 90 },
  queijo: { name: "Queijo",  emoji: "🧀", price: 170 },
  mel:    { name: "Mel",     emoji: "🍯", price: 300 },
  bacon:  { name: "Bacon",   emoji: "🥓", price: 520 },
};

// Melhorias compradas com moedas (cada uma tem vários níveis)
const UPGRADES = {
  adubo:   { name: "Adubo orgânico",   emoji: "🧪", desc: "Plantas crescem 10% mais rápido por nível.",      base: 300, max: 5 },
  regador: { name: "Regador turbo",    emoji: "🚿", desc: "A rega acelera mais 15% por nível.",              base: 250, max: 5 },
  feira:   { name: "Barraca na feira", emoji: "🏪", desc: "+8% no preço de venda por nível.",                base: 400, max: 5 },
  sorte:   { name: "Mãos de ouro",     emoji: "🍀", desc: "+5% de chance de colheita farta por nível.",      base: 350, max: 5 },
};

const animalTotal = () => Object.values(state.animals).reduce((s, a) => s + a.count, 0);
const upgradeTotal = () => Object.values(state.upgrades).reduce((s, n) => s + n, 0);

// Conquistas: ganhe moedas ao completar objetivos
const ACHIEVEMENTS = [
  { id: "h10",   emoji: "🧺", name: "Primeira colheita",  desc: "Colha 10 itens",                   reward: 30,    test: () => state.stats.harvested >= 10 },
  { id: "h100",  emoji: "🌾", name: "Colhedor",           desc: "Colha 100 itens",                  reward: 150,   test: () => state.stats.harvested >= 100 },
  { id: "h500",  emoji: "🚜", name: "Mão na terra",       desc: "Colha 500 itens",                  reward: 600,   test: () => state.stats.harvested >= 500 },
  { id: "h2000", emoji: "🏆", name: "Gigante da roça",    desc: "Colha 2.000 itens",                reward: 2500,  test: () => state.stats.harvested >= 2000 },
  { id: "e1k",   emoji: "🪙", name: "Pequeno comerciante", desc: "Ganhe 1.000 moedas no total",     reward: 100,   test: () => state.stats.earned >= 1000 },
  { id: "e20k",  emoji: "💼", name: "Empresário",         desc: "Ganhe 20.000 moedas no total",     reward: 800,   test: () => state.stats.earned >= 20000 },
  { id: "e200k", emoji: "💰", name: "Magnata rural",      desc: "Ganhe 200.000 moedas no total",    reward: 5000,  test: () => state.stats.earned >= 200000 },
  { id: "l5",    emoji: "⭐", name: "Pegando o jeito",    desc: "Chegue ao nível 5",                reward: 200,   test: () => state.level >= 5 },
  { id: "l10",   emoji: "🌟", name: "Fazendeiro de verdade", desc: "Chegue ao nível 10",            reward: 600,   test: () => state.level >= 10 },
  { id: "l20",   emoji: "✨", name: "Mestre da roça",     desc: "Chegue ao nível 20",               reward: 2500,  test: () => state.level >= 20 },
  { id: "l30",   emoji: "👑", name: "Lenda do campo",     desc: "Chegue ao nível 30",               reward: 8000,  test: () => state.level >= 30 },
  { id: "p20",   emoji: "🟫", name: "Terra grande",       desc: "Tenha 20 terrenos liberados",      reward: 500,   test: () => unlockedCount() >= 20 },
  { id: "pall",  emoji: "🏞️", name: "Fazendão",           desc: "Libere todos os terrenos",         reward: 5000,  test: () => unlockedCount() >= TOTAL },
  { id: "a1",    emoji: "🐣", name: "Primeiro bichinho",  desc: "Compre seu primeiro animal",       reward: 50,    test: () => animalTotal() >= 1 },
  { id: "a10",   emoji: "🐮", name: "Zoológico",          desc: "Tenha 10 animais",                 reward: 1000,  test: () => animalTotal() >= 10 },
  { id: "o10",   emoji: "📋", name: "Entregador",         desc: "Entregue 10 pedidos",              reward: 300,   test: () => state.stats.orders >= 10 },
  { id: "o50",   emoji: "📦", name: "Rei das entregas",   desc: "Entregue 50 pedidos",              reward: 2000,  test: () => state.stats.orders >= 50 },
  { id: "k10",   emoji: "🥕", name: "Colecionador",       desc: "Colha 10 tipos diferentes",        reward: 800,   test: () => Object.keys(state.stats.kinds).length >= 10 },
  { id: "kall",  emoji: "🧑‍🌾", name: "Mestre da horta",   desc: "Colha todos os tipos de planta",   reward: 10000, test: () => Object.keys(state.stats.kinds).length >= Object.keys(CROPS).length },
  { id: "u5",    emoji: "🛠️", name: "Bem equipado",       desc: "Compre 5 melhorias",               reward: 700,   test: () => upgradeTotal() >= 5 },
];

const RANKS = [
  [1, "Iniciante"], [5, "Aprendiz"], [10, "Fazendeiro"], [15, "Agricultor experiente"],
  [20, "Mestre da roça"], [30, "Lenda do campo"], [40, "Rei da fazenda"],
];
const rankName = (lvl) => RANKS.filter((r) => lvl >= r[0]).pop()[1];

/* ============ ESTADO DO JOGO ============ */
function defaultState() {
  const plots = [];
  for (let i = 0; i < TOTAL; i++) {
    const r = Math.floor(i / COLS);
    const c = i % COLS;
    plots.push({ unlocked: r < 3 && c < 3, crop: null, progress: 0, watered: false });
  }
  const inventory = {};
  Object.keys(CROPS).forEach((k) => (inventory[k] = 0));
  Object.keys(PRODUCTS).forEach((k) => (inventory[k] = 0));
  const animals = {};
  Object.keys(ANIMALS).forEach((k) => (animals[k] = { count: 0, stock: 0, timer: 0 }));
  const upgrades = {};
  Object.keys(UPGRADES).forEach((k) => (upgrades[k] = 0));

  return {
    name: "Fazenda do Thiago",
    coins: 50,
    xp: 0,
    level: 1,
    time: DAY_LENGTH * 0.3,
    plots,
    inventory,
    animals,
    upgrades,
    achievements: {},
    orders: [],
    nextOrderId: 1,
    selectedSeed: "trigo",
    seedFilter: "todas",
    sound: true,
    stats: { harvested: 0, earned: 0, orders: 0, kinds: {} },
    savedAt: Date.now(),
  };
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const base = defaultState();
    const s = { ...base, ...data };
    s.inventory = { ...base.inventory, ...(data.inventory || {}) };
    s.upgrades = { ...base.upgrades, ...(data.upgrades || {}) };
    s.achievements = { ...(data.achievements || {}) };
    s.stats = { ...base.stats, ...(data.stats || {}) };
    s.stats.kinds = { ...(s.stats.kinds || {}) };
    s.animals = {};
    Object.keys(ANIMALS).forEach((k) => {
      s.animals[k] = { ...base.animals[k], ...((data.animals || {})[k] || {}) };
    });
    s.plots = base.plots.map((p, i) => {
      const saved = (data.plots || [])[i] || {};
      const merged = { ...p, ...saved };
      if (merged.crop && !CROPS[merged.crop]) {
        merged.crop = null;
        merged.progress = 0;
        merged.watered = false;
      }
      return merged;
    });
    if (!CROPS[s.selectedSeed]) s.selectedSeed = "trigo";
    if (!["todas", "verdura", "fruta"].includes(s.seedFilter)) s.seedFilter = "todas";
    s.orders = Array.isArray(s.orders) ? s.orders.filter((o) => itemInfo(o.item)) : [];
    return s;
  } catch (e) {
    return null;
  }
}

function saveGame(manual = false) {
  try {
    state.savedAt = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    if (manual) toast("Jogo salvo 💾", "ok");
  } catch (e) {
    if (manual) toast("Não foi possível salvar neste navegador.", "warn");
  }
}

const loaded = loadGame();
let state = loaded || defaultState();
const rain = { left: 0, next: 90 };
let activeTab = "orders";

/* ============ ATALHOS / UTILITÁRIOS ============ */
const $ = (sel, root = document) => root.querySelector(sel);

const el = {
  grid: $("#grid"),
  coins: $("#coins"),
  level: $("#level"),
  rank: $("#rank"),
  xpFill: $("#xp-fill"),
  xpText: $("#xp-text"),
  clock: $("#clock"),
  farmName: $("#farm-name"),
  seeds: $("#seeds"),
  panel: $("#panel"),
  toasts: $("#toasts"),
  sky: $("#sky"),
  sound: $("#btn-sound"),
};

const fmt = (n) => Math.floor(n).toLocaleString("pt-BR");
const xpNeeded = (lvl) => Math.round(50 + (lvl - 1) * 60 + Math.pow(lvl - 1, 2) * 4);
const isReady = (p) => Boolean(p.crop) && p.progress >= CROPS[p.crop].time - 1e-6;
const unlockedCount = () => state.plots.filter((p) => p.unlocked).length;
const plotCost = () => Math.round(40 * Math.pow(1.15, unlockedCount() - START_PLOTS));
const animalCost = (key) => Math.round(ANIMALS[key].cost * (1 + 0.25 * state.animals[key].count));

// Efeitos das melhorias
const upgradeCost = (k) => Math.round(UPGRADES[k].base * Math.pow(2.4, state.upgrades[k]));
const upgradeReq = (k) => 3 + state.upgrades[k] * 3;
const growthMult = () => 1 + 0.1 * state.upgrades.adubo;
const waterBoost = () => WATER_BOOST + 0.15 * state.upgrades.regador;
const sellMult = () => 1 + 0.08 * state.upgrades.feira;
const bonusChance = () => BASE_BONUS_CHANCE + 0.05 * state.upgrades.sorte;

function itemInfo(id) {
  if (CROPS[id]) return { name: CROPS[id].name, emoji: CROPS[id].emoji, price: CROPS[id].price };
  return PRODUCTS[id];
}
const sellPrice = (id) => Math.round(itemInfo(id).price * sellMult());

function fmtTime(sec) {
  if (sec < 60) return sec + "s";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m + "m" + (s ? String(s).padStart(2, "0") + "s" : "");
}

function setText(node, text) {
  if (node.textContent !== text) node.textContent = text;
}

function setHTML(node, html) {
  if (node._html !== html) {
    node.innerHTML = html;
    node._html = html;
  }
}

function addCoins(n) {
  state.coins += n;
  if (n > 0) state.stats.earned += n;
}

function nextUnlock() {
  let best = null;
  const consider = (lv, label) => {
    if (lv > state.level && (!best || lv < best.lv)) best = { lv, label };
  };
  Object.values(CROPS).forEach((c) => consider(c.level, c.emoji + " " + c.name));
  Object.values(ANIMALS).forEach((a) => consider(a.level, a.emoji + " " + a.name));
  return best;
}

/* ============ SOM ============ */
let audioCtx = null;

function beep(freq = 440, dur = 0.08, type = "sine", vol = 0.05, delay = 0) {
  if (!state.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + dur);
  } catch (e) {
    /* sem áudio disponível: ignora */
  }
}

const sfx = {
  plant: () => beep(330, 0.08, "triangle"),
  water: () => beep(560, 0.1, "sine"),
  harvest: () => { beep(523, 0.08, "square", 0.035); beep(784, 0.1, "square", 0.035, 0.08); },
  coin: () => { beep(988, 0.07, "square", 0.03); beep(1319, 0.12, "square", 0.03, 0.07); },
  error: () => beep(140, 0.15, "sawtooth", 0.04),
  level: () => [523, 659, 784, 1046].forEach((f, i) => beep(f, 0.16, "triangle", 0.06, i * 0.1)),
};

/* ============ EFEITOS VISUAIS ============ */
function toast(msg, type = "") {
  const t = document.createElement("div");
  t.className = "toast " + type;
  t.textContent = msg;
  el.toasts.appendChild(t);
  while (el.toasts.children.length > 4) el.toasts.firstChild.remove();
  setTimeout(() => {
    t.classList.add("out");
    setTimeout(() => t.remove(), 320);
  }, 2900);
}

function pop(text, target, cls = "") {
  const node = typeof target === "number" ? el.grid.children[target] : target;
  if (!node) return;
  const r = node.getBoundingClientRect();
  const s = document.createElement("span");
  s.className = "pop " + cls;
  s.textContent = text;
  s.style.left = r.left + r.width / 2 + "px";
  s.style.top = r.top + r.height / 3 + "px";
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 900);
}

/* ============ NÍVEL E EXPERIÊNCIA ============ */
function addXp(n) {
  state.xp += n;
  let leveled = false;
  while (state.xp >= xpNeeded(state.level)) {
    state.xp -= xpNeeded(state.level);
    state.level++;
    const bonus = state.level * 25;
    addCoins(bonus);

    const unlocks = [];
    Object.values(CROPS).forEach((c) => { if (c.level === state.level) unlocks.push(c.emoji + " " + c.name); });
    Object.values(ANIMALS).forEach((a) => { if (a.level === state.level) unlocks.push(a.emoji + " " + a.name); });

    toast(
      "🎉 Nível " + state.level + "! Bônus de 🪙" + fmt(bonus) + (unlocks.length ? " · Novo: " + unlocks.join(", ") : ""),
      "level"
    );
    leveled = true;
  }
  if (leveled) sfx.level();
}

/* ============ CONQUISTAS ============ */
function checkAchievements() {
  ACHIEVEMENTS.forEach((a) => {
    if (state.achievements[a.id] || !a.test()) return;
    state.achievements[a.id] = true;
    addCoins(a.reward);
    toast("🏆 Conquista: " + a.name + "! +🪙" + fmt(a.reward), "level");
    sfx.level();
  });
}

/* ============ AÇÕES NOS CANTEIROS ============ */
function plantPlot(i, quiet = false) {
  const p = state.plots[i];
  const key = state.selectedSeed;
  const c = CROPS[key];
  if (!p.unlocked || p.crop) return false;

  if (state.level < c.level) {
    if (!quiet) { toast(c.name + " é liberado no nível " + c.level, "warn"); sfx.error(); }
    return false;
  }
  if (state.coins < c.seed) {
    if (!quiet) { toast("Moedas insuficientes para essa semente 🪙", "warn"); sfx.error(); }
    return false;
  }

  state.coins -= c.seed;
  p.crop = key;
  p.progress = 0;
  p.watered = rain.left > 0;
  addXp(1);
  if (!quiet) { sfx.plant(); pop("-" + fmt(c.seed), i, "neg"); }
  return true;
}

function waterPlot(i, quiet = false) {
  const p = state.plots[i];
  if (!p.crop || isReady(p) || p.watered) return false;
  p.watered = true;
  if (!quiet) { sfx.water(); pop("💧", i, "water"); }
  return true;
}

function harvestPlot(i, quiet = false) {
  const p = state.plots[i];
  if (!isReady(p)) return 0;
  const c = CROPS[p.crop];
  const qty = Math.random() < bonusChance() ? 2 : 1; // colheita farta
  state.inventory[p.crop] += qty;
  state.stats.harvested += qty;
  state.stats.kinds[p.crop] = true;
  addXp(c.xp);
  p.crop = null;
  p.progress = 0;
  p.watered = false;
  if (!quiet) {
    sfx.harvest();
    pop("+" + qty + " " + c.emoji, i, "pos");
    if (qty > 1) toast("Colheita farta! +1 extra 🎉", "ok");
  }
  return qty;
}

function buyPlot(i) {
  const cost = plotCost();
  if (state.coins < cost) {
    toast("Você precisa de 🪙" + fmt(cost) + " para comprar este terreno.", "warn");
    sfx.error();
    return false;
  }
  state.coins -= cost;
  state.plots[i].unlocked = true;
  sfx.coin();
  toast("Novo terreno liberado! 🌱", "ok");
  return true;
}

// Ação "inteligente": o que fazer ao clicar depende do estado do canteiro
function actOnPlot(i, painting = false) {
  const p = state.plots[i];
  if (!p.unlocked) return painting ? false : buyPlot(i);
  if (!p.crop) return plantPlot(i);
  if (isReady(p)) return harvestPlot(i) > 0;
  return waterPlot(i);
}

/* Botões de ação em massa */
function plantAll() {
  const c = CROPS[state.selectedSeed];
  if (state.level < c.level) { toast(c.name + " é liberado no nível " + c.level, "warn"); sfx.error(); return; }
  let n = 0;
  for (let i = 0; i < TOTAL; i++) {
    const p = state.plots[i];
    if (!p.unlocked || p.crop) continue;
    if (state.coins < c.seed) break;
    if (plantPlot(i, true)) n++;
  }
  if (n) { sfx.plant(); toast("Você plantou " + n + " × " + c.emoji + " " + c.name); }
  else { toast(state.coins < c.seed ? "Moedas insuficientes 🪙" : "Não há canteiros vazios.", "warn"); sfx.error(); }
  refresh();
}

function waterAll() {
  let n = 0;
  for (let i = 0; i < TOTAL; i++) if (waterPlot(i, true)) n++;
  if (n) { sfx.water(); toast("Você regou " + n + " plantio(s) 💧"); }
  else { toast("Nada para regar agora.", "warn"); }
  refresh();
}

function harvestAll() {
  let n = 0;
  for (let i = 0; i < TOTAL; i++) n += harvestPlot(i, true);
  if (n) { sfx.harvest(); toast("Você colheu " + n + " item(ns) 🧺", "ok"); }
  else { toast("Nada pronto para colher ainda.", "warn"); }
  refresh();
}

/* ============ ANIMAIS ============ */
function buyAnimal(key) {
  const a = ANIMALS[key];
  const s = state.animals[key];
  const cost = animalCost(key);
  if (state.level < a.level || s.count >= MAX_ANIMALS) return;
  if (state.coins < cost) { toast("Moedas insuficientes 🪙", "warn"); sfx.error(); return; }
  state.coins -= cost;
  s.count++;
  sfx.coin();
  toast(a.emoji + " " + a.name + " chegou na fazenda!", "ok");
}

function collectAnimal(key) {
  const a = ANIMALS[key];
  const s = state.animals[key];
  if (s.stock <= 0) return;
  const qty = s.stock;
  state.inventory[a.product] += qty;
  addXp(qty * a.xp);
  s.stock = 0;
  sfx.harvest();
  toast("Você coletou " + qty + " × " + PRODUCTS[a.product].emoji + " " + PRODUCTS[a.product].name);
}

/* ============ MELHORIAS ============ */
function buyUpgrade(key) {
  const u = UPGRADES[key];
  const lvl = state.upgrades[key];
  if (lvl >= u.max || state.level < upgradeReq(key)) return;
  const cost = upgradeCost(key);
  if (state.coins < cost) { toast("Moedas insuficientes 🪙", "warn"); sfx.error(); return; }
  state.coins -= cost;
  state.upgrades[key]++;
  sfx.level();
  toast(u.emoji + " " + u.name + " agora está no nível " + state.upgrades[key] + "!", "ok");
}

/* ============ PEDIDOS ============ */
function genOrder() {
  const unlocked = Object.keys(CROPS).filter((k) => CROPS[k].level <= state.level);
  // favorece as plantas mais novas que você já liberou
  const pool = unlocked.slice(-Math.max(2, Math.ceil(unlocked.length * 0.7)));
  Object.keys(ANIMALS).forEach((k) => {
    if (state.animals[k].count > 0) pool.push(ANIMALS[k].product);
  });

  let item = pool[Math.floor(Math.random() * pool.length)];
  for (let t = 0; t < 10 && state.orders.some((o) => o.item === item); t++) {
    item = pool[Math.floor(Math.random() * pool.length)];
  }

  const price = itemInfo(item).price;
  const target = (60 + Math.random() * 100) * (1 + state.level * 0.12);
  const qty = Math.max(2, Math.min(12, Math.round(target / price)));
  const reward = Math.round(price * qty * (1.4 + Math.random() * 0.4));
  const xp = Math.min(Math.round(5 + reward / 20), 10 + state.level * 12);
  return { id: state.nextOrderId++, item, qty, reward, xp };
}

function ensureOrders() {
  while (state.orders.length < ORDER_SLOTS) state.orders.push(genOrder());
}

function deliverOrder(id) {
  const idx = state.orders.findIndex((o) => String(o.id) === id);
  if (idx < 0) return;
  const o = state.orders[idx];
  if ((state.inventory[o.item] || 0) < o.qty) return;
  state.inventory[o.item] -= o.qty;
  addCoins(o.reward);
  state.stats.orders++;
  state.orders.splice(idx, 1);
  addXp(o.xp);
  state.orders.push(genOrder());
  sfx.coin();
  toast("Pedido entregue! +🪙" + fmt(o.reward), "ok");
}

function rerollOrder(id) {
  const idx = state.orders.findIndex((o) => String(o.id) === id);
  if (idx < 0) return;
  state.orders.splice(idx, 1);
  state.orders.push(genOrder());
}

/* ============ VENDAS ============ */
function sellItem(key, all, node) {
  const qty = all ? state.inventory[key] : Math.min(1, state.inventory[key]);
  if (qty <= 0) return;
  const gain = qty * sellPrice(key);
  state.inventory[key] -= qty;
  addCoins(gain);
  sfx.coin();
  pop("+" + fmt(gain), node, "pos");
}

function sellEverything(node) {
  let total = 0;
  Object.keys(state.inventory).forEach((k) => {
    total += state.inventory[k] * sellPrice(k);
    state.inventory[k] = 0;
  });
  if (total > 0) {
    addCoins(total);
    sfx.coin();
    pop("+" + fmt(total), node, "pos");
    toast("Você vendeu tudo por 🪙" + fmt(total), "ok");
  }
}

/* ============ SIMULAÇÃO DO MUNDO ============ */
function advanceWorld(dt) {
  state.time += dt;
  const grow = growthMult();
  const wet = waterBoost();

  state.plots.forEach((p) => {
    if (!p.crop) return;
    const c = CROPS[p.crop];
    if (p.progress < c.time) {
      p.progress = Math.min(c.time, p.progress + dt * grow * (p.watered ? wet : 1));
    }
  });

  Object.keys(ANIMALS).forEach((key) => {
    const a = ANIMALS[key];
    const s = state.animals[key];
    if (s.count <= 0) return;
    const cap = s.count * STOCK_PER_ANIMAL;
    s.timer += dt * s.count;
    while (s.timer >= a.every && s.stock < cap) {
      s.stock++;
      s.timer -= a.every;
    }
    if (s.stock >= cap) s.timer = Math.min(s.timer, a.every);
  });
}

function updateRain(dt) {
  if (rain.left > 0) {
    rain.left -= dt;
    state.plots.forEach((p) => {
      if (p.crop && !isReady(p)) p.watered = true;
    });
    if (rain.left <= 0) {
      rain.left = 0;
      rain.next = 120 + Math.random() * 120;
      document.body.classList.remove("raining");
      toast("☀️ A chuva passou.");
    }
  } else {
    rain.next -= dt;
    if (rain.next <= 0) {
      rain.left = 18;
      document.body.classList.add("raining");
      toast("🌧️ Começou a chover! Seus plantios foram regados.", "ok");
    }
  }
}

/* ============ RENDERIZAÇÃO ============ */
function buildGrid() {
  el.grid.innerHTML = "";
  for (let i = 0; i < TOTAL; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "plot";
    b.dataset.i = i;
    b.innerHTML =
      '<span class="drop">💧</span><span class="sprite"></span><span class="bar"><i></i></span><span class="lock"></span>';
    el.grid.appendChild(b);
  }
}

function updatePlot(i) {
  const p = state.plots[i];
  const b = el.grid.children[i];
  let status;
  let sprite = "";
  let lock = "";
  let ratio = 0;
  let label;

  if (!p.unlocked) {
    status = "locked";
    sprite = "🔒";
    lock = fmt(plotCost());
    label = "Terreno bloqueado. Comprar por " + plotCost() + " moedas";
  } else if (!p.crop) {
    status = "empty";
    label = "Canteiro vazio. Clique para plantar";
  } else {
    const c = CROPS[p.crop];
    ratio = Math.min(1, p.progress / c.time);
    if (ratio >= 1) {
      status = "ready";
      sprite = c.emoji;
      label = c.name + " pronto. Clique para colher";
    } else {
      status = "growing";
      sprite = ratio < 0.35 ? "🌱" : "🌿";
      label = c.name + " crescendo, " + Math.round(ratio * 100) + " por cento" + (p.watered ? ", regado" : ". Clique para regar");
    }
  }

  const cls = "plot " + status + (p.watered && status === "growing" ? " watered" : "");
  if (b.className !== cls) b.className = cls;
  setText(b.children[1], sprite);
  setText(b.children[3], lock);
  b.children[2].firstElementChild.style.width = (ratio * 100).toFixed(1) + "%";
  if (b.getAttribute("aria-label") !== label) b.setAttribute("aria-label", label);
}

function updateHud() {
  setText(el.coins, fmt(state.coins));
  setText(el.level, String(state.level));
  setText(el.rank, rankName(state.level));
  const need = xpNeeded(state.level);
  el.xpFill.style.width = Math.min(100, (state.xp / need) * 100) + "%";
  setText(el.xpText, fmt(state.xp) + "/" + fmt(need) + " XP");

  // dia e noite
  const phase = (state.time % DAY_LENGTH) / DAY_LENGTH;
  const h = Math.sin(2 * Math.PI * (phase - 0.25)); // 1 = meio-dia, -1 = meia-noite
  const night = Math.max(0, Math.min(0.5, 0.45 - h * 0.6));
  el.sky.style.opacity = night.toFixed(2);

  let icon = "🌙";
  if (h > 0.2) icon = "☀️";
  else if (h > -0.3) icon = phase < 0.5 ? "🌅" : "🌇";
  setText(el.clock, icon + " Dia " + (Math.floor(state.time / DAY_LENGTH) + 1));
}

function seedsHTML() {
  const f = state.seedFilter;
  const chips = [["todas", "🧺 Todas"], ["verdura", "🥕 Verduras"], ["fruta", "🍓 Frutas"]]
    .map(([k, label]) =>
      '<button type="button" class="chip' + (f === k ? " active" : "") + '" data-filter="' + k + '">' + label + "</button>")
    .join("");

  const next = nextUnlock();
  const nextText = next
    ? "Próximo desbloqueio: " + next.label + " (nível " + next.lv + ")"
    : "Tudo desbloqueado! 🏆";

  const list = Object.entries(CROPS)
    .filter(([, c]) => f === "todas" || c.type === f)
    .map(([k, c]) => {
      const locked = state.level < c.level;
      const cls = [
        "seed",
        state.selectedSeed === k ? "active" : "",
        locked ? "locked" : "",
        !locked && state.coins < c.seed ? "poor" : "",
      ].join(" ");
      return (
        '<button type="button" class="' + cls + '" data-seed="' + k + '" aria-pressed="' + (state.selectedSeed === k) + '">' +
        '<span class="seed-ico">' + (locked ? "🔒" : c.emoji) + "</span>" +
        '<span class="seed-name">' + c.name + "</span>" +
        '<span class="seed-info">' + (locked ? "Nível " + c.level : "🪙" + fmt(c.seed) + " → " + fmt(c.price)) + "</span>" +
        '<span class="seed-info">⏱ ' + fmtTime(c.time) + "</span>" +
        "</button>"
      );
    })
    .join("");

  return '<div class="seed-filters">' + chips + '<span class="next-unlock">' + nextText + "</span></div>" +
    '<div class="seed-grid">' + list + "</div>";
}

function ordersHTML() {
  const rows = state.orders
    .map((o) => {
      const it = itemInfo(o.item);
      const have = state.inventory[o.item] || 0;
      const ok = have >= o.qty;
      return (
        '<div class="item"><div class="item-ico">' + it.emoji + "</div>" +
        '<div class="item-body"><b>' + o.qty + " × " + it.name + "</b>" +
        '<div class="muted">Você tem ' + fmt(have) + "/" + o.qty + "</div>" +
        '<div class="muted">Recompensa: 🪙' + fmt(o.reward) + " · ⭐" + fmt(o.xp) + " XP</div></div>" +
        '<div class="item-actions">' +
        '<button type="button" class="btn small alt" data-action="deliver" data-id="' + o.id + '"' + (ok ? "" : " disabled") + ">Entregar</button>" +
        '<button type="button" class="btn small ghost" data-action="reroll" data-id="' + o.id + '" title="Trocar pedido">↻ Trocar</button>' +
        "</div></div>"
      );
    })
    .join("");
  return '<h3>Pedidos da vila</h3><p class="muted">Entregue o que os vizinhos pedem e ganhe mais do que no mercado.</p>' + rows;
}

function barnHTML() {
  const keys = Object.keys(state.inventory).filter((k) => state.inventory[k] > 0);
  if (!keys.length) {
    return '<h3>Celeiro</h3><p class="empty">O celeiro está vazio. Colha algo na plantação! 🌾</p>';
  }
  const total = keys.reduce((sum, k) => sum + state.inventory[k] * sellPrice(k), 0);
  const bonus = state.upgrades.feira
    ? '<p class="muted">🏪 Sua barraca na feira dá +' + Math.round((sellMult() - 1) * 100) + "% nos preços.</p>"
    : "";
  const rows = keys
    .map((k) => {
      const it = itemInfo(k);
      return (
        '<div class="item"><div class="item-ico">' + it.emoji + "</div>" +
        '<div class="item-body"><b>' + it.name + '</b> <span class="muted">× ' + fmt(state.inventory[k]) + "</span>" +
        '<div class="muted">🪙' + fmt(sellPrice(k)) + " cada</div></div>" +
        '<div class="item-actions">' +
        '<button type="button" class="btn small" data-action="sell" data-id="' + k + '">Vender 1</button>' +
        '<button type="button" class="btn small alt" data-action="sell-item" data-id="' + k + '">Vender tudo</button>' +
        "</div></div>"
      );
    })
    .join("");
  return (
    '<h3>Celeiro</h3>' + bonus +
    '<button type="button" class="btn" data-action="sell-everything">Vender tudo · 🪙' + fmt(total) + "</button>" + rows
  );
}

function animalsHTML() {
  const rows = Object.entries(ANIMALS)
    .map(([key, a]) => {
      const s = state.animals[key];
      const prod = PRODUCTS[a.product];
      const cap = Math.max(1, s.count) * STOCK_PER_ANIMAL;
      const locked = state.level < a.level;
      const cost = animalCost(key);
      let buy;
      if (locked) buy = '<span class="tag">Nível ' + a.level + "</span>";
      else if (s.count >= MAX_ANIMALS) buy = '<span class="tag">Máximo</span>';
      else
        buy =
          '<button type="button" class="btn small" data-action="buy-animal" data-id="' + key + '"' +
          (state.coins >= cost ? "" : " disabled") + ">Comprar 🪙" + fmt(cost) + "</button>";
      const collect = s.stock > 0
        ? '<button type="button" class="btn small alt" data-action="collect" data-id="' + key + '">Coletar ' + s.stock + "</button>"
        : "";
      return (
        '<div class="item' + (locked ? " is-locked" : "") + '"><div class="item-ico">' + a.emoji + "</div>" +
        '<div class="item-body"><b>' + a.name + '</b> <span class="muted">' + s.count + "/" + MAX_ANIMALS + "</span>" +
        '<div class="muted">' + prod.emoji + " " + prod.name + " (🪙" + fmt(prod.price) + "): " + s.stock + "/" + cap + "</div>" +
        (s.count ? '<div class="mini-bar"><i data-bar="' + key + '"></i></div>' : "") +
        '</div><div class="item-actions">' + buy + collect + "</div></div>"
      );
    })
    .join("");
  return '<h3>Animais</h3><p class="muted">Eles produzem sozinhos! Quanto mais animais, mais rápido. Colete e venda no celeiro.</p>' + rows;
}

function upgradesHTML() {
  const rows = Object.entries(UPGRADES)
    .map(([k, u]) => {
      const lvl = state.upgrades[k];
      const maxed = lvl >= u.max;
      const cost = upgradeCost(k);
      const req = upgradeReq(k);
      const locked = !maxed && state.level < req;
      let action;
      if (maxed) action = '<span class="tag">Máximo</span>';
      else if (locked) action = '<span class="tag">Nível ' + req + "</span>";
      else
        action =
          '<button type="button" class="btn small" data-action="upgrade" data-id="' + k + '"' +
          (state.coins >= cost ? "" : " disabled") + ">Melhorar 🪙" + fmt(cost) + "</button>";
      return (
        '<div class="item' + (locked ? " is-locked" : "") + '"><div class="item-ico">' + u.emoji + "</div>" +
        '<div class="item-body"><b>' + u.name + '</b> <span class="muted">Nv ' + lvl + "/" + u.max + "</span>" +
        '<div class="muted">' + u.desc + "</div></div>" +
        '<div class="item-actions">' + action + "</div></div>"
      );
    })
    .join("");
  return '<h3>Melhorias</h3><p class="muted">Invista suas moedas para deixar a fazenda mais eficiente.</p>' + rows;
}

function achievementsHTML() {
  const done = ACHIEVEMENTS.filter((a) => state.achievements[a.id]).length;
  const rows = ACHIEVEMENTS.map((a) => {
    const ok = Boolean(state.achievements[a.id]);
    return (
      '<div class="item' + (ok ? " done" : "") + '"><div class="item-ico">' + (ok ? a.emoji : "🔒") + "</div>" +
      '<div class="item-body"><b>' + a.name + '</b><div class="muted">' + a.desc + "</div></div>" +
      '<div class="item-actions"><span class="tag">' + (ok ? "✅ Feito" : "🪙" + fmt(a.reward)) + "</span></div></div>"
    );
  }).join("");
  return (
    "<h3>Conquistas " + done + "/" + ACHIEVEMENTS.length + "</h3>" +
    '<p class="muted">Complete objetivos para ganhar moedas de bônus.</p>' + rows
  );
}

function helpHTML() {
  return (
    "<h3>Como jogar</h3>" +
    '<ol class="help-list">' +
    "<li>Escolha uma <b>semente</b> embaixo da plantação (filtre por verduras ou frutas).</li>" +
    "<li>Clique num canteiro vazio para <b>plantar</b> (custa moedas).</li>" +
    "<li>Clique no plantio para <b>regar</b> 💧: cresce bem mais rápido. Às vezes chove sozinho!</li>" +
    "<li>Quando o canteiro brilhar ✨, clique para <b>colher</b>.</li>" +
    "<li>Venda no <b>Celeiro</b> ou entregue <b>Pedidos</b> para ganhar mais.</li>" +
    "<li>Suba de nível para liberar " + Object.keys(CROPS).length + " frutas e verduras e " + Object.keys(ANIMALS).length + " tipos de animais.</li>" +
    "<li>Compre <b>terrenos</b> 🔒 (até " + TOTAL + " canteiros) e <b>melhorias</b> 🛠️ para crescer.</li>" +
    "<li>Complete <b>conquistas</b> 🏆 para ganhar bônus.</li>" +
    "</ol>" +
    '<p class="muted" style="margin-top:12px">Dica: o jogo continua correndo mesmo com a aba fechada (até 2 horas). 🌙</p>'
  );
}

function renderPanel() {
  const views = {
    orders: ordersHTML, barn: barnHTML, animals: animalsHTML,
    upgrades: upgradesHTML, achievements: achievementsHTML, help: helpHTML,
  };
  setHTML(el.panel, views[activeTab]());
}

function updateBars() {
  el.panel.querySelectorAll("[data-bar]").forEach((bar) => {
    const key = bar.dataset.bar;
    const s = state.animals[key];
    const full = s.stock >= s.count * STOCK_PER_ANIMAL;
    bar.style.width = (full ? 100 : Math.min(100, (s.timer / ANIMALS[key].every) * 100)) + "%";
  });
}

function refresh() {
  updateHud();
  for (let i = 0; i < TOTAL; i++) updatePlot(i);
  setHTML(el.seeds, seedsHTML());
  renderPanel();
  updateBars();
}

/* ============ EVENTOS ============ */
// Canteiros: clique, e arrastar com o mouse para fazer vários de uma vez
let painting = false;
let suppressClick = false;
let lastPainted = -1;

function paintTile(node, dragging) {
  const i = Number(node.dataset.i);
  if (i === lastPainted) return;
  lastPainted = i;
  actOnPlot(i, dragging);
  refresh();
  scheduleSave();
}

el.grid.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== "mouse" || e.button !== 0) return;
  const b = e.target.closest(".plot");
  if (!b) return;
  painting = true;
  suppressClick = true;
  lastPainted = -1;
  paintTile(b, false);
});

el.grid.addEventListener("pointerover", (e) => {
  if (!painting) return;
  const b = e.target.closest(".plot");
  if (b) paintTile(b, true);
});

window.addEventListener("pointerup", () => {
  painting = false;
  lastPainted = -1;
  setTimeout(() => { suppressClick = false; }, 0);
});

el.grid.addEventListener("click", (e) => {
  if (suppressClick) { suppressClick = false; return; }
  const b = e.target.closest(".plot");
  if (!b) return;
  lastPainted = -1;
  paintTile(b, false);
  lastPainted = -1;
});

// Sementes e filtros
el.seeds.addEventListener("click", (e) => {
  const chip = e.target.closest("[data-filter]");
  if (chip) {
    state.seedFilter = chip.dataset.filter;
    refresh();
    scheduleSave();
    return;
  }
  const b = e.target.closest("[data-seed]");
  if (!b) return;
  const c = CROPS[b.dataset.seed];
  if (state.level < c.level) {
    toast(c.emoji + " " + c.name + " é liberado no nível " + c.level, "warn");
    sfx.error();
    return;
  }
  state.selectedSeed = b.dataset.seed;
  refresh();
  scheduleSave();
});

// Abas
$("#tabs").addEventListener("click", (e) => {
  const b = e.target.closest("[data-tab]");
  if (!b) return;
  activeTab = b.dataset.tab;
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === b));
  renderPanel();
  updateBars();
  el.panel.scrollTop = 0;
});

// Painel (pedidos, celeiro, animais, melhorias)
el.panel.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn || btn.disabled) return;
  const id = btn.dataset.id;
  switch (btn.dataset.action) {
    case "deliver": deliverOrder(id); break;
    case "reroll": rerollOrder(id); break;
    case "sell": sellItem(id, false, btn); break;
    case "sell-item": sellItem(id, true, btn); break;
    case "sell-everything": sellEverything(btn); break;
    case "buy-animal": buyAnimal(id); break;
    case "collect": collectAnimal(id); break;
    case "upgrade": buyUpgrade(id); break;
  }
  refresh();
  scheduleSave();
});

// Botões em massa
$("#btn-plant-all").addEventListener("click", () => { plantAll(); scheduleSave(); });
$("#btn-water-all").addEventListener("click", () => { waterAll(); scheduleSave(); });
$("#btn-harvest-all").addEventListener("click", () => { harvestAll(); scheduleSave(); });

// Barra superior
$("#btn-save").addEventListener("click", () => saveGame(true));

$("#btn-sound").addEventListener("click", () => {
  state.sound = !state.sound;
  el.sound.textContent = state.sound ? "🔊" : "🔇";
  if (state.sound) sfx.coin();
  scheduleSave();
});

$("#btn-rename").addEventListener("click", () => {
  const name = window.prompt("Nome da sua fazenda:", state.name);
  if (name && name.trim()) {
    state.name = name.trim().slice(0, 28);
    applyName();
    scheduleSave();
  }
});

$("#btn-reset").addEventListener("click", () => {
  if (!window.confirm("Recomeçar do zero? Todo o progresso será apagado.")) return;
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignora */ }
  state = defaultState();
  rain.left = 0;
  rain.next = 90;
  document.body.classList.remove("raining");
  ensureOrders();
  applyName();
  el.sound.textContent = "🔊";
  refresh();
  toast("Fazenda nova, vida nova! 🌱", "ok");
});

function applyName() {
  el.farmName.textContent = state.name;
  document.title = state.name + " | Edição Grande";
}

/* ============ SALVAR AUTOMATICAMENTE ============ */
let saveTimer = null;
function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    saveGame();
  }, 1000);
}

setInterval(() => saveGame(), 5000);
document.addEventListener("visibilitychange", () => { if (document.hidden) saveGame(); });
window.addEventListener("pagehide", () => saveGame());

/* ============ LOOP PRINCIPAL ============ */
let last = Date.now();
function tick() {
  const now = Date.now();
  const dt = Math.min((now - last) / 1000, OFFLINE_CAP);
  last = now;
  advanceWorld(dt);
  updateRain(dt);
  checkAchievements();
  refresh();
}

/* ============ INICIAR ============ */
function start() {
  document.getElementById("year").textContent = new Date().getFullYear();
  buildGrid();
  ensureOrders();
  applyName();
  el.sound.textContent = state.sound ? "🔊" : "🔇";

  if (loaded) {
    const away = Math.min((Date.now() - state.savedAt) / 1000, OFFLINE_CAP);
    if (away > 20) {
      advanceWorld(away);
      toast("Bem-vindo de volta! Sua fazenda trabalhou por " + Math.max(1, Math.round(away / 60)) + " min 🌾", "ok");
    }
  } else {
    toast("Bem-vindo à " + state.name + "! Clique num canteiro para plantar 🌱", "ok");
  }

  last = Date.now();
  refresh();
  setInterval(tick, 250);
}

start();
