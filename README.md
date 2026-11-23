# Edgerunning

> A Cyberpunk 2077 completion tracker: record your achievements, missions and hours played, and see how far you are from 100%.

Edgerunning is an individual project developed in the Systems Analysis and Development course at SPTech (São Paulo Tech School). It applies the semester's content, from front-end and API to database, to a personal interest: the game Cyberpunk 2077 and the cyberpunk aesthetic.

**Status:** in development.

## Table of contents

- [About](#about)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Pages](#pages)
- [API routes](#api-routes)
- [Database](#database)
- [Roadmap](#roadmap)
- [Links](#links)
- [Author](#author)
- [Disclaimer](#disclaimer)

## About

Reaching 100% in Cyberpunk 2077 means keeping track of 57 achievements and hundreds of missions, gigs and collectibles. Edgerunning puts that progress in one place: the player records what is done, and the dashboard works out the completion percentage, what is left and how the progress grew month by month.

All progress is entered by the player. The site does not read data from Steam or any other external service.

## Features

| Feature | Description |
| --- | --- |
| Account | Sign up with name, email and password, and log in. Signing up logs the player in right away. |
| Achievements | The game's 57 achievements, with their official icons. The player marks the ones they have, with the unlock date, and can unmark them or change the date. |
| Hours played | Total hours typed by the player, with the date of the last update. |
| Missions | Progress counters for 8 categories: main jobs, side jobs, gigs, NCPD scanner hustles, cyberpsychos, tarot cards, vehicles and iconic weapons. |
| Overview dashboard | Completion percentage, achievements unlocked, what is left to reach 100% and hours played; a monthly timeline and the progress of each mission category; the easiest missing, most recent and rarest achievements. |
| Universe | A public reading page about the game's story, the cyberpunk aesthetic and Night City, open with or without a session. |

How the numbers are calculated:

- **Completion:** marked achievements ÷ total achievements × 100, with one decimal place.
- **Timeline:** achievements accumulated per month by the date the player recorded, from the month before the first one up to the current month. Months with no achievement count as 0.
- **Missions:** the average of the 8 category percentages, so every category weighs the same.
- **Hours per achievement:** hours played ÷ marked achievements.
- **Rank:** Choom, Street kid, Mercenary, Elite solo and Night City Legend, by completion percentage.
- **Rarity:** Common, Uncommon, Rare, Epic and Legendary, by the share of players who own each achievement.

## Tech stack

| Layer | Technology |
| --- | --- |
| Front-end | HTML, CSS and JavaScript, with Chart.js (from a CDN) for the charts |
| Back-end | Node.js with Express, serving the REST API and the static pages |
| Database | MySQL 8 |
| Base | SPTech's web-data-viz template, organized like the Blue Cheese group project |

## Project structure

```
.
├── app.js                  # Express server entry point
├── package.json
├── .env.dev.exemplo        # Example settings, copied to .env.dev
├── public/                 # Static pages served by the server
│   ├── index.html          # Landing page
│   ├── login.html
│   ├── cadastro.html       # Sign-up page
│   ├── dashboard.html      # Overview
│   ├── conquistas.html     # Achievements
│   ├── missoes.html        # Missions
│   ├── universo.html       # Story, aesthetic and Night City
│   ├── style.css           # The site's only stylesheet
│   ├── assets/
│   │   ├── Logo/           # Logo and favicons
│   │   ├── index/          # Landing page photo
│   │   ├── imagens - referencias/  # Background photos and Universe page images
│   │   └── img/conquistas/ # The 57 achievement icons
│   └── js/                 # One script per page, plus the shared ones below
│       ├── sessao.js       # Session, API calls, messages and formatting, used by every page
│       ├── painel.js       # Rules and loading states shared by the dashboard pages
│       └── dados-mock.js   # Fake API answers for demo mode
├── src/
│   ├── routes/             # API routes
│   ├── controllers/        # Request validation and responses
│   ├── models/             # SQL queries
│   └── database/
│       ├── config.js       # MySQL connection
│       ├── script-tabelas.sql  # Tables, seed data and views
│       └── modelagem-fisica-edgerunning.mwb  # Physical model (MySQL Workbench)
└── web-dat-aviz/           # Original template, kept for reference
```

Each layer has one job: a **route** maps a URL to a **controller** function, the controller validates the request body and builds the response, and the **model** runs a parameterized SQL query through `database.executar(sql, [values])`. Queries that join tables read from a view defined in `script-tabelas.sql`.

The code is organized and written like the Blue Cheese group project, also built on web-data-viz: pages directly in `public/` with a single `style.css`, a side menu on the dashboard pages, `var` and `function`, Portuguese names, ids prefixed by element type (`span_horas`, `input_email`) and inline `onclick`/`onsubmit` handlers.

## Getting started

### Requirements

- Node.js 18 or later
- MySQL 8 or later

### Setup

1. Clone the repository and enter the folder:

   ```bash
   git clone https://github.com/kaua-augusto/Projeto-Individual.git
   cd Projeto-Individual
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create the database by running `src/database/script-tabelas.sql` in MySQL, for example in MySQL Workbench or with:

   ```bash
   mysql -u root -p < src/database/script-tabelas.sql
   ```

   The script creates the `edgerunning` database, its tables, the 57 achievements with their icons, the 8 mission categories and the views the API reads from. It can be run again at any time, also on a database created by an older version: it uses `create ... if not exists`, `insert ignore` and `on duplicate key update` over unique names, adds missing columns only when they do not exist, and keeps every player's progress.

4. Copy `.env.dev.exemplo` to `.env.dev` in the project root and fill in your MySQL settings:

   ```env
   AMBIENTE_PROCESSO=desenvolvimento

   DB_HOST=
   DB_DATABASE=edgerunning
   DB_USER=
   DB_PASSWORD=
   DB_PORT=

   APP_PORT=
   APP_HOST=
   ```

5. Start the server:

   ```bash
   npm start
   ```

6. Open `http://<APP_HOST>:<APP_PORT>` in the browser.

Use `npm run dev` to restart the server automatically when a file changes.

### Demo mode

To see the pages without the server or the database, set `var MODO_DEMO = true;` in `public/js/sessao.js` and open the pages from any static server. API calls are then answered by `public/js/dados-mock.js` and saved in `sessionStorage`. Log in with **v@nightcity.net / samurai** to see a sample account with data, or sign up to start from zero. Set it back to `false` before running with the real server.

## Pages

| Page | What it does |
| --- | --- |
| `index.html` | Landing page |
| `cadastro.html` | Sign up with name, email and password; logs in right away |
| `login.html` | Log in and go to the dashboard |
| `dashboard.html` | Completion %, unlocked, what is left, editable hours, monthly timeline, mission categories and highlight lists |
| `conquistas.html` | The 57 achievements with their icons: mark, unmark and change the unlock date; filter, search and sort |
| `missoes.html` | − / + counters per category, saved automatically |
| `universo.html` | Public page with three sections (story, the cyberpunk aesthetic, Night City); each has three thumbnails that swap the large image, and fades in when scrolled into view; an animated arrow below the first two links to the next section |

Navigation rules:

| Situation | What happens |
| --- | --- |
| A dashboard page is opened without a session | Goes to `login.html?motivo=sessao` and, after login, back to the page that was requested |
| Login or sign-up is opened with a session | Goes straight to the dashboard |
| Log out | Clears the session and goes to `login.html?motivo=saiu` |
| "ver todas" links on the overview | Open Achievements already filtered (`?filtro=faltando`, `?filtro=feitas&ordem=raras`…) |
| A server URL that does not exist | Pages redirect to the landing page; API calls get a JSON 404 |

## API routes

Request body fields use the `Server` suffix, as in the web-data-viz template.

| Method | Route | Body | Response |
| --- | --- | --- | --- |
| POST | `/usuarios/cadastrar` | `nomeServer`, `emailServer`, `senhaServer` | `{ id, nome, email }`; 409 if the email is taken |
| POST | `/usuarios/autenticar` | `emailServer`, `senhaServer` | `{ id, nome, email }`; 403 if invalid |
| GET | `/usuarios/perfil/:idUsuario` | — | `{ nome, horasJogadas, dtHoras }` |
| PUT | `/usuarios/horas` | `idUsuarioServer`, `horasServer` | `{ horasJogadas, dtHoras }` |
| GET | `/conquistas/listar/:idUsuario` | — | `[{ idConquista, nome, descricao, oculta, desbloqueada, desbloqueadaEm, dtDesbloqueio, global, imagem }]`; `dtDesbloqueio` is `yyyy-mm-dd` or `null`, `imagem` is the icon file name |
| POST | `/conquistas/marcar` | `idUsuarioServer`, `idConquistaServer`, `desbloqueadaServer` (true/false), `dataServer` (yyyy-mm-dd, optional) | `{ idConquista, desbloqueada, data }` |
| GET | `/progresso/categorias/:idUsuario` | — | `[{ idCategoria, nome, descricao, total, concluidas }]` |
| PUT | `/progresso/atualizar` | `idUsuarioServer`, `idCategoriaServer`, `concluidasServer` | `{ idCategoria, concluidas }` |

A missing or future unlock date is saved as today, and mission counters above the category total are saved as the total.

## Database

Defined in `src/database/script-tabelas.sql` (MySQL 8):

| Table | Content |
| --- | --- |
| `usuario` | Account (name, unique email, password) |
| `tempoJogo` | Each user's `horasJogadas` and `dtHoras`, the date hours were last updated; its primary key is `fkUsuario`, so a user has at most one row (1:1) |
| `conquista` | The game's 57 achievements, with description, reference global rarity and icon file name (`imagem`) |
| `conquistaUsuario` | Which achievements each user marked, and the unlock date |
| `categoria` | The 8 mission categories and their totals (example values, to be checked against the game) |
| `progresso` | Each user's counter per category |

| View | Content | Used by |
| --- | --- | --- |
| `vwConquistaUsuario` | Every achievement for every user, with the unlock date as `yyyy-mm-dd` text (`null` while locked) | `GET /conquistas/listar/:idUsuario` |
| `vwProgressoUsuario` | Every category for every user, with 0 where nothing was recorded | `GET /progresso/categorias/:idUsuario` |
| `vwPerfilUsuario` | Every user's name with their hours and last update (`null` until hours are saved) | `GET /usuarios/perfil/:idUsuario` |

Relationships: `usuario`–`tempoJogo` is 1:1; `usuario`–`conquista` (through `conquistaUsuario`) and `usuario`–`categoria` (through `progresso`) are N:N, each split into two 1:N relationships. The physical model is `src/database/modelagem-fisica-edgerunning.mwb`, made in MySQL Workbench from the script.

Passwords are stored as plain text, as in the course template. Every query uses `?` parameters, so user input is never concatenated into SQL.

## Roadmap

Planned work, tracked on the [Trello board](https://trello.com/b/2Ld9keMx/edgerunning):

- A forecast of when the player reaches 100%, calculated from the monthly timeline and shown on the dashboard.
- The 8 mission category totals checked against the game, replacing the example values in the seed.
- MySQL running on a Linux VM, with the API connected to it.

## Links

| Resource | Link |
| --- | --- |
| LinkedIn | [LinkedIn](https://www.linkedin.com/in/kaua-augusto-05186343a/) |
| Trello board | [Trello](https://trello.com/b/2Ld9keMx/edgerunning) |
| Documentation | [Documentation](https://bandteccom-my.sharepoint.com/:w:/g/personal/kaua_aguas_sptech_school/cQrIS3I8SY_oQbUd7l5SYRrDEgUBgqj2jMcxSxF-SgTp2J-BMg) |

## Author

**Kauã** · [GitHub](https://github.com/kaua-augusto) · LinkedIn: [LinkedIn](https://www.linkedin.com/in/kaua-augusto-05186343a/)

## Disclaimer

Edgerunning is a fan project made for study and personal satisfaction purposes. It is not affiliated with or endorsed by CD PROJEKT RED. Cyberpunk 2077 and its related names are trademarks of their owners. The achievement icons in `public/assets/img/conquistas/` are the game's official artwork, downloaded once from the game's public Steam achievements page and served from the project's own files. The images on the Universe page, in `public/assets/imagens - referencias/`, are official art and screenshots of the game, also served from the project's own files.
