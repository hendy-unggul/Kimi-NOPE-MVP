document.addEventListener('DOMContentLoaded', function() {
    console.log('NOPE loaded successfully! 🚀');
    
    // State management
    let isRegisterMode = true;
    let selectedHashtags = [];
    const MAX_HASHTAGS = 3;
    
    // DOM Elements
    const formTitle = document.getElementById('formTitle');
    const formSubtitle = document.getElementById('formSubtitle');
    const telegramInput = document.getElementById('telegramUsername');
    const hashtagsSection = document.getElementById('hashtagsSection');
    const hashtagOptions = document.querySelectorAll('.hashtag-option');
    const selectedHashtagsEl = document.getElementById('selectedHashtags');
    const submitBtn = document.getElementById('submitBtn');
    const toggleBtn = document.getElementById('toggleBtn');
    const toggleText = document.getElementById('toggleText');
    const loading = document.getElementById('loading');
    const successMessage = document.getElementById('successMessage');
    const goToDashboardBtn = document.getElementById('goToDashboard');
    
    // API Endpoint (Simulasi)
    const API_ENDPOINT = 'https://api.nope.example.com'; // Ganti dengan endpoint sebenarnya
    
    // Toggle between Register/Login
    toggleBtn.addEventListener('click', function() {
        isRegisterMode = !isRegisterMode;
        
        if (isRegisterMode) {
            // Switch to Register mode
            formTitle.textContent = 'Register to NOPE';
            formSubtitle.textContent = 'Create your anonymous identity';
            submitBtn.innerHTML = '<i class="fas fa-fingerprint"></i> CREATE NOPE IDENTITY';
            submitBtn.className = 'submit-btn';
            hashtagsSection.style.display = 'block';
            toggleText.textContent = 'Already have an account?';
            toggleBtn.textContent = 'Login instead';
        } else {
            // Switch to Login mode
            formTitle.textContent = 'Login to NOPE';
            formSubtitle.textContent = 'Access your anonymous identity';
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> LOGIN TO NOPE';
            submitBtn.className = 'submit-btn login-mode';
            hashtagsSection.style.display = 'none';
            toggleText.textContent = 'New to NOPE?';
            toggleBtn.textContent = 'Register instead';
        }
        
        // Reset selected hashtags
        selectedHashtags = [];
        updateSelectedHashtags();
        
        // Clear input
        telegramInput.value = '';
        
        console.log(`Switched to ${isRegisterMode ? 'Register' : 'Login'} mode`);
    });
    
    // Hashtag selection
    hashtagOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (!isRegisterMode) return; // Only for register mode
            
            const hashtag = this.textContent;
            
            if (this.classList.contains('selected')) {
                // Deselect
                this.classList.remove('selected');
                selectedHashtags = selectedHashtags.filter(tag => tag !== hashtag);
            } else {
                // Check if max limit reached
                if (selectedHashtags.length >= MAX_HASHTAGS) {
                    alert(`You can only select ${MAX_HASHTAGS} hashtags`);
                    return;
                }
                
                // Select
                this.classList.add('selected');
                selectedHashtags.push(hashtag);
            }
            
            updateSelectedHashtags();
        });
    });
    
    // Update selected hashtags display
    function updateSelectedHashtags() {
        if (selectedHashtags.length === 0) {
            selectedHashtagsEl.innerHTML = '<span class="selected-tag">No hashtags selected yet</span>';
            return;
        }
        
        selectedHashtagsEl.innerHTML = '';
        selectedHashtags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'selected-tag';
            span.textContent = tag;
            selectedHashtagsEl.appendChild(span);
        });
        
        // Add counter
        const counter = document.createElement('span');
        counter.className = 'selected-tag';
        counter.textContent = `${selectedHashtags.length}/${MAX_HASHTAGS}`;
        counter.style.background = 'rgba(255, 255, 255, 0.1)';
        selectedHashtagsEl.appendChild(counter);
    }
    
    // Validate Telegram username
    function validateTelegramUsername(username) {
        if (!username) {
            return 'Please enter your Telegram username';
        }
        
        // Clean input
        username = username.trim();
        
        // Remove @ if user included it
        if (username.startsWith('@')) {
            username = username.substring(1);
        }
        
        // Basic validation
        if (username.length < 5) {
            return 'Username is too short';
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return 'Username can only contain letters, numbers, and underscores';
        }
        
        return {
            valid: true,
            username: username
        };
    }
    
    // Submit form
    submitBtn.addEventListener('click', async function() {
        // Validate input
        const validation = validateTelegramUsername(telegramInput.value);
        
        if (typeof validation === 'string') {
            alert(validation);
            telegramInput.focus();
            return;
        }
        
        const { username } = validation;
        
        // Validate hashtags for register mode
        if (isRegisterMode && selectedHashtags.length !== MAX_HASHTAGS) {
            alert(`Please select exactly ${MAX_HASHTAGS} rage hashtags`);
            return;
        }
        
        // Show loading
        loading.style.display = 'block';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call (Replace with actual API call)
            console.log(`Submitting ${isRegisterMode ? 'Register' : 'Login'} for @${username}`);
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // For demo purposes - simulate success
            simulateSuccess(username);
            
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            loading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
    
    // Simulate successful registration/login
    function simulateSuccess(username) {
        // Hide form, show success message
        document.querySelector('.form-header').style.display = 'none';
        telegramInput.style.display = 'none';
        hashtagsSection.style.display = 'none';
        submitBtn.style.display = 'none';
        document.querySelector('.toggle-form').style.display = 'none';
        
        // Update success message
        const message = isRegisterMode 
            ? `Your anonymous NOPE identity has been created for @${username}!`
            : `Welcome back @${username}! Your identity is protected.`;
        
        successMessage.querySelector('p').textContent = message;
        successMessage.style.display = 'block';
        
        // Log to console
        console.log(`${isRegisterMode ? 'Registration' : 'Login'} successful for @${username}`);
        if (isRegisterMode) {
            console.log('Selected hashtags:', selectedHashtags);
        }
    }
    
    // Go to dashboard
    goToDashboardBtn.addEventListener('click', function() {
        alert('Redirecting to dashboard...');
        // In real app: window.location.href = '/dashboard';
    });
    
    // Enter key to submit
    telegramInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
    
    // Auto-focus input
    telegramInput.focus();
    
    // Console welcome message
    console.log(`
    ╔══════════════════════════════════════════╗
    ║                                          ║
    ║   NOPE Anonymous Platform Ready!         ║
    ║                                          ║
    ║   Mode: Register                         ║
    ║   Input: Telegram username only          ║
    ║   No Telegram app needed!                ║
    ║                                          ║
    ╚══════════════════════════════════════════╝
    `);
});
