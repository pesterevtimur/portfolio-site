# Magnetic gradient hover — дизайн

**Дата:** 2026-05-29
**Статус:** approved (brainstorm-фаза)
**Тип:** UX-фича, frontend-only
**Связано:** SPEC.md §13 (визуальная плотность), D-004 (mood A), Lighthouse baseline (mobile 89 / desktop 98)

## 1. Цель

Добавить интерактивную hover-анимацию на двух фокусных зонах сайта:
- **Hero** — радиальный градиент в `::before` плавно подтягивается к курсору.
- **Случай-карточки (CaseCard)** — accent-glow в углу карточки плавно перемещается к точке наведения внутри карточки.

Цель: оживить first-impression и proof-секцию без удара по производительности и без конфликта с читаемостью.

## 2. Не-цели (YAGNI)

- Не делаем эффект во всех секциях сайта (Principles, Stack, Competency и т.д. — статичные).
- Не делаем эффект на тач-устройствах (hover там не имеет смысла).
- Не делаем canvas/WebGL.
- Не делаем custom-cursor.
- Не делаем `auto-drift` на мобиле — фон там остаётся точно как сейчас.

## 3. Архитектура

### 3.1 Подход — `@property` + native CSS transition

Один shared TypeScript-скрипт `src/scripts/magnetic-gradient.ts` слушает `mousemove`/`mouseleave` на каждом элементе с атрибутом `data-magnetic`. Скрипт записывает позицию курсора (в процентах от размера элемента) в две CSS-переменные на самом элементе:

```js
el.style.setProperty('--mx', String(mxPercent));
el.style.setProperty('--my', String(myPercent));
```

Переменные `--mx` и `--my` зарегистрированы через `@property` в `globals.css` с типом `<number>` и заданным `transition` (0.6s ease-out). Браузер сам интерполирует значения на composite-thread; никакого `requestAnimationFrame` в коде проекта не нужно.

Градиент в `Hero.astro` и `CaseCard.astro` использует переменные напрямую:

```css
background: radial-gradient(
  ellipse at calc(var(--mx) * 1%) calc(var(--my) * 1%),
  var(--bg-grad-hi) 0%,
  var(--bg-base) 60%
);
```

### 3.2 Файлы, которые меняются

| Файл | Тип | Что |
|---|---|---|
| `src/scripts/magnetic-gradient.ts` | новый | ~20 строк: querySelectorAll(`[data-magnetic]`) + mousemove/mouseleave listeners + writer переменных. Top-level гейт: `if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return`. |
| `src/layouts/Layout.astro` | edit | +1 `<script>` импорт скрипта. |
| `src/styles/globals.css` | edit | `@property --mx`, `@property --my` (с `initial-value: 100`/`0` соответственно и `syntax: '<number>'`). Media-блок `@media (prefers-reduced-motion: reduce)` обнуляет transition на этих переменных. |
| `src/components/Hero.astro` | edit | `data-magnetic` на `<section>`. `.hero::before` background меняется на `radial-gradient(ellipse at calc(var(--mx, 100) * 1%) calc(var(--my, 0) * 1%), ...)` — defaults 100/0 совпадают с текущим `at top right`. |
| `src/components/CaseCard.astro` | edit | `data-magnetic` на `<article>`. `.case-card__accent` теряет фиксированные `top: -80px; right: -80px; width: 280px; height: 280px` → становится `inset: 0`. Background меняется на radial gradient с теми же `--mx`/`--my`. Defaults (100, 0) визуально равны текущему углу. |

## 4. Поток данных

```
mousemove(event)
  ├─ rect = el.getBoundingClientRect()
  ├─ mx = ((event.clientX - rect.left) / rect.width) * 100
  ├─ my = ((event.clientY - rect.top) / rect.height) * 100
  └─ el.style.setProperty('--mx', mx) + setProperty('--my', my)
       └─ @property triggers transition (0.6s ease-out)
            └─ composite-thread interpolates radial-gradient anchor
                 └─ GPU repaint (no layout, no style recalc выше)

mouseleave(event)
  └─ el.style.removeProperty('--mx') + removeProperty('--my')
       └─ переменные возвращаются к default (100/0 — текущий правый верхний)
            └─ та же 0.6s transition приводит градиент на место
```

## 5. Edge cases и graceful degradation

| Сценарий | Поведение |
|---|---|
| Touch-устройство (no hover) | `matchMedia` гейт в скрипте — listeners не вешаются. Градиент остаётся в дефолтной позиции (100/0). Поведение идентично текущему проду. |
| `prefers-reduced-motion: reduce` | `@media` блок в `globals.css` обнуляет `transition` на `@property` для пользователей с этой настройкой. Скрипт продолжает работать — курсор двигает градиент, но мгновенно, без 0.6s плавности. Решение: оставляем отзывчивость на курсор, убираем только инерцию. Полное отключение скрипта было бы агрессивнее, чем требует WCAG. |
| Браузер без `@property` (Safari <16.4, Firefox <128) | `@property` регистрации игнорируются. Гради ент использует переменные напрямую, но без интерполяции — прыгает мгновенно за курсором. Не magnetic, но и не сломано. |
| CTA / ссылки под градиент-слоем | Hero: `.hero::after` (grid) и градиент-слой имеют `pointer-events: none` — уже стоит. CaseCard: `.case-card__accent` уже `pointer-events: none`. Проверить что после `inset: 0` рефактора это сохраняется. |
| Курсор быстро перемещается между карточками | Каждая карточка — независимый listener на своём `<article>`. mouseleave одной → её градиент уходит на default; mouseenter второй → её градиент подхватывает. Нет cross-talk. |
| JS заблокирован / не загрузился | Защита — defaults `var(--mx, 80)` в CSS. Без JS градиент в дефолтной позиции, сайт работает. |

## 6. Производительность

- mousemove события на ~60Hz → 60 `setProperty` вызовов/сек. Это write в inline style, dirty не layout а composite. Дёшево.
- Нет requestAnimationFrame loop'а — оптимизация интерполяции на browser-side.
- JS-bundle: ожидаемый прирост ~1 KB minified, gzip ~500B.
- **Прогноз Lighthouse:**
  - Mobile (нет hover-устройства, скрипт early-return'ит) — не меняется, остаётся 89.
  - Desktop — теоретически возможна просадка с 98 на 97 из-за +1KB JS. Verify after deploy.

## 7. Тестирование

Manual tests (нет автотестов в проекте):

1. **Build:** `npm run build` зелёный.
2. **Vercel preview:** push на feature-branch `feat/magnetic-gradient`, проверить preview-URL.
3. **Hero hover:** курсор движется по Hero → градиент плавно следует с задержкой ~0.6s.
4. **Hero mouseleave:** курсор выходит из Hero → градиент возвращается в правый верхний.
5. **Card hover:** курсор внутри карточки → accent перетекает к курсору, остальные 2 карточки не реагируют.
6. **Card mouseleave:** курсор покидает карточку → accent возвращается в правый верхний.
7. **Mobile emulation (DevTools):** Toggle device toolbar → перезагрузить страницу → курсор в режиме touch → градиент статичный.
8. **Reduced motion:** DevTools → Rendering → Emulate CSS `prefers-reduced-motion: reduce` → перезагрузить → подтвердить (мгновенный jump без 0.6s плавности).
9. **Lighthouse mobile:** запустить против preview-URL → Perf не падает ниже 89.
10. **Lighthouse desktop:** Perf не падает ниже 97.

## 8. Acceptance criteria

- [ ] Hero gradient следует за курсором с плавной задержкой на desktop.
- [ ] CaseCard accent следует за курсором внутри карточки, не реагирует на курсор в других карточках.
- [ ] Touch-устройства: gradient статичный, JS не подгружает listeners.
- [ ] `prefers-reduced-motion: reduce`: gradient двигается, но без плавной интерполяции.
- [ ] `npm run build` зелёный.
- [ ] Lighthouse mobile ≥ 89, desktop ≥ 97 на preview-URL.
- [ ] Нет регрессий в UI: CTA-кнопки кликабельны, focus-ring у ссылок виден, scroll работает.

## 9. Открытые вопросы

Нет. Все решения зафиксированы в brainstorm-сессии 2026-05-29.

## 10. Связанные документы

- SPEC.md §13 — визуальная плотность и mood A
- decisions/D-004-visual-mood.md — обоснование dark gradient + grid
- docs/learnings.md — Lighthouse baseline 2026-05-28
