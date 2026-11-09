// SL:SaintCulture × Claude — white-on-white embroidery in an endless mirror tunnel.
// Artwork by Yaroslava Breus (SL:SaintCulture), made with Claude during the Claude Impact Lab Berlin, 7 November 2026.
// This is her original p5.js sketch, adapted for the results website:
// the keyboard shortcuts and the PNG/GIF/video recording helpers were removed,
// the canvas is attached to the #art-canvas element,
// and it animates only while on screen and when the visitor has not asked for reduced motion.
// Original comments below are hers, in Ukrainian.

// SaintLilith × SaintCulture — біла гладь по білому, нескінченний дзеркальний тунель
// Анімація безшовно зациклена: камера летить углиб відображень без кінця.

const R = 50;          // радіус кільця
const W = 16;          // ширина смужки вишивки

// Тунель
const LEVELS = 26;     // глибина видимих відображень (i = 26)
const SCALE = 0.8;     // у скільки разів менше кожне наступне відображення
const DECAY = 0.9;     // тьмяність за глибиною (менше = швидше згасає)
const TWIST = 0;       // поворот між рівнями (спробуй 0.12 — закрутить спіраллю)
const FLIP = true;     // віддзеркалювати кожен другий рівень
const PERIOD = 240;    // кадрів на один цикл
const FPS = 30;
const HQ = 3;          // якість: 2 = нормально, 3 = дуже чітко, 4 = максимум (важче)

// Вишитий підпис унизу. Варіанти:
//   'SL:SaintCulture x Claude 2026'   'SaintCulture · 07.11.2026'   'YB'
const SIGNATURE = 'SL:SaintCulture';

// Дрібний вишитий рядок у лівому нижньому кутку
const CORNER_TEXT = 'Claude Community x Foresight Institute';

// Біла вишивка
const MOTIF = '#E6DDC9';
const HEART = '#BFB398';
const EDGE = '#C9BFA8';
const MOTIF_STROKE = '#B8AD93';
const RING = '#F8F4EA';
const TEXT = '#7a6e58';
const BG = [242, 237, 225];

const PIVOT = { x: 270, y: 170 };

const rings = [
  { x: 150, y: 140, seed: 1 },
  { x: 210, y: 200, seed: 2 },
  { x: 270, y: 140, seed: 3 },
  { x: 330, y: 200, seed: 4 },
  { x: 390, y: 140, seed: 5 },
];

let bgImg;   // льон, намальований один раз
let buf;     // композиція (рамка + кільця) на прозорому тлі, намальована один раз
let sigImg;  // вишитий підпис на прозорому тлі, малюється один раз
let loopStart = 0;  // з якого кадру починається цикл (для запису)

function setup() {
  const cnv = createCanvas(540, 340);
  cnv.parent('art-canvas');
  pixelDensity(HQ);
  frameRate(FPS);

  // 1. тканина
  linen();
  bgImg = get();

  // 2. композиція на прозорому тлі
  clear();
  composition();
  buf = get();

  // 3. вишитий підпис — окремо, один раз, не лупається
  clear();
  embroideredText(SIGNATURE, width / 2, 291, 22);
  embroideredText(CORNER_TEXT, 30, 312, 10, LEFT);
  sigImg = get();

  // Website: a single still frame for visitors who prefer reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    noLoop();
    return;
  }
  // Website: run only while the canvas is on screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      entries.forEach(e => (e.isIntersecting ? loop() : noLoop()));
    }).observe(cnv.elt);
  }
}

// ---------- малювання вишивки ----------

function linen() {
  background(BG[0], BG[1], BG[2]);
  randomSeed(99);
  strokeWeight(1);
  for (let i = 0; i < 2500; i++) {
    const x = random(width), y = random(height);
    stroke(120, 90, 50, random(8, 22));
    if (random() < 0.5) line(x, y, x + random(4, 10), y);
    else line(x, y, x, y + random(4, 10));
  }
}

function motifStyle() {
  fill(MOTIF);
  stroke(MOTIF_STROKE);
  strokeWeight(0.6);
}

function flower() {
  motifStyle();
  for (let k = 0; k < 5; k++) {
    push();
    rotate((TWO_PI / 5) * k);
    ellipse(0, -3.6, 3.4, 5.6);
    pop();
  }
  noStroke();
  fill(HEART);
  circle(0, 0, 2.6);
}

function leaf() {
  motifStyle();
  ellipse(0, 0, 9, 3.2);
}

function knot() {
  motifStyle();
  circle(0, 0, 2.2);
}

function drawRing(r) {
  randomSeed(r.seed);
  const base = color(RING);

  noFill();
  stroke(0, 0, 0, 70);
  strokeWeight(W + 4);
  circle(r.x + 1.2, r.y + 1.8, R * 2);

  const n = 150;
  strokeWeight(2.8);
  strokeCap(ROUND);
  for (let k = 0; k < n; k++) {
    const a = (TWO_PI / n) * k + random(-0.012, 0.012);
    const half = W / 2 + random(-0.8, 0.8);
    const s = random(-10, 10);
    stroke(
      constrain(red(base) + s, 0, 255),
      constrain(green(base) + s, 0, 255),
      constrain(blue(base) + s, 0, 255)
    );
    line(
      r.x + cos(a) * (R - half), r.y + sin(a) * (R - half),
      r.x + cos(a) * (R + half), r.y + sin(a) * (R + half)
    );
  }

  noFill();
  stroke(EDGE);
  strokeWeight(1.1);
  circle(r.x, r.y, (R + W / 2) * 2);
  circle(r.x, r.y, (R - W / 2) * 2);

  for (let k = 0; k < 24; k++) {
    const a = (TWO_PI / 24) * k;
    push();
    translate(r.x + cos(a) * R, r.y + sin(a) * R);
    rotate(a + HALF_PI);
    if (k % 4 === 0) flower();
    else if (k % 4 === 2) leaf();
    else knot();
    pop();
  }
}

function overlay(p, ring) {
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(p.x, p.y, W * 1.7, 0, TWO_PI);
  drawingContext.clip();
  drawRing(ring);
  drawingContext.restore();
}

function mirrorFrame() {
  noFill();
  stroke(EDGE);
  strokeWeight(2);
  rect(12, 12, width - 24, height - 24, 16);
  strokeWeight(1);
  rect(18, 18, width - 36, height - 36, 12);
}

function composition() {
  rings.forEach(drawRing);

  for (let i = 0; i < rings.length - 1; i++) {
    const a = rings[i], b = rings[i + 1];
    const dx = b.x - a.x, dy = b.y - a.y;
    const d = sqrt(dx * dx + dy * dy);
    const h = sqrt(R * R - (d / 2) * (d / 2));
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;

    const p1 = { x: mx - (dy / d) * h, y: my + (dx / d) * h };
    const p2 = { x: mx + (dy / d) * h, y: my - (dx / d) * h };
    const top = p1.y < p2.y ? p1 : p2;

    overlay(top, a);
  }
}

// Вишитий напис: текст розкладається на тонкі вертикальні стібки гладді
function embroideredText(str, cx, cy, size, align = CENTER) {
  const h = 80, D = 4;                 // D — роздільність маски для чітких літер
  const pg = createGraphics(width, h);
  pg.pixelDensity(D);
  pg.clear();
  pg.noStroke();
  pg.fill(0);
  pg.textFont('Georgia');
  pg.textStyle(BOLD);
  pg.textSize(size);
  pg.textAlign(align, CENTER);
  pg.text(str, cx, h / 2);
  pg.loadPixels();

  const rowLen = width * D;
  const top = cy - h / 2;
  const step = 0.55;                   // відстань між стібками
  const maxLen = 5;                    // довгі ділянки розбиваємо на кілька стібків

  // знаходимо вертикальні відрізки літер у кожному стовпчику
  const segs = [];
  for (let x = 0; x < width; x += step) {
    const px = floor(x * D);
    let start = null;
    for (let y = 0; y <= h; y += 0.25) {
      const on = y < h && pg.pixels[4 * (floor(y * D) * rowLen + px) + 3] > 128;
      if (on && start === null) start = y;
      if (start !== null && (!on || y - start >= maxLen)) {
        segs.push([x, start, y]);
        start = on ? y : null;
      }
    }
  }

  const base = color(RING);
  const edge = color(MOTIF_STROKE);
  push();
  strokeCap(ROUND);
  randomSeed(7);

  // 1) тінь-рельєф
  stroke(red(edge), green(edge), blue(edge), 150);
  strokeWeight(step * 1.5);
  for (const [x, y0, y1] of segs) line(x + 0.6, top + y0 + 0.8, x + 0.6, top + y1 + 0.8);

  // 2) самі стібки
  strokeWeight(step * 1.3);
  for (const [x, y0, y1] of segs) {
    const s = random(-10, 10);
    stroke(
      constrain(red(base) + s, 0, 255),
      constrain(green(base) + s, 0, 255),
      constrain(blue(base) + s, 0, 255)
    );
    line(x, top + y0, x + random(-0.15, 0.15), top + y1);
  }
  pop();
  pg.remove();
}

// ---------- тунель ----------

// Прозорість рівня залежно від безперервної глибини p.
// p < 0: відображення виростає і зникає, p > LEVELS: нове з'являється з туману.
function levelAlpha(p) {
  if (p < 0) return constrain(1 + p, 0, 1);
  return pow(DECAY, p) * constrain(LEVELS - p, 0, 1);
}

function draw() {
  image(bgImg, 0, 0, width, height);

  // t: 0 → 1 за цикл. За цикл камера проходить рівно 2 рівні,
  // тому і масштаб, і віддзеркалення в кінці збігаються з початком.
  const t = (((frameCount - loopStart) % PERIOD) + PERIOD) % PERIOD / PERIOD;

  // тунель видно лише всередині рамки
  drawingContext.save();
  drawingContext.beginPath();
  if (drawingContext.roundRect) drawingContext.roundRect(12, 12, width - 24, height - 24, 16);
  else drawingContext.rect(12, 12, width - 24, height - 24);
  drawingContext.clip();

  for (let j = LEVELS + 2; j >= -2; j--) {
    const p = j - 2 * t;
    const al = levelAlpha(p);
    if (al < 0.01) continue;

    push();
    drawingContext.globalAlpha = al;
    translate(PIVOT.x, PIVOT.y);
    rotate(p * TWIST);
    const s = pow(SCALE, p);
    scale(FLIP && abs(j) % 2 === 1 ? -s : s, s);
    translate(-PIVOT.x, -PIVOT.y);
    image(buf, 0, 0, width, height);
    pop();
  }

  drawingContext.restore();

  // нижня смужка-«етикетка», щоб підпис не губився на кільцях
  noStroke();
  fill(BG[0], BG[1], BG[2], 240);
  rect(18, 276, width - 36, 46, 0, 0, 12, 12);
  stroke(EDGE);
  strokeWeight(1);
  line(18, 276, width - 18, 276);

  // рамка і підпис — по одному разу, нерухомі, не повторюються
  mirrorFrame();
  image(sigImg, 0, 0, width, height);
}
