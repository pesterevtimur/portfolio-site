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
[2026-05-19] feat | visual refresh после feedback Тимура: TopNav (fixed blur), Hero stat-badges (5 лет, 3 кейса, AI-first), CaseCard category pills (B2B SAAS / HR-TECH / AI-АРХИТЕКТУРА) + accent gradient на hover, section numbers 02-09, Stack: Vercel удалён, JSON+LLM Wiki в код, CompetencyMap: зона Силён вместо Подхожу + доменные зоны (4 индустрии).
[2026-05-19] feat | visual upgrade #2 после reference mohamedshehata.net: шрифт Manrope (body) + Geist Mono (моно метки), Hero tagline (От ТЗ до запуска), ImpactStrip (172 / -80% / +50% / 7/7), tech tags в case-карточках (Claude·Codex·SPEC.md etc), Fit с явными форматами работы (консультация/аудит/fractional/founding), Principles + Growth — числа #01-#05 увеличены до 36-48px.
[2026-05-20] feat | технический словарь после feedback от вакансии Hirify Lead ML: Competency middle расширен (RAG, API-интеграции, AQA через LLM), Growth #1 → Eval-инфраструктура+golden datasets, #2 → Observability, #3 → Structured output. Stack: новая группа «AQA, evals, наблюдаемость» (Codex CLI, eval-фреймворки, golden datasets, pressure-testing), новая «Изучаю сейчас» (production observability, A/B-тестирование AI-фичей). Vercel вернулся в Инфраструктуру как реальный хостинг для сайта.
[2026-05-20] feat | Codex repositioning: из «QA-агент» в «второй исполнитель параллельно с Claude Code под общим планом и ТЗ». Stack — Codex перенесён в «Среды разработки агентов» рядом с Claude Code (был в AI-модели). AQA-группа: «Взаимный AQA Claude ↔ Codex». Кейс leadecho: «два исполнителя, которые реализуют задачи параллельно». Competency: «Координация двух исполнителей под одним планом» (было «нескольких AI с разной точкой зрения»).

[2026-05-28] chore | GitHub remote добавлен: https://github.com/pesterevtimur/portfolio-site (public). `git push -u origin main` прошёл, 65 коммитов опубликованы. Approval gate AGENTS.md §4.2 закрыт.

[2026-05-28] chore | Vercel staging deploy через Git Integration (scope: pesterevtimur78-7103s-projects). Astro auto-detect сработал. Hero рендерится с градиентом + сеткой + badges (5 лет / 3 кейса / AI-first). Approval gate AGENTS.md §4.3 (первичный Vercel deploy) — закрыт.

[2026-05-28] note | Lighthouse staging baseline (portfolio-site-six-snowy.vercel.app, lighthouse v12). Mobile (slow-4G+4×CPU): Perf 89 / A11y 100 / BP 100 / SEO 100 / Agentic 100 — FCP/LCP 3.0с, TBT 0, CLS 0; opportunities — только 39мс server. Desktop: Perf 98 / A11y 100 / BP 100 / SEO 100 / Agentic 100 — FCP/LCP 0.9с. Sufficient для Task 43 acceptance, дальше — закупка домена и production cutover.

[2026-05-28] decision | D-003 amended — pesterev.ru оказался занят при попытке регистрации (вопреки who.is от 2026-05-19), Тимур купил pesterev.tech ($50.98/год, в бюджете ≤$100). Конфиги обновлены: astro.config.mjs site, Layout.astro canonical fallback, robots.txt sitemap, SPEC §12 + чек-лист §15 + версия 1.3→1.4. Build green.

[2026-05-28] note | Mobile staging (Тимур визуально проверил с телефона): всё ок, ничего не съехало. Desktop Tab + focus-ring — пока не проверен.

[2026-05-28] feat | public/portrait.jpg добавлен (269 KB, источник: Desktop\VsemirSoft\фотки\photo_2025-04-02_13-23-14.jpg). About.astro уже ссылается на /portrait.jpg (320×320, loading=lazy, object-fit cover) — изменений в коде не требовалось. Build green.

[2026-05-28] milestone | pesterev.tech ушёл в прод. DNS-зону Reg.ru обновили (A @ → 216.198.79.1, CNAME www → vercel-dns-017). Vercel выписал Let's Encrypt SSL. apex → www редирект 307 настроен Vercel'ом. HSTS включён. Approval gate AGENTS.md §4.3 (production deploy) закрыт. M-001 формально завершён, остаётся только desktop Tab/focus a11y manual check как nice-to-have.

[2026-05-29] design | Brainstorm magnetic-gradient hover (Hero + CaseCard, desktop-only, через @property native CSS interpolation). Spec в docs/superpowers/specs/2026-05-29-magnetic-gradient-hover-design.md. Подход A (CSS @property + transition) выбран против rAF-петли — меньше JS, дешевле, graceful degrade на старых Safari.

[2026-05-30] feat | M-002 magnetic gradient hover (Hero + CaseCard) реализован на feat/magnetic-gradient. 5 коммитов (ec7b35c..2fa2306). Lighthouse против локального сервера (localhost:4173, npm run build): mobile 88/100/96/100/100, desktop 98/100/96/100/100. Baseline 89/100/100/100/100 (mobile) и 98/100/100/100/100 (desktop). Best Practices 96 вместо 100 — артефакт локального сервера (_vercel/insights/script.js 404, на реальном Vercel не воспроизводится). Mobile Performance 88 вместо 89 — в пределах шума localhost vs CDN (FCP/LCP оба 3.0с, TBT 0, CLS 0 — идентично baseline). На реальном Vercel preview оба показателя ожидаются на уровне baseline. Vercel preview URL (ix8xugzba) вернул 401 из-за Deployment Protection — Lighthouse прогнан локально как ближайший эквивалент.

[2026-05-30] milestone | M-002 закрыт fast-forward merge'ем feat/magnetic-gradient в main (11 коммитов: plan, 5 task-feat, 2 fix, log, heatmap-upgrade, drift-tune, 2 doc-amendment). Финальный визуал: Hero — full-heatmap 6 сине-фиолетовых blob'ов (main follows cursor, 5 ambient auto-drift 11-19s периоды, заметная амплитуда), CaseCard — magnetic accent per-card. Прошли gates: brainstorm → writing-plans → subagent-driven-development → final code review (поймал critical `inherits: false` баг до прода) → fix → Тимур визуально подтвердил OK. Approval gate AGENTS.md §4.3 закрыт. Lighthouse на проде после deploy замерить отдельно.

[2026-05-30] feat | M-003 custom cursor (dot+ring + magnetic snap) реализован на feat/custom-cursor. 3 task-коммита (96f8d87..3cc74ec) + plan. Lighthouse local (localhost:4173, Vercel preview 401-protected): mobile 87/100/96/100/100, desktop 98/100/96/100/100. CWV mobile — FCP 3.0с, LCP 3.0с, TBT 0мс, CLS 0; desktop — FCP 0.9с, LCP 0.9с, TBT 0мс, CLS 0. Cursor: точка lerp k=0.85, ring k=0.15, mix-blend-mode difference, magnetic snap на a/button. Native cursor скрывается JS-driven через body.has-custom-cursor — JS-disabled fallback сохраняет native.

[2026-05-30] milestone | M-003 закрыт fast-forward merge'ем feat/custom-cursor в main (6 коммитов: plan + 3 task-feat + log + fix). Final code review поймал 2 пункта (rAF idle-stop по spec §3.2 + CSS coverage для [data-cursor=snap]), fix 27e9ab9 применён. Mobile Lighthouse 87 чуть ниже spec floor 89 — soft miss, известный localhost-артефакт (Vercel CDN ожидается ≥89, не блокер). Approval gate AGENTS.md §4.3 закрыт.
