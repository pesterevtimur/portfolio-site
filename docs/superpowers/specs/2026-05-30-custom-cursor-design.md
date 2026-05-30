# Custom cursor — дизайн

**Дата:** 2026-05-30
**Статус:** approved (brainstorm-фаза)
**Тип:** UX-фича, frontend-only
**Связано:** M-002 magnetic gradient (2026-05-29 spec), D-004 (mood A), AGENTS.md §4.3

## 1. Цель

Заменить системный курсор на минимальный кастомный из двух элементов — sharp dot + slow ring. На hover над интерактивными элементами (CTA-кнопки, ссылки, якоря) точка магнетически снапает в центр элемента, кольцо вырастает по его границам. Цель — подчеркнуть точность взаимодействия и интегрироваться с magnetic-темой M-002.

## 2. Не-цели (YAGNI)

- Нет custom cursor на touch-устройствах (там и нет курсора).
- Нет I-beam курсора на текстовых полях (на сайте их нет — портфолио).
- Нет цветных / тематических курсоров по секциям (одна форма везде).
- Нет custom cursor png / icon / эмоджи — только геометрия.
- Нет click-feedback (никаких scale/ripple на mousedown).
- Нет персистентного «trail» хвоста.
- Нет magnetic snap на CaseCard карточках — они не обёрнуты в `<a>`, не считаются интерактивными для целей курсора.

## 3. Архитектура

### 3.1 DOM

Два элемента, добавленных в `Layout.astro` сразу после `<body>` (рендерятся всегда; CSS скрывает их на touch):

```astro
<div id="cursor-dot" aria-hidden="true"></div>
<div id="cursor-ring" aria-hidden="true"></div>
```

Оба: `position: fixed; top: 0; left: 0; pointer-events: none; will-change: transform`.

### 3.2 Движение — requestAnimationFrame + lerp

Не CSS transition (как M-002). Курсор требует high-frequency smooth follow с разной инерцией для dot/ring — это идиоматично для rAF lerp:

```typescript
let mouseX = 0, mouseY = 0;
let dotX = 0, dotY = 0;
let ringX = 0, ringY = 0;
const DOT_K = 0.85;   // тугое следование
const RING_K = 0.15;  // мягкое следование с inertia

function frame() {
  dotX += (mouseX - dotX) * DOT_K;
  dotY += (mouseY - dotY) * DOT_K;
  ringX += (mouseX - ringX) * RING_K;
  ringY += (mouseY - ringY) * RING_K;
  dotEl.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
  ringEl.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
  requestAnimationFrame(frame);
}
```

Auto-stop loop когда `|target - current| < 0.5` на обеих координатах (минор-оптимизация для idle).

### 3.3 Magnetic snap на интерактивных элементах

JS навешивает `mouseenter`/`mouseleave` на селектор `a, button, [data-cursor="snap"]`. На enter:

- `rect = el.getBoundingClientRect()`
- Точка целится в `rect.left + rect.width / 2`, `rect.top + rect.height / 2`
- Кольцо целится туда же, плюс растёт: `ringEl.style.width = rect.width + 12 + "px"`, `height = rect.height + 12 + "px"`, `border-radius` уменьшается до `8px` (вместо круглого) чтобы матчить кнопку

На leave — отменяем магнитный режим, кольцо возвращается к 32×32 round, размер транзишится 0.2s ease-out.

Реализация snap'а: JS хранит state-переменную `snapTarget: HTMLElement | null`. Если != null — rAF loop использует target center как мишень для lerp вместо реального `mouseX/Y`. Если null — обычное следование.

### 3.4 Native cursor скрытие

В `globals.css`:

```css
@media (hover: hover) and (pointer: fine) {
  body { cursor: none; }
  a, button { cursor: none; }
}
```

На touch — `body { cursor: ... }` не переопределяется, native курсор не отображается (нет курсора на touch вообще), JS не вешает rAF loop.

### 3.5 mix-blend-mode: difference

Оба элемента — `mix-blend-mode: difference` с белым `background` (dot) / белой `border` (ring). Это инвертирует курсор против любого фона: на тёмном Hero → белый, на белой CTA-кнопке → чёрный. Решает проблему «курсор пропал на светлом фоне».

## 4. Поток данных

```
mousemove(event)
  └─ mouseX = event.clientX; mouseY = event.clientY (просто сохраняем)

mouseenter(intercept target)
  ├─ rect = target.getBoundingClientRect()
  ├─ snap mouseX/Y → rect center (override real position)
  └─ ringEl.style.width/height = rect.width+12/height+12, border-radius = 8px

mouseleave(target)
  ├─ restore mouseX/Y to event.clientX/Y
  └─ ringEl.style.width/height = 32, border-radius = 50%

requestAnimationFrame(frame)
  ├─ dotX += (mouseX - dotX) * 0.85
  ├─ ringX += (mouseX - ringX) * 0.15
  ├─ apply transforms
  └─ schedule next frame
```

## 5. Edge cases

| Сценарий | Поведение |
|---|---|
| Touch-устройство (no hover or coarse pointer) | `body { cursor: none }` не применяется (media query гейт). JS не вешает listeners. `#cursor-dot` и `#cursor-ring` скрыты через `display: none` внутри `@media (hover: none)`. Поведение идентично текущему — native touch без курсора. |
| `prefers-reduced-motion: reduce` | rAF loop работает, но `DOT_K = RING_K = 1.0` (мгновенный follow без inertia). Magnetic snap сохраняется — это feedback, не motion. |
| Старые браузеры без `mix-blend-mode: difference` | Курсор будет белым (fallback). На светлой CTA пропадёт. Acceptable degradation — не ломает функциональность. |
| Текстовые поля / textarea | На сайте их нет. Если появятся — `[data-cursor="text"]` селектор как future extension. |
| Курсор уходит за viewport (top: -10) | `position: fixed` + clamp на координаты — курсор остаётся в пределах viewport (или скрывается через CSS clip). |
| Конфликт с magnetic heatmap в Hero | Курсор (8px dot + 32px ring) на переднем плане, blob'ы heatmap (300-700px, blur 80px) на фоне. Разные масштабы, `mix-blend-mode` решает контраст. Конфликта нет. |
| JS заблокирован | `#cursor-dot/ring` остаются в (0,0). Native курсор скрыт через CSS. Плохо — курсор «исчез». **Mitigation:** `body { cursor: none }` ставится **JS'ом** при инициализации, а не статически в CSS. Если JS не загрузился — native курсор остаётся, элементы курсора невидимы. |

## 6. Производительность

- 60Hz mousemove → дёшево (просто 2 присваивания).
- rAF loop крутится только во время interaction. При idle (mouseX==dotX) можно делать auto-stop.
- Два `el.style.transform` per frame — composited на GPU layer. Без layout/paint.
- Bundle: ~1.5 KB minified, gzip ~700B.
- Lighthouse прогноз: не двигается (mobile 89, desktop 98 — текущий heatmap baseline).

## 7. Тестирование

Manual (нет автотестов):

1. **Build:** `npm run build` зелёный.
2. **Vercel preview:** push на `feat/custom-cursor`, проверить preview URL.
3. **Cursor visibility:** на тёмном Hero — белая точка/кольцо; на CTA «Написать в Telegram» (белая кнопка) — чёрная (через blend-mode).
4. **Movement:** точка следует тесно, кольцо отстаёт с заметной инерцией.
5. **Magnetic snap CTA:** hover на «Написать в Telegram» → точка центруется, кольцо растёт по форме кнопки.
6. **Magnetic snap link:** hover на якорь «Кейсы ↓» → snap работает.
7. **mouseleave:** курсор возвращается из snap-режима в обычный без артефактов.
8. **Mobile emulation:** Toggle device toolbar → cursor элементы скрыты, native touch работает.
9. **Reduced motion:** DevTools → Emulate `prefers-reduced-motion: reduce` → курсор следует мгновенно без inertia.
10. **Lighthouse mobile/desktop:** Performance не падает ниже baseline (89/98).
11. **Конфликт с heatmap:** курсор видимым over Hero (mix-blend-mode handles это).

## 8. Acceptance criteria

- [ ] Custom cursor виден на desktop, скрыт на touch.
- [ ] Точка следует тесно, кольцо отстаёт с inertia.
- [ ] `mix-blend-mode: difference` работает — курсор не пропадает на любом фоне.
- [ ] Magnetic snap на `a, button, [data-cursor="snap"]`.
- [ ] `prefers-reduced-motion`: мгновенный follow без inertia, magnetic snap остаётся.
- [ ] `npm run build` зелёный.
- [ ] Lighthouse mobile ≥ 89, desktop ≥ 97 на preview.
- [ ] Никаких регрессий: CTA-кнопки кликабельны, scroll работает, focus-ring у Tab сохранён.
- [ ] JS-disabled fallback: native курсор виден (никаких «потерянных» курсоров).

## 9. Открытые вопросы

Нет. Все решения зафиксированы в brainstorm-сессии 2026-05-30.

## 10. Связанные документы

- `docs/superpowers/specs/2026-05-29-magnetic-gradient-hover-design.md` — magnetic-gradient spec
- `decisions/D-004-visual-mood.md` — обоснование mood A
- AGENTS.md §4.3 — approval gate для production deploy
