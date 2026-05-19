# learnings.md

Лог принятых решений и review-замечаний. Одна строка на событие.

Формат: `[YYYY-MM-DD] <type> | <one-sentence>`

Типы: `spec`, `research`, `draft`, `decision`, `milestone`, `docs`, `chore`, `blocker`, `note`.

---

[2026-05-18] note | Тимур передал бриф портфолио-сайта в Claude Code (см. `docs/brief.md`).
[2026-05-19] spec | Brainstorm-сессия закрыта; SPEC.md v1.0 написан и ожидает review Тимура.
[2026-05-19] decision | Позиционирование — B (spec-driven AI) с битами из A и C. ADR D-001 будет создан в executing-plans фазе.
[2026-05-19] decision | Тех-стек — Astro (не Next.js). Обоснование в SPEC.md §7. ADR D-002 в executing-plans фазе.
[2026-05-19] decision | Структура — proof-first (Кейсы сразу после Hero, потом принципы, потом О тебе).
[2026-05-19] decision | Визуальное направление — mood «A» (dark gradient + grid + mono). ADR D-004 в executing-plans фазе.
[2026-05-19] blocker | super-agentic-ops: GitHub URL из брифа отдаёт 404, Тимур пришлёт фактуру отдельным сообщением; в MVP кейс не публикуется без описания.
