# AGENTS.md — portfolio-site

Операционный контракт для AI-агентов в этом репозитории. Читать **до**
первого действия.

## 1. Роли

| Агент | Роль | Границы записи |
|---|---|---|
| **Claude Code** | Реализатор: research, drafts, скаффолд Astro, секции, деплой | Пишет `SPEC.md`, `decisions/`, `docs/research/`, `drafts/`, `milestones/`, исходники сайта. |
| **Codex CLI** | Adversarial reviewer | Читает любой артефакт, бросает вызов: «это маркетинговое клише?», «эта формулировка отсечёт нетехнического founder'а?», «эта метрика подтверждена в репозитории-источнике?». **Не пишет production-контент.** |
| **Claude Desktop** | Architect / second opinion (опционально) | Подключается на крупные развилки (новое позиционирование, смена стека). Авторизует ADR. |
| **Тимур** | Стратегический accept, git merge, публикация | Финальный approve на merge в `main`. Publish на GitHub и Vercel — только с его явного разрешения. |

## 2. Project laws (4)

См. полный список в [`SPEC.md` §14](./SPEC.md#14-project-laws).
TL;DR:
1. SPEC.md — источник правды. Отклонение → ADR.
2. Adversarial review обязателен для: позиционирования, Hero, текстов кейсов, формулировок принципов.
3. Real fact > marketing claim. Никаких выдуманных метрик, кейсов, цитат, «эксперт»-формулировок.
4. Buyer-impact gate: каждая секция должна работать минимум на один из 3 целевых профилей (см. [`SPEC.md` §4](./SPEC.md#4-целевая-аудитория)). Если не работает — режем.

## 3. Workflow (Week 1, manual)

- **Старт задачи:** Claude Code открывает `SPEC.md` и текущий plan (`milestones/M-001-mvp-launch.md` после его создания), берёт следующий незакрытый item.
- **Запрос review:** после draft Claude Code коммитит на feature-ветку, Тимур запускает Codex CLI: «Codex, review `<file>` против `SPEC.md`».
- **Эскалация:** если Codex и Claude Code не сходятся за 2 раунда — Тимур решает или поднимает Claude Desktop для ADR.

## 4. Approval gates — Тимур должен сказать «можно» для:

1. **Любое изменение позиционирования** (тон, hero-формулировка, vocabulary). Это бизнес-решение.
2. **Публикация репозитория на GitHub.** До этого работаем локально.
3. **Деплой на Vercel** (первичный + любой prod deploy).
4. **Покупка домена.** Сначала research → 3-5 кандидатов → одобрение.

## 5. Файлы, которые Claude Code НЕ трогает

- `.git/` — инфраструктура Тимура.
- `data/` (если появится) — личные данные / фотографии. Тимур кладёт сам.
- Любые `.env*` файлы с реальными ключами.

## 6. End-of-session

Append одну строку в `docs/learnings.md`:

```
[YYYY-MM-DD] <type> | <one-sentence-what-was-done>
```

Типы: `spec`, `research`, `draft`, `decision`, `milestone`, `docs`, `chore`, `blocker`, `note`.

## 7. AI development workflow — 5-skill chain

Для любой кодовой работы (новый компонент Astro, рефактор секции, новая интеграция) — цепочка из 5 personal-скиллов в `~/.claude/skills/`, срабатывающих автоматически:

1. **`research-before-design`** — parallel subagents собирают факты по codebase, БЕЗ мнений.
2. **`design-before-plan`** — C4 + Data Flow + Sequence + ADR с альтернативами.
3. **`phased-plan-before-code`** — декомпозиция: 1 фаза = 1 коммит + тесты + CI green.
4. **`subagent-coding-team`** — multi-role: dev + code-reviewer + security + architect-checker.
5. **`gates-before-merge`** — обязательные ворота перед commit/push: build/lint/tests/spec-compliance.

Pinned копии — [`agentic-ops-cc/library/skills/`](../../Claude/agentic-ops-cc/library/skills/). Статус: validated (`pressure_tested: status: yes`, 2026-05-24, 15/15 GREEN).
