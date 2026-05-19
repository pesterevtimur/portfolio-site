# Visual design spec

> Источник: SPEC.md §6, decisions/D-004-visual-mood.md
> Статус: draft
> Цель реализации: `src/styles/globals.css` (Task 24), `src/components/*.astro` (Tasks 25-34)

---

## Палитра (CSS custom properties)

```css
--bg-base:          #0a0a0f;                   /* основной фон страницы */
--bg-elevated:      #14141c;                   /* фон карточек кейсов, fit-блоков */
--bg-grad-hi:       #1a1a2e;                   /* радиальный градиент Hero, правый верхний угол */
--grid-line:        rgba(255, 255, 255, 0.04); /* тонкая сетка 32px — только в Hero */
--text-primary:     #fafafa;                   /* основной текст */
--text-secondary:   #9090a8;                   /* вторичный текст, описания */
--text-mono-label:  #8a8aa0;                   /* моно-метки, технические подписи */
--border-subtle:    #2a2a3a;                   /* рамки карточек, разделители */
--cta-bg:           #fafafa;                   /* primary CTA — белая кнопка на чёрном */
--cta-text:         #0a0a0f;                   /* текст внутри primary CTA */
--bar-strong:       #fafafa;                   /* бар карты компетенций — зона «сильный» */
--bar-medium:       rgba(250, 250, 250, 0.55); /* бар — зона «средний» */
--bar-growing:      rgba(144, 144, 168, 0.7);  /* бар — зона «расту» */
--bar-outside:      #2a2a3a;                   /* бар — зона «не моя» (пустой) */
```

Итого: 14 CSS custom properties. Все значения — конкретные HEX или rgba, без «подобрать позже».

---

## Типографика

| Уровень | Элемент | Шрифт | Размер desktop | Размер mobile | Вес | letter-spacing | line-height |
|---|---|---|---|---|---|---|---|
| H1 (Hero) | `<h1>` | Inter | 56px | 36px | 700 | -0.025em | 1.05 |
| H2 (заголовок секции) | `<h2>` | Inter | 32px | 24px | 600 | -0.02em | 1.15 |
| H3 (подзаголовок) | `<h3>` | Inter | 20px | 18px | 600 | -0.01em | 1.25 |
| Body | `<p>`, `<li>` | Inter | 16px | 15px | 400 | 0 | 1.55 |
| Моно-метка | `.label-mono` | ui-monospace, 'SF Mono', Menlo | 12px | 12px | 500 | 0.15em + uppercase | 1.4 |
| Код в карточках кейсов | `code` | ui-monospace, 'SF Mono', Menlo | 14px | 13px | 400 | 0 | 1.5 |
| Подзаголовок Hero | `.hero-sub` | Inter | 18px | 16px | 400 | -0.01em | 1.45 |

Подключение шрифта: Inter через `astro:fonts` (локально, без CDN-зависимости), вес 400, 600, 700.

---

## Отступы (spacing system)

### Desktop (> 720px)

| Контекст | Значение |
|---|---|
| Между секциями (vertical padding в `.section`) | 96px |
| Внутри секции: от заголовка до контента | 48px |
| Между блоками внутри секции (карточки, строки) | 32px |
| Между элементами средней плотности | 24px |
| Между мелкими элементами | 16px |
| Минимальный отступ (иконка + текст) | 8px |

### Mobile (≤ 720px)

| Контекст | Значение |
|---|---|
| Между секциями (vertical padding в `.section`) | 64px |
| Внутри секции: от заголовка до контента | 32px |
| Между блоками | 24px |
| Между мелкими элементами | 12px |

### Контейнер страницы

```css
.container {
  max-width: 1080px;
  margin-inline: auto;
  padding-inline: 24px; /* desktop */
}

@media (max-width: 720px) {
  .container {
    padding-inline: 16px; /* mobile */
  }
}
```

---

## Breakpoints

| Имя | Условие | Что меняется |
|---|---|---|
| Desktop | `> 720px` | базовая раскладка |
| Mobile | `≤ 720px` | уменьшение шрифтов H1/H2, padding секций 96px → 64px, колонки → стек, бары компетенций уже |
| Очень узкие экраны | `≤ 375px` (iPhone SE) | специальный breakpoint **не нужен** — контент должен влезать по умолчанию при `padding-inline: 16px` и корректном `font-size` |

Единственный breakpoint в CSS: `@media (max-width: 720px)`.

---

## Hero — специфичный стиль

### Радиальный градиент фона

```css
.hero {
  background:
    radial-gradient(
      ellipse 60% 50% at 80% 0%,
      var(--bg-grad-hi),
      var(--bg-base)
    );
}
```

### Сетка 32px

Реализация через SVG `data:` URI как `background-image` поверх градиента:

```css
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
  z-index: 0;
}
```

Сетка — только в Hero. Все остальные секции имеют чистый `background: var(--bg-base)`.

### Раскладка Hero (desktop)

```
┌──────────────────────────────────────────────────────┐
│  [моно-метка сверху: "AI ARCHITECT · FRACTIONAL"]    │
│                                                      │
│  Запускаю AI-процессы,                               │
│  которые не разваливаются                            │
│  на втором месяце.                                   │
│                                                      │
│  [подзаголовок 18px]                                 │
│                                                      │
│  [CTA primary]  [CTA secondary «Кейсы ↓»]           │
│                                                      │
│  [фото портрета — правая колонка, абсолютно]        │
└──────────────────────────────────────────────────────┘
```

Desktop: двухколоночный CSS Grid (текст + фото). Mobile: фото убирается или переходит под CTA (уточнить в Task 25 Hero.astro). Фото файл: `public/portrait.jpg`.

---

## CTA (call-to-action) — состояния

### Primary CTA (белый на чёрном)

```css
.cta-primary {
  background-color: var(--cta-bg);      /* #fafafa */
  color: var(--cta-text);               /* #0a0a0f */
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.15s ease;
}

.cta-primary:hover {
  filter: brightness(0.95);
  transform: translateY(-1px);
}

.cta-primary:focus-visible {
  outline: 2px solid var(--cta-bg);
  outline-offset: 3px;
}

.cta-primary:active {
  transform: translateY(0);
  filter: brightness(0.9);
}
```

### Secondary CTA (обводка)

```css
.cta-secondary {
  background-color: transparent;
  color: var(--text-primary);           /* #fafafa */
  border: 1px solid var(--border-subtle); /* #2a2a3a */
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.cta-secondary:hover {
  border-color: var(--text-secondary);  /* #9090a8 */
  transform: translateY(-1px);
}

.cta-secondary:focus-visible {
  outline: 2px solid var(--text-secondary);
  outline-offset: 3px;
}

.cta-secondary:active {
  transform: translateY(0);
}
```

---

## Кейс-карточки

```css
.case-card {
  background: var(--bg-elevated);   /* #14141c */
  border: 1px solid var(--border-subtle); /* #2a2a3a */
  border-radius: 12px;
  padding: 32px;
}
```

### Внутренняя структура карточки

- **Моно-метка сверху** (проект / год): `font-family: ui-monospace; font-size: 12px; color: var(--text-mono-label); text-transform: uppercase; letter-spacing: 0.15em`.
- **Заголовок кейса**: H3 (20px desktop, 18px mobile), `color: var(--text-primary)`, margin-top: 8px.
- **Описание**: Body (16px desktop, 15px mobile), `color: var(--text-secondary)`.
- **Блок метрики** (например, «4 часа → 15 минут»): отдельный `div.metric-block` с `background: var(--bg-base); border-radius: 8px; padding: 16px 20px`. Число крупное — 32px desktop / 24px mobile, `color: var(--text-primary)`, вес 700. Подпись числа — `color: var(--text-secondary)`, 13px.
- **Ссылка «Подробнее»**: inline-link или secondary CTA внизу карточки.

### Mobile-адаптация карточки

```css
@media (max-width: 720px) {
  .case-card {
    padding: 24px 20px;
    border-radius: 10px;
  }
}
```

Карточки desktop: горизонтальная сетка `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`. Mobile: стек (одна колонка).

---

## Карта компетенций — стиль баров

Источник содержимого: `docs/research/competency-map.md` → Вариант 1 (горизонтальные бары).

```css
/* Зона-разделитель */
.zone-header {
  font-family: ui-monospace, 'SF Mono', Menlo;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 32px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-subtle);
}

/* Строка компетенции */
.competency-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(42, 42, 58, 0.5);
}

/* Метка зоны (моно-подпись справа) */
.zone-label {
  font-family: ui-monospace, 'SF Mono', Menlo;
  font-size: 11px;
  color: var(--text-mono-label);
  white-space: nowrap;
  min-width: 56px;
  text-align: right;
}

/* Бар — фиксированная длина, различие только цветом */
.bar {
  width: 120px;  /* фиксировано, НЕ шкала */
  height: 4px;
  border-radius: 2px;
  flex-shrink: 0;
}

.bar--strong  { background: var(--bar-strong); }   /* #fafafa, непрозрачный */
.bar--medium  { background: var(--bar-medium); }   /* #fafafa, 55% */
.bar--growing { background: var(--bar-growing); }  /* #9090a8, 70% */
.bar--outside { background: var(--bar-outside); }  /* #2a2a3a, пустой */
```

Под диаграммой — три строки-подписи в `color: var(--text-secondary)`, моно-шрифт 13px:

```
Где я подхожу · Где я расту · Где нужен другой специалист
```

### Mobile-вёрстка карты компетенций

```css
@media (max-width: 720px) {
  .competency-row {
    flex-wrap: wrap;
    gap: 6px;
  }
  .bar {
    width: 96px;      /* чуть уже на mobile */
    order: 3;         /* бар — последним в строке */
  }
  .zone-label {
    order: 2;
    text-align: left;
  }
}
```

---

## Иконки

- Библиотека: **Tabler outline** (пакет `@tabler/icons` или SVG-спрайт).
- Размер: 16px в текстовых строках (inline), 18px в заголовках или акцентных блоках.
- Цвет по умолчанию: `var(--text-secondary)` (`#9090a8`).
- Цвет hover / active: `var(--text-primary)` (`#fafafa`).
- Transition: `color 0.15s ease`.
- Stroke-width: 1.5px (стандарт Tabler outline).
- Никаких filled или duotone вариантов — только outline.

```css
.icon {
  width: 16px;
  height: 16px;
  stroke: var(--text-secondary);
  stroke-width: 1.5;
  fill: none;
  transition: stroke 0.15s ease;
  vertical-align: middle;
  flex-shrink: 0;
}

.icon--lg {
  width: 18px;
  height: 18px;
}

a:hover .icon,
button:hover .icon {
  stroke: var(--text-primary);
}
```

---

## Секции — межсекционные отступы и цвета фона

| Секция | Фон | Примечание |
|---|---|---|
| Hero | `var(--bg-base)` + радиальный градиент + сетка 32px | Градиент и сетка — только здесь |
| Кейсы | `var(--bg-base)` | Карточки сами используют `--bg-elevated` |
| Как я работаю | `var(--bg-base)` | Чистый фон |
| Карта компетенций | `var(--bg-base)` | Чистый фон |
| Стек | `var(--bg-elevated)` | Слегка выделен для визуальной паузы |
| О тебе | `var(--bg-base)` | Чистый фон |
| Кому подхожу | `var(--bg-elevated)` | Слегка выделен — акцент-секция |
| Куда расту | `var(--bg-base)` | Чистый фон |
| Контакты | `var(--bg-base)` | Финальный блок, минималистичный |

```css
.section {
  padding-block: 96px; /* desktop */
}

@media (max-width: 720px) {
  .section {
    padding-block: 64px;
  }
}

.section--elevated {
  background: var(--bg-elevated);
}
```

---

## Ссылки и интерактивные элементы

```css
a {
  color: var(--text-primary);
  text-decoration: underline;
  text-decoration-color: var(--border-subtle);
  text-underline-offset: 3px;
  transition: text-decoration-color 0.15s ease;
}

a:hover {
  text-decoration-color: var(--text-secondary);
}
```

---

## Самопроверка (чеклист перед Task 24)

- [x] ≥ 10 CSS custom properties: 14 переменных задекларированы.
- [x] Все типографические уровни имеют desktop И mobile размеры.
- [x] Spacing system конкретный: числа в px, не «small/medium/large».
- [x] Breakpoints явные: `@media (max-width: 720px)` — единственный.
- [x] Очень узкие экраны (≤ 375px): специальный breakpoint не нужен — покрывается `padding-inline: 16px` + базовыми font-size.
- [x] Hero-градиент: конкретный CSS `radial-gradient`, значения из палитры.
- [x] Сетка Hero: конкретный CSS `linear-gradient` 32px, только в Hero.
- [x] CTA: все 4 состояния (default / hover / focus-visible / active).
- [x] Кейс-карточки: фон, рамка, padding, метрика-блок — конкретные значения.
- [x] Карта компетенций: 4 цвета зон, фиксированная ширина баров (не шкала), mobile-адаптация.
- [x] Иконки: размер, цвет, stroke-width, переход.
- [x] Все HEX и rgba — валидный синтаксис, font-family — корректный comma-separated стек.
