(function() {
  "use strict";
  window.addEventListener("DOMContentLoaded", initialise);
  function initialise() {
    const themeToggle = document.querySelector("button.theme-toggle");
    const themeIcon = document.getElementById("themeIcon");
    const body = document.body;
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const projectImageViewers = document.querySelectorAll("div.project-image-viewer");
    if (savedTheme) {
      body.setAttribute("data-theme", savedTheme);
      updateThemeIcon(savedTheme);
    } else if (systemPrefersDark) {
      body.setAttribute("data-theme", "dark");
      updateThemeIcon("dark");
    } else {
      body.setAttribute("data-theme", "light");
      updateThemeIcon("light");
    }
    themeToggle.addEventListener("click", () => {
      const currentTheme = body.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      body.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeIcon(newTheme);
    });
    function updateThemeIcon(theme) {
      themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
    }
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        const newTheme = e.matches ? "dark" : "light";
        body.setAttribute("data-theme", newTheme);
        updateThemeIcon(newTheme);
      }
    });
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
          });
        }
      });
    });
    for (let projectImageViewer of projectImageViewers) {
      projectImageViewer.addEventListener("wheel", (e) => {
        e.preventDefault();
        projectImageViewer.scrollLeft += e.deltaY;
      });
    }
  }
})();
