// scripts.js - light-only version: mobile menu, reveal-on-scroll, smooth scroll, active nav.
// (theme/day-night removed)

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const navButtons = Array.from(document.querySelectorAll(".nav-btn"));
  const mobileLinks = Array.from(document.querySelectorAll(".mobile-link"));
  const ctas = Array.from(document.querySelectorAll(".btn"));
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // MOBILE MENU: hidden by default; JS toggles .open and hidden attr
  if (menuToggle && mobileMenu) {
    mobileMenu.hidden = true;
    mobileMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        mobileMenu.hidden = false;
        const first = mobileMenu.querySelector("button, a");
        first && first.focus();
      } else {
        mobileMenu.hidden = true;
        menuToggle.focus();
      }
    });

    // close when clicking outside
    document.addEventListener("click", (ev) => {
      if (mobileMenu.hidden) return;
      const target = ev.target;
      if (!mobileMenu.contains(target) && !menuToggle.contains(target)) {
        mobileMenu.classList.remove("open");
        mobileMenu.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });

    // close with Escape
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        if (!mobileMenu.hidden) {
          mobileMenu.classList.remove("open");
          mobileMenu.hidden = true;
          menuToggle.setAttribute("aria-expanded", "false");
          menuToggle.focus();
        }
      }
    });
  }

  // MAPPING: section IDs -> nav data-target values
  // hero section corresponds to "home" nav button
  const sectionToNavKey = {
    hero: "home",
    about: "about",
    skills: "skills",
    projects: "projects",
    contact: "contact",
  };

  // SMOOTH SCROLL
  function scrollToId(id) {
    // map "home" button to actual hero section
    const realId = id === "home" ? "hero" : id;
    const el = document.getElementById(realId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // close mobile menu if open
    if (mobileMenu && mobileMenu.classList.contains("open")) {
      mobileMenu.classList.remove("open");
      mobileMenu.hidden = true;
      menuToggle && menuToggle.setAttribute("aria-expanded", "false");
    }
  }

  navButtons.forEach((btn) =>
    btn.addEventListener("click", () => scrollToId(btn.dataset.target))
  );
  mobileLinks.forEach((btn) =>
    btn.addEventListener("click", () => scrollToId(btn.dataset.target))
  );
  ctas.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const t = e.currentTarget.dataset.target;
      if (t) scrollToId(t);
    })
  );

  // REVEAL & ACTIVE NAV: observe .scroll-animate nodes
  const animatedEls = Array.from(document.querySelectorAll(".scroll-animate"));

  if (animatedEls.length) {
    const observerOptions = {
      root: null,
      threshold: [0.15, 0.5, 0.9],
      rootMargin: "0px 0px -20% 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length === 0) return;

      // reveal on scroll
      visible.forEach((e) => e.target.classList.add("visible"));

      // pick the most visible element and set active nav
      const most = visible.reduce((a, b) =>
        a.intersectionRatio > b.intersectionRatio ? a : b
      );
      const parent = most.target.closest("section, header");
      if (!parent || !parent.id) return;

      const sectionId = parent.id;
      const navKey = sectionToNavKey[sectionId] || sectionId;

      navButtons.forEach((b) => {
        const isActive = b.dataset.target === navKey;
        if (isActive) {
          b.setAttribute("aria-current", "true");
        } else {
          b.removeAttribute("aria-current");
        }
      });

      // Make header constant for skills, projects, contact
      const nav = document.querySelector('.nav');
      if (navKey === 'skills' || navKey === 'projects' || navKey === 'contact') {
        nav.classList.add('fixed-nav');
      } else {
        nav.classList.remove('fixed-nav');
      }
    }, observerOptions);

    animatedEls.forEach((el) => observer.observe(el));
  } else {
    // fallback
    document
      .querySelectorAll(".scroll-animate")
      .forEach((el) => el.classList.add("visible"));
  }

  // respect reduced-motion
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document
      .querySelectorAll(".scroll-animate")
      .forEach((el) => el.classList.add("visible"));
  }
});
