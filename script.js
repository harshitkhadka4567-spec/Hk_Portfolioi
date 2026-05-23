// Portfolio interactions for Harshit Khadka.
const loader = document.querySelector(".loader");
const root = document.documentElement;
const hero = document.querySelector(".hero");
const progressBar = document.querySelector(".scroll-progress");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal, .scroll-reveal");
const typingTarget = document.querySelector(".typing-text");
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");
const developmentSkillCards = document.querySelectorAll(".development-skill-card");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const desktopNavigationQuery = window.matchMedia("(min-width: 981px)");
const siteRoutes = new Set(["about", "skills", "certifications", "projects", "resume", "contact"]);

const roles = [
  "Computer Science Sophomore",
  "Aspiring Software Developer",
  "Web Developer",
  "C++ Programmer",
  "Problem Solver"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let scrollTicking = false;
let navOverlay = null;
let navCloseButton = null;

const navIconIds = {
  Home: "icon-home",
  About: "icon-user",
  Skills: "icon-code",
  Certifications: "icon-award",
  Projects: "icon-layers",
  Resume: "icon-file",
  Contact: "icon-mail"
};

function getRouteFromPath(pathname = window.location.pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const route = segments.find((segment) => siteRoutes.has(segment));
  return route || "home";
}

function getProjectBasePath() {
  const segments = window.location.pathname.split("/").filter(Boolean);
  const routeIndex = segments.findIndex((segment) => siteRoutes.has(segment));

  if (routeIndex > 0) {
    return `/${segments.slice(0, routeIndex).join("/")}`;
  }

  if (segments.length === 1 && !siteRoutes.has(segments[0]) && !segments[0].includes(".")) {
    return `/${segments[0]}`;
  }

  return "";
}

function localizeRootRelativeLinks() {
  const basePath = getProjectBasePath();
  if (!basePath) return;

  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const isHome = href === "/";
    const isRoute = Array.from(siteRoutes).some((route) => href === `/${route}/`);
    if (!isHome && !isRoute) return;

    link.setAttribute("href", isHome ? `${basePath}/` : `${basePath}${href}`);
  });
}

function updateActiveNavigation() {
  const currentRoute = getRouteFromPath();

  navItems.forEach((item) => {
    const href = item.getAttribute("href") || "";
    let itemRoute = "home";

    try {
      itemRoute = getRouteFromPath(new URL(href, window.location.origin).pathname);
    } catch (error) {
      itemRoute = href === "/" ? "home" : "";
    }

    item.classList.toggle("active", itemRoute === currentRoute);
  });
}

localizeRootRelativeLinks();
setupMobileNavigationDecor();

function setupMobileNavigationDecor() {
  if (!menuToggle || !navLinks) return;

  const basePath = getProjectBasePath();
  const existingIconUse = document.querySelector('use[href*="assets/icons.svg"]');
  const spritePath = existingIconUse
    ? existingIconUse.getAttribute("href").split("#")[0]
    : `${basePath}/assets/icons.svg`;
  const brandMark = document.querySelector(".brand-mark");
  const brandSrc = brandMark ? brandMark.src : `${basePath}/assets/favicon.svg`;

  if (!navLinks.id) {
    navLinks.id = "mobile-navigation";
  }

  menuToggle.setAttribute("aria-controls", navLinks.id);

  if (!navLinks.querySelector(".nav-drawer-top")) {
    const drawerTop = document.createElement("li");
    drawerTop.className = "nav-drawer-top";
    drawerTop.innerHTML = `
      <div class="nav-drawer-brand">
        <img src="${brandSrc}" alt="" width="40" height="40">
        <span>
          <strong>Harshit Khadka</strong>
          <small>Computer Science Sophomore</small>
        </span>
      </div>
      <button class="nav-panel-close" type="button" aria-label="Close navigation menu">
        <span></span>
        <span></span>
      </button>
    `;
    navLinks.insertBefore(drawerTop, navLinks.firstElementChild);
    navCloseButton = drawerTop.querySelector(".nav-panel-close");
    navCloseButton.addEventListener("click", closeMobileMenu);
  }

  navItems.forEach((item, index) => {
    const label = item.textContent.trim();
    const iconId = navIconIds[label] || "icon-target";

    if (!item.querySelector(".nav-icon")) {
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const use = document.createElementNS("http://www.w3.org/2000/svg", "use");

      icon.classList.add("nav-icon");
      icon.setAttribute("aria-hidden", "true");
      use.setAttribute("href", `${spritePath}#${iconId}`);
      icon.appendChild(use);
      item.prepend(icon);
    }

    item.parentElement.style.setProperty("--nav-delay", `${120 + index * 45}ms`);
  });

  navOverlay = document.querySelector(".nav-overlay");
  if (!navOverlay) {
    navOverlay = document.createElement("div");
    navOverlay.className = "nav-overlay";
    navOverlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(navOverlay);
  }

  navOverlay.addEventListener("click", closeMobileMenu);
}

function closeMobileMenu() {
  if (!menuToggle || !navLinks) return;
  navLinks.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  document.body.classList.remove("nav-open");
  if (navOverlay) navOverlay.classList.remove("open");
}

// Mobile navigation toggle.
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = !navLinks.classList.contains("open");

    menuToggle.classList.toggle("open", isOpen);
    navLinks.classList.toggle("open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    if (navOverlay) navOverlay.classList.toggle("open", isOpen);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileMenu();
  });

  document.addEventListener("click", (event) => {
    if (!navLinks.classList.contains("open")) return;
    if (navLinks.contains(event.target) || menuToggle.contains(event.target)) return;
    closeMobileMenu();
  });

  desktopNavigationQuery.addEventListener("change", (event) => {
    if (event.matches) closeMobileMenu();
  });
}

navItems.forEach((item) => {
  item.addEventListener("click", closeMobileMenu);
});

// Skill cards reveal details on tap/click while hover stays CSS-only.
function setDevelopmentSkillCard(selectedCard, open) {
  developmentSkillCards.forEach((card) => {
    const shouldOpen = card === selectedCard && open;
    card.classList.toggle("is-open", shouldOpen);
    card.setAttribute("aria-expanded", String(shouldOpen));
  });
}

if (developmentSkillCards.length) {
  developmentSkillCards.forEach((card) => {
    card.addEventListener("click", () => {
      setDevelopmentSkillCard(card, !card.classList.contains("is-open"));
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      setDevelopmentSkillCard(card, !card.classList.contains("is-open"));
    });
  });

  document.addEventListener("click", (event) => {
    if (Array.from(developmentSkillCards).some((card) => card.contains(event.target))) return;
    setDevelopmentSkillCard(null, false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setDevelopmentSkillCard(null, false);
  });
}

function startTyping() {
  if (!typingTarget) return;
  typingTarget.textContent = roles[0];
}

startTyping();

// Contact form validation and Formspree submission.
function setFormStatus(message, type = "") {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = type ? `form-status ${type}` : "form-status";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clearFieldErrors(fields) {
  fields.forEach((field) => {
    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const buttonLabel = submitButton.querySelector(".button-label");
    const fields = [
      contactForm.elements.name,
      contactForm.elements.email,
      contactForm.elements.subject,
      contactForm.elements.message
    ];

    clearFieldErrors(fields);
    setFormStatus("");

    const emptyField = fields.find((field) => field.value.trim() === "");
    if (emptyField) {
      emptyField.classList.add("is-invalid");
      emptyField.setAttribute("aria-invalid", "true");
      emptyField.focus();
      setFormStatus("Please fill in every field before sending your message.", "error");
      return;
    }

    if (!isValidEmail(contactForm.elements.email.value.trim())) {
      contactForm.elements.email.classList.add("is-invalid");
      contactForm.elements.email.setAttribute("aria-invalid", "true");
      contactForm.elements.email.focus();
      setFormStatus("Please enter a valid email address.", "error");
      return;
    }

    submitButton.disabled = true;
    buttonLabel.textContent = "Sending...";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        contactForm.reset();
        setFormStatus("Thanks! Your message has been sent successfully.", "success");
      } else {
        setFormStatus("Something went wrong while sending. Please try again in a moment.", "error");
      }
    } catch (error) {
      setFormStatus("Network error. Please check your connection and try again.", "error");
    } finally {
      submitButton.disabled = false;
      buttonLabel.textContent = "Send Message";
    }
  });
}

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

  if (progressBar) {
    progressBar.style.transform = `scaleX(${Math.min(progress / 100, 1)})`;
  }

  updateActiveNavigation();
}

function requestScrollUpdate() {
  if (scrollTicking) return;

  scrollTicking = true;
  window.requestAnimationFrame(() => {
    updateScrollUI();
    scrollTicking = false;
  });
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
updateScrollUI();

// Scroll reveal animation.
function showAllRevealItems() {
  revealItems.forEach((item) => {
    item.classList.add("visible");
    item.style.transitionDelay = "0ms";
  });
}

if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
  showAllRevealItems();
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -36px 0px" }
  );

  const staggerGroups = document.querySelectorAll(
    ".preview-grid, .projects-grid, .skills-grid, .cert-grid, .cert-featured-grid, .metrics-grid, .about-highlights, .contact-links"
  );

  staggerGroups.forEach((group) => {
    Array.from(group.children).forEach((item, index) => {
      if (!item.matches(".reveal, .scroll-reveal")) return;
      item.style.transitionDelay = `${50 + index * 70}ms`;
    });
  });

  revealItems.forEach((item) => {
    if (!item.style.transitionDelay) {
      item.style.transitionDelay = "50ms";
    }
    revealObserver.observe(item);
  });

  reducedMotionQuery.addEventListener("change", () => {
    if (reducedMotionQuery.matches) showAllRevealItems();
  });
}
