# ReactFrontEnd (Personal Website + Diving Log)

A modern React + Vite front end that serves as a personal website with multiple pages (Home, About) and a diving log feature area. Designed to be easy to customize and ready to connect to an API.

## Features

- **Home page** with navigation and overview content
- **About Me page** driven by editable data
- **Diving** section/pages (UI + API utilities) to support logging dives / viewing dive-related info
- Basic **API client utilities** for backend integration
- Optional **Docker + Nginx** setup for containerized builds/serving

## Tech Stack

- **React** (SPA UI)
- **Vite** (dev server + build tooling)
- **React Router** (routing)
- **CSS** (project styles under `src/styles/`)

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm (this repo includes a `package-lock.json`)

### Install
```bash
npm install
```

### Run locally (development)
```bash
npm run dev
```

### Build (production)
```bash
npm run build
```

### Preview the production build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## Configuration / API

- API-related configuration lives in:
  - `src/config/api.js`
  - `src/utils/api/*`
- See [`API_INTEGRATION.md`](./API_INTEGRATION.md) for notes on wiring the frontend to a backend.

## Customization

### Personal content
- Update About content/data in:
  - `src/data/aboutMe.js`
- Page layout/components:
  - `src/pages/AboutMe.jsx`

### Diving pages
- Pages:
  - `src/pages/Diving.jsx`
  - `src/pages/DiveLog.jsx`
- Data/config:
  - `src/data/diving.js`
  - `src/utils/api/diving.js`

## Project Structure

```text
.
├── public/
│   └── vite.svg
├── src/
│   ├── assets/                # Static assets imported by the app
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   └── Sidebar.css
│   ├── config/
│   │   └── api.js              # API base/config helpers
│   ├── data/
│   │   ├── aboutMe.js          # Data backing the About page
│   │   └── diving.js           # Data/constants for diving UI
│   ├── pages/
│   │   ├── MainPage.jsx        # Home page
│   │   ├── AboutMe.jsx         # About page
│   │   ├── Diving.jsx          # Diving landing/feature page
│   │   └── DiveLog.jsx         # Dive log UI
│   ├── styles/
│   │   ├── MainPage.css
│   │   ├── AboutMe.css
│   │   ├── Diving.css
│   │   └── DivingInfo.css
│   ├── utils/
│   │   └── api/                # API client + endpoint helpers
│   │       ├── client.js
│   │       ├── auth.js
│   │       ├── diving.js
│   │       └── index.js
│   ├── App.jsx                 # Routes + app composition
│   ├── App.css
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── Dockerfile                  # Container build (optional)
├── nginx.conf                  # Nginx config for serving build (optional)
├── docker-compose.dev.yml      # Dev compose (optional)
├── docker-compose.frontend.yml # Frontend compose (optional)
├── vite.config.js
├── eslint.config.js
├── index.html
├── API_INTEGRATION.md
└── package.json
```

## Docker (optional)

If you’re using the included Docker/Nginx setup, check:
- `Dockerfile`
- `nginx.conf`
- `docker-compose.frontend.yml` / `docker-compose.dev.yml`

Exact commands may vary depending on your intended workflow.

## License

This project is open source and available for personal use.
