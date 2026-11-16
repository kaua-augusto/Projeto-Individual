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
- [Roadmap](#roadmap)
- [Links](#links)
- [Author](#author)
- [Disclaimer](#disclaimer)

## About

Reaching 100% in Cyberpunk 2077 means keeping track of 57 achievements and hundreds of missions, gigs and collectibles. Edgerunning puts that progress in one place: the player records what is done, and the dashboard works out the completion percentage, what is left and a forecast of when 100% will be reached.

All progress is entered by the player. The site does not read data from Steam or any other external service.

## Features

| Feature | Description |
| --- | --- |
| Account | Sign up with name, email and password, and log in. Signing up logs the player in right away. |
| Achievements | The game's 57 achievements. The player marks the ones they have, with the unlock date, and can unmark them or change the date. |
| Hours played | Total hours typed by the player, with the date of the last update. |
| Missions | Progress counters for 8 categories: main jobs, side jobs, gigs, NCPD scanner hustles, cyberpsychos, tarot cards, vehicles and iconic weapons. |
| Overview dashboard | Completion percentage, what is left to reach 100%, hours played, a monthly timeline, a completion forecast and highlight lists. |

How the numbers are calculated:

- **Completion:** marked achievements ÷ total achievements × 100, with one decimal place.
- **Forecast:** the pace of the last 180 days, applied to the achievements still missing.
- **Rank:** Choom, Street kid, Mercenary, Elite solo and Night City Legend, by completion percentage.
- **Rarity:** Common, Uncommon, Rare, Epic and Legendary, by the share of players who own each achievement.

## Tech stack

| Layer | Technology |
| --- | --- |
| Front-end | HTML, CSS and JavaScript |
| Back-end | Node.js with Express, serving the REST API and the static pages |
| Database | MySQL 8 |
| Base | SPTech's web-data-viz template |

## Project structure

```
.
├── app.js              # Express server entry point
├── package.json
├── public/             # Static pages served by the server
│   ├── index.html      # Landing page
│   ├── login.html
│   ├── cadastro.html   # Sign-up page
│   ├── css/
│   └── js/
├── src/
│   └── routes/         # API routes
└── web-dat-aviz/       # Original template, kept for reference
```

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

3. Create a `.env.dev` file in the project root with your settings:

   ```env
   AMBIENTE_PROCESSO=desenvolvimento

   DB_HOST=
   DB_DATABASE=
   DB_USER=
   DB_PASSWORD=
   DB_PORT=

   APP_PORT=
   APP_HOST=
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Open `http://<APP_HOST>:<APP_PORT>` in the browser.

Use `npm run dev` to restart the server automatically when a file changes.

## Links

| Resource | Link |
| --- | --- |
| LinkedIn | [LinkedIn](https://www.linkedin.com/in/kaua-augusto-05186343a/) |
| Trello board | _to be added_ |
| Documentation | [Documentation](https://bandteccom-my.sharepoint.com/:w:/g/personal/kaua_aguas_sptech_school/cQrIS3I8SY_oQbUd7l5SYRrDEgUBgqj2jMcxSxF-SgTp2J-BMg) |

## Author

**Kauã** · [GitHub](https://github.com/kaua-augusto) · LinkedIn: [LinkedIn](https://www.linkedin.com/in/kaua-augusto-05186343a/)

## Disclaimer

Edgerunning is a fan project made for study and personal satisfaction purposes. It is not affiliated with or endorsed by CD PROJEKT RED. Cyberpunk 2077 and its related names are trademarks of their owners.
