// ============================================
// BLITZ - GLOBAL SCRIPT
// ============================================

// CONFIGURASI
const CONFIG = {
    APP_NAME: 'Blitz',
    VERSION: '1.0.0',
    MAX_HASHTAG_SELECTION: 3,
    MAX_CHARACTERS: 280,
    STORAGE_KEYS: {
        USERNAME: 'blitz_username',
        LOGGED_IN: 'blitz_logged_in',
        ONBOARDING_COMPLETE: 'blitz_onboarding_complete',
        SELECTED_HASHTAGS: 'blitz_selected_hashtags',
        USER_AVATAR: 'blitz_user_avatar'
    }
};

// DATA HASHTAG
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
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.LOGGED_IN) === 'true';
}

/**
 * Check if onboarding is complete
 */
function isOnboardingComplete() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
}

/**
 * Get current username
 */
function getUsername() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME) || 'Pengguna';
}

/**
 * Get selected hashtags
 */
function getSelectedHashtags() {
    const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.SELECTED_HASHTAGS);
    return stored ? JSON.parse(stored) : [];
}

/**
 * Save selected hashtags
 */
function saveSelectedHashtags(hashtags) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.SELECTED_HASHTAGS, JSON.stringify(hashtags));
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotif = document.querySelector('.blitz-notification');
    if (existingNotif) existingNotif.remove();

    // Determine color based on type
    let color = '#06d6a0'; // default success
    if (type === 'error') color = '#ff6b6b';
    if (type === 'warning') color = '#ffd166';
    if (type === 'info') color = '#4d8af0';

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'blitz-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'check-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
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
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Redirect to page with validation
 */
function redirectTo(page) {
    // Check login for protected pages
    const protectedPages = ['rage.html', 'wall.html', 'profile.html'];
    
    if (protectedPages.includes(page) && !isLoggedIn()) {
        showNotification('Silakan login terlebih dahulu', 'error');
        window.location.href = 'index.html';
        return;
    }

    // Check onboarding for wall page
    if (page === 'wall.html' && !isOnboardingComplete()) {
        showNotification('Silakan selesaikan onboarding terlebih dahulu', 'warning');
        window.location.href = 'rage.html';
        return;
    }

    window.location.href = page;
}

/**
 * Logout function
 */
function logout() {
    if (confirm('Yakin ingin logout?')) {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.LOGGED_IN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USERNAME);
        showNotification('Berhasil logout', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

/**
 * Initialize character counter
 */
function initCharCounter(textareaId, counterId) {
    const textarea = document.getElementById(textareaId);
    const counter = document.getElementById(counterId);
    
    if (!textarea || !counter) return;
    
    textarea.addEventListener('input', function() {
        const count = this.value.length;
        counter.textContent = count;
        
        // Update color
        counter.style.color = '#aaa';
        if (count > 200) counter.style.color = '#ffd166';
        if (count >= 270) counter.style.color = '#ff6b6b';
        
        // Disable/enable submit button
        const submitBtn = document.querySelector('.btn-lampiaskan');
        if (submitBtn) {
            submitBtn.disabled = count < 10 || count > CONFIG.MAX_CHARACTERS;
        }
    });
}

// ============================================
// PAGE-SPECIFIC INITIALIZATIONS
// ============================================

/**
 * Initialize login page
 */
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username')?.value || '';
            const password = document.getElementById('password')?.value || '';
            
            // Simple validation
            if (!username.trim() || !password.trim()) {
                showNotification('Username dan password harus diisi', 'error');
                return;
            }
            
            // Save user data
            localStorage.setItem(CONFIG.STORAGE_KEYS.USERNAME, username);
            localStorage.setItem(CONFIG.STORAGE_KEYS.LOGGED_IN, 'true');
            
            showNotification(`Selamat datang ${username}!`, 'info');
            
            // Redirect to onboarding
            setTimeout(() => {
                redirectTo('rage.html');
            }, 1500);
        });
        
        // Demo credentials
        const demoUser = document.getElementById('demoUser');
        const demoPass = document.getElementById('demoPass');
        
        if (demoUser && demoPass) {
            demoUser.addEventListener('click', function() {
                document.getElementById('username').value = 'user123';
                document.getElementById('password').value = 'blitz2023';
            });
            
            demoPass.addEventListener('click', function() {
                document.getElementById('username').value = 'user123';
                document.getElementById('password').value = 'blitz2023';
            });
        }
    }
}

/**
 * Initialize onboarding page
 */
function initOnboardingPage() {
    // Display username
    const usernameDisplay = document.getElementById('usernameDisplay');
    const userWelcome = document.getElementById('userWelcome');
    
    if (usernameDisplay && userWelcome) {
        const username = getUsername();
        usernameDisplay.textContent = username;
        userWelcome.textContent = `Halo ${username}! Pilih 3 hashtag yang paling mewakili kekesalanmu`;
    }
    
    // Render hashtags
    const hashtagSelection = document.getElementById('hashtagSelection');
    if (hashtagSelection) {
        renderHashtags();
    }
    
    // Start button
    const btnStart = document.getElementById('btnStart');
    if (btnStart) {
        btnStart.addEventListener('click', function() {
            const selectedHashtags = getSelectedHashtags();
            
            if (selectedHashtags.length !== CONFIG.MAX_HASHTAG_SELECTION) {
                showNotification(`Pilih ${CONFIG.MAX_HASHTAG_SELECTION} hashtag terlebih dahulu`, 'error');
                return;
            }
            
            // Save onboarding complete
            localStorage.setItem(CONFIG.STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
            
            showNotification('Onboarding selesai! Mengarahkan ke Dinding Kekesalan...', 'info');
            
            setTimeout(() => {
                redirectTo('wall.html');
            }, 1500);
        });
    }
}

/**
 * Initialize wall page
 */
function initWallPage() {
    // Display user info
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userName) {
        userName.textContent = getUsername();
    }
    
    if (userAvatar) {
        const username = getUsername();
        userAvatar.textContent = username.charAt(0).toUpperCase();
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Distribute hashtags to walls
    distributeHashtags();
    
    // Initialize character counter for rage window
    initCharCounter('kekesalanTextarea', 'charCount');
    
    // Post rage button
    const btnLampiaskan = document.getElementById('btnLampiaskan');
    if (btnLampiaskan) {
        btnLampiaskan.addEventListener('click', postRage);
    }
}

// ============================================
// HASHTAG MANAGEMENT
// ============================================

let selectedHashtagIds = [];

function renderHashtags() {
    const container = document.getElementById('hashtagSelection');
    if (!container) return;
    
    container.innerHTML = '';
    
    HASHTAGS.forEach(hashtag => {
        const isSelected = selectedHashtagIds.includes(hashtag.id);
        
        const hashtagElement = document.createElement('div');
        hashtagElement.className = `hashtag-option ${isSelected ? 'selected' : ''}`;
        hashtagElement.dataset.id = hashtag.id;
        
        hashtagElement.innerHTML = `
            <div class="hashtag-name">${hashtag.name}</div>
            <div class="hashtag-category">${hashtag.category}</div>
            <div style="color: #06d6a0; font-weight: 600;">
                ${hashtag.posts} posts
            </div>
            <div style="margin-top: 15px; color: #aaa; font-size: 0.9rem;">
                ${isSelected ? '✓ Terpilih' : 'Klik untuk memilih'}
            </div>
        `;
        
        hashtagElement.addEventListener('click', () => toggleHashtagSelection(hashtag.id));
        container.appendChild(hashtagElement);
    });
    
    updateSelectionCounter();
}

function toggleHashtagSelection(id) {
    const index = selectedHashtagIds.indexOf(id);
    
    if (index === -1) {
        // Add if not reached max
        if (selectedHashtagIds.length < CONFIG.MAX_HASHTAG_SELECTION) {
            selectedHashtagIds.push(id);
        } else {
            showNotification(`Maksimal ${CONFIG.MAX_HASHTAG_SELECTION} hashtag yang bisa dipilih`, 'warning');
            return;
        }
    } else {
        // Remove if already selected
        selectedHashtagIds.splice(index, 1);
    }
    
    // Save to storage
    const selectedNames = selectedHashtagIds.map(id => {
        const hashtag = HASHTAGS.find(h => h.id === id);
        return hashtag ? hashtag.name : '';
    }).filter(name => name);
    
    saveSelectedHashtags(selectedNames);
    
    // Update UI
    renderHashtags();
    updateStartButton();
}

function updateSelectionCounter() {
    const counter = document.getElementById('selectedCount');
    if (counter) {
        counter.textContent = selectedHashtagIds.length;
        
        // Update color
        if (selectedHashtagIds.length === CONFIG.MAX_HASHTAG_SELECTION) {
            counter.style.color = '#ff6b6b';
        } else if (selectedHashtagIds.length > 0) {
            counter.style.color = '#ffd166';
        } else {
            counter.style.color = '#06d6a0';
        }
    }
}

function updateStartButton() {
    const btnStart = document.getElementById('btnStart');
    if (btnStart) {
        btnStart.disabled = selectedHashtagIds.length !== CONFIG.MAX_HASHTAG_SELECTION;
    }
}

function distributeHashtags() {
    const selectedHashtags = getSelectedHashtags();
    
    // Sefrekuensi (3 hashtag yang sama)
    const sefrekuensiHashtags = selectedHashtags.slice(0, 3);
    renderWall('sefrekuensiList', sefrekuensiHashtags, 'sefrekuensi');
    
    // Segelombang Biru (2 hashtag yang sama)
    const biruHashtags = selectedHashtags.slice(3, 5);
    if (biruHashtags.length < 2) {
        // Add random hashtags if needed
        const remaining = HASHTAGS
            .filter(h => !selectedHashtags.includes(h.name))
            .slice(0, 2 - biruHashtags.length)
            .map(h => h.name);
        biruHashtags.push(...remaining);
    }
    renderWall('biruList', biruHashtags, 'biru');
    
    // Segelombang Merah (2 hashtag yang sama)
    const merahHashtags = selectedHashtags.slice(5, 7);
    if (merahHashtags.length < 2) {
        const remaining = HASHTAGS
            .filter(h => !selectedHashtags.includes(h.name) && !biruHashtags.includes(h.name))
            .slice(0, 2 - merahHashtags.length)
            .map(h => h.name);
        merahHashtags.push(...remaining);
    }
    renderWall('merahList', merahHashtags, 'merah');
}

function renderWall(containerId, hashtagNames, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    hashtagNames.forEach(name => {
        const hashtagData = HASHTAGS.find(h => h.name === name) || 
                           { name, category: 'General', posts: Math.floor(Math.random() * 200) + 50 };
        
        const hashtagItem = document.createElement('div');
        hashtagItem.className = 'hashtag-item';
        hashtagItem.dataset.name = hashtagData.name;
        hashtagItem.dataset.type = type;
        
        hashtagItem.innerHTML = `
            <div class="hashtag-name">${hashtagData.name}</div>
            <div class="hashtag-meta">
                <div class="hashtag-category">${hashtagData.category}</div>
                <div class="hashtag-count">${hashtagData.posts} posts</div>
            </div>
        `;
        
        hashtagItem.addEventListener('click', function() {
            selectWallHashtag(hashtagData.name, type);
        });
        
        container.appendChild(hashtagItem);
    });
}

let selectedWallHashtag = null;

function selectWallHashtag(name, type) {
    selectedWallHashtag = { name, type };
    
    // Update UI
    const selectedHashtagName = document.getElementById('selectedHashtagName');
    const selectedHashtagInfo = document.getElementById('selectedHashtagInfo');
    
    if (selectedHashtagName) selectedHashtagName.textContent = name;
    if (selectedHashtagInfo) selectedHashtagInfo.style.display = 'block';
    
    // Enable textarea
    const textarea = document.getElementById('kekesalanTextarea');
    if (textarea) {
        textarea.disabled = false;
        textarea.placeholder = `Tulis kekesalanmu tentang ${name}...`;
        textarea.focus();
    }
    
    // Update button
    const btnLampiaskan = document.getElementById('btnLampiaskan');
    if (btnLampiaskan) {
        btnLampiaskan.disabled = false;
    }
    
    showNotification(`${name} dipilih`, 'info');
}

function postRage() {
    const textarea = document.getElementById('kekesalanTextarea');
    const kekesalan = textarea ? textarea.value.trim() : '';
    
    if (!selectedWallHashtag) {
        showNotification('Pilih hashtag terlebih dahulu', 'error');
        return;
    }
    
    if (kekesalan.length < 10) {
        showNotification('Minimal 10 karakter', 'error');
        return;
    }
    
    if (kekesalan.length > CONFIG.MAX_CHARACTERS) {
        showNotification(`Maksimal ${CONFIG.MAX_CHARACTERS} karakter`, 'error');
        return;
    }
    
    const btnLampiaskan = document.getElementById('btnLampiaskan');
    if (btnLampiaskan) {
        btnLampiaskan.innerHTML = '<i class="fas fa-spinner fa-spin"></i> MENGIRIM...';
        btnLampiaskan.disabled = true;
    }
    
    // Simulate API call
    setTimeout(() => {
        showNotification(`Kekesalanmu berhasil diposting ke ${selectedWallHashtag.name}!`, 'info');
        
        // Reset form
        if (textarea) textarea.value = '';
        const charCount = document.getElementById('charCount');
        if (charCount) charCount.textContent = '0';
        
        const selectedHashtagInfo = document.getElementById('selectedHashtagInfo');
        if (selectedHashtagInfo) selectedHashtagInfo.style.display = 'none';
        
        selectedWallHashtag = null;
        
        // Reset button
        if (btnLampiaskan) {
            btnLampiaskan.innerHTML = '<i class="fas fa-fire"></i> POSTING KE DINDING';
            btnLampiaskan.disabled = true;
        }
    }, 1500);
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
    `;
    document.head.appendChild(style);
    
    // Initialize based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initLoginPage();
            break;
        case 'rage.html':
            initOnboardingPage();
            break;
        case 'wall.html':
            initWallPage();
            break;
        case 'profile.html':
            // Initialize profile page later
            break;
        case 'tray.html':
            // Initialize tray page later
            break;
    }
    
    // Load selected hashtag IDs on onboarding page
    if (currentPage === 'rage.html') {
        const savedHashtags = getSelectedHashtags();
        selectedHashtagIds = savedHashtags.map(name => {
            const hashtag = HASHTAGS.find(h => h.name === name);
            return hashtag ? hashtag.id : null;
        }).filter(id => id !== null);
        renderHashtags();
    }
});
