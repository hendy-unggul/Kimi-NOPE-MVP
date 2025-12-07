// ============================================
// NOPE - GLOBAL SCRIPT
// ============================================

// CONFIGURASI
const CONFIG = {
    APP_NAME: 'NOPE',
    VERSION: '1.0.0',
    MAX_HASHTAG_SELECTION: 3,
    MAX_CHARACTERS: 280,
    STORAGE_KEYS: {
        ANON_USERNAME: 'nope_anon_username',
        TELEGRAM_USERNAME: 'nope_telegram_username',
        LOGGED_IN: 'nope_logged_in',
        ONBOARDING_COMPLETE: 'nope_onboarding_complete',
        SELECTED_HASHTAGS: 'nope_selected_hashtags'
    }
};

// DATA HASHTAG NOPE
const HASHTAGS = [
    { id: 1, name: '#MagangDigajiSertifikat', category: 'Personal Pain', posts: 245 },
    { id: 2, name: '#DiajakJalanTapiKempes', category: 'Personal Pain', posts: 178 },
    { id: 3, name: '#DiphostingGebetan', category: 'Personal Pain', posts: 312 },
    { id: 4, name: '#DramaQueenAnjay', category: 'Social Sickness', posts: 189 },
    { id: 5, name: '#BacotLambeTurah', category: 'Social Sickness', posts: 321 },
    { id: 6, name: '#RencanaPlinPlan', category: 'Social Sickness', posts: 267 },
    { id: 7, name: '#BellTiketJualSinjal', category: 'Pop Culture', posts: 89 },
    { id: 8, name: '#InfluencerNgchek', category: 'Pop Culture', posts: 203 },
    { id: 9, name: '#FilmEndingGaje', category: 'Pop Culture', posts: 142 }
];

// ============================================
// TELEGRAM MINI APP INTEGRATION
// ============================================

// Clear any service worker issues
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
        }
    });
}

// Clear caches
if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
        cacheNames.forEach(function(cacheName) {
            caches.delete(cacheName);
        });
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.LOGGED_IN) === 'true';
}

/**
 * Get current anon username
 */
function getAnonUsername() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.ANON_USERNAME) || 'AnonUser';
}

/**
 * Get Telegram username
 */
function getTelegramUsername() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.TELEGRAM_USERNAME) || '@user';
}

/**
 * Check if username is unique (simulated)
 */
function isUsernameUnique(username) {
    // In real app, this would check with backend
    const existingUsers = JSON.parse(localStorage.getItem('nope_all_users') || '[]');
    return !existingUsers.includes(username.toLowerCase());
}

/**
 * Register new anon username
 */
function registerAnonUsername(username) {
    if (!isUsernameUnique(username)) {
        return { success: false, message: 'Username sudah dipakai' };
    }
    
    // Save to "database"
    const existingUsers = JSON.parse(localStorage.getItem('nope_all_users') || '[]');
    existingUsers.push(username.toLowerCase());
    localStorage.setItem('nope_all_users', JSON.stringify(existingUsers));
    
    return { success: true };
}

// ============================================
// LOGIN PAGE INITIALIZATION
// ============================================

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    // Auto-fill Telegram username from URL or mock
    const urlParams = new URLSearchParams(window.location.search);
    const tgUser = urlParams.get('tg_user') || urlParams.get('username') || 'telegram_user';
    
    const tgInput = document.getElementById('telegramUsername');
    if (tgInput) {
        tgInput.value = tgUser;
        tgInput.readOnly = true;
        tgInput.style.opacity = '0.7';
    }
    
    // Focus on anon username input
    const anonInput = document.getElementById('anonUsername');
    if (anonInput) {
        anonInput.focus();
        
        // Real-time validation
        anonInput.addEventListener('input', function() {
            const username = this.value.trim();
            const feedback = document.getElementById('usernameFeedback') || 
                            document.createElement('div');
            
            if (!feedback.id) {
                feedback.id = 'usernameFeedback';
                feedback.style.marginTop = '5px';
                feedback.style.fontSize = '0.8rem';
                this.parentNode.appendChild(feedback);
            }
            
            if (username.length < 3) {
                feedback.textContent = 'Minimal 3 karakter';
                feedback.style.color = '#ff6b6b';
            } else if (username.length > 20) {
                feedback.textContent = 'Maksimal 20 karakter';
                feedback.style.color = '#ff6b6b';
            } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                feedback.textContent = 'Hanya huruf, angka, underscore';
                feedback.style.color = '#ff6b6b';
            } else if (!isUsernameUnique(username)) {
                feedback.textContent = 'Username sudah terpakai';
                feedback.style.color = '#ff6b6b';
            } else {
                feedback.textContent = '✓ Username tersedia';
                feedback.style.color = '#06d6a0';
            }
        });
    }
    
    // Form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const telegramUsername = tgInput ? tgInput.value.trim() : '';
        const anonUsername = anonInput ? anonUsernameInput.value.trim() : '';
        
        // Validations
        if (!anonUsername || anonUsername.length < 3) {
            showNotification('Username anonim minimal 3 karakter', 'error');
            return;
        }
        
        if (anonUsername.length > 20) {
            showNotification('Username anonim maksimal 20 karakter', 'error');
            return;
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(anonUsername)) {
            showNotification('Username hanya boleh huruf, angka, underscore', 'error');
            return;
        }
        
        // Check uniqueness
        const uniqueCheck = registerAnonUsername(anonUsername);
        if (!uniqueCheck.success) {
            showNotification(uniqueCheck.message, 'error');
            return;
        }
        
        // Save user data
        localStorage.setItem(CONFIG.STORAGE_KEYS.TELEGRAM_USERNAME, telegramUsername);
        localStorage.setItem(CONFIG.STORAGE_KEYS.ANON_USERNAME, anonUsername);
        localStorage.setItem(CONFIG.STORAGE_KEYS.LOGGED_IN, 'true');
        
        showNotification(`Selamat datang, ${anonUsername}!`, 'info');
        
        // Redirect to onboarding
        setTimeout(() => {
            window.location.href = 'rage.html';
        }, 1500);
    });
}

// ============================================
// AUTO-INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION} initialized`);
    
    // Add global styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .blitz-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #06d6a0;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            font-weight: 600;
            max-width: 300px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'login.html':
        case 'index.html':
        case '':
            initLoginPage();
            break;
        case 'rage.html':
            // Will be initialized later
            break;
    }
});

// Keep existing functions for other pages (hashtag, wall, etc.)
// ... (functions from previous script remain the same, just update CONFIG references)
