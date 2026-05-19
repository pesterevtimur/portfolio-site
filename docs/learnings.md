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
