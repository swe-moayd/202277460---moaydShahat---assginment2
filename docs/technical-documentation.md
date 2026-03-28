# Technical Documentation (Assignment 2)

## Overview

This portfolio is an incremental enhancement of the previous assignment, built with:
- **HTML** for semantic page structure
- **CSS** for layout, transitions, and responsive behavior
- **JavaScript** for interactivity, dynamic content, data handling, and user feedback

## File Responsibilities

- `index.html`  
  Main structure with sections for About, Projects, and Contact.  
  Includes dynamic UI controls:
  - Project category tabs
  - Live project search input
  - API quote widget button and status output

- `css/styles.css`  
  Handles:
  - Theme variables and dark mode overrides
  - Responsive layout (`Grid` and `Flexbox`)
  - Button/card hover transitions
  - Reveal animation classes (`.reveal`, `.is-visible`)
  - Status styles for loading/success/error feedback

- `js/script.js`  
  Handles:
  - Theme persistence with `localStorage`
  - Time-based greeting
  - Mobile menu behavior
  - Dynamic project filtering + live search
  - Fetching a quote from GitHub Zen API with loading/error states
  - Contact form validation and status feedback
  - Scroll reveal animation using `IntersectionObserver`

## Assignment 2 Requirement Mapping

### 1) Dynamic Content
- Implemented project filtering and live search.
- Project cards update immediately based on user clicks and typing.
- Empty state appears when no project matches.

### 2) Data Handling
- `localStorage` stores theme preference (`light` / `dark`).
- Public API fetch (`https://api.github.com/zen`) loads dynamic quote text.
- API errors are handled with friendly feedback.

### 3) Animation and Transitions
- Card and button hover transitions.
- Fade/slide reveal effect for project cards when scrolling into view.
- Animated status message entry (`status-pop`) for feedback text.

### 4) Error Handling and User Feedback
- Contact form validation for name, email, and message length.
- Clear error and success messages in contact form.
- Loading message shown while fetching quote.
- Friendly API failure message if request fails.
- Empty state message shown when search/filter returns no results.

## Responsiveness

- Breakpoint at `900px`: content grids collapse to one column.
- Breakpoint at `720px`: mobile nav dropdown is enabled.
- Project controls adapt to stacked layout on small screens.

## Manual Test Checklist

- [ ] Theme toggle persists after reload
- [ ] Mobile nav opens/closes and closes on outside click/ESC
- [ ] Project tabs filter cards correctly
- [ ] Search updates results while typing
- [ ] Empty state appears when there are no matches
- [ ] Quote widget shows loading, then success or error message
- [ ] Form validation blocks invalid submit and shows hints
- [ ] Form success message appears for valid input
