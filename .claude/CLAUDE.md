# Project: Edgerunning

## Project Context

Edgerunning is a Cyberpunk 2077 fan site for tracking a player's road to 100% completion. It is an individual SPTech course project built around a personal interest: the game Cyberpunk 2077 and the cyberpunk aesthetic.

All progress data is entered by the user. There is no external data API: a former Steam Web API integration was removed on purpose. Do not add Steam or any other third-party data source unless the user asks for it.

Stack: HTML/CSS/JS front-end, Node.js + Express REST API that also serves the static files, and MySQL on a Linux VM, with passwords stored as plain text.

The database is modeled and implemented in **MySQL** (8.0 or later).

The application lives in the repository root (`app.js`, `src/`, `public/`), built on SPTech's legacy web-data-viz template. Run it with `npm install` and `npm start` in the root. The original template is kept for reference in `web-dat-aviz/web-data-viz-main/`.

- Do not change or create APIs (`src/`, `app.js`) without asking the user first.
- Ask before changing or deleting existing front-end pages and scripts.
- There are no automated tests or lint setup yet.

## Features

- **Account:** sign up (name, email, password) and log in. Sign-up logs the user in right away.
- **Achievements:** the game's 57 achievements. The user marks the ones they have, with the date they got each one, and can unmark them or change the date.
- **Hours played:** the user types their total hours; the date of the last update is stored.
- **Missions:** progress counters for 8 categories (main jobs, side jobs, gigs, NCPD scanner hustles, cyberpsychos, tarot cards, vehicles, iconic weapons), saved automatically.
- **Overview dashboard:** completion percentage, what is left to reach 100%, hours played, a monthly timeline, a completion forecast and highlight lists (easiest missing, most recent, rarest owned).

## Business Rules

- Completion % = marked achievements ÷ total achievements × 100, with one decimal place. Remaining % = 100 − completion %.
- Timeline: achievements accumulated per month, by the date the user recorded.
- Forecast: achievements marked in the last 180 days give a daily pace; missing achievements ÷ pace = days left. No forecast when nothing was marked in that period.
- Hours per achievement = hours played ÷ marked achievements.
- Rank by completion: Choom < 25%, Street kid < 50%, Mercenary < 75%, Elite solo < 100%, Night City Legend at 100%.
- Rarity by the reference global percentage stored per achievement: Legendary < 5, Epic < 10, Rare < 20, Uncommon < 50, otherwise Common.
- An achievement with an empty description is secret; the UI shows a placeholder instead of the description.
- A missing or future unlock date is saved as today. Mission counters are clamped between 0 and the category total.
- Missions overall % = average of the category percentages, so every category weighs the same.
- Category totals in the seed are placeholder values until checked against the game.

## Data and API Conventions

- Tables: `usuario`, `conquista`, `conquistaUsuario` (user × achievement, with unlock date), `categoria`, `progresso` (user × category counter).- Primary keys are `idTable`, foreign keys `fkTable`, constraints `fk<ChildTable><Reference>`. No `TINYINT`.
- Seed inserts must stay idempotent (`INSERT IGNORE` + `UNIQUE(nome)`), so running the script again never duplicates rows. `src/database/corrigir-duplicadas.sql` repairs databases created before that.
- Every query is parameterized with `?` through `database.executar(sql, [values])`. Never concatenate user input into SQL.
- Request body fields use the `Server` suffix (`emailServer`), as in the web-data-viz template.
- Errors reply with `res.status(4xx).send(message)` or `res.status(500).json(erro.sqlMessage)`.
- User-provided text is escaped before being inserted into HTML.

## Session and Navigation

- Login stores the user id, name and email in `sessionStorage`.
- A dashboard page opened without a session redirects to the login page and, after login, returns to the page that was requested.
- Login and sign-up pages redirect to the dashboard when a session already exists.
- Logging out clears the session and returns to the login page. Unknown server URLs redirect to the home page.

## Languages

The project is written in HTML, CSS and JavaScript (Node.js on the server), with SQL for MySQL. Do not introduce another language unless that has been decided first.

## Commits

Do not commit on your own. Commit only when the user asks, using the `commit` skill. Commit messages start with a type and no scope in parentheses (`feat: add achievement date editing`).

## Language convention

- Code, identifiers, comments, commit messages, documentation: **English**.
- UI copy (labels, buttons, messages shown to the user) and mock/fixture
  *content* (achievement names, category names, user names, etc.): **Portuguese**,
  since the product is for Portuguese speakers.

---

# Rules

* Follow existing project patterns before introducing new ones.
* Reuse existing services, components, utilities and abstractions whenever possible.
* Prefer modifying existing code over creating new files.
* Keep changes as small as possible.
* Document modifications according to the docs, if needed.
* Do not refactor unrelated code.
* Do not introduce new dependencies without clear justification.
* Do not create abstractions for a single use case.
* Do not leave TODO comments.
* Do not leave commented code.

---

# File Creation Policy

Before creating a new file:

1. Search for an existing implementation.
2. Search for a similar component.
3. Verify that extending existing code is not possible.

Create new files only when there is no reasonable alternative.

---

# API Rules

* Never break existing public contracts.
* Maintain backward compatibility.
* Reuse existing DTO patterns.
* Follow existing validation conventions.
* When a route changes, update its route, controller and model together.

---

# Simplicity Rules

The user prefers simple code that is easy to understand over clever or compact code. Keep cognitive complexity low.

* Write the most direct solution that works: plain loops and `if`s over chains of `reduce`, nested callbacks or clever one-liners.
* Keep nesting shallow: return early instead of nesting `if`s, and avoid deeply nested callbacks.
* Keep functions small and doing one thing. Split a function when it does more than one job, but do not split it into helpers used only once just to make it shorter.
* Avoid generic helpers and configuration objects for things that happen once or twice; repeating a few clear lines is better than a hard-to-follow abstraction.
* A reader should understand a function without jumping to several other places in the code.

---

# Clean Code Documentation Rules

Follow Clean Code (Robert C. Martin) for naming and documentation.

* Names reveal intent: functions are verbs that say what they do (`loadAchievements`, `renderTimeline`), variables and constants are nouns that say what they hold (`achievements`, `MIN_PASSWORD_LENGTH`). No abbreviations or one-letter names, except loop indexes.
* Code explains *what*; comments explain *why*. Do not write comments that repeat the code, and prefer a better name over a comment.
* Every function shared across files (for example in `shared/`) and every non-obvious function gets a short doc comment above it: one sentence on what it does, plus `@param` and `@returns` when they are not obvious from the names.
* Use named constants instead of magic numbers and strings.
* Keep related code together, in reading order: constants first, then functions from the highest level to the lowest, then the code that starts the page.

---

# CSS Rules

* Keep CSS well structured: tokens and base styles in `shared/style.css`, feature styles in the feature's folder. Inside a file, group rules by section in page order, with media queries at the end.
* Avoid unnecessary repetition: use the `:root` variables for colors and fonts, and reuse shared classes (`.btn`, `.card`, `.section-title`, `.message`…) before creating new ones. Do not redeclare values that are inherited or already set by a shared rule.
* Keep it as simple as possible: short, low-specificity selectors, only the declarations that change something, and no `!important`.
* Lay out with flexbox (`display: flex`), not CSS grid, including multi-column sections.

---

# Testing Rules

When modifying code:

* Update existing tests if necessary.
* Add tests for new behavior.
* Ensure all tests pass before considering the task complete.

---

# Documentation Rules

* Never forget to update the documentation, when necessary.
* If no relevant documentation exists, create it.
* Keep documentation synchronized with the current implementation.
* Documentation is considered part of the deliverable.

---

# Code Review Checklist

Before finishing any task verify:

* Project builds successfully.
* Tests pass.
* Lint passes.
* No unused imports.
* No dead code.
* No commented code.
* No debugging statements.
* No duplicated logic introduced.
* Folders are separated by feature.

---

# Forbidden Actions

* Never rewrite large sections of code without request.
* Never rename files solely for preference.
* Never change architecture without request.
* Never introduce new frameworks.
* Never modify environment configuration without request.
* Never modify CI/CD pipelines without request.
