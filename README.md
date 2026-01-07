# Personal Website

A modern personal website built with React and Vite, featuring three main sections:

## Features

### 🏠 Home Page
- Clean, modern design with a sidebar navigation
- Overview cards showcasing different sections
- Gradient hero section with welcoming message

### 👤 About Me Page
- Bio section to share your story
- Skills & Expertise showcase
- Social links section (GitHub, LinkedIn, Email, CV)
- Interests & Hobbies list
- Fully customizable template

### 🤿 Diving Log Manager
- **Add Dives**: Form to log dive details including:
  - Date, dive site, depth, duration
  - Water temperature and visibility
  - Notes section for observations
- **Add Dive Sites**: Form to catalog dive locations with:
  - Site name, location, maximum depth
  - GPS coordinates
  - Site description
- **View Dives**: Display all logged dives in card format
- **View Sites**: Display all dive sites with details
- Ready for API integration with placeholder fetch calls

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **CSS3** - Styling with modern gradients and animations

## Customization

### About Me Page
Edit `/src/pages/AboutMe.jsx` to update:
- Social media links (GitHub, LinkedIn, etc.)
- Bio information
- Skills list
- Interests and hobbies

### Diving API Integration
Edit `/src/pages/Diving.jsx` to connect your API:
- Update `handleDiveSubmit` function with your API endpoint
- Update `handleSiteSubmit` function with your API endpoint
- Add GET requests to fetch existing data on component mount

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx       # Navigation sidebar
│   └── Sidebar.css
├── pages/
│   ├── MainPage.jsx      # Home page
│   ├── AboutMe.jsx       # About me page
│   └── Diving.jsx        # Diving log manager
├── styles/
│   ├── MainPage.css
│   ├── AboutMe.css
│   └── Diving.css
├── App.jsx               # Main app component with routing
└── main.jsx             # Entry point
```

## License

This project is open source and available for personal use.

