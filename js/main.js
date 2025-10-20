window.addEventListener("DOMContentLoaded", initialise);

function initialise() {
    // Theme toggle
    const themeToggle = document.querySelector("button.theme-toggle");
    const body = document.body;

    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Elements to scroll horizontally
    const imageViewers = document.querySelectorAll("div.image-viewer");
    const codeBlocks = document.querySelectorAll(".highlight>pre");

    // Set initial theme
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (systemPrefersDark) {
        body.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    } else {
        body.setAttribute('data-theme', 'light');
        updateThemeIcon('light');
    }

    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            console.log("theme toggle");
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            body.setAttribute('data-theme', newTheme);
            localStorage.setItem("theme", newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // Update theme icon
    function updateThemeIcon(theme) {
        const themeIcon = document.getElementById("themeIcon");
        if (!themeIcon) {
            return;
        }
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem("theme")) {
            const newTheme = e.matches ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });

    // Set scroll direction on image viewers
    for (let imageViewer of imageViewers) {
        imageViewer.addEventListener("wheel", (event) => {
            // Scroll normally if contents are not overflowing
            if (imageViewer.scrollWidth <= imageViewer.clientWidth) {
                return;
            }

            event.preventDefault();
            const delta = event.deltaY;
            imageViewer.scrollLeft += delta;
        });
    }

    // Set scroll direction on code blocks
    for (let codeBlock of codeBlocks) {
        codeBlock.addEventListener("wheel", (event) => {
            // Scroll normally if contents are not overflowing
            if (codeBlock.scrollWidth <= codeBlock.clientWidth) {
                return;
            }

            event.preventDefault();
            const delta = event.deltaY;
            codeBlock.scrollLeft += delta;
        });
    }
}
