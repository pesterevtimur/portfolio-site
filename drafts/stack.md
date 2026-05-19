# Stack — draft

> Source: SPEC.md §5 секция «Стек»
> Status: draft
> Acceptance:
> - [ ] Сгруппировано по типу инструмента
> - [ ] Без рейтингов / звёзд / «эксперт»
> - [ ] Только реально используется
> - [ ] Adversarial review пройден (Task 23)

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
- Skills + MCP servers — как контракты работы

### Код и данные
- Python — детерминистские пайплайны и интеграции
- SQLite / Postgres — где нужна персистентность
- Markdown в git — для wiki и спецификаций

### Инфраструктура
- GitHub — версионирование артефактов
- Vercel — статический хостинг
- Telegram Bot API — для сборщиков и нотификаций

### Сейчас изучаю / собираю
- Pressure-testing skills через `skill-creator`
- LLM Wiki паттерн (эссе Карпатого)

---

## Acceptance log
- 2026-05-19: draft v1 written
