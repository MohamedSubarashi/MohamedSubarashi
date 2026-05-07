const body = document.body;
const nav = document.querySelector(".site-nav");
const themeToggle = document.querySelector("#themeToggle");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectItems = document.querySelectorAll(".project-item");
const form = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const year = document.querySelector("#year");
const extensionGroups = document.querySelectorAll(".Chrome-extensions, .Firefox-extensions, .Edge-extensions, .opera-extensions");
const extensionLabels = new Map([
  ["Chrome-extensions", "Chrome"],
  ["Firefox-extensions", "Firefox"],
  ["Edge-extensions", "Edge"],
  ["opera-extensions", "Opera"]
]);

if (year) {
  year.textContent = new Date().getFullYear();
}

const savedTheme = localStorage.getItem("fatgeek-theme");
if (savedTheme === "light" && themeToggle) {
  body.classList.add("light-theme");
  themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    const isLight = body.classList.contains("light-theme");
    localStorage.setItem("fatgeek-theme", isLight ? "light" : "dark");
    themeToggle.innerHTML = isLight ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
  });
}

const updateNav = () => {
  if (nav) {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }
};

updateNav();
window.addEventListener("scroll", updateNav, { passive: true });

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectItems.forEach((item) => {
      const shouldShow = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

extensionGroups.forEach((group) => {
  group.setAttribute("tabindex", "0");
  group.setAttribute("aria-expanded", "false");

  const groupClass = [...group.classList].find((className) => extensionLabels.has(className));
  const label = extensionLabels.get(groupClass) || "Extensions";
  const toggleItem = document.createElement("li");
  const toggleButton = document.createElement("button");

  toggleItem.className = "extension-toggle-item";
  toggleButton.className = "extension-toggle";
  toggleButton.type = "button";
  toggleButton.textContent = label;
  toggleButton.setAttribute("aria-expanded", "false");
  toggleButton.setAttribute("aria-label", `Toggle ${label} extension links`);
  toggleItem.append(toggleButton);
  group.prepend(toggleItem);

  const closeOtherGroups = () => {
    extensionGroups.forEach((item) => {
      if (item !== group) {
        item.classList.remove("is-open");
        item.setAttribute("aria-expanded", "false");
        item.querySelector(".extension-toggle")?.setAttribute("aria-expanded", "false");
      }
    });
  };

  const toggleGroup = () => {
    const willOpen = !group.classList.contains("is-open");
    closeOtherGroups();
    group.classList.toggle("is-open", willOpen);
    group.setAttribute("aria-expanded", String(willOpen));
    toggleButton.setAttribute("aria-expanded", String(willOpen));
  };

  toggleButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleGroup();
  });

  group.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    toggleGroup();
  });

  group.querySelectorAll("a.nav-link").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const text = link.textContent.toLowerCase();
    const unavailable = href.trim() === "" || href === "#" || text.includes("comming soon") || text.includes("coming soon");

    link.textContent = link.textContent.replace("Comming Soon", "Coming Soon");

    if (href.startsWith("http")) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noreferrer");
    }

    if (unavailable) {
      link.classList.add("extension-unavailable");
      link.setAttribute("aria-disabled", "true");
      link.addEventListener("click", (event) => event.preventDefault());
    }
  });
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".Chrome-extensions, .Firefox-extensions, .Edge-extensions, .opera-extensions")) {
    return;
  }

  extensionGroups.forEach((group) => {
    group.classList.remove("is-open");
    group.setAttribute("aria-expanded", "false");
    group.querySelector(".extension-toggle")?.setAttribute("aria-expanded", "false");
  });
});

const counters = document.querySelectorAll("[data-count]");
const animateCounter = (counter) => {
  const target = Number(counter.dataset.count);
  let value = 0;
  const step = Math.max(1, Math.ceil(target / 42));

  const tick = () => {
    value = Math.min(target, value + step);
    counter.textContent = value;
    if (value < target) {
      requestAnimationFrame(tick);
    }
  };

  tick();
};

const revealItems = document.querySelectorAll(".service-card, .extension-card, .project-card, .timeline-item, .testimonial, .contact-intro, .contact-form, .stat");
revealItems.forEach((item) => item.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");

      if (entry.target.classList.contains("stat")) {
        const counter = entry.target.querySelector("[data-count]");
        if (counter && !counter.dataset.done) {
          counter.dataset.done = "true";
          animateCounter(counter);
        }
      }

      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => observer.observe(item));

document.querySelectorAll(".navbar a[href^='#'], .site-footer a[href^='#']").forEach((link) => {
  link.addEventListener("click", () => {
    if (link.classList.contains("dropdown-toggle")) {
      return;
    }

    const menu = document.querySelector("#mainNav");
    const collapse = bootstrap.Collapse.getInstance(menu);
    if (collapse) {
      collapse.hide();
    }
  });
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (formStatus) {
      formStatus.textContent = "Thanks. Your message is ready to be connected to an email or backend service.";
    }
    form.reset();
  });
}
