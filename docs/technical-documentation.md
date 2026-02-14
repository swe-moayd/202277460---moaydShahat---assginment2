# Technical Documentation (Assignment 1)

## Overview

This project is a static personal portfolio site built with:
- **HTML** for structure and content
- **CSS** for styling and responsive layout
- **JavaScript** for interactivity (theme toggle, greeting, form validation)

## File/Folder Responsibilities

- `index.html`  
  Main page containing navigation and 3 required sections:
  - About Me
  - Projects (2 cards)
  - Contact (form)

- `css/styles.css`  
  Styles for layout, typography, components, and responsiveness.
  Uses:
  - CSS variables (`:root`) for theme colors
  - `[data-theme="dark"]` for dark theme overrides
  - Grid/Flexbox for responsive layout

- `js/script.js`  
  Adds interactivity:
  - Theme toggle with `localStorage`
  - Greeting message based on time of day
  - Mobile menu toggle (hamburger) + close behavior (outside click, ESC)
  - Contact form validation (no backend submission)

- `assets/images/`  
  Placeholder SVG images for profile and projects. Replace with your own.

- `docs/ai-usage-report.md`  
  Documents how AI tools were used and how output was reviewed/modified.

## Interactivity Details

### 1) Dark/Light Theme Toggle
- Button toggles `document.documentElement.dataset.theme`
- Theme is stored in `localStorage` under key `theme`
- If no saved theme exists, system preference is used (`prefers-color-scheme`)

### 2) Time-Based Greeting
- On page load, the script checks the local hour:
  - < 12 → “Good morning”
  - < 18 → “Good afternoon”
  - otherwise → “Good evening”
- Updates the greeting text in the hero section.

### 3) Contact Form Validation (Demo)
- Uses JavaScript to validate:
  - Name: at least 2 characters
  - Email: basic regex check
  - Message: at least 10 characters
- Prevents default form submission and shows a success message.

## Responsive Design Strategy

- Layout is built mobile-first and adapts using breakpoints:
  - `900px`: switches 2-column grids to single column
  - `720px`: enables mobile menu dropdown

## Testing Checklist

- Resize window / use DevTools device toolbar:
  - [ ] Mobile (360px)
  - [ ] Tablet (768px)
  - [ ] Desktop (1024px+)
- Confirm:
  - [ ] Theme toggle works and persists after refresh
  - [ ] Nav links smoothly scroll and mobile menu closes when clicked
  - [ ] Form shows hints and success message
