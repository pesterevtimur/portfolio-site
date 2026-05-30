# Custom Cursor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заменить системный курсор на минимальный кастомный из двух элементов (sharp dot + slow ring) с magnetic snap на интерактивных элементах. Touch и JS-disabled — graceful fallback на native.

**Architecture:** Два `<div>` в `<body>` (`#cursor-dot`, `#cursor-ring`), позиционируемые JS-скриптом через rAF + lerp. Точка следует тесно (k=0.85), кольцо мягко (k=0.15). На hover над `a, button, [data-cursor="snap"]` точка магнетически снапает в центр элемента, кольцо вырастает по его рамке. `mix-blend-mode: difference` для видимости на любом фоне. Native cursor скрывается JS'ом (а не CSS) → JS-disabled keeps native.

**Tech Stack:** Astro 5 (TypeScript strict), vanilla CSS, vanilla TS (no framework runtime).

**Spec:** [`docs/superpowers/specs/2026-05-30-custom-cursor-design.md`](../specs/2026-05-30-custom-cursor-design.md)

**Testing note:** Этот проект не имеет фреймворка автотестов. «TDD» в плане переведён в gates: `astro check` + `npm run build` + dist-grep + manual visual + Lighthouse на preview. Каждая фаза проходит эти gates перед коммитом.

**Spec § note:** Spec §3.4 показывает `body { cursor: none }` в CSS, но §5 «JS заблокирован / не загрузился» требует **JS-driven** approach (CSS не должен скрывать native курсор статически — иначе JS-disabled пользователи потеряют курсор). План следует §5 (правильное поведение).

---

## File Structure

| Файл | Тип | Ответственность |
|---|---|---|
| `src/scripts/custom-cursor.ts` | NEW | ~80 строк: matchMedia гейт + rAF lerp loop + mouseenter/leave snap handlers + reduced-motion гейт |
| `src/layouts/Layout.astro` | EDIT | +2 `<div>` в начало `<body>` (`#cursor-dot`, `#cursor-ring`) + 1 `<script>` import |
| `src/styles/globals.css` | EDIT (append) | Стили `#cursor-dot/ring` (с `display: none` по умолчанию) + `body.has-custom-cursor #cursor-dot/ring { display: block }` + `body.has-custom-cursor { cursor: none }` + `body.has-custom-cursor a, body.has-custom-cursor button { cursor: none }` |

---

## Task 1: Cursor markup + CSS plumbing (no JS yet)

Render cursor элементы в DOM, но они невидимы пока JS не активирует. Без JS — native курсор остаётся.

**Files:**
- Modify: `src/layouts/Layout.astro` (add 2 divs at start of `<body>`)
- Modify: `src/styles/globals.css` (append cursor styles)

- [ ] **Step 1: Добавить cursor markup в Layout.astro**

Текущий `<body>` начинается с:
```astro
  <body>
    <a id="top" tabindex="-1" aria-hidden="true"></a>
```

Меняется на:
```astro
  <body>
    <div id="cursor-dot" aria-hidden="true"></div>
    <div id="cursor-ring" aria-hidden="true"></div>
    <a id="top" tabindex="-1" aria-hidden="true"></a>
```

(Скрипт-импорт добавим в Task 2 — не одновременно с markup, чтобы между задачами было чёткое состояние.)

- [ ] **Step 2: Append cursor стили в globals.css**

В конце `src/styles/globals.css` (после `@property` + `[data-magnetic]` блоков, которые уже там после M-002):

```css

/* === Custom cursor === */
/* Скрыт по умолчанию. JS добавляет класс body.has-custom-cursor только */
/* на (hover: hover) and (pointer: fine), что показывает курсор и скрывает native. */
/* JS-disabled fallback: курсор не появится, native останется. */

#cursor-dot,
#cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  display: none;
  will-change: transform;
  mix-blend-mode: difference;
}

#cursor-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffffff;
}

#cursor-ring {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid #ffffff;
  transition: width 0.2s ease-out, height 0.2s ease-out, border-radius 0.2s ease-out;
}

body.has-custom-cursor {
  cursor: none;
}

body.has-custom-cursor a,
body.has-custom-cursor button {
  cursor: none;
}

body.has-custom-cursor #cursor-dot,
body.has-custom-cursor #cursor-ring {
  display: block;
}
```

- [ ] **Step 3: Type-check + build**

```powershell
cd "C:\Users\user\Documents\Claude\Projects\portfolio-site"
npx astro check
npm run build
```

Expected: оба зелёные.

- [ ] **Step 4: Verify dist contains markup but cursor inactive by default**

```powershell
Select-String -Path "C:\Users\user\Documents\Claude\Projects\portfolio-site\dist\index.html" -Pattern 'cursor-dot' -SimpleMatch
Select-String -Path "C:\Users\user\Documents\Claude\Projects\portfolio-site\dist\index.html" -Pattern 'has-custom-cursor' -SimpleMatch
```

Expected:
- `cursor-dot` найдено ≥1 раз (в HTML + в CSS селекторах)
- `has-custom-cursor` найдено ≥3 раз (CSS селекторы для body, a/button, cursor элементов)

- [ ] **Step 5: Commit**

```powershell
git -C "C:\Users\user\Documents\Claude\Projects\portfolio-site" add src/layouts/Layout.astro src/styles/globals.css
git -C "C:\Users\user\Documents\Claude\Projects\portfolio-site" commit -m "feat(cursor): markup + CSS plumbing (hidden до активации JS)"
```

---

## Task 2: Basic cursor follow (rAF + lerp, no magnetic snap yet)

Создать скрипт, инициализирующий курсор с базовым следованием за мышью. Magnetic snap — следующая задача.

**Files:**
- Create: `src/scripts/custom-cursor.ts`
- Modify: `src/layouts/Layout.astro` (add `<script>` import)

- [ ] **Step 1: Create `src/scripts/custom-cursor.ts`**

```typescript
// Custom cursor — sharp dot + slow ring.
// Hides native cursor and renders #cursor-dot / #cursor-ring via rAF + lerp.
// Touch / reduced-motion / JS-disabled — graceful fallback to native.

const HOVER_DEVICE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (HOVER_DEVICE) {
  const DOT_K = REDUCED_MOTION ? 1 : 0.85;
  const RING_K = REDUCED_MOTION ? 1 : 0.15;

  const init = (): void => {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    document.body.classList.add('has-custom-cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener('mousemove', (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const frame = (): void => {
      dotX += (mouseX - dotX) * DOT_K;
      dotY += (mouseY - dotY) * DOT_K;
      ringX += (mouseX - ringX) * RING_K;
      ringY += (mouseY - ringY) * RING_K;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
```

- [ ] **Step 2: Add `<script>` import в `Layout.astro`**

В конце `<body>` (где уже есть magnetic-gradient script):
```astro
    <script>
      import '../scripts/magnetic-gradient';
    </script>
  </body>
```

Меняется на:
```astro
    <script>
      import '../scripts/magnetic-gradient';
      import '../scripts/custom-cursor';
    </script>
  </body>
```

- [ ] **Step 3: Type-check + build**

```powershell
cd "C:\Users\user\Documents\Claude\Projects\portfolio-site"
npx astro check
npm run build
```

Expected: oба зелёные.

- [ ] **Step 4: Verify dist contains script**

```powershell
$html = Get-Content "C:\Users\user\Documents\Claude\Projects\portfolio-site\dist\index.html" -Raw
"has-custom-cursor добавляется: $($html -match 'has-custom-cursor')"
"rAF references: $(([regex]::Matches($html, 'requestAnimationFrame')).Count)"
"DOT_K minified somewhere: $($html -match 'cursor-dot')"
```

Expected: `has-custom-cursor` найден (в CSS + минифицированном JS), `requestAnimationFrame` ≥ 2 (1 от magnetic-gradient через DOM, 1 от cursor), `cursor-dot` ≥ 1.

- [ ] **Step 5: Commit**

```powershell
git -C "C:\Users\user\Documents\Claude\Projects\portfolio-site" add src/scripts/custom-cursor.ts src/layouts/Layout.astro
git -C "C:\Users\user\Documents\Claude\Projects\portfolio-site" commit -m "feat(cursor): basic rAF+lerp follow + matchMedia gates"
```

---

## Task 3: Magnetic snap на интерактивных элементах

Добавить snap-поведение: на hover точка снапает в центр элемента, кольцо вырастает по его рамке.

**Files:**
- Modify: `src/scripts/custom-cursor.ts` (расширить логику)

- [ ] **Step 1: Расширить `custom-cursor.ts`**

Полная новая версия файла:
```typescript
// Custom cursor — sharp dot + slow ring with magnetic snap.
// Hides native cursor and renders #cursor-dot / #cursor-ring via rAF + lerp.
// On hover над a/button/[data-cursor="snap"] — dot snaps to center, ring grows to bounds.
// Touch / reduced-motion / JS-disabled — graceful fallback to native.

const HOVER_DEVICE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (HOVER_DEVICE) {
  const DOT_K = REDUCED_MOTION ? 1 : 0.85;
  const RING_K = REDUCED_MOTION ? 1 : 0.15;
  const RING_PADDING = 12;
  const SNAP_SELECTOR = 'a, button, [data-cursor="snap"]';

  const init = (): void => {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    document.body.classList.add('has-custom-cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let snapTarget: HTMLElement | null = null;

    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (!snapTarget) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }
    });

    const targets = document.querySelectorAll<HTMLElement>(SNAP_SELECTOR);
    targets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        snapTarget = target;
        const rect = target.getBoundingClientRect();
        mouseX = rect.left + rect.width / 2;
        mouseY = rect.top + rect.height / 2;
        ring.style.width = `${rect.width + RING_PADDING}px`;
        ring.style.height = `${rect.height + RING_PADDING}px`;
        ring.style.borderRadius = '8px';
      });
      target.addEventListener('mouseleave', () => {
        snapTarget = null;
        ring.style.width = '';
        ring.style.height = '';
        ring.style.borderRadius = '';
      });
    });

    const frame = (): void => {
      dotX += (mouseX - dotX) * DOT_K;
      dotY += (mouseY - dotY) * DOT_K;
      ringX += (mouseX - ringX) * RING_K;
      ringY += (mouseY - ringY) * RING_K;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
```

Изменения от Task 2:
- Добавлены константы `RING_PADDING` и `SNAP_SELECTOR`.
- Добавлена state-переменная `snapTarget`.
- `mousemove` теперь игнорирует event если `snapTarget != null` (фиксирует на target center).
- Добавлен `querySelectorAll` + `mouseenter/leave` listeners на a/button/[data-cursor="snap"].
- На enter: записываем `snapTarget`, override `mouseX/Y` на center rect'а, растягиваем ring.
- На leave: сбрасываем всё.

- [ ] **Step 2: Type-check + build**

```powershell
cd "C:\Users\user\Documents\Claude\Projects\portfolio-site"
npx astro check
npm run build
```

Expected: oба зелёные.

- [ ] **Step 3: Verify dist contains snap selectors**

```powershell
$html = Get-Content "C:\Users\user\Documents\Claude\Projects\portfolio-site\dist\index.html" -Raw
"snapTarget logic: $($html -match 'snapTarget|data-cursor.*snap')"
"mouseenter listener: $($html -match 'mouseenter')"
```

Expected: `snapTarget`/`data-cursor` найден в минифицированном JS, `mouseenter` есть.

- [ ] **Step 4: Commit**

```powershell
git -C "C:\Users\user\Documents\Claude\Projects\portfolio-site" add src/scripts/custom-cursor.ts
git -C "C:\Users\user\Documents\Claude\Projects\portfolio-site" commit -m "feat(cursor): magnetic snap на a/button (центр + ring growth)"
```

---

## Task 4: Preview deploy + interactive verification + Lighthouse

**Files:** только doc-обновление.

- [ ] **Step 1: Push feature branch**

```powershell
git -C "C:\Users\user\Documents\Claude\Projects\portfolio-site" push
```

(Upstream tracking устанавливается одновременно: branch создан локально перед стартом implementation.)

- [ ] **Step 2: Найти Vercel preview URL**

```powershell
cd "C:\Users\user\Documents\Claude\Projects\portfolio-site"
npx vercel ls 2>&1 | Select-Object -First 20
```

Альтернатива: открыть https://github.com/pesterevtimur/portfolio-site/pull/new/feat/custom-cursor — Vercel автоматически комментирует preview URL.

Если `vercel ls` требует `vercel link` или авторизации — report NEEDS_CONTEXT.

- [ ] **Step 3: Verify preview alive**

```powershell
$previewUrl = "https://<URL-from-step-2>/"
Invoke-WebRequest -Uri $previewUrl -Method Head -UseBasicParsing | Select-Object StatusCode
```

Expected: `200` или `307` (Vercel canonical redirect).

- [ ] **Step 4: Visual check — Тимур** (subagent не может)

Преview URL открывается в Chrome:
- Native курсор скрыт; виден кастомный (dot + ring).
- На тёмном Hero — белый; на CTA "Написать в Telegram" — чёрный (через blend-mode).
- Точка следует тесно; кольцо отстаёт с inertia.
- Hover на «Написать в Telegram» — точка центруется, кольцо растёт по форме кнопки.
- Hover на «Кейсы ↓» — snap аналогично.
- В DevTools → Toggle device toolbar → перезагрузить → курсор скрыт, native touch активен.
- DevTools → Rendering → Emulate `prefers-reduced-motion: reduce` → перезагрузить → курсор следует мгновенно без inertia, snap остаётся.

- [ ] **Step 5: Run Lighthouse mobile**

```powershell
cd "C:\Users\user\Documents\Claude\Projects\portfolio-site"
npx -y lighthouse@latest "<preview-URL>" --chrome-flags="--headless=new" --quiet --output=json --output-path=".\docs\lighthouse-cursor-mobile.json"
```

Извлечь scores:
```powershell
$lh = Get-Content "C:\Users\user\Documents\Claude\Projects\portfolio-site\docs\lighthouse-cursor-mobile.json" -Raw | ConvertFrom-Json
foreach ($k in $lh.categories.PSObject.Properties.Name) { $c = $lh.categories.$k; "{0,-18} {1,3}" -f $c.title, [int]($c.score * 100) }
```

Acceptance: Performance не падает существенно от текущего baseline (после ambient-5 trim ожидается ~82-86).

- [ ] **Step 6: Run Lighthouse desktop**

```powershell
npx -y lighthouse@latest "<preview-URL>" --chrome-flags="--headless=new" --quiet --preset=desktop --output=json --output-path=".\docs\lighthouse-cursor-desktop.json"
```

Тем же скриптом scores. Acceptance: Performance не падает существенно от baseline (~96-98).

- [ ] **Step 7: Append log entry в `docs/learnings.md`**

```markdown
[2026-05-30] feat | M-003 custom cursor: dot+ring + magnetic snap, deployed to preview. Lighthouse mobile <PERF>/<A11Y>/<BP>/<SEO>/<AGENTIC>, desktop <same>. Cursor: точка lerp k=0.85, ring k=0.15, blend-mode difference, magnetic snap на a/button с ring growth.
```

Заполни реальными цифрами.

- [ ] **Step 8: Commit log + push**

```powershell
git -C "C:\Users\user\Documents\Claude\Projects\portfolio-site" add docs/learnings.md
git -C "C:\Users\user\Documents\Claude\Projects\portfolio-site" commit -m "docs: log M-003 custom cursor Lighthouse on preview"
git -C "C:\Users\user\Documents\Claude\Projects\portfolio-site" push
```

- [ ] **Step 9: STOP — approval-gate**

Step 9 = merge в main (= prod deploy на pesterev.tech) требует **явного "merge it"** от Тимура per AGENTS.md §4. Implementer останавливается здесь и report'ит controller'у.

---

## Self-Review

**1. Spec coverage:**
- Spec §3.1 DOM → Task 1 ✓
- Spec §3.2 rAF + lerp → Task 2 ✓
- Spec §3.3 magnetic snap → Task 3 ✓
- Spec §3.4 native cursor hide (через JS, §5 mitigation) → Task 1 (CSS) + Task 2 (JS class toggle) ✓
- Spec §3.5 mix-blend-mode → Task 1 CSS ✓
- Spec §4 поток данных → реализован в Task 2 + Task 3 ✓
- Spec §5 edge cases:
  - Touch: matchMedia гейт → Task 2 Step 1 ✓
  - reduced-motion: lerp k=1 → Task 2 Step 1 ✓
  - Старые браузеры без blend-mode: fallback to white (acceptable) → Task 1 CSS, no special handling needed ✓
  - JS заблокирован: native cursor preserved via JS-driven `cursor: none` → Task 1 CSS + Task 2 ✓
- Spec §6 perf → Task 4 Lighthouse measure ✓
- Spec §7 tests → Task 4 visual + Lighthouse ✓
- Spec §8 acceptance:
  - Custom cursor desktop, hidden touch → Task 4 Step 4 ✓
  - Точка тесно, кольцо inertia → Task 4 Step 4 ✓
  - mix-blend-mode → Task 4 Step 4 ✓
  - Magnetic snap a/button → Task 4 Step 4 ✓
  - reduced-motion → Task 4 Step 4 ✓
  - Build green → Tasks 1-3 Step "Type-check + build" ✓
  - Lighthouse в баseline → Task 4 Steps 5-6 ✓
  - Не сломаны CTA/scroll/focus-ring → Task 4 Step 4 ✓
  - JS-disabled fallback → CSS из Task 1 не ставит native:none без body class ✓

**2. Placeholder scan:**
- `<URL-from-step-2>` — runtime значение из Step 2, не TODO. ✓
- `<PERF>/<A11Y>/.../<AGENTIC>` в log entry — заполняется implementer'ом после реальных замеров. Это не placeholder в плане, а template для лога. ✓
- Никаких "TBD", "TODO", "implement later". ✓
- Все step'ы имеют полный код. ✓

**3. Type consistency:**
- `snapTarget: HTMLElement | null` (Task 3) ✓
- `mouseX, mouseY, dotX, dotY, ringX, ringY: number` (Task 2 + 3) ✓
- `RING_PADDING = 12, SNAP_SELECTOR = string` (Task 3) ✓
- Selectors `#cursor-dot, #cursor-ring` единообразны в HTML/CSS/JS. ✓
- Class `has-custom-cursor` единообразен между CSS (Task 1) и JS (Task 2). ✓
- Все ID атрибуты совпадают: `cursor-dot`, `cursor-ring`. ✓
