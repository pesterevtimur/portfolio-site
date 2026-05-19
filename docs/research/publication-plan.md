# Publication plan — MVP vs v2

> Цель: зафиксировать что входит в первую публичную версию сайта, что откладывается, что не делаем точно. Источники: SPEC §15 acceptance criteria, SPEC §16 out of scope.

## MVP (сейчас)

- 9 секций в proof-first порядке (SPEC §5: Hero · Cases · Principles · CompetencyMap · Stack · About · Fit · Growth · Contacts)
- 3 кейса с реальной фактурой (SPEC §9): leadecho-leadgen, outstaff-matcher, super-agentic-ops
- Mood A (SPEC §6, D-004): dark gradient + grid + mono
- Только русский язык
- Аналитика — Vercel Analytics (D-002 + analytics research)
- SEO meta + OG + sitemap + robots
- Lighthouse Performance ≥ 95 на staging
- Mobile-вёрстка обязательна
- Manual deploy после approve Тимура
- Адверсарный review (Codex CLI) на 7 значимых артефактах (SPEC §13)

## V2 (после MVP, по запросу аудитории)

### Возможные дополнения
- Английская версия сайта (после явного спроса от международных клиентов)
- Light theme toggle
- Подробные case-страницы (раскрытие в modal или /cases/<slug>)
- Блог-секция (если будет 3+ написанных постов)
- Notes / changelog feed
- Calendly или аналог (только если будет много входящих и неудобно отвечать в TG руками)
- Подключение Habr / vc.ru как канал размещения ссылок (требует контента)
- Дашборд внутренних метрик для самого Тимура

### Триггеры для v2
- 5+ входящих в месяц через сайт → возможен Calendly
- 2+ международных контакта → возможен EN
- 3+ написанных Habr-статей → возможна блог-секция

## Что НЕ делаем — никогда в этой версии (SPEC §16)

- CMS / админка
- Лидген-форма с capture email
- Любые pop-up / chat-bot
- Кнопка «Скачать резюме PDF» (сайт = резюме)
- Bootstrap / Material UI / другие UI-фреймворки
- Сложные scroll-анимации, parallax, hover-эффекты на каждом элементе
- Иллюстрации AI-роботов / стоковые фото программистов / AI-арт
- Цитаты несуществующих клиентов
- Google Analytics
- Любая монетизация (банеры, партнёрские ссылки)
