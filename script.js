// NOPE - Telegram Mini App Login
const CONFIG = {
    APP_NAME: 'NOPE',
    STORAGE_KEYS: {
        ANON_USERNAME: 'nope_anon_username',
        TELEGRAM_USERNAME: 'nope_tg_username',
        LOGGED_IN: 'nope_logged_in'
    }
};

// Clear any service worker issues
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(reg => reg.unregister());
    });
}

// Simulate Telegram WebApp data
function getTelegramUserData() {
    // In real app: return window.Telegram.WebApp.initDataUnsafe.user
    return {
        username: 'telegram_user_' + Math.floor(Math.random() * 10000),
        first_name: 'Telegram',
        last_name: 'User'
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
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'nope-notification';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff3b30' : '#34c759'};
        color: white;
        padding: 16px 24px;
        border-radius: 14px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: 600;
        max-width: 300px;
        backdrop-filter: blur(20px);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize login page
function initLoginPage() {
    const form = document.getElementById('loginForm');
    const anonInput = document.getElementById('anonUsername');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!form || !anonInput || !submitBtn) return;
    
    // Get Telegram user data
    const tgUser = getTelegramUserData();
    const tgUsername = tgUser.username || 'telegram_user';
    
    // Set Telegram username (readonly)
    const tgInput = document.getElementById('telegramUsername');
    if (tgInput) {
        tgInput.value = `@${tgUsername}`;
    }
    
    // Username validation
    anonInput.addEventListener('input', function() {
        const username = this.value.trim();
        const feedback = document.getElementById('usernameFeedback') || 
                        document.createElement('div');
        
        if (!feedback.id) {
            feedback.id = 'usernameFeedback';
            feedback.style.marginTop = '8px';
            feedback.style.fontSize = '0.85rem';
            feedback.style.fontWeight = '500';
            feedback.style.padding = '8px 12px';
            feedback.style.borderRadius = '10px';
            this.parentNode.appendChild(feedback);
        }
        
        // Validation rules
        if (username.length < 3) {
            feedback.textContent = 'Minimum 3 characters';
            feedback.style.background = 'rgba(255, 59, 48, 0.1)';
            feedback.style.color = '#ff3b30';
            feedback.style.border = '1px solid rgba(255, 59, 48, 0.2)';
            submitBtn.disabled = true;
        } else if (username.length > 20) {
            feedback.textContent = 'Maximum 20 characters';
            feedback.style.background = 'rgba(255, 59, 48, 0.1)';
            feedback.style.color = '#ff3b30';
            feedback.style.border = '1px solid rgba(255, 59, 48, 0.2)';
            submitBtn.disabled = true;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            feedback.textContent = 'Only letters, numbers, underscore';
            feedback.style.background = 'rgba(255, 59, 48, 0.1)';
            feedback.style.color = '#ff3b30';
            feedback.style.border = '1px solid rgba(255, 59, 48, 0.2)';
            submitBtn.disabled = true;
        } else if (!isUsernameUnique(username)) {
            feedback.textContent = 'Username already taken';
            feedback.style.background = 'rgba(255, 59, 48, 0.1)';
            feedback.style.color = '#ff3b30';
            feedback.style.border = '1px solid rgba(255, 59, 48, 0.2)';
            submitBtn.disabled = true;
        } else {
            feedback.textContent = '✓ Available';
            feedback.style.background = 'rgba(52, 199, 89, 0.1)';
            feedback.style.color = '#34c759';
            feedback.style.border = '1px solid rgba(52, 199, 89, 0.2)';
            submitBtn.disabled = false;
        }
    });
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const anonUsername = anonInput.value.trim();
        
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
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> CREATING IDENTITY...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Register username
            registerUsername(anonUsername);
            
            // Save to localStorage
            localStorage.setItem(CONFIG.STORAGE_KEYS.TELEGRAM_USERNAME, tgUsername);
            localStorage.setItem(CONFIG.STORAGE_KEYS.ANON_USERNAME, anonUsername);
            localStorage.setItem(CONFIG.STORAGE_KEYS.LOGGED_IN, 'true');
            
            showNotification(`Welcome, ${anonUsername}!`, 'success');
            
            // Redirect to onboarding
            setTimeout(() => {
                window.location.href = 'rage.html';
            }, 1500);
        }, 1000);
    });
    
    // Focus on input
    anonInput.focus();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('NOPE — Anonymous Rage Platform');
    
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
        
        /* Smooth focus animation */
        input:focus {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;
    document.head.appendChild(style);
    
    // Initialize login page
    initLoginPage();
});
