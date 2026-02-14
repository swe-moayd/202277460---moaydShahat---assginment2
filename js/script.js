/**
 * script.js
 * - Theme toggle (light/dark) with localStorage
 * - Time-based greeting
 * - Mobile navigation toggle
 * - Contact form validation + success message (no backend)
 */

(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);

  // ---------------------------
  // Theme Toggle
  // ---------------------------
  const themeToggle = $("#themeToggle");
  const themeIcon = $("#themeIcon");

  function getPreferredTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;

    // If no saved preference, use system preference:
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;

    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Toggle light mode" : "Toggle dark mode");
    themeIcon.textContent = isDark ? "☀️" : "🌙";
  }

  function toggleTheme() {
    const current = document.documentElement.dataset.theme || "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  }

  // ---------------------------
  // Greeting (time of day)
  // ---------------------------
  const greetingEl = $("#greeting");

  function getGreetingByTime(date = new Date()) {
    const hour = date.getHours();
    if (hour < 12) return "Good morning 👋";
    if (hour < 18) return "Good afternoon 👋";
    return "Good evening 👋";
  }

  function setGreeting() {
    if (!greetingEl) return;
    greetingEl.textContent = getGreetingByTime();
  }

  // ---------------------------
  // Mobile nav toggle
  // ---------------------------
  const navToggle = $("#navToggle");
  const navList = $("#navList");

  function closeMenu() {
    if (!navList) return;
    navList.dataset.open = "false";
    navToggle?.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    if (!navList) return;
    const isOpen = navList.dataset.open === "true";
    navList.dataset.open = String(!isOpen);
    navToggle?.setAttribute("aria-expanded", String(!isOpen));
  }

  function setupNavInteractions() {
    if (!navToggle || !navList) return;

    // Default closed
    navList.dataset.open = "false";

    navToggle.addEventListener("click", toggleMenu);

    // Close menu when clicking a link (on mobile)
    navList.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof HTMLAnchorElement) closeMenu();
    });

    // Close menu on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Close menu if you click outside
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Node)) return;
      const clickedInside = navList.contains(target) || navToggle.contains(target);
      if (!clickedInside) closeMenu();
    });
  }

  // ---------------------------
  // Contact form: basic validation (no backend)
  // ---------------------------
  const form = $("#contactForm");
  const statusEl = $("#formStatus");

  function showHint(inputId, show) {
    const hint = $(`#${inputId}Hint`);
    if (!hint) return;
    hint.style.display = show ? "block" : "none";
  }

  function validateForm() {
    const name = $("#name");
    const email = $("#email");
    const message = $("#message");

    let valid = true;

    if (!name || !email || !message) return false;

    // Name
    const nameOk = name.value.trim().length >= 2;
    showHint("name", !nameOk);
    if (!nameOk) valid = false;

    // Email (simple pattern check)
    const emailValue = email.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
    showHint("email", !emailOk);
    if (!emailOk) valid = false;

    // Message
    const msgOk = message.value.trim().length >= 10;
    showHint("message", !msgOk);
    if (!msgOk) valid = false;

    return valid;
  }

  function setupForm() {
    if (!form || !statusEl) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Clear previous status
      statusEl.textContent = "";

      const ok = validateForm();
      if (!ok) {
        statusEl.textContent = "Please fix the highlighted fields and try again.";
        return;
      }

      // No backend: just show a success message
      statusEl.textContent = "✅ Message sent (demo). Thanks for reaching out!";
      form.reset();
    });

    // Hide hints as user types
    ["name", "email", "message"].forEach((id) => {
      const el = $(`#${id}`);
      el?.addEventListener("input", () => showHint(id, false));
    });
  }

  // ---------------------------
  // Footer year
  // ---------------------------
  function setYear() {
    const yearEl = $("#year");
    if (!yearEl) return;
    yearEl.textContent = String(new Date().getFullYear());
  }

  // ---------------------------
  // Init
  // ---------------------------
  document.addEventListener("DOMContentLoaded", () => {
    // Theme
    applyTheme(getPreferredTheme());
    themeToggle?.addEventListener("click", toggleTheme);

    // Greeting
    setGreeting();

    // Nav & Form
    setupNavInteractions();
    setupForm();

    // Footer year
    setYear();
  });
})();
