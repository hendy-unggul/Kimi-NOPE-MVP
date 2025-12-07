// NOPE - Telegram Mini App Login
const CONFIG = {
    APP_NAME: 'NOPE',
    STORAGE_KEYS: {
        TELEGRAM_USERNAME: 'nope_tg_username',
        ANON_USERNAME: 'nope_anon_username',
        LOGGED_IN: 'nope_logged_in',
        USER_ID: 'nope_user_id'
    }
};

// Clear service worker issues
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(reg => reg.unregister());
    });
}

// Telegram Mini App Simulation
function getTelegramUserData() {
    // In real Telegram Mini App:
    // return window.Telegram.WebApp.initDataUnsafe.user
    
    // For simulation/demo:
    const params = new URLSearchParams(window.location.search);
    const tgUsername = params.get('tg_user') || 'user_' + Math.floor(Math.random() * 10000);
    
    return {
        username: tgUsername,
        id: Math.floor(Math.random() * 1000000),
        first_name: 'User',
        last_name: ''
    };
}

// Check username uniqueness
function isUsernameUnique(username) {
    const existing = JSON.parse(localStorage.getItem('nope_usernames') || '[]');
    return !existing.includes(username.toLowerCase());
}

// Register new username
function registerUsername(username) {
    const existing = JSON.parse(localStorage.getItem('nope_usernames') || '[]');
    existing.push(username.toLowerCase());
    localStorage.setItem('nope_usernames', JSON.stringify(existing));
    return true;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'nope-notification';
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
        padding: 14px 20px;
        border-radius: 10px;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: 500;
        max-width: 300px;
        font-size: 0.85rem;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Initialize login page
function initLoginPage() {
    const form = document.getElementById('loginForm');
    const anonInput = document.getElementById('anonUsername');
    const submitBtn = document.getElementById('submitBtn');
    const tgDisplay = document.getElementById('telegramUsernameDisplay');
    
    if (!form || !anonInput || !submitBtn || !tgDisplay) return;
    
    // Get Telegram user data
    const tgUser = getTelegramUserData();
    const tgUsername = tgUser.username;
    
    // Display Telegram username
    tgDisplay.textContent = '@' + tgUsername;
    
    // Save Telegram username to localStorage
    localStorage.setItem(CONFIG.STORAGE_KEYS.TELEGRAM_USERNAME, tgUsername);
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER_ID, tgUser.id.toString());
    
    // Username validation
    anonInput.addEventListener('input', function() {
        const username = this.value.trim();
        const feedback = document.getElementById('usernameFeedback');
        
        // Validation rules
        if (username.length < 3) {
            feedback.textContent = 'min 3 characters';
            feedback.style.color = 'rgba(255, 255, 255, 0.4)';
            submitBtn.disabled = true;
        } else if (username.length > 20) {
            feedback.textContent = 'max 20 characters';
            feedback.style.color = 'rgba(255, 255, 255, 0.4)';
            submitBtn.disabled = true;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            feedback.textContent = 'letters, numbers, underscore only';
            feedback.style.color = 'rgba(255, 255, 255, 0.4)';
            submitBtn.disabled = true;
        } else if (!isUsernameUnique(username)) {
            feedback.textContent = 'username taken';
            feedback.style.color = 'rgba(255, 59, 48, 0.7)';
            submitBtn.disabled = true;
        } else {
            feedback.textContent = '✓ available';
            feedback.style.color = 'rgba(52, 199, 89, 0.7)';
            submitBtn.disabled = false;
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const anonUsername = anonInput.value.trim();
        
        // Final validation
        if (anonUsername.length < 3 || anonUsername.length > 20) {
            showNotification('Username must be 3-20 characters');
            return;
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(anonUsername)) {
            showNotification('Invalid characters in username');
            return;
        }
        
        if (!isUsernameUnique(anonUsername)) {
            showNotification('Username is already taken');
            return;
        }
        
        // Show loading state
        submitBtn.textContent = '...';
        submitBtn.disabled = true;
        
        // Simulate API processing
        setTimeout(() => {
            // Register username
            registerUsername(anonUsername);
            
            // Save to localStorage
            localStorage.setItem(CONFIG.STORAGE_KEYS.ANON_USERNAME, anonUsername);
            localStorage.setItem(CONFIG.STORAGE_KEYS.LOGGED_IN, 'true');
            
            showNotification(`Welcome, ${anonUsername}`);
            
            // Redirect to onboarding/hashtag selection
            setTimeout(() => {
                window.location.href = 'rage.html';
            }, 1000);
        }, 800);
    });
    
    // Auto-focus
    anonInput.focus();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('NOPE — Telegram Mini App Login');
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize login page
    initLoginPage();
});
