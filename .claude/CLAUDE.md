# Project: Edgerunning

## Project Context

Edgerunning is a Cyberpunk 2077 fan site for tracking a player's road to 100% completion. It is an individual SPTech course project built around a personal interest: the game Cyberpunk 2077 and the cyberpunk aesthetic.

All progress data is entered by the user. There is no external data API: a former Steam Web API integration was removed on purpose. Do not add Steam or any other third-party data source unless the user asks for it.

Stack: HTML/CSS/JS front-end, Node.js + Express REST API that also serves the static files, and MySQL on a Linux VM, with passwords stored as plain text.

The database is modeled and implemented in **MySQL** (8.0 or later).

The application lives in the repository root (`app.js`, `src/`, `public/`), built on SPTech's legacy web-data-viz template. Run it with `npm install` and `npm start` in the root. The original template is kept for reference in `web-dat-aviz/web-data-viz-main/`.

Code style and organization follow the user's group project Blue Cheese (temperature and humidity monitoring of cheese maturation chambers, also built on web-data-viz): front-end, routes, controllers, models and the SQL script. Compare with it before writing new code; where it differs from the rules in this file (SQL concatenation, `let`), these rules win.

- Do not change or create APIs (`src/`, `app.js`) without asking the user first.
- Ask before changing or deleting existing front-end pages and scripts.
- There are no automated tests or lint setup yet.

## Features

- **Account:** sign up (name, email, password) and log in. Sign-up logs the user in right away.
- **Achievements:** the game's 57 achievements, each with its official icon. The user marks the ones they have, with the date they got each one, and can unmark them or change the date.
- **Hours played:** the user types their total hours; the date of the last update is stored.
- **Missions:** progress counters for 8 categories (main jobs, side jobs, gigs, NCPD scanner hustles, cyberpsychos, tarot cards, vehicles, iconic weapons), saved automatically.
- **Overview dashboard:** completion percentage, achievements unlocked, what is left to reach 100% and hours played in the first row; the monthly timeline and the progress of the 8 mission categories in the second; highlight lists (easiest missing, most recent, rarest owned) in the third.
- **Universe:** a public reading page (story, cyberpunk aesthetic, Night City), one dark card per section, lit by a purple gradient, with a large image and three thumbnails that swap it. Official art and screenshots of the game are allowed: they are local files in `public/assets/imagens - referencias/`, each with a descriptive `alt`. Below each large image, a "Por que isso me interessa" `<details>` opens a short personal text, written in `universo.html`; closed, it takes no height, so the section keeps its size.
- **Thanks:** a public, static page (`agradecimentos.html`) that shows each person who helped the author as a Cyberpunk 2077 "build" card in a dark wine panel with red borders. The people are a `pessoas` array in `public/js/agradecimentos.js`, and their photos are in `public/assets/img/agradecimentos/`. Arrows, arrow keys and dots switch person in a loop. No game art: icons are Unicode or emoji.

## Business Rules

- Completion % = marked achievements ÷ total achievements × 100, with one decimal place. Remaining % = 100 − completion %.
- Timeline: achievements accumulated per month, by the date the user recorded, grouped by the `yyyy-mm` text of the date (never through `new Date()`, so the timezone cannot move a date to another month). It starts at 0 in the month before the first achievement and runs to the current month; months with no achievement count as 0. The Y axis goes from 0 to the total of achievements.
- Hours per achievement = hours played ÷ marked achievements, shown in the hours card.
- Rank by completion: Choom < 25%, Street kid < 50%, Mercenary < 75%, Elite solo < 100%, Night City Legend at 100%.
- Rarity by the reference global percentage stored per achievement: Legendary < 5, Epic < 10, Rare < 20, Uncommon < 50, otherwise Common.
- An achievement with an empty description is secret; the UI shows a placeholder instead of the description.
- Achievement icons are local files in `public/assets/img/conquistas/`, named in the `imagem` column. A locked icon is shown in grayscale; a secret achievement that is still locked shows `?` instead of the icon, to avoid spoilers; an icon that fails to load falls back to the initials of the name.
- Dashboard colors have a fixed meaning: yellow = main or completed, green = information, magenta = what is missing or an alert.
- A missing or future unlock date is saved as today. Mission counters are clamped between 0 and the category total.
- Missions overall % = average of the category percentages, so every category weighs the same.
- Category totals in the seed are the game's totals for the base game plus Phantom Liberty, counting every mission that exists (alternative endings and branches included): main jobs 63, side jobs 104, gigs 81, NCPD scanner hustles 156, cyberpsychos 17, tarot cards 26, vehicles 88 (every ownable car and bike, bought or rewarded), iconic weapons 113. Running the script again updates the totals and lowers saved counters that are above the new total.

## Data and API Conventions

- Tables: `usuario`, `tempoJogo` (1:1 with user: hours played and last update, primary key `fkUsuario`), `conquista`, `conquistaUsuario` (user × achievement, with unlock date), `categoria`, `progresso` (user × category counter).
- Views: `vwConquistaUsuario` (every achievement for every user, with the unlock date as `yyyy-mm-dd` text), `vwProgressoUsuario` (every category for every user, 0 where nothing was recorded) and `vwPerfilUsuario` (every user with hours and last update, `null` until saved). A SELECT that joins tables reads from a view created in `src/database/script-tabelas.sql`; a SELECT on a single table is written in the model, one clause per line.
- `script-tabelas.sql` follows the Blue Cheese modeling file: lowercase keywords, columns at the margin and constraints indented with a tab, primary keys `idTable`, foreign keys `fkTable`, constraints `fk<ChildTable>_<reference>` and `chk<Column>`. No `TINYINT`. It starts with `set names utf8mb4` so the Windows `mysql` client does not garble accents.
- The script must stay safe to run again: `create ... if not exists`, `insert ignore` over `unique(nome)`, `on duplicate key update` when existing rows need a new column filled, and a guarded `alter table` (checked against `information_schema`) for columns added after the first version.
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

- Code identifiers and ids (JS, CSS, HTML, SQL): **Portuguese**, as in web-data-viz and Blue Cheese. CSS class names and `:root` tokens keep their existing names.
- Commit messages and documentation (`README.md`, this file): **English**.
- UI copy (labels, buttons, messages shown to the user) and seed
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

* Names reveal intent: functions are verbs that say what they do (`listarConquistas`, `atualizarLinhaTempo`), variables and constants are nouns that say what they hold (`conquistas`, `TAMANHO_MINIMO_SENHA`). No abbreviations or one-letter names, except loop indexes.
* No comments in the code: no comment lines and no end-of-line comments in JS, CSS, HTML, SQL or `.env.dev.exemplo`, not even section banners. Names must say what the code does; explanations go in the reply to the user or in `README.md`.
* Use named constants instead of magic numbers and strings.
* Keep related code together, in reading order: constants first, then functions from the highest level to the lowest, then the code that starts the page.

---

# Front-End Code Style

Always write the front-end in the Blue Cheese style.

* Pages sit directly in `public/` (`index.html`, `login.html`, `cadastro.html`, `dashboard.html`, `conquistas.html`, `missoes.html`, `universo.html`, `agradecimentos.html`) and link `./style.css`.
* HTML: `<!DOCTYPE html>` and 2-space indentation. Public pages use `header`, `nav`, `main`, `section` and `footer`; dashboard pages use the Blue Cheese shell: `body.dashboard-page` > `div.dashboard-sidebar` (`sidebar-brand`, `sidebar-nav`, `sidebar-account`) + `div.dashboard` (`img.dashboard-background`, a photo fixed to the screen behind the content and beside the sidebar; `dashboard-header`, `dashboard-cards` of `dashboard-card`, `dashboard-grid` of `dashboard-panel` with `dashboard-panel-header` and `dashboard-chart-container`).
* Ids are Portuguese, with a prefix for the element type (`span_horas`, `input_email`, `btn_entrar`, `div_alerta`, `ul_recentes`, `tbody_linha_tempo`); chart canvases are camelCase (`graficoLinhaTempo`). Scripts use the ids directly as variables (`span_horas.textContent`) and `document.getElementById` only for ids built at runtime (`'input_qtd_' + id`).
* The current menu link gets `class="active"`. Every form field has a `<label for>`.
* Events are inline attributes: `onclick="limparSessao()"`, `onsubmit="return entrar()"` (the function returns `false`), `onchange`, `oninput`, `onerror`. `addEventListener` only for `window`/`document` events.
* Scripts load at the end of `<body>`, without `defer`, in this order: `sessao.js`, `painel.js` (dashboard pages), the page's own `js/<page>.js`. Chart.js comes from the CDN in `<head>`.
* JavaScript: `var` and `function`, single quotes, 2-space indentation, Portuguese names (`validarSessao`, `chamarApi`, `mostrarMensagem`), and a block at the end of the file that calls the page's loader.
* Charts are created once with `new Chart(canvas, {...})`; when the data changes the script replaces `chart.data` and calls `chart.update()`.
* Message text lives in the HTML, so a sentence can be changed without touching the JS: each value inside a sentence is a `<span id>` that the JS fills (`Média das <span id="span_qtd_categorias"></span> categorias: <span id="span_media_missoes"></span>%`), and each alternative message (empty state, singular/plural ending, "ainda não informado") is its own element that the JS shows or hides with `hidden`. Only text repeated per item of a list (cards, rows, chart tooltips) stays in the JS template.
* API request fields (`emailServer`), `sessionStorage` keys (`ID_USUARIO`) and file names (`cadastro.html`, `sessao.js`) keep their names.

---

# CSS Rules

* One stylesheet for the whole site, `public/style.css`, as in Blue Cheese. A rule shared by several pages is written once; never duplicate a rule, and delete rules that no page uses any more.
* Order: `:root` tokens, `*` reset, element base styles, then the rules grouped by component or page, with no banner comments (public header, buttons, background photos, landing page, login and sign-up, footer, dashboard sidebar, dashboard cards and charts, achievements, missions, thanks), and the single media query (`max-width: 800px`) at the end. 2-space indentation and a blank line between rules.
* Use the `:root` variables for colors and fonts (`--base`, `--surface`, `--muted`, `--yellow`, `--cut-corners`…), and reuse existing classes (`.button`, `.section-label`, `.field`, plain `<p>` for muted text…) before creating new ones. Do not redeclare values that are inherited.
* Keep it as simple as possible: short, low-specificity selectors, only the declarations that change something, and no `!important`.
* Lay out pages and multi-column sections with CSS Grid; use flexbox inside components. Under 800px every grid becomes one column.
* Cyberpunk identity: dark background, cut corners (`clip-path: var(--cut-corners)`) on dashboard cards and panels, RGB-split shadow (glitch) on titles only, never on numbers.

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
