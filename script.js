/**
 * Load dark mode preference on page load
 */
window.addEventListener('load', function() {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            const icon = darkModeToggle.querySelector('.theme-icon');
            if (icon) icon.textContent = '☀️';
        }
    }
});

// Get DOM elements for navbar (if they exist)
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    /**
     * Dark mode toggle functionality
     */
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Update icon
            const icon = darkModeToggle.querySelector('.theme-icon');
            if (document.body.classList.contains('dark-mode')) {
                if (icon) icon.textContent = '☀️';
                localStorage.setItem('darkMode', 'enabled');
            } else {
                if (icon) icon.textContent = '🌙';
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }

    /**
     * Mobile menu toggle
     */
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        /**
         * Close mobile menu when a link is clicked
         */
        document.querySelectorAll('.nav-button').forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.id !== 'darkModeToggle') {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }
});

/**
 * Helper function to escape HTML
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

