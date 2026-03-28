/**
 * script.js
 * - Theme toggle (light/dark) with localStorage
 * - Time-based greeting
 * - Mobile navigation toggle
 * - Project filtering + live search
 * - API quote fetch with loading/error feedback
 * - Contact form validation + success message (no backend)
 * - Reveal animation on scroll
 */

(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  // ---------------------------
  // Theme Toggle
  // ---------------------------
  const themeToggle = $("#themeToggle");
  const themeIcon = $("#themeIcon");

  function getPreferredTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;

    const isDark = theme === "dark";
    themeToggle?.setAttribute("aria-pressed", String(isDark));
    themeToggle?.setAttribute("aria-label", isDark ? "Toggle light mode" : "Toggle dark mode");
    if (themeIcon) themeIcon.textContent = isDark ? "☀️" : "🌙";
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
    if (greetingEl) greetingEl.textContent = getGreetingByTime();
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

    navList.dataset.open = "false";
    navToggle.addEventListener("click", toggleMenu);

    navList.addEventListener("click", (e) => {
      if (e.target instanceof HTMLAnchorElement) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (e) => {
      if (!(e.target instanceof Node)) return;
      const clickedInside = navList.contains(e.target) || navToggle.contains(e.target);
      if (!clickedInside) closeMenu();
    });
  }

  // ---------------------------
  // Project filter + live search
  // ---------------------------
  const projectCards = $$("#projectGrid .card");
  const filterTabs = $$(".tab-btn");
  const searchInput = $("#projectSearch");
  const projectsEmpty = $("#projectsEmpty");
  let activeFilter = "all";

  function applyProjectFilter() {
    if (!projectCards.length) return;

    const query = (searchInput?.value || "").trim().toLowerCase();
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const category = (card.dataset.category || "").toLowerCase();
      const searchableText = (card.dataset.search || "").toLowerCase();

      const matchesFilter = activeFilter === "all" || category === activeFilter;
      const matchesQuery = !query || searchableText.includes(query);
      const show = matchesFilter && matchesQuery;

      card.hidden = !show;
      if (show) visibleCount += 1;
    });

    if (projectsEmpty) projectsEmpty.hidden = visibleCount !== 0;
  }

  function setupProjectFilters() {
    if (!projectCards.length) return;

    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activeFilter = tab.dataset.filter || "all";

        filterTabs.forEach((btn) => {
          const isActive = btn === tab;
          btn.classList.toggle("is-active", isActive);
          btn.setAttribute("aria-selected", String(isActive));
        });

        applyProjectFilter();
      });
    });

    searchInput?.addEventListener("input", applyProjectFilter);
    applyProjectFilter();
  }

  // ---------------------------
  // API-powered quote widget
  // ---------------------------
  const factText = $("#factText");
  const factStatus = $("#factStatus");
  const loadFactBtn = $("#loadFactBtn");

  function setStatus(el, message, type) {
    if (!el) return;
    const baseClass = el.id === "formStatus" ? "form__status" : "fact-widget__status";
    el.className = baseClass;
    el.classList.add("status-pop");
    if (type) el.classList.add(`status--${type}`);
    el.textContent = message;
  }

  async function fetchDeveloperQuote() {
    if (!factText || !factStatus || !loadFactBtn) return;

    setStatus(factStatus, "Loading quote...", "loading");
    loadFactBtn.disabled = true;

    try {
      const response = await fetch("https://api.github.com/zen", {
        headers: {
          Accept: "text/plain"
        }
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const quote = (await response.text()).trim();
      if (!quote) {
        throw new Error("Empty response");
      }

      factText.textContent = `"${quote}"`;
      setStatus(factStatus, "Quote loaded successfully.", "success");
    } catch (_err) {
      factText.textContent = "Could not load a live quote right now. Please try again in a moment.";
      setStatus(factStatus, "Unable to load quote. Check your connection and retry.", "error");
    } finally {
      loadFactBtn.disabled = false;
    }
  }

  function setupQuoteWidget() {
    if (!loadFactBtn) return;
    loadFactBtn.addEventListener("click", fetchDeveloperQuote);
  }

  // ---------------------------
  // Contact form: validation (no backend)
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

    if (!name || !email || !message) return false;

    let valid = true;

    const nameOk = name.value.trim().length >= 2;
    showHint("name", !nameOk);
    if (!nameOk) valid = false;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    showHint("email", !emailOk);
    if (!emailOk) valid = false;

    const msgOk = message.value.trim().length >= 10;
    showHint("message", !msgOk);
    if (!msgOk) valid = false;

    return valid;
  }

  function setupForm() {
    if (!form || !statusEl) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      setStatus(statusEl, "", undefined);

      const ok = validateForm();
      if (!ok) {
        setStatus(statusEl, "Please fix the highlighted fields and try again.", "error");
        return;
      }

      setStatus(statusEl, "Message sent (demo). Thanks for reaching out!", "success");
      form.reset();
    });

    ["name", "email", "message"].forEach((id) => {
      const el = $(`#${id}`);
      el?.addEventListener("input", () => {
        showHint(id, false);
        if (statusEl.textContent) setStatus(statusEl, "", undefined);
      });
    });
  }

  // ---------------------------
  // Reveal animation
  // ---------------------------
  function setupReveal() {
    const revealEls = $$(".reveal");
    if (!revealEls.length) return;

    if (!("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  // ---------------------------
  // Footer year
  // ---------------------------
  function setYear() {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  // ---------------------------
  // Init
  // ---------------------------
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getPreferredTheme());
    themeToggle?.addEventListener("click", toggleTheme);

    setGreeting();
    setupNavInteractions();
    setupProjectFilters();
    setupQuoteWidget();
    setupForm();
    setupReveal();
    setYear();
  });
})();
