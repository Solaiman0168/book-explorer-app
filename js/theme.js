class ThemeManager {
    static init() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        this.setTheme(savedTheme);
        
        // Add event listener for theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    static setTheme(theme) {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('theme', theme);
        
        // Update icon
        if (this.themeIcon) {
            this.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    static toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 
                           (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => ThemeManager.init());

// Export if using modules
export default ThemeManager;