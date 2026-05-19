# learnings.md

Лог принятых решений и review-замечаний. Одна строка на событие.

Формат: `[YYYY-MM-DD] <type> | <one-sentence>`

Типы: `spec`, `research`, `draft`, `decision`, `milestone`, `docs`, `chore`, `blocker`, `note`.

---

[2026-05-19] research | Проанализированы 9 сайтов (7 международных persona/advisor + 2 РФ-компании); зафиксированы 3 зазора: пустая ниша РФ-персональных AI-консультантов, методологическая прозрачность как дифференциатор, явное называние целевой аудитории.

[2026-05-18] note | Тимур передал бриф портфолио-сайта в Claude Code (см. `docs/brief.md`).
[2026-05-19] spec | Brainstorm-сессия закрыта; SPEC.md v1.0 написан и ожидает review Тимура.
[2026-05-19] decision | Позиционирование — B (spec-driven AI) с битами из A и C. ADR D-001 будет создан в executing-plans фазе.
[2026-05-19] decision | Тех-стек — Astro (не Next.js). Обоснование в SPEC.md §7. ADR D-002 в executing-plans фазе.
[2026-05-19] decision | Структура — proof-first (Кейсы сразу после Hero, потом принципы, потом О тебе).
[2026-05-19] decision | Визуальное направление — mood «A» (dark gradient + grid + mono). ADR D-004 в executing-plans фазе.
[2026-05-19] blocker | super-agentic-ops: GitHub URL из брифа отдаёт 404, Тимур пришлёт фактуру отдельным сообщением; в MVP кейс не публикуется без описания.
[2026-05-19] note | Тимур approved SPEC.md v1.0, передал контактные данные (TG @timursky, фото) и распакованный super-agentic-ops в Downloads.
[2026-05-19] research | super-agentic-ops изучен: 4-слойная архитектура, 4 закона, 7 skills, pressure-tested `evidence-before-action`. Фактура зафиксирована в SPEC.md §9 — blocker снят.
[2026-05-19] decision | Email на сайте — pesterevtimur78@gmail.com (текущий). После выбора домена в D-003 рассмотреть t@<домен>.
[2026-05-19] spec | SPEC.md v1.0 → v1.1: §9 раскрыт фактурой super-agentic-ops; §11 заполнен реальными контактами; §15 acceptance criteria переформулирован для кейса 3.
[2026-05-19] research | Domain shortlist готов — 9 кандидатов проверены, 4 заняты (pesterev.tech, agentic.work, pesterev.team, agenticops.ru), топ-3 рекомендация: pesterev.ai > pesterev.dev > pesterev.ru.
[2026-05-19] research | SEO research — 12 запросов (6 транзакционных, 4 информационных, 2 брендовых), топ-5 приоритетных: «ИИ консультант для стартапа», «AI аудит для стартапа», «AI-консультант B2B», «нанять AI архитектора», «Тимур Пестерев AI»; частотность грубая оценка (wordstat.yandex.ru требует авторизации).
[2026-05-19] research | Analytics decision — выбрана Vercel Analytics (Hobby, бесплатно).
[2026-05-19] research | Competency map visualization — выбран Вариант 1 (горизонтальные бары): статический CSS, 0 KB JS, mood A совместим, 3 варианта исследованы (бары / 2×2 матрица / badge-list).
[2026-05-19] research | Positioning research — 3 варианта зафиксированы, B выбран с битами A+C.
[2026-05-19] decision | 4 ADR созданы: D-001..D-004 (positioning, tech-stack, domain proposed, visual-mood).
[2026-05-19] draft | visual.md — design spec с CSS-токенами (14 переменных), типографикой, spacing system и mobile-breakpoints для Task 24 globals.css.
[2026-05-19] draft | case-leadecho-leadgen.md (227 слов, в bd76f37). Факт «172 ICP» подтверждён в leadecho-leadgen/SPEC.md §3 и M-001.md. KP case 7.3 (+9,2% AOV, ROI 24×) подтверждён там же. M-001 status «в работе», не «завершён». [Учёл: subagent сначала случайно положил эту запись в leadecho-leadgen — soft-reset выполнен]
[2026-05-19] draft | case-outstaff-matcher.md (243 слова, в 986cf53). Метрика «4ч→15м» НЕ подтверждена в source-репо (grep по *.md — нет). Заменена на «существенное сокращение ручной работы»; верифицируемые факты: 129 тестов зелёных, 5 CLI-субкоманд smoke OK (STATUS.md строки 1–3).
[2026-05-19] draft | case-super-agentic-ops.md — 4 слоя + 4 закона + 7 pressure-сценариев подтверждены в Downloads/super-agentic-ops-main.
[2026-05-19] draft+research | hero.md, contacts.md (@timursky), publication-plan.md (MVP/v2/never-do) — все 3 коммита в portfolio-site.
[2026-05-19] draft | batch — principles.md (5 правил), competency-map.md (4 зоны), stack.md (5 групп инструментов).

[2026-05-19] draft | batch — about.md (5-7 строк), fit.md (3 профиля + no-fit), growth.md (3 направления с дедлайнами).
[2026-05-19] note | Codex review applied: 3 critical (SPEC §9 reconciliation, англицизмы case-1, gender fit), 8 important (LLM/LLM-API/founding-engineer translations + Hero label), 3 minor (артефакт «3 批 ×», context-engineering gloss, principle №5 gloss).

[2026-05-19] decision | D-003 accepted — pesterev.ru выбран Тимуром (бюджет, RU-аудитория, простая регистрация).
[2026-05-19] fix | outstaff-matcher case: реальные метрики от Тимура (5 менеджеров → 1 + AI, время заявки 4ч→1ч=−80%, приглашения на интервью +50%). SPEC §2 обновлён, draft v2.
[2026-05-19] feat | Astro 5 scaffold: package.json, astro.config.mjs (site: pesterev.ru), tsconfig (strict), Layout с meta-тегами, globals.css с 14 CSS-переменными из drafts/visual.md. npm run build proves green.
[2026-05-19] feat | Hero.astro: full-bleed радиальный градиент + сетка 32px, headline 3 строки из drafts/hero.md (post Codex review), CTA Telegram + якорь #cases, mobile breakpoint 720px. npm run build green.
[2026-05-19] feat | Tasks 26-27: CaseCard переиспользуемый компонент (props title/subtitle/metric/metricLabel + slot), Cases.astro подгружает Astro 5 content collection через glob loader, 3 MDX (leadecho/outstaff/super-agentic). #cases anchor работает.
[2026-05-19] feat | Tasks 28-35 batch: 7 секций (Principles, CompetencyMap, Stack, About, Fit, Growth, Contacts) + final index.astro в proof-first порядке. Все 9 секций рендерятся, npm run build green, dist/index.html прошёл 8/8 anchor + 10/10 content grep.
[2026-05-19] feat | Tasks 38-40: robots.txt с pesterev.ru sitemap link, favicon.svg (моно T на тёмном), @vercel/analytics подключен в Layout. Sitemap-index.xml авто-генерится через @astrojs/sitemap. OG image — placeholder reference (PNG генерация отложена в v2).
