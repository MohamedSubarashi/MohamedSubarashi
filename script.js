const body = document.body;
const nav = document.querySelector(".site-nav");
const themeToggle = document.querySelector("#themeToggle");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectItems = document.querySelectorAll(".project-item");
const form = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const year = document.querySelector("#year");

year.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem("fatgeek-theme");
if (savedTheme === "light") {
  body.classList.add("light-theme");
  themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-theme");
  const isLight = body.classList.contains("light-theme");
  localStorage.setItem("fatgeek-theme", isLight ? "light" : "dark");
  themeToggle.innerHTML = isLight ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
});

const updateNav = () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 24);
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

const revealItems = document.querySelectorAll(".service-card, .project-card, .timeline-item, .testimonial, .contact-intro, .contact-form, .stat");
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
    const menu = document.querySelector("#mainNav");
    const collapse = bootstrap.Collapse.getInstance(menu);
    if (collapse) {
      collapse.hide();
    }
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "Thanks. Your message is ready to be connected to an email or backend service.";
  form.reset();
});
