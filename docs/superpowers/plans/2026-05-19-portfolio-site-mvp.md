# Portfolio Site MVP — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Запустить MVP портфолио-сайта Тимура Пестерева на основе SPEC.md v1.1 — статический Astro-сайт на Vercel с 9 секциями в proof-first порядке, mood A визуалом, тремя кейсами с реальной фактурой, прошедший adversarial review и Lighthouse ≥ 95.

**Architecture:** Astro 5 + MDX контент-коллекции, единственная страница `/` с длинным скроллом, без backend / без форм / без CMS. Стиль из SPEC §6 (тёмная палитра `#0a0a0f`, радиальный градиент Hero, тонкая 32px сетка, Inter через `astro:fonts`, Tabler outline иконки). Деплой через Vercel Git integration после явного approve Тимура.

**Tech Stack:** Astro 5 · MDX · Tailwind CSS (для утилитарных классов; кастомные дизайн-токены в `globals.css`) · `@astrojs/sitemap` · `@astrojs/check` · Plausible или Vercel Analytics · Vitest для компонентных тестов · Vercel CLI для деплоя.

**Зависимости от SPEC.md:**
- §2 Позиционирование B (с битами A, C) → определяет Hero и тон
- §5 Структура (9 секций, proof-first) → порядок задач в Phase 5
- §6 Визуал (mood A) → дизайн-токены в Phase 5
- §7 Стек (Astro) → ADR D-002 и инструменты в Phase 5
- §14 4 project laws → каждая задача проходит Buyer-Impact Gate и Real-fact rule
- §15 Acceptance criteria → финальный чеклист Phase 7

---

## Index фаз

| Phase | Что | Задач | Длительность |
|---|---|---|---|
| **1. Research** | Анализ конкурентов, домен, SEO, аналитика, карта компетенций, позиционирование | 6 | ~3 дня |
| **2. ADRs** | Фиксируем 4 ключевых решения как ADR | 4 | ~0.5 дня |
| **3. Content drafts** | 11 драфтов под секции + visual spec | 11 | ~4-5 дней |
| **4. Adversarial review** | Codex CLI review значимых артефактов из SPEC §13 | 1 | ~1 день |
| **5. Astro build** | Скаффолд, секции, компоненты, SEO, мобильная вёрстка | 17 | ~5-6 дней |
| **6. Build + deploy** | Lighthouse, GitHub, Vercel, production deploy | 5 | ~1-2 дня |
| **7. Milestone closure** | M-001 заполнен, learnings обновлены | 2 | ~0.5 дня |
| **Итого** | | **46** | **~2-3 недели** |

---

## Conventions для всех задач

- **Коммиты** — после каждой задачи (не после каждого шага). Префиксы: `research:`, `decision:`, `draft:`, `feat:`, `test:`, `docs:`, `chore:`, `milestone:`. Без `wip`, `update`, `fix typo`.
- **CWD** для всех bash-команд: `/c/Users/user/Documents/Claude/Projects/portfolio-site` (если другое — указано явно).
- **Codex review** — формат запроса в SPEC §13. После каждого review — запись в `docs/learnings.md`.
- **Тесты в Phase 5** — Vitest для компонентов + grep по `dist/` для smoke-проверок. Без Playwright и e2e — overkill для статики.
- **Project laws** (SPEC §14) применяются всегда:
  1. SPEC.md > всё. Расхождение — ADR.
  2. Adversarial review значимого артефакта обязателен.
  3. Real fact > marketing claim. Не выдумываем метрики.
  4. Buyer-Impact Gate: каждая секция работает минимум на один из 3 профилей.

---

# Phase 1 — Research foundations

Цель: собрать данные для информированных решений в драфтах. Все артефакты — `docs/research/*.md`. Никакого кода. Каждый research-документ имеет acceptance-чеклист в первых строках («что должно быть в этом файле, чтобы считать его готовым»).

---

### Task 1: Анализ конкурентов (5-7 портфолио-сайтов)

**Files:**
- Create: `docs/research/competitors.md`

**Acceptance:**
- 5+ сайтов проанализированы (РФ AI-консультанты, fractional CTO, persona-сайты founders).
- Для каждого сайта: URL, краткое описание, что работает (3 пункта), что отталкивает (2-3 пункта), визуальные паттерны (цвет/шрифт/плотность), длина текстов.
- Раздел «Выводы для нашего сайта» внизу: что заимствовать, чего избегать, чего не делает никто (наш зазор).

- [ ] **Step 1: Зафиксировать структуру файла**

Создать `docs/research/competitors.md` со скелетом:

```markdown
# Анализ конкурентов

> Цель: понять, как себя подают близкие специалисты (AI-консультанты, fractional CTO с AI-уклоном, persona-сайты технических founders). Что работает, чего избегать, где наш зазор. Финальные выводы используются в `decisions/D-001-positioning.md` и `drafts/visual.md`.

## Список проанализированных сайтов

| # | Сайт | Категория | Дата проверки |
|---|---|---|---|

## Подробный анализ

### 1. <URL>

**Категория:** AI-консультант / fractional CTO / persona-founder / другое
**Дата проверки:** 2026-05-…

**Что работает (3 пункта):**
- …

**Что отталкивает (2-3 пункта):**
- …

**Визуальные паттерны:**
- Палитра: …
- Шрифт: …
- Плотность контента: …

**Длина текстов:**
- Hero: N слов
- Кейсы: ~N слов каждый
- О себе: N строк

---

### 2. <URL>

…

---

## Выводы для нашего сайта

### Что заимствовать
- …

### Чего избегать
- …

### Наш зазор (чего не делает никто из проанализированных)
- …
```

- [ ] **Step 2: Список кандидатов для анализа**

Поискать и зафиксировать 7-10 кандидатов через WebSearch + ручной обзор. Ориентир-категории:
- РФ AI-консультанты (vc.ru, Habr-авторы) — 2-3 сайта
- Международные fractional CTO / AI architect — 2-3 сайта (rauchg.com, swyx.io, simonwillison.net аналоги)
- Persona-сайты технических founders — 2-3 сайта (paul.copplestone.com, ben.page, leerob.io)

Записать в раздел «Список проанализированных сайтов» с категорией.

- [ ] **Step 3: Анализ каждого сайта**

Для каждого: открыть сайт через WebFetch, заполнить все поля шаблона из Step 1. Минимум 5 сайтов с полным анализом. Если сайт не открылся / 404 — заменить на следующего кандидата.

- [ ] **Step 4: Синтез выводов**

Написать раздел «Выводы для нашего сайта»:
- 3-5 паттернов для заимствования (с указанием источника)
- 3-5 паттернов для избегания
- 2-3 формулировки нашего зазора

- [ ] **Step 5: Acceptance check**

```bash
wc -l docs/research/competitors.md
grep -c "^### " docs/research/competitors.md
grep -c "Что работает" docs/research/competitors.md
```
Expected: ≥ 100 строк, ≥ 5 entries (`### N. URL`), ≥ 5 «Что работает» секций.

- [ ] **Step 6: Commit**

```bash
git add docs/research/competitors.md
git commit -m "research: анализ 5+ конкурентов, выводы для позиционирования и визуала"
```

---

### Task 2: Domain shortlist + availability check

**Files:**
- Create: `docs/research/domain.md`

**Acceptance:**
- 5+ кандидатов с обоснованием.
- Каждый проверен на доступность через whois или registrar (Namecheap/Gandi/REG.RU).
- Топ-3 рекомендация с reasoning.

- [ ] **Step 1: Скелет файла**

```markdown
# Domain research

> Цель: выбрать 1 домен под `decisions/D-003-domain.md`. Бюджет ≤ $100/год. Зона `.ai` / `.dev` / `.tech` / `.ru` / `.work` допустимы.

## Критерии оценки

1. Длина ≤ 12 символов
2. Легко произносится по-русски в разговоре
3. Без двусмысленностей
4. Семантика близка к позиционированию B (spec-driven AI architect)

## Кандидаты

| Домен | Длина | Произношение | Доступен? | Цена/год | Оценка |
|---|---|---|---|---|---|

## Подробности

### `pesterev.ai`
- **Семантика:** имя + AI. Прямо персональный.
- **Доступность:** … (проверено `whois pesterev.ai` или https://www.namecheap.com/domains/registration/results/?domain=pesterev.ai)
- **Цена:** $… /год у …
- **Минусы:** .ai дороже стандартных зон ($60-90/год).

### …

## Рекомендация

Топ-3:
1. **<домен>** — потому что …
2. **<домен>** — …
3. **<домен>** — …

Дополнительная проверка перед покупкой: …
```

- [ ] **Step 2: Список кандидатов**

Минимум 5 кандидатов. Стартовый список из SPEC §12:
- `pesterev.ai`
- `pesterev.tech`
- `pesterev.work`
- `timurai.dev`
- `agentic.work`

Можно добавить: `pesterev.dev`, `pesterev.team`, `agenticops.ru`, и т.п. Цель — 5-7 шорт-листированных кандидатов.

- [ ] **Step 3: Проверить доступность**

Для каждого через WebFetch на whois-сервис или registrar:

```bash
# Пример проверки через Namecheap API (через WebFetch)
# URL: https://www.namecheap.com/domains/registration/results/?domain=pesterev.ai
```

Записать статус (доступен / занят) и цену.

- [ ] **Step 4: Заполнить таблицу + подробности**

Каждый кандидат — отдельный подраздел.

- [ ] **Step 5: Сформулировать топ-3 рекомендацию**

С обоснованием по 4 критериям (длина, произношение, отсутствие двусмысленности, семантика).

- [ ] **Step 6: Acceptance check**

```bash
grep -c "^### " docs/research/domain.md
grep -c "Доступен" docs/research/domain.md
```
Expected: ≥ 5 кандидатов с подробностями, статус доступности заполнен для всех.

- [ ] **Step 7: Commit**

```bash
git add docs/research/domain.md
git commit -m "research: domain shortlist с проверкой доступности и топ-3 рекомендацией"
```

---

### Task 3: SEO keyword research

**Files:**
- Create: `docs/research/seo.md`

**Acceptance:**
- 10+ целевых запросов на русском, сгруппированных по интенту.
- Для каждого — оценка частотности (через wordstat.yandex.ru) и конкуренции.
- 3-5 приоритетных запросов, под которые SEO-оптимизируем.
- План привлечения трафика (где размещать ссылку).

- [ ] **Step 1: Скелет файла**

```markdown
# SEO research

> Цель: определить 3-5 запросов, под которые оптимизируем meta-теги и H-заголовки сайта. Плюс — план размещения ссылки на сайт.

## Группы целевых запросов

### Транзакционные (готов нанять)
- «AI-консультант B2B»
- «AI-аудит для стартапа»
- …

### Информационные (изучает рынок)
- «как внедрить AI в B2B компанию»
- «spec-driven AI разработка»
- …

### Брендовые (ищет конкретного человека)
- «Тимур Пестерев AI»
- «Pesterev consulting»
- …

## Анализ частотности и конкуренции

| Запрос | Группа | Частота /мес (Wordstat) | Конкуренция | Приоритет |
|---|---|---|---|---|

## Приоритетные запросы (3-5)

…

## План размещения ссылки

### Где будем размещать
- Telegram-сообщения (outbound): да
- Telegram-канал: нет (см. SPEC §11 — канала пока нет)
- Habr / vc.ru: …
- LinkedIn: …
- В подписи холодных писем: да

### Где НЕ будем
- Spam-каталоги, reddit-flood, и т.п.
```

- [ ] **Step 2: Собрать 10+ запросов**

Через WebSearch + Wordstat. Сгруппировать по интенту.

- [ ] **Step 3: Оценить частотность через wordstat.yandex.ru**

WebFetch `https://wordstat.yandex.ru/?words=<запрос>`. Записать число показов в месяц.

- [ ] **Step 4: Выбрать 3-5 приоритетных**

Критерии: высокая транзакционность + средняя конкуренция + соответствие позиционированию B.

- [ ] **Step 5: Написать план размещения**

Где есть ссылки от Тимура — какие каналы, какие нет (см. SPEC §11).

- [ ] **Step 6: Acceptance check**

```bash
grep -c "^- «" docs/research/seo.md
grep -c "^| " docs/research/seo.md
```
Expected: ≥ 10 запросов, ≥ 5 строк в таблице приоритезации.

- [ ] **Step 7: Commit**

```bash
git add docs/research/seo.md
git commit -m "research: 10+ SEO-запросов, 3-5 приоритетных, план размещения ссылки"
```

---

### Task 4: Analytics decision (Plausible vs Vercel Analytics)

**Files:**
- Create: `docs/research/analytics.md`

**Acceptance:**
- Сравнение Plausible и Vercel Analytics по 5+ критериям.
- Рекомендация с обоснованием.
- Если выбран Plausible — план настройки. Если Vercel Analytics — план настройки.

- [ ] **Step 1: Скелет файла**

```markdown
# Analytics — Plausible vs Vercel Analytics

> Цель: выбрать одну систему аналитики. Без Google Analytics (медленный, не нужен).

## Критерии

1. Скорость загрузки скрипта (KB и ms)
2. Стоимость
3. GDPR-совместимость
4. Доступность в РФ
5. Качество данных для KPI из SPEC §4 (входящие, конверсия CTA)
6. Простота настройки в Astro

## Сравнение

| Критерий | Plausible | Vercel Analytics |
|---|---|---|
| Скорость скрипта | < 1KB, < 10ms | … |
| Стоимость | $9/мес от 10k pageviews | Free tier до 2.5k events/мес |
| GDPR | Нативно без cookie banner | … |
| Доступность в РФ | … | … |
| Качество для нашего KPI | … | … |
| Настройка в Astro | `<script defer …>` в Layout | `@vercel/analytics/astro` |

## Рекомендация

…

## План настройки (выбранной системы)

1. …
```

- [ ] **Step 2: Заполнить сравнение через WebFetch**

Проверить актуальные цены / характеристики на plausible.io и vercel.com/analytics.

- [ ] **Step 3: Сформулировать рекомендацию**

Если оба подходят — приоритет Vercel Analytics (нативно с хостингом, free tier перекрывает наш ожидаемый трафик в первые месяцы).

- [ ] **Step 4: Описать план настройки**

Конкретные шаги для выбранной системы — что положить в Layout, какой код, какие env-переменные.

- [ ] **Step 5: Acceptance check**

```bash
grep -c "^| " docs/research/analytics.md
grep "## Рекомендация" docs/research/analytics.md
```
Expected: сравнительная таблица ≥ 6 строк, секция «Рекомендация» присутствует.

- [ ] **Step 6: Commit**

```bash
git add docs/research/analytics.md
git commit -m "research: Plausible vs Vercel Analytics сравнение, рекомендация и план настройки"
```

---

### Task 5: Competency map visualization research

**Files:**
- Create: `docs/research/competency-map.md`

**Acceptance:**
- 2-3 визуальных подхода к карте компетенций (горизонтальные бары / radar / matrix / nested list).
- Mockup ASCII или ссылка на скриншот для каждого.
- Рекомендация с обоснованием для mood A.

- [ ] **Step 1: Скелет файла**

```markdown
# Competency map — визуальная подача

> Источник содержимого: SPEC §10. Здесь решаем — КАК подать.

## Содержимое (из SPEC §10)

Четыре зоны:
- Подхожу (сильный уровень)
- Подхожу (средний уровень)
- Активно развиваю
- Не моя зона

## Варианты визуализации

### Вариант 1 — Горизонтальные бары (4 цветовые зоны)
ASCII mockup:
```
Архитектура AI-нативных процессов        ██████████░░  сильный
Чёткие ТЗ для AI-агентов                  ██████████░░  сильный
Координация нескольких AI-моделей         ██████████░░  сильный
…
Работа с LLM-API                          ██████░░░░░░  средний
…
Eval-фреймворки                           ███░░░░░░░░░  расту
…
Обучение моделей с нуля                   ░░░░░░░░░░░░  не моя
```

**Pros:** легко читается на десктопе и мобильном. Универсальный паттерн.
**Cons:** «бар» может прочитаться как «оценка себя» — нужны чёткие подписи зон.

### Вариант 2 — Матрица 2×2 (уверенность × частота)

…

### Вариант 3 — Радар / spider chart

…

## Рекомендация

Для mood A (dark + grid + mono) лучше всего работает: …

## Технические детали реализации

- Если бары — нативный HTML/CSS, без библиотек. Цвет зон из палитры SPEC §6.
- Если матрица — то же.
- Если радар — Chart.js или D3, +25KB JS. Стоит ли? — нет, **не используем**.
```

- [ ] **Step 2: Описать 2-3 варианта с ASCII**

Минимум 2 варианта, желательно 3. Для каждого — ASCII-mockup, pros, cons.

- [ ] **Step 3: Рекомендация**

С обоснованием почему конкретный вариант подходит mood A и не нарушает SPEC §6 (никаких сложных анимаций, минимум JS).

- [ ] **Step 4: Acceptance check**

```bash
grep -c "^### Вариант" docs/research/competency-map.md
grep "## Рекомендация" docs/research/competency-map.md
```
Expected: ≥ 2 варианта, секция «Рекомендация» присутствует.

- [ ] **Step 5: Commit**

```bash
git add docs/research/competency-map.md
git commit -m "research: 2-3 варианта визуализации карты компетенций, рекомендация под mood A"
```

---

### Task 6: Positioning research (3 варианта + сравнение)

**Files:**
- Create: `docs/research/positioning.md`

**Acceptance:**
- 3 варианта позиционирования (A, B, C из brainstorm-сессии) полностью прописаны.
- Сравнительная таблица: кого привлекает / отсекает / что подсвечивает / что прячет / trade-off.
- Зафиксирована рекомендация (B с битами A, C) с обоснованием.

> Этот файл важен даже после фикса позиционирования в `D-001` — сохраняет альтернативы для будущего ADR-аудита (SPEC §15).

- [ ] **Step 1: Создать файл с содержимым из brainstorm-сессии**

Зафиксировать 3 варианта (A, B, C) из brainstorm 2026-05-19. Включить:
- Hero-формулировку
- Подзаголовок
- Кого привлекает (по 3 профилям)
- Кого отсекает
- Что подсвечивает
- Что прячет
- Trade-off

- [ ] **Step 2: Сравнительная таблица**

Строки — варианты A/B/C. Колонки — критерии. Кратко.

- [ ] **Step 3: Раздел «Выбранный вариант + биты»**

B с битами:
- Из A — мост в «Кому подхожу»
- Из C — outstaff-matcher метрика + vibe→agentic-coding в принципах

- [ ] **Step 4: Acceptance check**

```bash
grep -c "^## Вариант" docs/research/positioning.md
grep "Trade-off" docs/research/positioning.md
```
Expected: ≥ 3 «## Вариант» секции, минимум 3 упоминания trade-off.

- [ ] **Step 5: Commit**

```bash
git add docs/research/positioning.md
git commit -m "research: 3 варианта позиционирования (A/B/C), таблица сравнения, обоснование выбора B"
```

---

# Phase 2 — ADRs

Цель: зафиксировать 4 ключевых решения как ADR с supersedes-трекингом. Каждый ADR — отдельный коммит с префиксом `decision:`.

**Шаблон ADR** (используется для D-001..D-004):

```markdown
# D-NNN — <Краткое название решения>

**Статус:** accepted | superseded by D-NNN
**Дата:** YYYY-MM-DD
**Затрагивает SPEC.md:** §N, §M

## Контекст

Какая ситуация существует. Какие силы в игре.

## Рассмотренные варианты

1. **Вариант A** — …
2. **Вариант B** — …
3. **Вариант C** — …

## Решение

Выбрали вариант **N**.

## Обоснование

Почему именно так. 3-5 аргументов.

## Последствия

- Положительные: …
- Отрицательные: …
- Нейтральные: …

## Связанные документы

- `docs/research/<file>.md` — исходный research
- `SPEC.md §N` — где это отражено
```

---

### Task 7: ADR D-001 — Positioning

**Files:**
- Create: `decisions/D-001-positioning.md`

**Acceptance:** ADR заполнен по шаблону, ссылается на `docs/research/positioning.md` и SPEC §2.

- [ ] **Step 1: Скопировать шаблон, заполнить контекст**

Контекст: бриф давал черновое позиционирование («AI-архитектор для B2B-команд»). В brainstorm 2026-05-19 разработаны 3 варианта (A, B, C). Нужно зафиксировать выбор.

- [ ] **Step 2: Описать 3 варианта**

Кратко (1-2 строки каждый, ссылка на полный текст в `docs/research/positioning.md`).

- [ ] **Step 3: Решение и обоснование**

Решение: B (spec-driven AI) с битами A (мост в «Кому подхожу») и C (outstaff-matcher метрика + vibe→agentic-coding в принципах).

Обоснование (минимум 4 аргумента):
1. У Тимура есть доказательства spec-driven подхода (leadecho-leadgen, outstaff-matcher, super-agentic-ops).
2. Совпадает с описанием сильных сторон в SPEC §10.
3. Профиль 3 (founding AI engineer) тоже на это покупается.
4. Защищает от ловушки «ещё один AI-евангелист».

- [ ] **Step 4: Последствия**

- Положительные: дифференциация, чёткий буйер-фит для Профиля 2, защита от клише.
- Отрицательные: уже воронка чем A, Профиль 1 может теряться на термине «spec-driven» (компенсируется в секции «Кому подхожу»).
- Нейтральные: фиксация позиционирования на ~6 месяцев; следующий ADR — если KPI §4 не выполнены за 3 месяца.

- [ ] **Step 5: Acceptance check**

```bash
test -f decisions/D-001-positioning.md && grep "^## Решение" decisions/D-001-positioning.md
```

- [ ] **Step 6: Commit**

```bash
git add decisions/D-001-positioning.md
git commit -m "decision: D-001 positioning — B (spec-driven AI) с битами A и C"
```

---

### Task 8: ADR D-002 — Tech stack

**Files:**
- Create: `decisions/D-002-tech-stack.md`

**Acceptance:** Заполнен по шаблону. Решение — Astro. Обоснование против Next.js. Ссылка на SPEC §7.

- [ ] **Step 1: Заполнить контекст**

Бриф предлагал Next.js или Astro. SPEC §7 фиксирует Astro.

- [ ] **Step 2: 2 варианта (Next.js, Astro)**

Pros/cons по таблице SPEC §7.

- [ ] **Step 3: Решение и обоснование**

Astro, потому что: zero-JS by default, меньше API surface, native Vercel adapter, performance budget из SPEC §7 покрывается из коробки.

- [ ] **Step 4: Последствия**

- Положительные: меньший бандл, проще будущие правки AI-агентами, Lighthouse 95+ легче достичь.
- Отрицательные: если в v2 понадобится тяжёлый интерактив или SSR с auth — миграция. Пока не нужно (SPEC §16).
- Нейтральные: ровно одна страница `/`, минимум контента — Astro идеально подходит.

- [ ] **Step 5: Commit**

```bash
git add decisions/D-002-tech-stack.md
git commit -m "decision: D-002 tech-stack — Astro (не Next.js), обоснование через performance + simplicity"
```

---

### Task 9: ADR D-003 — Domain

**Files:**
- Create: `decisions/D-003-domain.md`

**Acceptance:** Заполнен после Task 2 (research/domain.md). Решение — конкретный домен из топ-3.

- [ ] **Step 1: Заполнить контекст**

Бюджет ≤ $100/год. 5 кандидатов проверены в `docs/research/domain.md`. Нужно выбрать один.

- [ ] **Step 2: Перечислить топ-3 из research**

Скопировать топ-3 кандидатов с обоснованием из `docs/research/domain.md`.

- [ ] **Step 3: Решение**

Выбрать один. Если все доступны — взять самый короткий / самый запоминаемый.

**Важно:** покупка домена — это approval gate в SPEC.md §6 AGENTS.md «Approval gates». Этот ADR ФИКСИРУЕТ выбор; покупка — отдельное действие Тимура.

- [ ] **Step 4: Обоснование (3-5 аргументов)**

Длина, произношение, семантика, цена, отсутствие двусмысленностей.

- [ ] **Step 5: Последствия**

- Положительные: …
- Отрицательные: цена $… /год на … лет вперёд.
- Нейтральные: возможность позже добавить subdomain (например, `notes.<домен>`) — это часть v2.

- [ ] **Step 6: Commit**

```bash
git add decisions/D-003-domain.md
git commit -m "decision: D-003 domain — <выбранный_домен>, обоснование через критерии из research"
```

---

### Task 10: ADR D-004 — Visual mood

**Files:**
- Create: `decisions/D-004-visual-mood.md`

**Acceptance:** Зафиксирован mood A (dark gradient + grid + mono). Палитра, шрифты, иконки.

- [ ] **Step 1: Контекст**

В brainstorm 2026-05-19 показаны 4 mood-варианта (A, B, C, D). Тимур выбрал A.

- [ ] **Step 2: 4 варианта (кратко)**

A — dark gradient + grid + mono
B — light editorial + serif
C — hard minimalism + oversize sans
D — artifact-driven + screenshots

- [ ] **Step 3: Решение**

Mood A. Финальные дизайн-токены из SPEC §6:
- Основной фон `#0a0a0f`, градиент к `#1a1a2e`
- Сетка 32px ~4% white в Hero
- Inter через `astro:fonts`
- Моно-метки `ui-monospace, 'SF Mono', Menlo`
- Текст `#fafafa` / `#9090a8` / `#8a8aa0`
- Tabler outline 16-18px

- [ ] **Step 4: Обоснование**

- Самый «продуктовый» вид из 4 → совпадает с позиционированием B (мы строим системы, не пишем эссе).
- Тёмная палитра даёт правильный контраст для портрета Тимура (тёплая, светлая фотография).
- Тонкая сетка + моно метки = технологический сигнал без неоновых клише.
- Vercel.com / Linear.app — эстетический референс совпадает с целевой аудиторией.

- [ ] **Step 5: Последствия**

- Положительные: чёткая палитра → меньше микро-решений в build phase.
- Отрицательные: тёмные сайты режут аудиторию (часть людей предпочитает светлые). Принимаем риск.
- Нейтральные: возможен toggle light/dark в v2 (не в MVP).

- [ ] **Step 6: Commit**

```bash
git add decisions/D-004-visual-mood.md
git commit -m "decision: D-004 visual-mood — mood A (dark gradient + grid + mono), палитра и шрифты зафиксированы"
```

---

# Phase 3 — Content drafts

Цель: написать 11 драфтов под все секции SPEC §5 + visual spec. Каждый драфт — markdown, готовый к переносу в Astro `src/content/`. Acceptance каждого драфта — встроенный machine-verifiable чеклист в начале файла.

**Структурный шаблон драфта:**

```markdown
# <Section> — draft

> Source: SPEC.md §<N>
> Status: draft | review-requested | approved | shipped
> Acceptance:
> - [ ] N строк / N слов
> - [ ] Содержит фразу X
> - [ ] Не содержит англицизмов из словаря замен SPEC §8
> - [ ] Прошёл adversarial review (если значимый артефакт)

<контент>

---

## Acceptance log

- 2026-05-…: draft v1 written
- 2026-05-…: Codex review run, see `docs/learnings.md`
- 2026-05-…: approved by Тимур
```

---

### Task 11: drafts/visual.md — Design spec

**Files:**
- Create: `drafts/visual.md`

**Acceptance:** Полная спецификация дизайн-токенов (цвет, шрифт, отступы, размеры заголовков, иконки). Готов к переводу в `globals.css` (Phase 5).

- [ ] **Step 1: Скелет с дизайн-токенами**

```markdown
# Visual design spec

> Source: SPEC.md §6, D-004 visual mood
> Status: draft

## Палитра

```css
--bg-base: #0a0a0f;
--bg-elevated: #14141c;
--bg-grad-hi: #1a1a2e;     /* верхний правый угол радиального градиента */
--grid-line: rgba(255, 255, 255, 0.04);
--text-primary: #fafafa;
--text-secondary: #9090a8;
--text-mono-label: #8a8aa0;
--border-subtle: #2a2a3a;
--cta-bg: #fafafa;
--cta-text: #0a0a0f;
```

## Типографика

| Уровень | Шрифт | Размер | Вес | Letter-spacing | Line-height |
|---|---|---|---|---|---|
| H1 (Hero) | Inter | 56px desktop / 36px mobile | 700 | -0.025em | 1.05 |
| H2 (секции) | Inter | 32px / 24px | 600 | -0.02em | 1.15 |
| H3 (под-секции) | Inter | 20px / 18px | 600 | -0.01em | 1.25 |
| Body | Inter | 16px / 15px | 400 | 0 | 1.55 |
| Mono label | ui-monospace | 12px | 500 | 0.15em uppercase | 1.4 |
| Mono code | ui-monospace | 14px | 400 | 0 | 1.5 |

## Отступы (на десктопе)

- Между секциями: 96px
- Внутри секции: 48px между блоками
- Внутри блока: 16px
- Padding страницы: 24px по бокам, max-width: 1080px

## Hero специфичное

- Радиальный градиент: `radial-gradient(ellipse at top right, var(--bg-grad-hi) 0%, var(--bg-base) 60%)`
- Сетка: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px); background-size: 32px 32px;`

## Иконки

- Tabler outline, 16-18px
- Цвет — `var(--text-secondary)` или `var(--text-primary)` для активного состояния

## Состояния CTA

- Primary CTA (Telegram): bg `var(--cta-bg)`, text `var(--cta-text)`, без border, padding 12px 20px, border-radius 6px
- Secondary CTA: text `var(--text-primary)`, border 1px `var(--border-subtle)`, padding 12px 20px, border-radius 6px
- Hover: brightness 0.95 + transform translateY(-1px)
```

- [ ] **Step 2: Дополнить деталями вёрстки секций**

Какие отступы между секциями. Где сетка (только Hero) и где плоский фон. Цвета карточек кейсов.

- [ ] **Step 3: Acceptance check**

```bash
grep -c "^--" drafts/visual.md
grep "Inter" drafts/visual.md
```
Expected: ≥ 10 CSS-переменных, упоминание Inter.

- [ ] **Step 4: Commit**

```bash
git add drafts/visual.md
git commit -m "draft: visual.md — дизайн-токены и спека для globals.css"
```

---

### Task 12: drafts/hero.md

**Files:**
- Create: `drafts/hero.md`

**Acceptance:** Headline ≤ 3 строки, sub ≤ 1 предложение. CTA: Telegram + Кейсы↓. Без англицизмов.

- [ ] **Step 1: Создать файл с финальным текстом**

```markdown
# Hero — draft

> Source: SPEC.md §2
> Status: draft
> Acceptance:
> - [ ] Headline ≤ 3 строки
> - [ ] Подзаголовок ≤ 1 предложение
> - [ ] 2 CTA: primary Telegram, secondary Кейсы↓
> - [ ] Без англицизмов из SPEC §8 (исключение: «AI»)
> - [ ] Adversarial review пройден

---

## Mono label
→ AI Architecture · B2B

## Headline
Запускаю AI-процессы,
которые не разваливаются
на втором месяце.

## Подзаголовок
Жёсткие ТЗ перед стартом. Один AI пишет — другой проверяет. Видимая работа агентов вместо чёрного ящика.

## CTA
- Primary: «Написать в Telegram» → ссылка `https://t.me/timursky`
- Secondary: «Кейсы ↓» → якорь `#cases`

---

## Acceptance log

- 2026-05-…: draft v1 written
- 2026-05-…: Codex review pending
```

- [ ] **Step 2: Acceptance check**

```bash
# Headline ≤ 3 строки
awk '/^## Headline/{flag=1; next} /^##/{flag=0} flag' drafts/hero.md | grep -v "^$" | wc -l
# Подзаголовок ≤ 1 предложение (= 1 точка)
awk '/^## Подзаголовок/{flag=1; next} /^##/{flag=0} flag' drafts/hero.md | grep -v "^$" | grep -o "\." | wc -l

# Запрещённые англицизмы (не должно быть)
grep -iE "agentic|multi-agent|spec-driven|adversarial|observability|eval framework|structured output|LLM|RAG|fine-tuning|trade-off|context window|MCP server" drafts/hero.md && echo "FAIL" || echo "PASS"
```
Expected: headline ≤ 3 строки, sub ≤ 1 точка (один предложение, две точки также допустимы если разбито), «PASS» для англицизмов.

> Примечание: Hero-фраза в SPEC §2 содержит "AI". «AI» — исключение из словаря замен SPEC §8 (это латинская аббревиатура, заменять на «искусственный интеллект» снизит читаемость). Принимаем.

- [ ] **Step 3: Commit**

```bash
git add drafts/hero.md
git commit -m "draft: hero.md — финальный текст headline + sub + CTA"
```

---

### Task 13: drafts/case-leadecho-leadgen.md

**Files:**
- Create: `drafts/case-leadecho-leadgen.md`

**Acceptance:** ≤ 250 слов. Содержит: контекст, что построил, результат с конкретной фактурой, ссылка (если есть). Без выдуманных метрик.

- [ ] **Step 1: Прочитать исходник**

```bash
cat /c/Users/user/Documents/Claude/Projects/leadecho-leadgen/SPEC.md | head -80
cat /c/Users/user/Documents/Claude/Projects/leadecho-leadgen/CLAUDE.md
ls /c/Users/user/Documents/Claude/Projects/leadecho-leadgen/playbooks/
```

Записать в `docs/learnings.md`: какие реальные артефакты подтверждают что выполнено.

- [ ] **Step 2: Скелет драфта**

```markdown
# Case: leadecho-leadgen — draft

> Source: SPEC.md §9, исходник проекта `C:\Users\user\Documents\Claude\Projects\leadecho-leadgen`
> Status: draft
> Acceptance:
> - [ ] ≤ 250 слов
> - [ ] Контекст · Что построил · Результат — все 3 блока есть
> - [ ] Все факты подтверждены в исходном репозитории
> - [ ] Без выдуманных метрик
> - [ ] Adversarial review пройден

---

## Заголовок
leadecho-leadgen · Multi-agent cold outreach для B2B SaaS

## Контекст (~50 слов)
LeadEcho — B2B SaaS-стартап, делающий речевую аналитику звонков для отделов продаж (сегменты: автодилеры, недвижимость). Задача — построить процесс холодных продаж, где AI-агенты делают черновую работу под жёсткими правилами и проверками, а не «как-нибудь».

## Что построил (~100 слов)
Spec-driven мульти-агентный воркспейс. Три агента с разделёнными ролями: Claude Desktop как архитектор/бизнес-аналитик, Claude Code как исполнитель/QA, Codex CLI как adversarial reviewer с другим bias. Главный файл SPEC.md — источник правды; любое отклонение требует ADR. Каждый milestone имеет `business_value:` в frontmatter — без бизнес-смысла отклоняется. Adversarial questions: проверяющий бросает вызов гипотезам ДО того, как исполнитель начинает черновик — это пре-мортем подход.

## Результат (~80 слов)
На 5-й день — готовое холодное письмо для сегмента 172 ICP-компаний, прошедшее adversarial review через Codex CLI. Воспроизводимый процесс: новый сегмент или новый продукт разворачивается по тем же правилам без переписывания методологии. Я выступаю как owner, а не ручной исполнитель.

## Ссылка
Локальный репозиторий: `C:\Users\user\Documents\Claude\Projects\leadecho-leadgen`. GitHub-публикация после согласования с командой LeadEcho.

---

## Acceptance log
- 2026-05-…: draft v1 written
```

- [ ] **Step 3: Acceptance check**

```bash
# Word count ≤ 250
wc -w drafts/case-leadecho-leadgen.md
# Все 3 блока
grep -c "^## " drafts/case-leadecho-leadgen.md
```
Expected: ≤ 350 слов (включая метаданные и frontmatter), ≥ 4 секции (Заголовок, Контекст, Что построил, Результат).

> Если перевалили 250 слов в контенте — резать.

- [ ] **Step 4: Commit**

```bash
git add drafts/case-leadecho-leadgen.md
git commit -m "draft: case-leadecho-leadgen.md — spec-driven multi-agent кейс"
```

---

### Task 14: drafts/case-outstaff-matcher.md

**Files:**
- Create: `drafts/case-outstaff-matcher.md`

**Acceptance:** ≤ 250 слов. Содержит метрику **4 часа → 15 минут** (подтверждённую в исходном репо). Контекст · что построил · результат.

- [ ] **Step 1: Подтвердить метрику в исходнике**

```bash
cd /c/Users/user/Documents/Claude/Projects/outstaff-matcher
grep -ri "4 час\|4 hour\|15 минут\|15 minute\|4ч\|15м" --include="*.md"
cat README.md
cat master-plan.md | head -50
```

Если метрика «4ч → 15м» подтверждена в repo — используем. Если нет — записать в `docs/learnings.md` `blocker | outstaff-matcher: метрика не подтверждена в исходнике, нужно уточнить у Тимура`.

- [ ] **Step 2: Скелет драфта**

```markdown
# Case: outstaff-matcher — draft

> Source: SPEC.md §9, исходник `C:\Users\user\Documents\Claude\Projects\outstaff-matcher`
> Status: draft
> Acceptance:
> - [ ] ≤ 250 слов
> - [ ] Метрика «4 часа → 15 минут» подтверждена в исходнике
> - [ ] Контекст · Что построил · Результат
> - [ ] Adversarial review пройден

---

## Заголовок
outstaff-matcher · От vibe-coding к agentic-coding на реальной задаче

## Контекст (~60 слов)
Менеджер в IT-аутстаффе тратил 4 часа в день на ручной мэтчинг: ловил входящие запросы клиентов из 30 Telegram-каналов и сводил их с базой кандидатов на бенче. Шум, ошибки, выгорание.

## Что построил (~110 слов)
Первая версия — vibe-coding: один большой AI-агент делал 6-7 задач за один промпт. При первом серьёзном изменении (упал Telegram-сервер в РФ, нужно было переключиться на локальную выгрузку) — система рассыпалась. Контекстное окно агента было забито, новые запросы то добавлялись, то нет.

Переделал по правилу «один агент = одна задача». Два специализированных Cowork-агента вместо универсального. Между ними — Python-скрипты с описанными API-контрактами и контрактами обмена данных. Версионирование, тесты, чёткие планы перед каждым этапом.

## Результат (~60 слов)
Время на мэтчинг: с 4 часов до 15 минут. Прогнозируемое качество, понятные ошибки когда что-то идёт не так. Систему можно расширять без переписывания. Главный урок: переход от «AI делает много задач за раз» к «задачи декомпозированы и проверены».

## Ссылка
Локальный: `C:\Users\user\Documents\Claude\Projects\outstaff-matcher`. GitHub — приватный (содержит данные кандидатов).

---

## Acceptance log
- 2026-05-…: draft v1 written, метрика 4ч→15м подтверждена / не подтверждена в исходнике
```

- [ ] **Step 3: Acceptance check**

```bash
wc -w drafts/case-outstaff-matcher.md
grep "4 час\|15 минут" drafts/case-outstaff-matcher.md
```

- [ ] **Step 4: Commit**

```bash
git add drafts/case-outstaff-matcher.md
git commit -m "draft: case-outstaff-matcher.md — vibe→agentic-coding с метрикой 4ч→15м"
```

---

### Task 15: drafts/case-super-agentic-ops.md

**Files:**
- Create: `drafts/case-super-agentic-ops.md`

**Acceptance:** ≤ 250 слов. Содержит 4-слойную архитектуру (упрощённо), 4 закона, 7 skills за 7 дней, pressure-tested skill. Без англицизмов кроме принятых.

- [ ] **Step 1: Скелет**

```markdown
# Case: super-agentic-ops (agentic-ops) — draft

> Source: SPEC.md §9, исходник `C:\Users\user\Downloads\super-agentic-ops-main`
> Status: draft
> Acceptance:
> - [ ] ≤ 250 слов
> - [ ] Упоминает 4 слоя архитектуры
> - [ ] Упоминает 4 закона проекта
> - [ ] Упоминает pressure-tested skill discipline
> - [ ] Adversarial review пройден

---

## Заголовок
agentic-ops · Персональный agent-harness с компаундирующей памятью

## Контекст (~50 слов)
Большинство людей работают с AI так: открыл чат, объяснил контекст, получил ответ, закрыл. На следующий день — то же заново. Знания нигде не накапливаются, навыки нигде не сохраняются. Хотел построить систему, где знания и навыки переживают сессии.

## Что построил (~120 слов)
Систему из четырёх слоёв: исходники (PDF, статьи, спеки) → AI-собранные wiki-страницы со ссылками на источники → контракты `CLAUDE.md` (правила работы агента) → переиспользуемые навыки.

Чёткие правила-блокировки: навык не пишется руками (только через `skill-creator`), wiki-страница не пишется руками (только через `wiki-ingest`), факт без citation не существует, таблица не пересказывается — хранится как данные.

Семь навыков построены за семь дней (с 12 по 19 мая). Один из них — `evidence-before-action` — прошёл через 7 pressure-сценариев перед публикацией: «отметить как факт без проверки», «закончить тесты не запустив», и другие. Только после этого он помечен как готовый.

## Результат (~50 слов)
Один реальный wiki (context-engineering) с первым источником — эссе Карпатого «LLM Wiki». Воспроизводимая методология: новый проект разворачивается по тем же четырём слоям. Это не «один разовый AI-эксперимент», а способ работы.

---

## Acceptance log
- 2026-05-…: draft v1 written
```

- [ ] **Step 2: Acceptance check**

```bash
wc -w drafts/case-super-agentic-ops.md
grep -c "слой\|закон\|pressure" drafts/case-super-agentic-ops.md
```

- [ ] **Step 3: Commit**

```bash
git add drafts/case-super-agentic-ops.md
git commit -m "draft: case-super-agentic-ops.md — 4 слоя, 4 закона, pressure-tested skills"
```

---

### Task 16: drafts/principles.md

**Files:**
- Create: `drafts/principles.md`

**Acceptance:** 5 принципов, по одной строке на принцип. Один из них использует формулировку «vibe-coding → agentic-coding» (бит из варианта C).

- [ ] **Step 1: Создать с 5 принципами**

```markdown
# Principles — draft

> Source: SPEC.md §5 секция «Как я работаю»
> Status: draft
> Acceptance:
> - [ ] Ровно 5 принципов
> - [ ] Один принцип = одна строка ~12-20 слов
> - [ ] Принцип №5 использует формулировку «vibe-coding → agentic-coding» (бит C)

---

## Заголовок
Как я работаю

## Подзаголовок
Пять правил, по которым строю процессы с AI-агентами.

## Принципы

1. **ТЗ перед кодом.** Сначала пишу что нужно построить и как проверить готовность — потом разрешаю AI писать код.

2. **Один AI пишет — другой проверяет.** Author и reviewer — это разные сессии с разным bias. Иначе ошибки маскируются.

3. **Артефакты в файлы, не в чат.** Контракты, правила, лог решений живут в git, чтобы будущая сессия начинала с известного состояния, а не с нуля.

4. **Бизнес-ценность перед сложностью.** У каждой задачи в плане есть строка «зачем». Если строка пустая — задача откладывается.

5. **От vibe-coding к agentic-coding.** Не один большой AI на всё подряд — несколько специализированных с понятными контрактами между ними.

---

## Acceptance log
- 2026-05-…: draft v1 written
```

- [ ] **Step 2: Acceptance check**

```bash
grep -c "^[0-9]\. \*\*" drafts/principles.md
grep "vibe-coding\|agentic-coding" drafts/principles.md
```
Expected: ровно 5 принципов, упоминание vibe→agentic.

- [ ] **Step 3: Commit**

```bash
git add drafts/principles.md
git commit -m "draft: principles.md — 5 правил с битом vibe→agentic из варианта C"
```

---

### Task 17: drafts/competency-map.md

**Files:**
- Create: `drafts/competency-map.md`

**Acceptance:** Использует визуальный подход из `docs/research/competency-map.md`. 4 зоны заполнены содержанием SPEC §10.

- [ ] **Step 1: Скопировать выбранный визуальный подход из research**

Импортировать структуру из `docs/research/competency-map.md` (горизонтальные бары — наиболее вероятно).

- [ ] **Step 2: Заполнить 4 зоны по SPEC §10**

```markdown
# Competency map — draft

> Source: SPEC.md §10, выбор визуала: `docs/research/competency-map.md`
> Status: draft
> Acceptance:
> - [ ] 4 зоны заполнены: сильный / средний / расту / не моя
> - [ ] Каждый пункт — фраза 3-7 слов
> - [ ] Под диаграммой — 3 строки пояснения

---

## Заголовок
Карта компетенций

## Подзаголовок
Где я подхожу, где средний, где активно развиваю, и где нужен другой специалист.

## Структура диаграммы

### Зона: подхожу (сильный уровень)
- Архитектура AI-нативных процессов с нуля
- Чёткие ТЗ для AI-агентов
- Координация нескольких AI с разной точкой зрения
- Решения с явными компромиссами, без перфекционизма
- Связка B2B-продаж и AI-инструментов
- Переделка системы, когда понимаю что не так построил

### Зона: подхожу (средний уровень)
- Работа с LLM-API: Claude, GPT, function calling, tool use
- Поиск по документам через эмбеддинги, базовая работа с векторными базами

### Зона: активно развиваю (закрою к концу лета)
- Проверка качества ответов AI: метрики, регрессионные тесты
- Видимость работы AI в реальном времени: логи, латентность, стоимость
- Гарантированный формат ответа AI: валидация, повторы при ошибке

### Зона: не моя зона
- Обучение и дообучение моделей с нуля
- Глубокий research в AI
- Классическая ML-разработка (recsys, computer vision)

## Подпись (3 строки под диаграммой)

> **Где подхожу:** строю системы и процессы — от ТЗ до запуска.
> **Где расту:** инструменты контроля качества и видимости AI-работы.
> **Где нужен другой:** обучение моделей, классический ML, deep AI research.

---

## Acceptance log
- 2026-05-…: draft v1 written
```

- [ ] **Step 3: Acceptance check**

```bash
grep -c "^### Зона:" drafts/competency-map.md
```
Expected: ровно 4.

- [ ] **Step 4: Commit**

```bash
git add drafts/competency-map.md
git commit -m "draft: competency-map.md — 4 зоны и подпись под диаграммой"
```

---

### Task 18: drafts/stack.md

**Files:**
- Create: `drafts/stack.md`

**Acceptance:** Сгруппированный список. Без рейтингов «5/5» и «эксперт». Только используемые инструменты.

- [ ] **Step 1: Создать**

```markdown
# Stack — draft

> Source: SPEC.md §5 секция «Стек»
> Status: draft
> Acceptance:
> - [ ] Сгруппировано по типу инструмента
> - [ ] Без рейтингов и звёзд
> - [ ] Без «всех технологий мира» — только то, что используется

---

## Заголовок
Инструменты, которыми работаю

## Группы

### AI-модели и API
- Claude (Anthropic) — основная рабочая модель
- GPT (OpenAI) — для adversarial review и сравнения
- Codex CLI — отдельный пайплайн review с другим bias

### Среды разработки агентов
- Claude Code (CLI + VS Code)
- Claude Desktop (для архитектурных решений)
- Skills + MCP servers как контракты

### Код и данные
- Python — для детерминистских пайплайнов и интеграций
- SQLite / Postgres — где нужна персистентность
- Markdown в git — для wiki и спецификаций

### Инфраструктура
- GitHub — версионирование артефактов
- Vercel — статический хостинг
- Telegram Bot API — для сборщиков и нотификаций

### Сейчас изучаю / собираю
- Pressure-testing skills через `skill-creator`
- LLM Wiki паттерн (Карпатый)

---

## Acceptance log
- 2026-05-…: draft v1 written
```

- [ ] **Step 2: Acceptance check**

```bash
grep -c "^### " drafts/stack.md
grep -iE "5/5|эксперт|star|⭐" drafts/stack.md && echo "FAIL" || echo "PASS"
```

- [ ] **Step 3: Commit**

```bash
git add drafts/stack.md
git commit -m "draft: stack.md — группированный список инструментов"
```

---

### Task 19: drafts/about.md

**Files:**
- Create: `drafts/about.md`

**Acceptance:** 5-7 строк. Без англицизмов из словаря замен. Мост для Профиля 1 (нетехнический founder).

- [ ] **Step 1: Создать**

```markdown
# About — draft

> Source: SPEC.md §5 секция «О тебе»
> Status: draft
> Acceptance:
> - [ ] 5-7 строк (не больше)
> - [ ] Без англицизмов из словаря замен SPEC §8
> - [ ] Работает на Профиль 1 (нетехнический founder)
> - [ ] Adversarial review пройден

---

## Заголовок
Тимур Пестерев

## Текст

Пять лет в IT — основатель и совладелец двух компаний в аутстаффе и рекрутменте. До прошлого года писал процессы для людей: продажи, найм, операционка. Последний год — pivot в AI-first: вместо того, чтобы расширять команды, строю системы, где AI выполняет работу под чёткими правилами и проверками. Базируюсь в Казани, работаю удалённо с командами в РФ и за рубежом.

---

## Acceptance log
- 2026-05-…: draft v1 written
```

- [ ] **Step 2: Acceptance check**

```bash
awk '/^## Текст/{flag=1; next} /^---/{flag=0} flag' drafts/about.md | grep -v "^$" | wc -l
grep -iE "agentic|multi-agent|spec-driven|adversarial|observability|LLM|RAG|trade-off" drafts/about.md && echo "FAIL" || echo "PASS"
```
Expected: 5-7 строк, PASS на словарь замен.

- [ ] **Step 3: Commit**

```bash
git add drafts/about.md
git commit -m "draft: about.md — 5-7 строк с мостом для нетехнического founder"
```

---

### Task 20: drafts/fit.md

**Files:**
- Create: `drafts/fit.md`

**Acceptance:** 3 профиля × 2-3 строки на каждый. Прямые формулировки «если — пиши / если — нет». Отсекает неправильную аудиторию.

- [ ] **Step 1: Создать**

```markdown
# Fit — draft

> Source: SPEC.md §5 секция «Кому подхожу», SPEC §3 (3 профиля)
> Status: draft
> Acceptance:
> - [ ] 3 профиля × 2-3 строки
> - [ ] Прямые формулировки «если — пиши / если — нет»
> - [ ] Adversarial review пройден

---

## Заголовок
Кому подхожу

## Профили

### Если ты founder или CTO B2B-стартапа (5-50 человек)
Хочешь добавить AI в продукт или внутренние процессы, но не знаешь с чего начать. Или начал и получил кашу. Бюджет $1-10k на проект. Пиши — разберёмся вместе.

### Если ты технический руководитель в средней компании
Команда инженеров есть, AI-кусок уже что-то делает, но «генерит ересь». Нужен внешний взгляд, аудит, конкретный план. Бюджет $2-15k. Пиши.

### Если ты сооснователь раннего AI-стартапа
Ищешь founding AI engineer или AI Lead. Готов на акции + базовую зарплату. Хочешь видеть, что человек строит системы, а не пишет демо. Пиши — обсудим fit.

## Кому НЕ подойду

- Если нужен ML-инженер или Data Scientist (это другая роль).
- Если нужно «по-быстрому прикрутить ChatGPT» — это делается без меня.
- Если хочется full-time в большой компании с корпоративной иерархией.

---

## Acceptance log
- 2026-05-…: draft v1 written
```

- [ ] **Step 2: Acceptance check**

```bash
grep -c "^### Если ты" drafts/fit.md
grep "Пиши" drafts/fit.md
grep "Кому НЕ" drafts/fit.md
```
Expected: ровно 3 «### Если ты», секция «Кому НЕ подойду» есть.

- [ ] **Step 3: Commit**

```bash
git add drafts/fit.md
git commit -m "draft: fit.md — 3 профиля fit + явный no-fit список"
```

---

### Task 21: drafts/growth.md

**Files:**
- Create: `drafts/growth.md`

**Acceptance:** 2-3 направления роста с дедлайнами. Самокритика — это работает на доверие.

- [ ] **Step 1: Создать**

```markdown
# Growth — draft

> Source: SPEC.md §5 секция «Куда расту», SPEC §10 зона «активно развиваю»
> Status: draft
> Acceptance:
> - [ ] 2-3 направления роста
> - [ ] Каждое — с дедлайном (хотя бы примерным)
> - [ ] Самокритика, не «я уже всё знаю»

---

## Заголовок
Куда я расту

## Подзаголовок
Эти три вещи я активно подтягиваю до конца лета — потому что без них процессы с AI остаются «работает у меня, не работает у клиента».

## Направления

### 1. Системная проверка качества AI-ответов
Метрики, регрессионные тесты, бенчмарки. Сейчас собираю первую полноценную eval-сетку для одного из проектов. Дедлайн: июль 2026.

### 2. Видимость работы AI в реальном времени
Логирование, трейсы, латентность, стоимость. Сейчас работаю на уровне «вижу что-то когда сломалось» — нужно «вижу что-то ДО того как сломалось». Дедлайн: август 2026.

### 3. Гарантированный формат ответа AI
Валидация структуры, повторы при ошибке. Прикладной слой — есть, но «жёсткая отказоустойчивость» — недотянута. Дедлайн: август 2026.

---

## Acceptance log
- 2026-05-…: draft v1 written
```

- [ ] **Step 2: Acceptance check**

```bash
grep -c "^### [0-9]" drafts/growth.md
grep "Дедлайн" drafts/growth.md
```
Expected: 2-3 направления, дедлайны проставлены.

- [ ] **Step 3: Commit**

```bash
git add drafts/growth.md
git commit -m "draft: growth.md — 3 направления с дедлайнами до конца лета"
```

---

### Task 22: drafts/contacts.md + publication-plan

**Files:**
- Create: `drafts/contacts.md`
- Create: `docs/research/publication-plan.md`

**Acceptance:** Contacts — реальный TG, email, одна строка про ожидание. Publication plan — что в MVP / что в v2.

- [ ] **Step 1: drafts/contacts.md**

```markdown
# Contacts — draft

> Source: SPEC.md §11
> Status: draft
> Acceptance:
> - [ ] Telegram @timursky указан
> - [ ] Email указан
> - [ ] Одна строка про ожидание ответа
> - [ ] Нет форм захвата

---

## Заголовок
Связаться

## Каналы

**Telegram (приоритет):** [@timursky](https://t.me/timursky)
**Email:** [pesterevtimur78@gmail.com](mailto:pesterevtimur78@gmail.com)

## Ожидание ответа

В будний день отвечаю в течение 6 часов (часовой пояс UTC+3). По выходным — медленнее.

---

## Acceptance log
- 2026-05-…: draft v1 written
```

- [ ] **Step 2: docs/research/publication-plan.md**

```markdown
# Publication plan — MVP vs v2

> Цель: зафиксировать что входит в первую публичную версию сайта, что откладывается.

## MVP (сейчас)

- 9 секций в proof-first порядке (SPEC §5)
- 3 кейса с реальной фактурой (SPEC §9)
- mood A (SPEC §6) — dark gradient + grid + mono
- Только русский
- Аналитика — Plausible или Vercel Analytics (по `docs/research/analytics.md`)
- SEO meta + OG + sitemap + robots
- Lighthouse ≥ 95 на staging
- Manual deploy после approve Тимура

## V2 (после MVP)

### Возможные дополнения (приоритеты — по запросу аудитории)
- Английская версия сайта
- Light theme toggle
- Подробные case-страницы (раскрытие в modal или /cases/<slug>)
- Блог-секция (если будет 3+ написанных постов)
- Notes / changelog feed
- Подключение Calendly или аналога (только если будет много входящих и неудобно отвечать в TG руками)

### Что НЕ делаем в v2 точно
- CMS / админка
- Лидген-форма с capture
- Партнёрские программы / банеры
- Чат-бот / pop-up
```

- [ ] **Step 3: Acceptance check**

```bash
test -f drafts/contacts.md && test -f docs/research/publication-plan.md
grep "@timursky" drafts/contacts.md
grep "## MVP" docs/research/publication-plan.md
```

- [ ] **Step 4: Commit (две задачи объединены — это OK)**

```bash
git add drafts/contacts.md docs/research/publication-plan.md
git commit -m "draft+research: contacts.md (TG @timursky + email) и publication-plan (MVP vs v2)"
```

---

# Phase 4 — Adversarial review

Цель: прогнать значимые драфты через Codex CLI (как описано в SPEC §13). Только 1 задача в плане, но она содержит несколько Codex-вызовов и фиксацию замечаний в `docs/learnings.md`.

---

### Task 23: Codex CLI review значимых артефактов

**Files:**
- Modify: `drafts/hero.md`, `drafts/case-leadecho-leadgen.md`, `drafts/case-outstaff-matcher.md`, `drafts/case-super-agentic-ops.md`, `drafts/principles.md`, `drafts/competency-map.md`, `drafts/fit.md`
- Append: `docs/learnings.md`

**Acceptance:** Каждый из 7 значимых артефактов прошёл review. Замечания зафиксированы, правки внесены или явно отклонены с обоснованием.

**Запросный шаблон к Codex** (из SPEC §13):

> «Codex, прочитай `<file>` против `SPEC.md`. Найди: маркетинговые клише, формулировки которые отсекают целевые профили (см. SPEC §3), неподтверждённые метрики, гендерные предположения, английские термины из словаря замен SPEC §8. Дай список замечаний.»

- [ ] **Step 1: Тимур запускает Codex CLI на drafts/hero.md**

Запрос — из шаблона выше. Ожидаемое: список из 3-8 замечаний.

- [ ] **Step 2: Записать замечания в docs/learnings.md**

```bash
echo "[$(date +%Y-%m-%d)] note | Codex review drafts/hero.md: <саммари замечаний>" >> docs/learnings.md
```

- [ ] **Step 3: Внести правки в hero.md**

Если замечание принимается — править. Если отклоняется — записать в learnings с обоснованием.

- [ ] **Step 4: Повторить Steps 1-3 для остальных 6 значимых файлов:**

- `drafts/case-leadecho-leadgen.md`
- `drafts/case-outstaff-matcher.md`
- `drafts/case-super-agentic-ops.md`
- `drafts/principles.md`
- `drafts/competency-map.md`
- `drafts/fit.md`

- [ ] **Step 5: Acceptance check**

```bash
grep -c "Codex review" docs/learnings.md
```
Expected: ≥ 7 строк «Codex review» (по одной на каждый значимый артефакт).

- [ ] **Step 6: Commit изменений**

```bash
git add drafts/ docs/learnings.md
git commit -m "draft: adversarial review pass — 7 значимых артефактов через Codex CLI"
```

---

# Phase 5 — Astro build

Цель: реальная реализация сайта. От скаффолда до всех 9 секций. Все Astro-компоненты — TypeScript-ready, без runtime JS где можно обойтись CSS.

**Test strategy:**
- Vitest для unit-тестов компонентов (рендер строки, наличие нужных атрибутов).
- После каждой секции — `npm run build` exit 0 + grep по `dist/index.html` на наличие ключевых строк.
- Mobile-вёрстка — после всех секций (Task 39) через виртуальный viewport в Lighthouse.

---

### Task 24: Astro scaffold + базовый Layout + globals.css

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.npmrc`
- Create: `src/layouts/Layout.astro`, `src/styles/globals.css`
- Create: `vitest.config.ts`, `src/test-setup.ts`

**Acceptance:**
- `npm install` отработал без ошибок.
- `npm run dev` поднимает сервер на localhost:4321 и отдаёт пустой Layout.
- `npm run build` собирает `dist/index.html`.
- CSS-переменные из `drafts/visual.md` доступны глобально.

- [ ] **Step 1: Инициализировать Astro проект**

```bash
cd /c/Users/user/Documents/Claude/Projects/portfolio-site
npm create astro@latest -- --template minimal --typescript strict --no-install --skip-houston --yes .
```

Затем установить:

```bash
npm install
npm install -D vitest @astrojs/check typescript
npm install @astrojs/mdx @astrojs/sitemap
```

> Если `npm create astro` спросит про перезапись существующих файлов (README, .gitignore) — отказаться (`No`).

- [ ] **Step 2: astro.config.mjs**

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://<домен_из_D-003>',  // заполнить после D-003
  integrations: [mdx(), sitemap()],
  build: {
    inlineStylesheets: 'always',
  },
});
```

- [ ] **Step 3: tsconfig.json (strict mode)**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: src/styles/globals.css**

Перенести дизайн-токены из `drafts/visual.md`:

```css
:root {
  --bg-base: #0a0a0f;
  --bg-elevated: #14141c;
  --bg-grad-hi: #1a1a2e;
  --grid-line: rgba(255, 255, 255, 0.04);
  --text-primary: #fafafa;
  --text-secondary: #9090a8;
  --text-mono-label: #8a8aa0;
  --border-subtle: #2a2a3a;
  --cta-bg: #fafafa;
  --cta-text: #0a0a0f;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html { color-scheme: dark; }

body {
  background: var(--bg-base);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

main {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px;
}

.mono { font-family: ui-monospace, 'SF Mono', Menlo, monospace; }
.label { font-size: 12px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-mono-label); }

@media (max-width: 720px) {
  main { padding: 0 16px; }
}
```

- [ ] **Step 5: src/layouts/Layout.astro**

```astro
---
import '../styles/globals.css';
interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
---

<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/og-default.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <title>{title}</title>
  </head>
  <body>
    <main>
      <slot />
    </main>
  </body>
</html>
```

- [ ] **Step 6: Минимальный src/pages/index.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Тимур Пестерев" description="AI-архитектор для B2B-команд">
  <h1 style="margin-top: 96px;">Site is being built</h1>
</Layout>
```

- [ ] **Step 7: Verify build**

```bash
npm run build
grep "Site is being built" dist/index.html && echo "PASS" || echo "FAIL"
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: Astro scaffold + Layout + globals.css с дизайн-токенами"
```

---

### Task 25: Hero компонент

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`
- Test: `src/components/Hero.test.ts`

**Acceptance:**
- Рендерит headline, sub, mono-label из `drafts/hero.md`.
- Тёмный фон с радиальным градиентом + сеткой 32px.
- 2 CTA: primary Telegram (`https://t.me/timursky`) + secondary якорь `#cases`.
- В dist/index.html присутствуют все ключевые строки.
- Vitest snapshot тест проходит.

- [ ] **Step 1: Написать failing-тест**

```typescript
// src/components/Hero.test.ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Hero from './Hero.astro';

test('Hero renders headline, sub, CTA links', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Hero);

  expect(html).toContain('Запускаю AI-процессы');
  expect(html).toContain('не разваливаются');
  expect(html).toContain('Жёсткие ТЗ');
  expect(html).toContain('https://t.me/timursky');
  expect(html).toContain('#cases');
  expect(html).toContain('AI Architecture · B2B');
});
```

Run: `npx vitest run src/components/Hero.test.ts`
Expected: FAIL (no Hero.astro yet).

- [ ] **Step 2: Создать Hero.astro**

```astro
---
// src/components/Hero.astro
---

<section class="hero">
  <p class="label hero__label">→ AI Architecture · B2B</p>
  <h1 class="hero__headline">
    Запускаю AI-процессы,<br />
    которые не разваливаются<br />
    на втором месяце.
  </h1>
  <p class="hero__sub">
    Жёсткие ТЗ перед стартом. Один AI пишет — другой проверяет.
    Видимая работа агентов вместо чёрного ящика.
  </p>
  <div class="hero__cta">
    <a class="cta cta--primary" href="https://t.me/timursky">Написать в Telegram</a>
    <a class="cta cta--secondary" href="#cases">Кейсы ↓</a>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100vh;
    padding: 96px 0 64px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at top right, var(--bg-grad-hi) 0%, var(--bg-base) 60%);
    z-index: -2;
  }
  .hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(var(--grid-line) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
    background-size: 32px 32px;
    z-index: -1;
    pointer-events: none;
  }
  .hero__label { margin-bottom: 32px; }
  .hero__headline {
    font-size: 56px;
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.025em;
    margin-bottom: 24px;
    color: var(--text-primary);
  }
  .hero__sub {
    font-size: 18px;
    color: var(--text-secondary);
    max-width: 580px;
    margin-bottom: 32px;
  }
  .hero__cta { display: flex; gap: 12px; flex-wrap: wrap; }
  .cta {
    display: inline-block;
    padding: 12px 20px;
    border-radius: 6px;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.15s ease;
  }
  .cta--primary {
    background: var(--cta-bg);
    color: var(--cta-text);
  }
  .cta--primary:hover { transform: translateY(-1px); filter: brightness(0.95); }
  .cta--secondary {
    color: var(--text-primary);
    border: 1px solid var(--border-subtle);
  }
  .cta--secondary:hover { background: var(--border-subtle); }
  @media (max-width: 720px) {
    .hero__headline { font-size: 36px; }
    .hero__sub { font-size: 16px; }
  }
</style>
```

- [ ] **Step 3: Подключить в index.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
---

<Layout title="Тимур Пестерев — AI-архитектор для B2B" description="Запускаю AI-процессы, которые не разваливаются на втором месяце.">
  <Hero />
</Layout>
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/components/Hero.test.ts
```
Expected: PASS.

- [ ] **Step 5: Build smoke test**

```bash
npm run build
grep "Запускаю AI-процессы" dist/index.html && echo "PASS" || echo "FAIL"
grep "t.me/timursky" dist/index.html && echo "PASS" || echo "FAIL"
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro src/components/Hero.test.ts src/pages/index.astro
git commit -m "feat: Hero component с радиальным градиентом, сеткой 32px, 2 CTA"
```

---

### Task 26: CaseCard component (shared)

**Files:**
- Create: `src/components/CaseCard.astro`
- Test: `src/components/CaseCard.test.ts`

**Acceptance:** Принимает props (title, subtitle, body, metric, link). Рендерит карточку с тёмным фоном `--bg-elevated`, тонкой границей `--border-subtle`. Hover-эффект.

- [ ] **Step 1: Failing test**

```typescript
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import CaseCard from './CaseCard.astro';

test('CaseCard renders all props', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(CaseCard, {
    props: {
      title: 'leadecho-leadgen',
      subtitle: 'Multi-agent cold outreach для B2B SaaS',
      body: '<p>Контекст: …</p>',
      metric: '172 ICP',
      metricLabel: 'cold email на 5-й день',
    },
  });
  expect(html).toContain('leadecho-leadgen');
  expect(html).toContain('Multi-agent cold outreach');
  expect(html).toContain('172 ICP');
});
```

Run: FAIL.

- [ ] **Step 2: Создать CaseCard.astro**

```astro
---
interface Props {
  title: string;
  subtitle: string;
  body: string;  // HTML (из MDX)
  metric?: string;
  metricLabel?: string;
  link?: { url: string; text: string };
}
const { title, subtitle, body, metric, metricLabel, link } = Astro.props;
---

<article class="case-card">
  <header class="case-card__head">
    <h3 class="case-card__title">{title}</h3>
    <p class="case-card__sub">{subtitle}</p>
  </header>
  {metric && (
    <div class="case-card__metric">
      <span class="case-card__metric-value">{metric}</span>
      <span class="case-card__metric-label">{metricLabel}</span>
    </div>
  )}
  <div class="case-card__body" set:html={body} />
  {link && (
    <a class="case-card__link" href={link.url}>{link.text} →</a>
  )}
</article>

<style>
  .case-card {
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    padding: 32px;
    transition: border-color 0.15s ease;
  }
  .case-card:hover { border-color: var(--text-mono-label); }
  .case-card__title { font-size: 20px; font-weight: 600; letter-spacing: -0.01em; margin-bottom: 4px; }
  .case-card__sub { color: var(--text-secondary); font-size: 14px; margin-bottom: 20px; }
  .case-card__metric {
    background: var(--bg-base);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .case-card__metric-value { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; }
  .case-card__metric-label { color: var(--text-secondary); font-size: 13px; }
  .case-card__body { color: var(--text-primary); line-height: 1.6; }
  .case-card__body :global(p) { margin-bottom: 12px; }
  .case-card__body :global(p:last-child) { margin-bottom: 0; }
  .case-card__link {
    display: inline-block;
    margin-top: 16px;
    color: var(--text-primary);
    text-decoration: none;
    border-bottom: 1px solid var(--border-subtle);
    padding-bottom: 2px;
    font-size: 14px;
  }
  .case-card__link:hover { border-bottom-color: var(--text-primary); }
</style>
```

- [ ] **Step 3: Test passes**

```bash
npx vitest run src/components/CaseCard.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add src/components/CaseCard.astro src/components/CaseCard.test.ts
git commit -m "feat: CaseCard переиспользуемый компонент с metric-блоком"
```

---

### Task 27: Cases секция (содержит 3 CaseCard)

**Files:**
- Create: `src/components/Cases.astro`
- Create: `src/content/cases/leadecho-leadgen.mdx`
- Create: `src/content/cases/outstaff-matcher.mdx`
- Create: `src/content/cases/super-agentic-ops.mdx`
- Create: `src/content/config.ts`
- Modify: `src/pages/index.astro`

**Acceptance:** 3 CaseCard в proof-first позиции (сразу после Hero). Контент из MDX. Якорь `#cases` ведёт сюда.

- [ ] **Step 1: src/content/config.ts**

```typescript
import { defineCollection, z } from 'astro:content';

const cases = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    metric: z.string().optional(),
    metricLabel: z.string().optional(),
    link: z.object({
      url: z.string(),
      text: z.string(),
    }).optional(),
    order: z.number(),
  }),
});

export const collections = { cases };
```

- [ ] **Step 2: Создать MDX для каждого кейса**

Контент копировать из `drafts/case-*.md`. Пример `src/content/cases/leadecho-leadgen.mdx`:

```mdx
---
title: leadecho-leadgen
subtitle: Multi-agent cold outreach для B2B SaaS
metric: "172 ICP"
metricLabel: cold email на 5-й день, прошло adversarial review
order: 1
---

LeadEcho — B2B SaaS-стартап, делающий речевую аналитику звонков. Задача — построить процесс холодных продаж, где AI-агенты делают черновую работу под жёсткими правилами.

Spec-driven мульти-агентный воркспейс. Три агента с разделёнными ролями: Claude Desktop как архитектор, Claude Code как исполнитель, Codex CLI как adversarial reviewer. Главный файл SPEC.md — источник правды; любое отклонение требует ADR. Каждый milestone имеет поле `business_value:` — без бизнес-смысла откладывается.

На 5-й день — готовое холодное письмо для сегмента 172 компаний, прошедшее adversarial review. Воспроизводимый процесс: новый сегмент разворачивается по тем же правилам без переписывания методологии.
```

(Аналогично для outstaff-matcher и super-agentic-ops — содержимое из `drafts/case-*.md`.)

- [ ] **Step 3: src/components/Cases.astro**

```astro
---
import { getCollection } from 'astro:content';
import CaseCard from './CaseCard.astro';

const cases = (await getCollection('cases')).sort((a, b) => a.data.order - b.data.order);
---

<section id="cases" class="section section--cases">
  <header class="section__head">
    <p class="label">Кейсы</p>
    <h2 class="section__title">Что построил</h2>
  </header>
  <div class="cases__grid">
    {cases.map(async (caseDoc) => {
      const { Content } = await caseDoc.render();
      // Получаем HTML через rendered content
      return (
        <CaseCard
          title={caseDoc.data.title}
          subtitle={caseDoc.data.subtitle}
          body={''}  // см. примечание ниже
          metric={caseDoc.data.metric}
          metricLabel={caseDoc.data.metricLabel}
          link={caseDoc.data.link}
        >
          <Content />
        </CaseCard>
      );
    })}
  </div>
</section>

<style>
  .section { padding: 96px 0; }
  .section__head { margin-bottom: 48px; }
  .section__title { font-size: 32px; font-weight: 600; letter-spacing: -0.02em; margin-top: 8px; }
  .cases__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
  }
  @media (max-width: 720px) {
    .section { padding: 64px 0; }
    .section__title { font-size: 24px; }
  }
</style>
```

> Примечание про body: Astro Content Collection `.render()` возвращает компонент. Чтобы передавать body как HTML в CaseCard через `set:html` — нужно либо рендерить через AstroNode (сложно), либо переделать CaseCard на принимать children через `<slot />`. Второй путь — проще. Адаптировать CaseCard:

```diff
- <div class="case-card__body" set:html={body} />
+ <div class="case-card__body">
+   <slot />
+ </div>
```

И убрать prop `body` из interface. Адаптировать Cases.astro чтобы передавать `<Content />` как children.

- [ ] **Step 4: Подключить в index.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import Cases from '../components/Cases.astro';
---

<Layout title="Тимур Пестерев — AI-архитектор для B2B" description="...">
  <Hero />
  <Cases />
</Layout>
```

- [ ] **Step 5: Build smoke test**

```bash
npm run build
grep "leadecho-leadgen" dist/index.html
grep "outstaff-matcher" dist/index.html
grep "super-agentic-ops\|agentic-ops" dist/index.html
grep 'id="cases"' dist/index.html
```
All 4 → PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/Cases.astro src/components/CaseCard.astro src/content/ src/pages/index.astro
git commit -m "feat: Cases секция с 3 MDX-кейсами + якорь #cases"
```

---

### Task 28: Principles секция

**Files:**
- Create: `src/components/Principles.astro`
- Create: `src/content/principles.mdx`
- Modify: `src/pages/index.astro`

**Acceptance:** 5 принципов из `drafts/principles.md`. Mono-метка слева, текст справа. Один из принципов содержит «vibe-coding».

- [ ] **Step 1: src/content/principles.mdx**

(можно просто данные в TS-файле, MDX оверкилл для 5 строк)

Альтернатива — `src/data/principles.ts`:

```typescript
export const principles = [
  { num: '01', title: 'ТЗ перед кодом', text: 'Сначала пишу что нужно построить и как проверить готовность — потом разрешаю AI писать код.' },
  { num: '02', title: 'Один AI пишет — другой проверяет', text: 'Author и reviewer — разные сессии с разным bias. Иначе ошибки маскируются.' },
  { num: '03', title: 'Артефакты в файлы, не в чат', text: 'Контракты, правила, лог решений живут в git, чтобы будущая сессия начинала с известного состояния.' },
  { num: '04', title: 'Бизнес-ценность перед сложностью', text: 'У каждой задачи есть строка «зачем». Если строка пустая — задача откладывается.' },
  { num: '05', title: 'От vibe-coding к agentic-coding', text: 'Не один большой AI на всё подряд — несколько специализированных с понятными контрактами между ними.' },
];
```

- [ ] **Step 2: Principles.astro**

```astro
---
import { principles } from '../data/principles';
---

<section class="section section--principles">
  <header class="section__head">
    <p class="label">Как я работаю</p>
    <h2 class="section__title">Пять правил</h2>
  </header>
  <ol class="principles">
    {principles.map((p) => (
      <li class="principle">
        <span class="principle__num mono">{p.num}</span>
        <div class="principle__body">
          <h3 class="principle__title">{p.title}</h3>
          <p class="principle__text">{p.text}</p>
        </div>
      </li>
    ))}
  </ol>
</section>

<style>
  .principles { list-style: none; display: flex; flex-direction: column; gap: 24px; }
  .principle { display: grid; grid-template-columns: 64px 1fr; gap: 16px; align-items: start; }
  .principle__num { color: var(--text-mono-label); font-size: 14px; padding-top: 4px; }
  .principle__title { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
  .principle__text { color: var(--text-secondary); font-size: 16px; line-height: 1.55; }
  @media (max-width: 720px) {
    .principle { grid-template-columns: 40px 1fr; gap: 12px; }
  }
</style>
```

- [ ] **Step 3: Подключить в index.astro**

```astro
import Principles from '../components/Principles.astro';
...
<Hero />
<Cases />
<Principles />
```

- [ ] **Step 4: Build smoke test**

```bash
npm run build
grep "vibe-coding" dist/index.html
grep "agentic-coding" dist/index.html
grep -c "principle__" dist/index.html  # ≥ 10 (5 принципов × 2 элемента)
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Principles.astro src/data/principles.ts src/pages/index.astro
git commit -m "feat: Principles секция с 5 правилами включая vibe→agentic-coding"
```

---

### Task 29: CompetencyMap секция

**Files:**
- Create: `src/components/CompetencyMap.astro`
- Create: `src/data/competencies.ts`
- Modify: `src/pages/index.astro`

**Acceptance:** 4 зоны (сильный / средний / расту / не моя) визуализированы по подходу из `docs/research/competency-map.md`. Цвета зон из палитры SPEC §6.

- [ ] **Step 1: src/data/competencies.ts**

```typescript
export type Zone = 'strong' | 'mid' | 'growing' | 'not-mine';

export interface Competency {
  text: string;
  zone: Zone;
}

export const competencies: Competency[] = [
  // Сильные
  { text: 'Архитектура AI-нативных процессов с нуля', zone: 'strong' },
  { text: 'Чёткие ТЗ для AI-агентов', zone: 'strong' },
  { text: 'Координация нескольких AI с разной точкой зрения', zone: 'strong' },
  { text: 'Решения с явными компромиссами, без перфекционизма', zone: 'strong' },
  { text: 'Связка B2B-продаж и AI-инструментов', zone: 'strong' },
  { text: 'Переделка системы при понимании что не так', zone: 'strong' },
  // Средний
  { text: 'Работа с LLM-API: Claude, GPT, function calling, tool use', zone: 'mid' },
  { text: 'Поиск по документам через эмбеддинги, базовая работа с векторными базами', zone: 'mid' },
  // Расту
  { text: 'Проверка качества AI-ответов: метрики, регрессионные тесты', zone: 'growing' },
  { text: 'Видимость работы AI в реальном времени: логи, латентность, стоимость', zone: 'growing' },
  { text: 'Гарантированный формат ответа AI: валидация, повторы при ошибке', zone: 'growing' },
  // Не моя
  { text: 'Обучение и дообучение моделей с нуля', zone: 'not-mine' },
  { text: 'Глубокий research в AI', zone: 'not-mine' },
  { text: 'Классическая ML-разработка (recsys, computer vision)', zone: 'not-mine' },
];

export const zoneConfig: Record<Zone, { label: string; color: string; level: number }> = {
  strong: { label: 'Подхожу', color: '#fafafa', level: 4 },
  mid: { label: 'Средний', color: '#9090a8', level: 3 },
  growing: { label: 'Расту', color: '#6666aa', level: 2 },
  'not-mine': { label: 'Не моя зона', color: '#3a3a4a', level: 0 },
};
```

- [ ] **Step 2: CompetencyMap.astro**

```astro
---
import { competencies, zoneConfig } from '../data/competencies';
---

<section class="section section--competency">
  <header class="section__head">
    <p class="label">Карта компетенций</p>
    <h2 class="section__title">Где я подхожу, где расту, где нужен другой</h2>
  </header>

  <ul class="competency">
    {competencies.map((c) => {
      const cfg = zoneConfig[c.zone];
      return (
        <li class="competency__row">
          <span class="competency__text">{c.text}</span>
          <span class="competency__bar">
            <span
              class="competency__bar-fill"
              style={`width: ${cfg.level * 25}%; background: ${cfg.color}`}
            />
          </span>
          <span class="competency__zone mono">{cfg.label}</span>
        </li>
      );
    })}
  </ul>

  <p class="competency__legend">
    <strong>Где подхожу:</strong> строю системы и процессы — от ТЗ до запуска.<br />
    <strong>Где расту:</strong> инструменты контроля качества и видимости AI-работы.<br />
    <strong>Где нужен другой:</strong> обучение моделей, классический ML, deep AI research.
  </p>
</section>

<style>
  .competency { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 32px; }
  .competency__row {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) 200px 100px;
    gap: 16px;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--border-subtle);
  }
  .competency__text { color: var(--text-primary); font-size: 15px; }
  .competency__bar {
    background: var(--border-subtle);
    height: 6px;
    border-radius: 3px;
    overflow: hidden;
    display: block;
  }
  .competency__bar-fill { height: 100%; display: block; transition: width 0.3s ease; }
  .competency__zone { color: var(--text-secondary); font-size: 11px; }
  .competency__legend {
    color: var(--text-secondary);
    line-height: 1.7;
    font-size: 14px;
    padding-top: 24px;
    border-top: 1px solid var(--border-subtle);
  }
  .competency__legend strong { color: var(--text-primary); }
  @media (max-width: 720px) {
    .competency__row { grid-template-columns: 1fr; gap: 4px; padding: 12px 0; }
    .competency__bar { width: 100%; }
  }
</style>
```

- [ ] **Step 3: index.astro подключить**

```astro
<Cases />
<Principles />
<CompetencyMap />
```

- [ ] **Step 4: Build smoke test**

```bash
npm run build
grep "Архитектура AI-нативных" dist/index.html
grep "Где я подхожу" dist/index.html
```

- [ ] **Step 5: Commit**

```bash
git add src/components/CompetencyMap.astro src/data/competencies.ts src/pages/index.astro
git commit -m "feat: CompetencyMap секция с 4 зонами + горизонтальные бары"
```

---

### Task 30: Stack секция

**Files:**
- Create: `src/components/Stack.astro`
- Create: `src/data/stack.ts`

**Acceptance:** Сгруппированный список из `drafts/stack.md`. Без рейтингов.

- [ ] **Step 1: src/data/stack.ts**

```typescript
export const stack = [
  {
    group: 'AI-модели и API',
    items: [
      { name: 'Claude (Anthropic)', note: 'основная рабочая модель' },
      { name: 'GPT (OpenAI)', note: 'для adversarial review и сравнения' },
      { name: 'Codex CLI', note: 'отдельный пайплайн review' },
    ],
  },
  {
    group: 'Среды разработки агентов',
    items: [
      { name: 'Claude Code', note: 'CLI + VS Code' },
      { name: 'Claude Desktop', note: 'архитектурные решения' },
      { name: 'Skills + MCP servers', note: 'контракты работы' },
    ],
  },
  {
    group: 'Код и данные',
    items: [
      { name: 'Python', note: 'детерминистские пайплайны' },
      { name: 'SQLite / Postgres', note: 'где нужна персистентность' },
      { name: 'Markdown в git', note: 'wiki и спецификации' },
    ],
  },
  {
    group: 'Инфраструктура',
    items: [
      { name: 'GitHub', note: 'версионирование артефактов' },
      { name: 'Vercel', note: 'статический хостинг' },
      { name: 'Telegram Bot API', note: 'сборщики и нотификации' },
    ],
  },
  {
    group: 'Сейчас изучаю',
    items: [
      { name: 'Pressure-testing skills', note: 'через skill-creator' },
      { name: 'LLM Wiki паттерн', note: 'эссе Карпатого' },
    ],
  },
];
```

- [ ] **Step 2: Stack.astro**

```astro
---
import { stack } from '../data/stack';
---

<section class="section section--stack">
  <header class="section__head">
    <p class="label">Стек</p>
    <h2 class="section__title">Чем работаю</h2>
  </header>
  <div class="stack">
    {stack.map((group) => (
      <div class="stack__group">
        <h3 class="stack__group-title">{group.group}</h3>
        <ul class="stack__items">
          {group.items.map((item) => (
            <li class="stack__item">
              <span class="stack__item-name">{item.name}</span>
              <span class="stack__item-note">— {item.note}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</section>

<style>
  .stack { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; }
  .stack__group-title { font-size: 13px; font-weight: 500; letter-spacing: 0.1em; color: var(--text-mono-label); text-transform: uppercase; margin-bottom: 12px; }
  .stack__items { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .stack__item-name { color: var(--text-primary); font-weight: 500; font-size: 15px; }
  .stack__item-note { color: var(--text-secondary); font-size: 14px; }
</style>
```

- [ ] **Step 3: index.astro + build**

```bash
npm run build
grep "Claude (Anthropic)" dist/index.html
grep -c "stack__group" dist/index.html  # ≥ 5
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Stack.astro src/data/stack.ts src/pages/index.astro
git commit -m "feat: Stack секция с 5 группами инструментов"
```

---

### Task 31: About секция (с фотографией)

**Files:**
- Create: `src/components/About.astro`
- Modify: `src/pages/index.astro`
- Ожидаем: `public/portrait.jpg` (Тимур положит сам — задокументировать)

**Acceptance:** Текст из `drafts/about.md`. Фото слева (если есть), текст справа. Mobile — фото сверху, текст снизу.

- [ ] **Step 1: About.astro**

```astro
---
const aboutText = `Пять лет в IT — основатель и совладелец двух компаний в аутстаффе и рекрутменте. До прошлого года писал процессы для людей: продажи, найм, операционка. Последний год — pivot в AI-first: вместо того, чтобы расширять команды, строю системы, где AI выполняет работу под чёткими правилами и проверками. Базируюсь в Казани, работаю удалённо с командами в РФ и за рубежом.`;
---

<section class="section section--about">
  <header class="section__head">
    <p class="label">О тебе</p>
    <h2 class="section__title">Тимур Пестерев</h2>
  </header>
  <div class="about">
    <div class="about__portrait">
      <img src="/portrait.jpg" alt="Тимур Пестерев" width="320" height="320" loading="lazy" />
    </div>
    <p class="about__text">{aboutText}</p>
  </div>
</section>

<style>
  .about { display: grid; grid-template-columns: 320px 1fr; gap: 48px; align-items: start; }
  .about__portrait img {
    width: 100%;
    height: auto;
    border-radius: 12px;
    display: block;
    background: var(--bg-elevated);
  }
  .about__text {
    color: var(--text-primary);
    font-size: 17px;
    line-height: 1.7;
  }
  @media (max-width: 720px) {
    .about { grid-template-columns: 1fr; gap: 24px; }
    .about__portrait { max-width: 240px; }
  }
</style>
```

- [ ] **Step 2: Документировать ожидание фотографии**

```bash
echo "ВАЖНО: положите фотографию в public/portrait.jpg перед сборкой. Рекомендация: квадрат, ≥ 640x640, JPG, ≤ 200KB." > public/portrait.PLACEHOLDER.md
```

> Если файл `portrait.jpg` не существует — заменить `<img>` на placeholder div до того момента, как Тимур положит файл.

- [ ] **Step 3: index.astro + build**

```bash
npm run build
grep "Пять лет в IT" dist/index.html
```

- [ ] **Step 4: Commit**

```bash
git add src/components/About.astro src/pages/index.astro public/portrait.PLACEHOLDER.md
git commit -m "feat: About секция с фото + 5-7 строк бэкграунда"
```

---

### Task 32: Fit секция

**Files:**
- Create: `src/components/Fit.astro`
- Create: `src/data/fit.ts`

**Acceptance:** 3 профиля + раздел «Кому не подойду» из `drafts/fit.md`.

- [ ] **Step 1: src/data/fit.ts**

```typescript
export const fitProfiles = [
  {
    title: 'Если ты founder или CTO B2B-стартапа (5-50 человек)',
    text: 'Хочешь добавить AI в продукт или внутренние процессы, но не знаешь с чего начать. Или начал и получил кашу. Бюджет $1-10k на проект. Пиши — разберёмся вместе.',
  },
  {
    title: 'Если ты технический руководитель в средней компании',
    text: 'Команда инженеров есть, AI-кусок уже что-то делает, но «генерит ересь». Нужен внешний взгляд, аудит, конкретный план. Бюджет $2-15k. Пиши.',
  },
  {
    title: 'Если ты сооснователь раннего AI-стартапа',
    text: 'Ищешь founding AI engineer или AI Lead. Готов на акции + базовую зарплату. Хочешь видеть, что человек строит системы, а не пишет демо. Пиши — обсудим fit.',
  },
];

export const noFit = [
  'Если нужен ML-инженер или Data Scientist (это другая роль).',
  'Если нужно «по-быстрому прикрутить ChatGPT» — это делается без меня.',
  'Если хочется full-time в большой компании с корпоративной иерархией.',
];
```

- [ ] **Step 2: Fit.astro**

```astro
---
import { fitProfiles, noFit } from '../data/fit';
---

<section class="section section--fit">
  <header class="section__head">
    <p class="label">Кому подхожу</p>
    <h2 class="section__title">Профили клиентов</h2>
  </header>
  <ul class="fit">
    {fitProfiles.map((p) => (
      <li class="fit__profile">
        <h3 class="fit__title">{p.title}</h3>
        <p class="fit__text">{p.text}</p>
      </li>
    ))}
  </ul>
  <div class="fit__no">
    <h3 class="fit__no-title">Кому НЕ подойду</h3>
    <ul class="fit__no-list">
      {noFit.map((n) => <li>{n}</li>)}
    </ul>
  </div>
</section>

<style>
  .fit { list-style: none; display: flex; flex-direction: column; gap: 24px; margin-bottom: 48px; }
  .fit__profile {
    padding: 24px;
    background: var(--bg-elevated);
    border-radius: 12px;
    border: 1px solid var(--border-subtle);
  }
  .fit__title { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
  .fit__text { color: var(--text-secondary); line-height: 1.55; }
  .fit__no { padding-top: 24px; border-top: 1px solid var(--border-subtle); }
  .fit__no-title { color: var(--text-mono-label); font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 16px; }
  .fit__no-list { list-style: none; display: flex; flex-direction: column; gap: 8px; color: var(--text-secondary); }
  .fit__no-list li::before { content: '—'; color: var(--text-mono-label); margin-right: 8px; }
</style>
```

- [ ] **Step 3: build + commit**

```bash
npm run build
grep "Если ты founder" dist/index.html
grep "Кому НЕ" dist/index.html
git add src/components/Fit.astro src/data/fit.ts src/pages/index.astro
git commit -m "feat: Fit секция с 3 профилями и явным no-fit списком"
```

---

### Task 33: Growth секция

**Files:**
- Create: `src/components/Growth.astro`
- Create: `src/data/growth.ts`

**Acceptance:** 3 направления роста с дедлайнами из `drafts/growth.md`.

- [ ] **Step 1: src/data/growth.ts + Growth.astro**

```typescript
export const growth = [
  {
    num: '01',
    title: 'Системная проверка качества AI-ответов',
    text: 'Метрики, регрессионные тесты, бенчмарки. Сейчас собираю первую полноценную eval-сетку.',
    deadline: 'Июль 2026',
  },
  {
    num: '02',
    title: 'Видимость работы AI в реальном времени',
    text: 'Логирование, трейсы, латентность, стоимость. Хочу видеть проблемы ДО того, как сломалось.',
    deadline: 'Август 2026',
  },
  {
    num: '03',
    title: 'Гарантированный формат ответа AI',
    text: 'Валидация структуры, повторы при ошибке. Прикладной слой есть, жёсткой отказоустойчивости недотянуто.',
    deadline: 'Август 2026',
  },
];
```

```astro
---
// src/components/Growth.astro
import { growth } from '../data/growth';
---

<section class="section section--growth">
  <header class="section__head">
    <p class="label">Куда расту</p>
    <h2 class="section__title">Три вещи, которые активно подтягиваю</h2>
  </header>
  <ol class="growth">
    {growth.map((g) => (
      <li class="growth__row">
        <span class="growth__num mono">{g.num}</span>
        <div class="growth__body">
          <h3 class="growth__title">{g.title}</h3>
          <p class="growth__text">{g.text}</p>
          <p class="growth__deadline mono">→ {g.deadline}</p>
        </div>
      </li>
    ))}
  </ol>
</section>

<style>
  .growth { list-style: none; display: flex; flex-direction: column; gap: 24px; }
  .growth__row { display: grid; grid-template-columns: 64px 1fr; gap: 16px; }
  .growth__num { color: var(--text-mono-label); font-size: 14px; padding-top: 4px; }
  .growth__title { font-size: 18px; font-weight: 600; margin-bottom: 6px; }
  .growth__text { color: var(--text-secondary); margin-bottom: 8px; }
  .growth__deadline { color: var(--text-primary); font-size: 13px; }
</style>
```

- [ ] **Step 2: build + commit**

```bash
npm run build
grep "Июль 2026" dist/index.html
git add src/components/Growth.astro src/data/growth.ts src/pages/index.astro
git commit -m "feat: Growth секция с 3 направлениями и дедлайнами"
```

---

### Task 34: Contacts секция

**Files:**
- Create: `src/components/Contacts.astro`

**Acceptance:** Telegram + email + одна строка про ожидание.

- [ ] **Step 1: Contacts.astro**

```astro
---
---

<section id="contacts" class="section section--contacts">
  <header class="section__head">
    <p class="label">Контакты</p>
    <h2 class="section__title">Связаться</h2>
  </header>
  <div class="contacts">
    <a class="contact" href="https://t.me/timursky">
      <span class="contact__icon">→</span>
      <span class="contact__label">Telegram (приоритет)</span>
      <span class="contact__value mono">@timursky</span>
    </a>
    <a class="contact" href="mailto:pesterevtimur78@gmail.com">
      <span class="contact__icon">→</span>
      <span class="contact__label">Email</span>
      <span class="contact__value mono">pesterevtimur78@gmail.com</span>
    </a>
  </div>
  <p class="contacts__note">
    В будний день отвечаю в течение 6 часов (UTC+3). По выходным — медленнее.
  </p>
</section>

<style>
  .contacts { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
  .contact {
    display: grid;
    grid-template-columns: 32px 200px 1fr;
    gap: 16px;
    padding: 20px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-subtle);
    border-radius: 10px;
    text-decoration: none;
    color: var(--text-primary);
    transition: border-color 0.15s ease;
  }
  .contact:hover { border-color: var(--text-mono-label); }
  .contact__icon { color: var(--text-mono-label); }
  .contact__label { color: var(--text-secondary); }
  .contact__value { color: var(--text-primary); font-size: 15px; }
  .contacts__note { color: var(--text-secondary); font-size: 14px; }
  @media (max-width: 720px) {
    .contact { grid-template-columns: 1fr; gap: 4px; }
  }
</style>
```

- [ ] **Step 2: index.astro подключить + build**

```bash
npm run build
grep "@timursky" dist/index.html
grep "pesterevtimur78" dist/index.html
git add src/components/Contacts.astro src/pages/index.astro
git commit -m "feat: Contacts секция с @timursky и email + ожидание ответа"
```

---

### Task 35: Финальная сборка index.astro в proof-first порядке

**Files:**
- Modify: `src/pages/index.astro`

**Acceptance:** Все 9 секций в порядке из SPEC §5 (proof-first):
1. Hero
2. Cases
3. Principles
4. CompetencyMap
5. Stack
6. About
7. Fit
8. Growth
9. Contacts

- [ ] **Step 1: Финальный index.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import Cases from '../components/Cases.astro';
import Principles from '../components/Principles.astro';
import CompetencyMap from '../components/CompetencyMap.astro';
import Stack from '../components/Stack.astro';
import About from '../components/About.astro';
import Fit from '../components/Fit.astro';
import Growth from '../components/Growth.astro';
import Contacts from '../components/Contacts.astro';

const title = 'Тимур Пестерев — AI-архитектор для B2B';
const description = 'Запускаю AI-процессы, которые не разваливаются на втором месяце. Жёсткие ТЗ перед стартом. Один AI пишет — другой проверяет.';
---

<Layout title={title} description={description}>
  <Hero />
  <Cases />
  <Principles />
  <CompetencyMap />
  <Stack />
  <About />
  <Fit />
  <Growth />
  <Contacts />
</Layout>
```

- [ ] **Step 2: Verify все 9 секций в правильном порядке**

```bash
npm run build
# Извлекаем последовательность section__title в порядке появления
grep -o 'class="section__title">[^<]*' dist/index.html
```
Expected порядок (без Hero, у него своя структура):
1. Что построил (Cases)
2. Пять правил (Principles)
3. Где я подхожу, где расту, где нужен другой (CompetencyMap)
4. Чем работаю (Stack)
5. Тимур Пестерев (About)
6. Профили клиентов (Fit)
7. Три вещи, которые активно подтягиваю (Growth)
8. Связаться (Contacts)

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: финальная сборка index.astro — 9 секций в proof-first порядке"
```

---

### Task 36: Tabler outline иконки (опционально, если ещё нужны)

**Files:**
- Modify: `src/components/Hero.astro`, `Contacts.astro` если решено добавить иконки

**Acceptance:** Tabler outline иконки 16-18px в нужных местах (Hero label, Contacts).

> Если в текущем варианте дизайна стрелки `→` достаточны — пропустить таску. Решение в зависимости от того, как выглядит финал на staging (Lighthouse + визуальная оценка).

- [ ] **Step 1: Если решено добавлять — установить**

```bash
npm install @tabler/icons-svg
```

- [ ] **Step 2: Использовать как inline SVG**

(пример, если потребуется)

```astro
---
import arrowRight from '@tabler/icons-svg/icons/arrow-right.svg?raw';
---
<span class="icon" set:html={arrowRight} />
```

- [ ] **Step 3: Commit (если применили)**

```bash
git add . && git commit -m "feat: Tabler outline иконки в Hero label и Contacts"
```

---

### Task 37: MDX контент для кейсов (полная фактура)

**Files:**
- Verify/expand: `src/content/cases/leadecho-leadgen.mdx`
- Verify/expand: `src/content/cases/outstaff-matcher.mdx`
- Verify/expand: `src/content/cases/super-agentic-ops.mdx`

**Acceptance:** Финальные тексты кейсов соответствуют утверждённым `drafts/case-*.md` после adversarial review. Каждый MDX содержит ровно текст из draft.

- [ ] **Step 1: Скопировать финальный текст из drafts в MDX**

```bash
# Извлечь основной текст из draft (между --- блоками)
# Вставить в .mdx как есть (с правильным frontmatter)
```

- [ ] **Step 2: Build и сверить**

```bash
npm run build
grep "4 час\|15 минут\|4 часа" dist/index.html  # outstaff-matcher метрика
grep "172 ICP\|172 компаний\|172 компани" dist/index.html  # leadecho метрика
grep "4 слоя\|четыре слоя\|четырёх слоях\|четырех слоях" dist/index.html  # super-agentic-ops
```

- [ ] **Step 3: Commit**

```bash
git add src/content/cases/
git commit -m "feat: финальный контент кейсов (фактура из drafts после adversarial review)"
```

---

### Task 38: SEO meta + OG image generation

**Files:**
- Create: `src/components/SEOMeta.astro` (если не вошло в Layout)
- Modify: `src/layouts/Layout.astro`
- Create: `public/og-default.png` (через сборку или вручную)

**Acceptance:** OG-картинка генерируется (1200×630). Все meta-теги присутствуют. Социальный share работает.

- [ ] **Step 1: Проверить Layout.astro на полноту meta-тегов**

Уже в Task 24 базовые есть. Дополнить:

```diff
+ <meta name="robots" content="index, follow" />
+ <meta name="author" content="Тимур Пестерев" />
+ <meta property="og:locale" content="ru_RU" />
+ <link rel="canonical" href={Astro.url.href} />
```

- [ ] **Step 2: Сгенерировать OG-картинку**

Простейший путь — использовать [`satori`](https://github.com/vercel/satori) или сделать вручную в Figma и положить в `public/og-default.png`.

Команда для satori (если выбран этот путь):

```bash
npm install satori satori-html @resvg/resvg-js
```

Скрипт `scripts/generate-og.ts`:

```typescript
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';

const svg = await satori(
  {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        background: 'radial-gradient(ellipse at top right, #1a1a2e 0%, #0a0a0f 60%)',
        color: '#fafafa',
        fontFamily: 'Inter',
        padding: '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { fontSize: 24, color: '#9090a8', marginBottom: 24, letterSpacing: '0.15em' },
            children: '→ AI ARCHITECTURE · B2B',
          },
        },
        {
          type: 'div',
          props: {
            style: { fontSize: 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.025em' },
            children: 'Запускаю AI-процессы, которые не разваливаются на втором месяце.',
          },
        },
      ],
    },
  },
  { width: 1200, height: 630, fonts: [/* загрузить Inter */] }
);
const png = new Resvg(svg).render().asPng();
fs.writeFileSync('public/og-default.png', png);
```

- [ ] **Step 3: Verify**

```bash
test -f public/og-default.png
# Размер должен быть ~50-300KB
ls -la public/og-default.png
```

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Layout.astro public/og-default.png scripts/generate-og.ts
git commit -m "feat: SEO meta-теги полный набор + OG картинка 1200x630"
```

---

### Task 39: robots.txt + sitemap.xml + favicon

**Files:**
- Create: `public/robots.txt`
- Create: `public/favicon.svg`
- Verify: `astro-sitemap` плагин уже подключен в Task 24

**Acceptance:** robots.txt разрешает индексацию. sitemap.xml генерируется при build. Favicon отображается.

- [ ] **Step 1: public/robots.txt**

```
User-agent: *
Allow: /

Sitemap: https://<домен>/sitemap-index.xml
```

(Поставить реальный домен после D-003.)

- [ ] **Step 2: public/favicon.svg**

Простой моно-favicon, минимальный SVG. Можно — буква «T» в моно-стиле:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#0a0a0f"/>
  <text x="16" y="22" text-anchor="middle" font-family="SF Mono, monospace" font-size="20" font-weight="700" fill="#fafafa">T</text>
</svg>
```

- [ ] **Step 3: Verify sitemap генерируется**

```bash
npm run build
ls dist/sitemap-index.xml
ls dist/sitemap-0.xml
```

- [ ] **Step 4: Commit**

```bash
git add public/robots.txt public/favicon.svg
git commit -m "feat: robots.txt + favicon.svg + sitemap (auto-generated)"
```

---

### Task 40: Аналитика — установка выбранной системы

**Files:**
- Modify: `src/layouts/Layout.astro`

**Acceptance:** Скрипт аналитики (Plausible или Vercel Analytics, по `docs/research/analytics.md`) подключен с правильным domain/site ID. Тестовый pageview отслеживается.

- [ ] **Step 1: Если Vercel Analytics**

```bash
npm install @vercel/analytics
```

В Layout.astro:

```astro
---
import { Analytics } from '@vercel/analytics/astro';
---
<Layout>
  ...
  <Analytics />
</Layout>
```

- [ ] **Step 2: Если Plausible**

В Layout.astro `<head>`:

```html
<script defer data-domain="<домен>" src="https://plausible.io/js/script.js"></script>
```

- [ ] **Step 3: Verify в dev mode**

```bash
npm run dev
# Открыть localhost:4321, проверить network tab — есть запрос к plausible.io / vercel.com/_vercel/insights
```

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Layout.astro package.json
git commit -m "feat: подключена аналитика — <Plausible|Vercel Analytics>"
```

---

# Phase 6 — Build + deploy

Цель: финальная сборка, Lighthouse валидация, и production-deploy после approve Тимура.

---

### Task 41: Production build + Lighthouse audit

**Files:**
- Create: `docs/lighthouse-baseline.md`

**Acceptance:**
- `npm run build` exit 0.
- Lighthouse Performance ≥ 95 на desktop И mobile.
- LCP < 1.5s.
- Размер первого экрана < 100KB.

- [ ] **Step 1: Production build**

```bash
npm run build
echo "Build exit code: $?"
```
Expected: `Build exit code: 0`.

- [ ] **Step 2: Preview build локально**

```bash
npm run preview
# Открывает на http://localhost:4321 production build
```

- [ ] **Step 3: Lighthouse audit (desktop)**

```bash
npx lighthouse http://localhost:4321 --view --preset=desktop --output=html --output-path=./lighthouse-desktop.html
# Записать метрики в docs/lighthouse-baseline.md
```

- [ ] **Step 4: Lighthouse audit (mobile)**

```bash
npx lighthouse http://localhost:4321 --view --output=html --output-path=./lighthouse-mobile.html
```

- [ ] **Step 5: Записать результаты в docs/lighthouse-baseline.md**

```markdown
# Lighthouse baseline

## Desktop
- Performance: N
- Accessibility: N
- Best Practices: N
- SEO: N
- LCP: N ms
- FCP: N ms
- TBT: N ms

## Mobile
- Performance: N
- Accessibility: N
- LCP: N ms

## Размер первого экрана
- HTML: N KB
- CSS: N KB
- JS: N KB
- Total: N KB

## Замечания
- ...
```

- [ ] **Step 6: Если Lighthouse < 95 — fix loop**

Типичные узкие места:
- Большой OG image / portrait.jpg → сжать
- Inline шрифт vs preload → проверить `astro:fonts` config
- Лишние CSS → audit + удалить unused
- Большой DOM в одной секции → разбить

Цикл fix → rebuild → re-audit, пока ≥ 95.

- [ ] **Step 7: Commit**

```bash
git add docs/lighthouse-baseline.md
git commit -m "test: Lighthouse baseline desktop+mobile, оба ≥ 95"
```

---

### Task 42: GitHub repo creation (после approve Тимура)

**Files:** internal — git remote setup

**Acceptance:** Репозиторий создан на GitHub, push выполнен, текущая ветка main отслеживает origin/main.

> **Approval gate (SPEC AGENTS §4):** Тимур должен явно сказать «можно push на GitHub».

- [ ] **Step 1: Создать репозиторий через `gh` (если установлен) или вручную**

Если `gh` доступен:
```bash
gh repo create portfolio-site --private --description "Personal portfolio site for Тимур Пестерев"
```

Или вручную: создать через github.com/new, добавить remote:

```bash
git remote add origin git@github.com:pesterevtimur/portfolio-site.git
# Альтернативно через HTTPS + PAT (так как SSH порт 22 заблокирован — см. leadecho-leadgen CLAUDE.md §5)
git remote add origin https://github.com/pesterevtimur/portfolio-site.git
```

- [ ] **Step 2: Push**

```bash
git push -u origin main
```

- [ ] **Step 3: Verify**

```bash
git remote -v
git branch -vv  # должно показать origin/main
```

- [ ] **Step 4: Записать в docs/learnings.md**

```bash
echo "[$(date +%Y-%m-%d)] chore | repo pushed to github.com/pesterevtimur/portfolio-site (private)" >> docs/learnings.md
git add docs/learnings.md
git commit -m "chore: репозиторий запушен на GitHub (private)"
git push
```

---

### Task 43: Vercel project setup + staging deploy

**Files:**
- Create: `vercel.json` (если нужно настроить redirects / headers)

**Acceptance:** Vercel project создан, подключен к GitHub repo. Staging deploy работает. URL вида `portfolio-site-<random>.vercel.app` отвечает 200.

> **Approval gate:** Vercel staging-deploy — OK без approve. Production-deploy на кастомный домен — отдельный gate в Task 44.

- [ ] **Step 1: Залогиниться в Vercel CLI**

```bash
npm install -g vercel
vercel login
# Открывает браузер для OAuth
```

- [ ] **Step 2: Linked project**

```bash
cd /c/Users/user/Documents/Claude/Projects/portfolio-site
vercel link
# Выбрать team, project name = portfolio-site
```

- [ ] **Step 3: Trigger preview deploy**

```bash
vercel
# Получить preview URL вида: https://portfolio-site-<hash>.vercel.app
```

- [ ] **Step 4: Verify staging работает**

```bash
curl -I https://portfolio-site-<hash>.vercel.app
# Expected: HTTP/2 200
```

- [ ] **Step 5: Lighthouse на staging**

```bash
npx lighthouse https://portfolio-site-<hash>.vercel.app --preset=desktop --output=html --output-path=./lighthouse-staging.html
```
Expected: Performance ≥ 95.

- [ ] **Step 6: Commit + push**

```bash
git add vercel.json  # если создан
git commit -m "chore: Vercel project setup + staging deploy"
git push
```

---

### Task 44: Production deploy (после approve Тимура + покупки домена)

**Files:** Vercel project настройки

**Acceptance:** Сайт доступен по выбранному в D-003 домену. SSL работает. Lighthouse ≥ 95 на production URL.

> **Approval gate:** Тимур должен подтвердить:
> 1. Готовность контента (все 9 секций просмотрены).
> 2. Готовность дизайна (визуал на staging устраивает).
> 3. Покупка домена выполнена.
> 4. «Можно публиковать».

- [ ] **Step 1: Дождаться явного approve от Тимура**

Записать в learnings:
```bash
echo "[$(date +%Y-%m-%d)] note | Production deploy approved by Тимур: <ссылка на сообщение/timestamp>" >> docs/learnings.md
```

- [ ] **Step 2: Купить домен**

(Делает Тимур через выбранный registrar.)

- [ ] **Step 3: Привязать домен к Vercel project**

В Vercel dashboard → Settings → Domains → Add → ввести домен. Vercel показывает DNS записи (A или CNAME).

- [ ] **Step 4: Настроить DNS у registrar**

Добавить A / CNAME записи по инструкциям Vercel.

- [ ] **Step 5: Wait for DNS propagation**

```bash
# Periodically check
nslookup <домен>
# Когда DNS прорезался — Vercel автоматически выпускает SSL
```

- [ ] **Step 6: Trigger production deploy**

```bash
vercel --prod
```

- [ ] **Step 7: Verify**

```bash
curl -I https://<домен>
# Expected: HTTP/2 200, ssl valid

npx lighthouse https://<домен> --preset=desktop --output=html --output-path=./lighthouse-prod.html
# Performance ≥ 95
```

- [ ] **Step 8: Записать в learnings + commit**

```bash
echo "[$(date +%Y-%m-%d)] milestone | Production deploy LIVE на https://<домен>, Lighthouse <N>" >> docs/learnings.md
git add docs/learnings.md
git commit -m "milestone: production deploy на <домен>, Lighthouse <N>"
git push
```

---

### Task 45: Mobile + accessibility final check

**Files:**
- Update: `docs/lighthouse-baseline.md` (отметить production числа)

**Acceptance:**
- Мобильная вёрстка проверена в Chrome DevTools (375px, 414px, 768px) — все 9 секций читаемы.
- Accessibility ≥ 95 в Lighthouse.
- Все интерактивные элементы доступны клавиатурой.

- [ ] **Step 1: Manual mobile check**

Открыть production URL в Chrome DevTools → Device toolbar:
- iPhone SE (375 × 667)
- iPhone 14 Pro (393 × 852)
- iPad (768 × 1024)

Прокрутить через все 9 секций. Записать замечания в learnings.

- [ ] **Step 2: Keyboard navigation check**

Tab по странице. Все CTA и ссылки доступны. Focus-стиль видим.

Если focus-стиль не виден — добавить в globals.css:

```css
*:focus-visible {
  outline: 2px solid var(--cta-bg);
  outline-offset: 2px;
}
```

- [ ] **Step 3: Lighthouse Accessibility audit**

```bash
npx lighthouse https://<домен> --only-categories=accessibility --view
```
Expected: ≥ 95.

- [ ] **Step 4: Commit fixes (если были)**

```bash
git add src/styles/globals.css
git commit -m "fix: focus-visible outline для accessibility"
git push
```

---

# Phase 7 — Milestone closure

---

### Task 46: M-001-mvp-launch.md заполнен + learnings finalized

**Files:**
- Create: `milestones/M-001-mvp-launch.md`
- Update: `docs/learnings.md`

**Acceptance:**
- M-001 содержит business_value, acceptance criteria (зеркало SPEC §15), related decisions, фактический результат.
- docs/learnings.md имеет финальную запись с production URL.
- README.md обновлён ссылкой на live site.

- [ ] **Step 1: milestones/M-001-mvp-launch.md**

```markdown
---
id: M-001
title: MVP launch portfolio-site
status: completed
created: 2026-05-18
completed: 2026-<MM>-<DD>
business_value: Сайт становится точкой входа для входящих запросов на AI-консалтинг и founding AI engineer позиции. Заменяет резюме. См. SPEC §4 KPI.
related_decisions:
  - D-001-positioning
  - D-002-tech-stack
  - D-003-domain
  - D-004-visual-mood
---

# M-001 — MVP launch

## Что сделано

- 9 секций в proof-first порядке (Hero → Cases → Principles → CompetencyMap → Stack → About → Fit → Growth → Contacts)
- 3 кейса с реальной фактурой (leadecho-leadgen, outstaff-matcher, super-agentic-ops)
- mood A: dark gradient + grid + mono
- Astro + Vercel + <аналитика>
- Lighthouse Performance: <N> desktop / <N> mobile
- Live: https://<домен>

## Acceptance criteria (зеркало SPEC §15)

См. SPEC §15. Все пункты закрыты.

## Что отложено в v2

См. `docs/research/publication-plan.md` секция «V2».

## Production URL

https://<домен>

## Repo

https://github.com/pesterevtimur/portfolio-site (private)
```

- [ ] **Step 2: Финальная запись в docs/learnings.md**

```bash
echo "[$(date +%Y-%m-%d)] milestone | M-001 MVP закрыт. Сайт LIVE: https://<домен>. Lighthouse <N>. Repo private." >> docs/learnings.md
```

- [ ] **Step 3: Обновить README.md**

```bash
# Добавить в README ссылку на live site и статус
```

```diff
- ## Статус
- 
- Brainstorm закрыт 2026-05-19. SPEC.md ожидает review от Тимура.
- Следующий шаг — writing-plans → research-задачи + content drafts.
+ ## Статус
+ 
+ MVP LIVE: https://<домен>
+ Дата запуска: 2026-<MM>-<DD>
+ Lighthouse Performance: <N> desktop / <N> mobile
```

- [ ] **Step 4: Финальный commit**

```bash
git add milestones/M-001-mvp-launch.md docs/learnings.md README.md
git commit -m "milestone: M-001 MVP closed — live on https://<домен>, Lighthouse <N>"
git push
```

- [ ] **Step 5: Optional — публичный repo**

Если Тимур решит сделать репозиторий публичным (для прозрачности процесса):

```bash
gh repo edit pesterevtimur/portfolio-site --visibility public
```

Записать в learnings: `[date] decision | repo made public for transparency`.

---

# Финальная сверка с SPEC.md §15 (Acceptance criteria)

После Task 46 — пройти весь чеклист SPEC §15 и убедиться что каждый пункт закрыт:

- [ ] SPEC.md существует, v1.1, подписан Тимуром → ✓ Task 0 (brainstorm)
- [ ] Все 9 секций имеют draft в `drafts/<section>.md` → ✓ Tasks 11-22
- [ ] 5+ конкурентов проанализированы → ✓ Task 1
- [ ] 3 варианта позиционирования в research → ✓ Task 6
- [ ] Тех-стек подтверждён в D-002 → ✓ Task 8
- [ ] 3-5 доменов проверены на доступность → ✓ Task 2
- [ ] Hero ≤ 3 строк, sub ≤ 1 предложения → ✓ Task 12 + Task 25
- [ ] Каждый кейс ≤ 250 слов → ✓ Tasks 13, 14, 15
- [ ] Все артефакты §13 прошли adversarial review → ✓ Task 23
- [ ] `npm run build` exits 0 → ✓ Task 41
- [ ] Lighthouse Performance ≥ 95 на staging → ✓ Task 43
- [ ] LCP < 1.5s → ✓ Task 41/43
- [ ] Все 9 секций видны на 375px → ✓ Task 45
- [ ] OG картинка работает в Telegram-шаринге → ✓ Task 38
- [ ] robots.txt и sitemap.xml есть → ✓ Task 39
- [ ] Production-deploy после approve Тимура → ✓ Task 44
- [ ] super-agentic-ops кейс с фактурой из SPEC §9 → ✓ Tasks 15 + 37

---

*End of plan.*
