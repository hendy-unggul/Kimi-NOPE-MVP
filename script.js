document.addEventListener('DOMContentLoaded', function() {
    console.log('NOPE loaded successfully! 🚀');
    
    // Telegram Bot URL (GANTI DENGAN BOT ANDA)
    const TELEGRAM_BOT_USERNAME = '@nope_app_bot'; // Ganti dengan username bot Anda
    const TELEGRAM_BOT_URL = `https://t.me/${TELEGRAM_BOT_USERNAME}`;
    
    // Get buttons
    const registerBtn = document.getElementById('registerBtn');
    const loginBtn = document.getElementById('loginBtn');
    const registerCard = document.getElementById('registerCard');
    const loginCard = document.getElementById('loginCard');
    
    // Add click effects to cards
    [registerCard, loginCard].forEach(card => {
        card.addEventListener('click', function() {
            // Add temporary click effect
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Register Button
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click from firing
            
            // Animation
            this.style.transform = 'scale(0.95)';
            
            // Redirect to Telegram Bot with start parameter for registration
            const startParam = 'start=register';
            const fullUrl = `${TELEGRAM_BOT_URL}?${startParam}`;
            
            console.log('Redirecting to Telegram for registration...');
            window.open(fullUrl, '_blank');
            
            // Reset animation
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    }
    
    // Login Button
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click from firing
            
            // Animation
            this.style.transform = 'scale(0.95)';
            
            // Redirect to Telegram Bot with start parameter for login
            const startParam = 'start=login';
            const fullUrl = `${TELEGRAM_BOT_URL}?${startParam}`;
            
            console.log('Redirecting to Telegram for login...');
            window.open(fullUrl, '_blank');
            
            // Reset animation
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    }
    
    // Optional: Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl + 1 for Register
        if (e.ctrlKey && e.key === '1') {
            registerBtn.click();
        }
        // Ctrl + 2 for Login
        if (e.ctrlKey && e.key === '2') {
            loginBtn.click();
        }
    });
    
    // Show welcome message in console
    console.log(`
    ╔══════════════════════════════════════╗
    ║                                      ║
    ║   NOPE Anonymous Platform Ready!     ║
    ║                                      ║
    ║   Register: Click green button       ║
    ║   Login: Click blue button           ║
    ║                                      ║
    ╚══════════════════════════════════════╝
    `);
});
