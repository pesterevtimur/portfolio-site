# Magnetic Gradient Hover — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hero и CaseCard получают magnetic hover-эффект — радиальный градиент плавно подтягивается к курсору на desktop, статичный на touch и при `prefers-reduced-motion`.

**Architecture:** Один shared TypeScript-скрипт слушает `mousemove`/`mouseleave` на `[data-magnetic]` элементах и пишет позицию курсора в CSS-переменные `--mx`/`--my`. Переменные зарегистрированы через `@property` с native CSS `transition` — браузер интерполирует на composite-thread, нет requestAnimationFrame в коде проекта.

**Tech Stack:** Astro 5 (TypeScript strict), vanilla CSS, vanilla TS (no framework runtime).

**Spec:** [`docs/superpowers/specs/2026-05-29-magnetic-gradient-hover-design.md`](../specs/2026-05-29-magnetic-gradient-hover-design.md)

**Testing note:** Этот проект не имеет фреймворка автотестов (нет Vitest, Playwright). «TDD» в этом плане переведён в gates: `astro check` (типы) → `npm run build` (build green) → `grep` на dist (артефакты на месте) → визуальный check на dev-сервере → Lighthouse на Vercel preview. Каждая фаза проходит эти gates перед коммитом.

---

## File Structure

| Файл | Тип | Ответственность |
|---|---|---|
| `src/scripts/magnetic-gradient.ts` | NEW | Один shared слушатель: querySelectorAll(`[data-magnetic]`) + mousemove/mouseleave + writer CSS-переменных. Top-level гейт matchMedia. |
| `src/styles/globals.css` | EDIT (append) | `@property --mx`, `@property --my` регистрации + `@media (prefers-reduced-motion: reduce)` блок с обнулением transition. |
| `src/layouts/Layout.astro` | EDIT | +1 `<script>` импорт магнетик-скрипта (Astro auto-hoist). |
| `src/components/Hero.astro` | EDIT | `data-magnetic` на `<section>`. `.hero::before` background — radial-gradient с `calc(var(--mx, 100) * 1%) calc(var(--my, 0) * 1%)`. |
| `src/components/CaseCard.astro` | EDIT | `data-magnetic` на `<article>`. `.case-card__accent` — `inset: 0` + radial-gradient с `--mx`/`--my`. |

---

## Task 1: CSS @property registrations + reduced-motion guard

**Files:**
- Modify: `src/styles/globals.css` (append after line 152)

- [ ] **Step 1: Append `@property` registrations и reduced-motion блок в конец `globals.css`**

```css

/* === Magnetic gradient — CSS custom properties для hover-эффекта === */
/* Регистрируем --mx/--my как <number> с initial-value и transition.
   Браузер сам интерполирует на composite-thread.
   Defaults: 100/0 — соответствует at top right (текущая позиция в Hero и CaseCard). */

@property --mx {
  syntax: '<number>';
  inherits: true;
  initial-value: 100;
}

@property --my {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}

[data-magnetic] {
  transition: --mx 0.6s ease-out, --my 0.6s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  [data-magnetic] {
    transition: none;
  }
}
```

- [ ] **Step 2: Type-check + build**

Команды:
```bash
cd "C:\Users\user\Documents\Claude\Projects\portfolio-site"
npx astro check
npm run build
```

Ожидаемо: `astro check` без ошибок, build green («Complete!»).

- [ ] **Step 3: Verify dist содержит @property**

Команда (PowerShell):
```powershell
Select-String -Path "C:\Users\user\Documents\Claude\Projects\portfolio-site\dist\index.html" -Pattern "@property --mx" -SimpleMatch
```

Ожидаемо: найдена 1 строка с `@property --mx`.

- [ ] **Step 4: Commit**

```bash
git add src/styles/globals.css
git commit -m "feat(magnetic): register --mx/--my CSS properties with reduced-motion guard"
```

---

## Task 2: Shared script + Layout import

**Files:**
- Create: `src/scripts/magnetic-gradient.ts`
- Modify: `src/layouts/Layout.astro` (add `<script>` tag перед `</body>`)

- [ ] **Step 1: Create `src/scripts/magnetic-gradient.ts`**

```typescript
// Magnetic gradient hover.
// Hooks into elements with data-magnetic attribute,
// writes cursor position as CSS custom properties --mx/--my (0-100).
// Browser interpolates via @property + transition declared in globals.css.

const COARSE_POINTER = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (!COARSE_POINTER) {
  const init = (): void => {
    const targets = document.querySelectorAll<HTMLElement>('[data-magnetic]');
    targets.forEach((el) => {
      el.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--mx', mx.toFixed(2));
        el.style.setProperty('--my', my.toFixed(2));
      });
      el.addEventListener('mouseleave', () => {
        el.style.removeProperty('--mx');
        el.style.removeProperty('--my');
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
```

- [ ] **Step 2: Add `<script>` import в `Layout.astro`**

Текущий конец body (строки 39-46):
```astro
  <body>
    <a id="top" tabindex="-1" aria-hidden="true"></a>
    <TopNav />
    <main>
      <slot />
    </main>
    <Analytics />
  </body>
```

Меняется на:
```astro
  <body>
    <a id="top" tabindex="-1" aria-hidden="true"></a>
    <TopNav />
    <main>
      <slot />
    </main>
    <Analytics />
    <script>
      import '../scripts/magnetic-gradient';
    </script>
  </body>
```

- [ ] **Step 3: Type-check + build**

```bash
npx astro check
npm run build
```

Ожидаемо: оба зелёные.

- [ ] **Step 4: Verify dist содержит скрипт**

```powershell
Get-ChildItem "C:\Users\user\Documents\Claude\Projects\portfolio-site\dist\_astro\*.js" | ForEach-Object { if ((Get-Content $_ -Raw) -match "data-magnetic") { $_.Name } }
```

Ожидаемо: один .js файл содержит `data-magnetic`.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/magnetic-gradient.ts src/layouts/Layout.astro
git commit -m "feat(magnetic): shared script + Layout import"
```

---

## Task 3: Hero integration

**Files:**
- Modify: `src/components/Hero.astro` — `<section>` tag (line 9) + `.hero::before` (lines 47-53)

- [ ] **Step 1: Добавить `data-magnetic` на `<section>`**

Строка 9 меняется с:
```astro
<section class="hero">
```

На:
```astro
<section class="hero" data-magnetic>
```

- [ ] **Step 2: Переписать `.hero::before` gradient**

Строки 47-53 меняются с:
```css
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top right, var(--bg-grad-hi) 0%, var(--bg-base) 60%);
  z-index: 0;
}
```

На:
```css
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at calc(var(--mx, 100) * 1%) calc(var(--my, 0) * 1%),
    var(--bg-grad-hi) 0%,
    var(--bg-base) 60%
  );
  z-index: 0;
}
```

- [ ] **Step 3: Type-check + build**

```bash
npx astro check
npm run build
```

Ожидаемо: оба зелёные.

- [ ] **Step 4: Visual check на dev-сервере**

```bash
npm run dev
```

Открыть `http://localhost:4321/` в Chrome. Ожидаемо:
- При загрузке: градиент в правом верхнем (визуально как сейчас в проде).
- При движении курсора в Hero: gradient плавно следует за курсором с задержкой ~0.6s.
- При выходе курсора из Hero: gradient возвращается в правый верхний.
- Заголовок и CTA остаются читаемыми и кликабельными.

Остановить dev-сервер (Ctrl+C).

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat(magnetic): apply to Hero — gradient follows cursor"
```

---

## Task 4: CaseCard integration

**Files:**
- Modify: `src/components/CaseCard.astro` — `<article>` (line 23) + `.case-card__accent` (lines 70-79)

- [ ] **Step 1: Добавить `data-magnetic` на `<article>`**

Строка 23 меняется с:
```astro
<article class="case-card" style={`--accent-glow: ${c.glow}; --accent-edge: ${c.edge};`}>
```

На:
```astro
<article class="case-card" data-magnetic style={`--accent-glow: ${c.glow}; --accent-edge: ${c.edge};`}>
```

- [ ] **Step 2: Переписать `.case-card__accent`**

Строки 70-79 меняются с:
```css
.case-card__accent {
  position: absolute;
  top: -80px;
  right: -80px;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
```

На:
```css
.case-card__accent {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle 280px at calc(var(--mx, 100) * 1%) calc(var(--my, 0) * 1%),
    var(--accent-glow) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}
```

Изменения:
- `top/right/width/height` (фиксированный 280×280 в углу) → `inset: 0` (растягивается на всю карточку, чтобы gradient двигался внутри без обрезания).
- `radial-gradient(circle, ...)` → `radial-gradient(circle 280px at <pos>, ...)` — размер круга сохранён (280px), позиция параметризована.
- Defaults (100, 0) визуально соответствуют текущему углу справа сверху.

- [ ] **Step 3: Type-check + build**

```bash
npx astro check
npm run build
```

Ожидаемо: оба зелёные.

- [ ] **Step 4: Visual check на dev-сервере**

```bash
npm run dev
```

В Chrome открыть `http://localhost:4321/#cases`. Ожидаемо:
- При загрузке: accent в правом верхнем углу каждой карточки (как сейчас в проде).
- При наведении на карточку 1: её accent плавно перетекает к курсору. Карточки 2 и 3 не реагируют.
- При выходе курсора: accent возвращается в правый верхний.
- При переходе с карточки 1 на карточку 2: 1-я возвращается в default, 2-я подхватывает курсор.
- CTA-кнопки и ссылки внутри карточек остаются кликабельными.

Остановить dev-сервер.

- [ ] **Step 5: Commit**

```bash
git add src/components/CaseCard.astro
git commit -m "feat(magnetic): apply to CaseCard — accent follows cursor"
```

---

## Task 5: Preview deploy + Lighthouse

**Files:** нет изменений в коде — только push и измерения.

- [ ] **Step 1: Push feature branch**

```bash
git push -u origin feat/magnetic-gradient
```

Ожидаемо: branch создан на GitHub. Vercel auto-detect и стартует preview-деплой.

- [ ] **Step 2: Получить preview-URL**

В Vercel dashboard → проект → Deployments → найти latest deployment для ветки `feat/magnetic-gradient` → скопировать preview-URL (формат `portfolio-site-<hash>-pesterevtimur78-7103s-projects.vercel.app`).

Альтернатива: GitHub commit на ветке должен иметь Vercel-комментарий с URL.

- [ ] **Step 3: Verify preview live**

```bash
curl -s -o /dev/null -w "%{http_code}" https://<preview-url>/
```

Ожидаемо: `200` (или `307` если apex редиректит — это OK).

- [ ] **Step 4: Visual check на preview-URL**

Открыть preview-URL в Chrome:
- Hero gradient следует курсору с плавной задержкой.
- CaseCard accent следует курсору внутри карточки.
- DevTools → Toggle device toolbar → iPhone → перезагрузить → gradient статичный (touch fallback работает).
- DevTools → Rendering → Emulate CSS `prefers-reduced-motion: reduce` → перезагрузить → gradient мгновенно следует за курсором без 0.6s плавности.

- [ ] **Step 5: Run Lighthouse mobile**

```bash
cd "C:\Users\user\Documents\Claude\Projects\portfolio-site"
npx -y lighthouse@latest "https://<preview-url>/" --chrome-flags="--headless=new" --quiet --output=json --output-path=".\docs\lighthouse-magnetic-mobile.json"
```

Извлечь scores:
```powershell
$lh = Get-Content "C:\Users\user\Documents\Claude\Projects\portfolio-site\docs\lighthouse-magnetic-mobile.json" -Raw | ConvertFrom-Json
foreach ($k in $lh.categories.PSObject.Properties.Name) { $c = $lh.categories.$k; "{0,-18} {1,3}" -f $c.title, [int]($c.score * 100) }
```

Acceptance: Performance ≥ 89 (baseline), Accessibility ≥ 100, Best Practices ≥ 100, SEO ≥ 100.

- [ ] **Step 6: Run Lighthouse desktop**

```bash
npx -y lighthouse@latest "https://<preview-url>/" --chrome-flags="--headless=new" --quiet --preset=desktop --output=json --output-path=".\docs\lighthouse-magnetic-desktop.json"
```

Извлечь scores тем же скриптом. Acceptance: Performance ≥ 97, остальные ≥ 100.

- [ ] **Step 7: Записать результаты в learnings**

Добавить в `docs/learnings.md`:
```markdown
[2026-05-29] feat | M-002 magnetic gradient hover: Hero + CaseCard. Lighthouse preview: mobile <X>/<a11y>/<bp>/<seo>, desktop <X>/<a11y>/<bp>/<seo>. Baseline 89/100/100/100 (mobile) и 98/100/100/100 (desktop) <сохранён|изменился>.
```

Заполнить реальными цифрами из Steps 5-6.

- [ ] **Step 8: Commit log entry**

```bash
git add docs/learnings.md
git commit -m "docs: log M-002 magnetic gradient Lighthouse on preview"
git push
```

- [ ] **Step 9: Пауза для approval Тимура перед merge в main**

Merge в `main` = выкат на прод (pesterev.tech). Per AGENTS.md §4 «approval gate» — нужно явное «можно» от Тимура. Не мержить без него.

После approval — merge на main одним из:
- GitHub PR (если хочется code-review history) — `gh pr create --title "..." --body "..."`, потом merge через UI.
- Прямой merge — `git checkout main && git merge feat/magnetic-gradient && git push`.

Vercel автоматически передеплоит prod после push в main.

---

## Self-Review

**1. Spec coverage:**
- Spec §3 (Архитектура) → Tasks 1+2 (CSS plumbing + shared script) ✓
- Spec §3.2 (файлы) → File Structure + 5 tasks покрывают все 5 файлов ✓
- Spec §4 (поток данных) → Task 2 implements mousemove → setProperty; CSS interpolation native ✓
- Spec §5 (edge cases): touch — Task 2 Step 1 имеет matchMedia гейт ✓; reduced-motion — Task 1 имеет @media block ✓; старые браузеры — defaults `var(--mx, 100)` в Tasks 3+4 ✓; cross-talk между cards — независимые listeners в Task 2 ✓; JS-блокировка — defaults в CSS обеспечивают fallback ✓.
- Spec §6 (производительность) → Task 5 Steps 5-6 (Lighthouse acceptance) ✓
- Spec §7 (тестирование) → Tasks 3-5 включают визуальные проверки + Lighthouse ✓
- Spec §8 (acceptance criteria) → Все пункты покрыты в Task 5 acceptance ✓

**2. Placeholder scan:** найден `<preview-url>` в Task 5 Steps 3-6 — это runtime-значение, известное только после Step 2. Это не TODO, а параметр. OK.

**3. Type consistency:** CSS-переменные `--mx`/`--my` используются единообразно во всех Tasks 1, 3, 4. Defaults `100, 0` единообразно во всех use-sites. Атрибут `data-magnetic` единообразен. JS-скрипт читает `mx`/`my` по тем же именам. ✓
