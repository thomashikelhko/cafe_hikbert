# Café Hikbert – Full-Stack Website

A modern, full-stack website for **Café Hikbert** – a café serving handmade cakes, Kaiserschmarrn, and seasonal specialties.

## Features

- **Hero section** – large full-screen banner with call-to-action buttons
- **About** – café story with an image placeholder
- **Menu card** – tabbed menu for Cakes & Pastries, Hot Dishes (incl. Kaiserschmarrn), and Drinks
- **Photo gallery** – responsive mosaic grid with image placeholders
- **Opening hours** – weekly schedule with address/map placeholder
- **Events** – upcoming events cards with placeholders
- **Reservation system** – full booking form with Express.js backend (saves reservations to `data/reservations.json`)
- **Footer** – navigation, social links, and opening hours summary

## Tech Stack

| Layer    | Technology                 |
|----------|----------------------------|
| Frontend | HTML5, CSS3, Vanilla JS    |
| Backend  | Node.js + Express          |
| Storage  | JSON file (upgradeable to a database) |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in browser
open http://localhost:3000
```

## Customisation Guide

All placeholder locations are marked with `<!-- PLACEHOLDER: … -->` comments in the HTML and `/* PLACEHOLDER … */` comments in CSS.

### Adding Your Own Photos

1. Add your images to `public/images/`
2. In `public/index.html`, replace each `<div class="placeholder-img …">` block with:
   ```html
   <img src="images/your-photo.jpg" alt="Description of photo" loading="lazy" />
   ```
3. **Hero image**: in `public/css/styles.css`, find the `.hero` rule and replace the `background` gradient with:
   ```css
   background-image: url('../images/your-hero-photo.jpg');
   background-size: cover;
   background-position: center;
   ```

### Updating the Menu

Open `public/index.html` and find the `<!-- CAKES & PASTRIES -->`, `<!-- HOT DISHES -->`, and `<!-- DRINKS -->` sections. Each menu item follows this pattern:

```html
<div class="menu__item">
  <img src="images/your-dish.jpg" alt="Dish name" />
  <div class="menu__item-info">
    <div class="menu__item-header">
      <h3>Dish Name</h3>
      <span class="menu__price">€X.XX</span>
    </div>
    <p>Short description of the dish.</p>
  </div>
</div>
```

### Adding Events

In `public/index.html`, find `<!-- PLACEHOLDER: Add more event cards … -->` and copy an existing `<article class="event-card">` block. Update the date, title, time, and description.

### Opening Hours

In `public/index.html`, find the `<table class="hours__table">` and update the times to match your actual hours. Also update the footer hours at the bottom of the page.

### Contact & Address

Search for `<!-- PLACEHOLDER: Your` in `public/index.html` to find all contact information placeholders (phone, email, address, social links, Google Maps embed).

### Reservations

Reservations are stored in `data/reservations.json` (automatically created on first run, gitignored). To view all bookings:

```bash
curl http://localhost:3000/api/reservations
```

For production, consider replacing the JSON file storage with a proper database (e.g. SQLite, PostgreSQL).

## Project Structure

```
cafe_hikbert/
├── server.js              # Express backend
├── package.json
├── public/
│   ├── index.html         # Main page (all sections)
│   ├── css/
│   │   └── styles.css     # All styles
│   ├── js/
│   │   └── main.js        # Navigation, tabs, reservation form
│   └── images/            # Add your photos here
└── data/
    └── reservations.json  # Auto-created, gitignored
```
