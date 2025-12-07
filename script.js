// NOPE - Telegram Mini App Login
console.log('NOPE script.js loaded');

const CONFIG = {
    APP_NAME: 'NOPE',
    STORAGE_KEYS: {
        TELEGRAM_USERNAME: 'nope_tg_username',
        ANON_USERNAME: 'nope_anon_username',
        LOGGED_IN: 'nope_logged_in',
        USER_ID: 'nope_user_id',
        ONBOARDING_COMPLETE: 'nope_onboarding_complete'
    }
};

// Clear service worker issues
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log('Clearing service workers:', registrations.length);
        registrations.forEach(reg => reg.unregister());
    });
}

// Show notification
function showNotification(message, type = 'info') {
    console.log('Notification:', message);
    
    // Remove existing notification
    const existing = document.querySelector('.nope-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'nope-notification';
    notification.textContent = message;
    
    const bgColor = type === 'error' ? 'rgba(255, 59, 48, 0.9)' : 'rgba(255, 255, 255, 0.1)';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
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

// Telegram Mini App Simulation
function getTelegramUserData() {
    // Check URL parameters
    const params = new URLSearchParams(window.location.search);
    let tgUsername = params.get('tg_user') || params.get('username');
    
    // If no parameter, generate random for demo
    if (!tgUsername) {
        tgUsername = 'user_' + Math.floor(Math.random() * 10000);
        console.log('Generated demo username:', tgUsername);
    }
    
    return {
        username: tgUsername,
        id: Math.floor(Math.random() * 1000000)
    };
}

// Check username uniqueness
function isUsernameUnique(username) {
    const existing = JSON.parse(localStorage.getItem('nope_usernames') || '[]');
    const isUnique = !existing.includes(username.toLowerCase());
    console.log('Username check:', username, 'unique:', isUnique);
    return isUnique;
}

// Register new username
function registerUsername(username) {
    const existing = JSON.parse(localStorage.getItem('nope_usernames') || '[]');
    existing.push(username.toLowerCase());
    localStorage.setItem('nope_usernames', JSON.stringify(existing));
    console.log('Registered username:', username);
    return true;
}

// Initialize login page
function initLoginPage() {
    console.log('Initializing login page...');
    
    const form = document.getElementById('loginForm');
    const anonInput = document.getElementById('anonUsername');
    const submitBtn = document.getElementById('submitBtn');
    const tgDisplay = document.getElementById('telegramUsernameDisplay');
    
    if (!form) {
        console.error('Form not found!');
        return;
    }
    
    if (!anonInput) console.error('anonInput not found');
    if (!submitBtn) console.error('submitBtn not found');
    if (!tgDisplay) console.error('tgDisplay not found');
    
    // Get Telegram user data
    const tgUser = getTelegramUserData();
    const tgUsername = tgUser.username;
    
    console.log('Telegram user:', tgUsername);
    
    // Display Telegram username
    if (tgDisplay) {
        tgDisplay.textContent = '@' + tgUsername;
    }
    
    // Save Telegram username to localStorage
    localStorage.setItem(CONFIG.STORAGE_KEYS.TELEGRAM_USERNAME, tgUsername);
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER_ID, tgUser.id.toString());
    
    // Clear any previous login state (for testing)
    localStorage.removeItem(CONFIG.STORAGE_KEYS.LOGGED_IN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.ONBOARDING_COMPLETE);
    
    // Username validation
    if (anonInput) {
        anonInput.addEventListener('input', function() {
            const username = this.value.trim();
            const feedback = document.getElementById('usernameFeedback');
            
            console.log('Username input:', username);
            
            if (!feedback) {
                console.error('Feedback element not found');
                return;
            }
            
            // Validation rules
            if (username.length < 3) {
                feedback.textContent = 'min 3 characters';
                feedback.style.color = 'rgba(255, 255, 255, 0.4)';
                if (submitBtn) submitBtn.disabled = true;
            } else if (username.length > 20) {
                feedback.textContent = 'max 20 characters';
                feedback.style.color = 'rgba(255, 255, 255, 0.4)';
                if (submitBtn) submitBtn.disabled = true;
            } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                feedback.textContent = 'letters, numbers, underscore only';
                feedback.style.color = 'rgba(255, 255, 255, 0.4)';
                if (submitBtn) submitBtn.disabled = true;
            } else if (!isUsernameUnique(username)) {
                feedback.textContent = 'username taken';
                feedback.style.color = 'rgba(255, 59, 48, 0.7)';
                if (submitBtn) submitBtn.disabled = true;
            } else {
                feedback.textContent = '✓ available';
                feedback.style.color = 'rgba(52, 199, 89, 0.7)';
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
    
    // Form submission - FIXED VERSION
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted!');
        
        const anonUsername = anonInput ? anonInput.value.trim() : '';
        console.log('Submitting username:', anonUsername);
        
        // Final validation
        if (anonUsername.length < 3 || anonUsername.length > 20) {
            showNotification('Username must be 3-20 characters', 'error');
            return;
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(anonUsername)) {
            showNotification('Invalid characters in username', 'error');
            return;
        }
        
        if (!isUsernameUnique(anonUsername)) {
            showNotification('Username is already taken', 'error');
            return;
        }
        
        // Show loading state
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
        }
        
        // Simulate API processing
        setTimeout(() => {
            try {
                // Register username
                registerUsername(anonUsername);
                
                // Save to localStorage
                localStorage.setItem(CONFIG.STORAGE_KEYS.ANON_USERNAME, anonUsername);
                localStorage.setItem(CONFIG.STORAGE_KEYS.LOGGED_IN, 'true');
                
                console.log('Login successful, redirecting to rage.html');
                console.log('Stored username:', anonUsername);
                console.log('Stored login state:', localStorage.getItem(CONFIG.STORAGE_KEYS.LOGGED_IN));
                
                showNotification(`Welcome, ${anonUsername}`);
                
                // REDIRECT TO ONBOARDING - ABSOLUTE URL
                setTimeout(() => {
                    // Use absolute path
                    window.location.href = '/rage.html';
                    
                    // Fallback after 2 seconds
                    setTimeout(() => {
                        if (window.location.pathname.includes('login.html')) {
                            console.log('Redirect failed, trying relative path');
                            window.location.href = 'rage.html';
                        }
                    }, 2000);
                }, 800);
                
            } catch (error) {
                console.error('Login error:', error);
                showNotification('Login failed. Please try again.', 'error');
                if (submitBtn) {
                    submitBtn.textContent = 'GO';
                    submitBtn.disabled = false;
                }
            }
        }, 500);
    });
    
    // Auto-focus
    if (anonInput) {
        anonInput.focus();
    }
    
    console.log('Login page initialized successfully');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing NOPE...');
    
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
    
    // Initialize based on current page
    const currentPage = window.location.pathname;
    console.log('Current page:', currentPage);
    
    if (currentPage.includes('login.html') || currentPage === '/' || currentPage.endsWith('/')) {
        initLoginPage();
    }
});

// Debug helper
window.debugNOPE = function() {
    console.log('=== NOPE DEBUG INFO ===');
    console.log('Current URL:', window.location.href);
    console.log('LocalStorage:');
    console.log('- Logged in:', localStorage.getItem('nope_logged_in'));
    console.log('- Username:', localStorage.getItem('nope_anon_username'));
    console.log('- Telegram:', localStorage.getItem('nope_tg_username'));
    console.log('=======================');
    
    // Clear and reset
    const clear = confirm('Clear all NOPE data?');
    if (clear) {
        localStorage.clear();
        console.log('LocalStorage cleared');
        window.location.reload();
    }
};
