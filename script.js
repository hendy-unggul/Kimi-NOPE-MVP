// Di dalam form submit handler, ganti dengan:
setTimeout(() => {
    // Save data
    localStorage.setItem(CONFIG.STORAGE_KEYS.ANON_USERNAME, anonUsername);
    localStorage.setItem(CONFIG.STORAGE_KEYS.LOGGED_IN, 'true');
    
    console.log('Login successful, redirecting...');
    
    // REDIRECT DENGAN ABSOLUTE PATH
    window.location.href = window.location.origin + '/rage.html';
    
    // Fallback jika gagal
    setTimeout(() => {
        if (window.location.pathname.includes('login')) {
            console.log('Fallback redirect');
            window.location.href = 'rage.html';
        }
    }, 1000);
}, 500);
