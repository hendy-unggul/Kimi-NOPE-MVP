document.addEventListener('DOMContentLoaded', function() {
    console.log('NOPE - Anonymous Register/Login Loaded');
    
    // Elements
    const telegramInput = document.getElementById('telegramInput');
    const submitBtn = document.getElementById('submitBtn');
    const loginLink = document.getElementById('loginLink');
    
    // Auto-focus input
    telegramInput.focus();
    
    // Generate anonymous username
    function generateAnonymousId() {
        const adjectives = ['Silent', 'Ghost', 'Shadow', 'Hidden', 'Unknown', 'Secret', 'Mystery', 'Anonymous'];
        const nouns = ['Rager', 'Whisper', 'Phantom', 'Specter', 'Wraith', 'Stranger', 'Voyager', 'Observer'];
        const randomNum = Math.floor(Math.random() * 999) + 1;
        
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        
        return `${adj}_${noun}_${randomNum}`;
    }
    
    // Validate Telegram username
    function validateUsername(username) {
        if (!username || username.trim() === '') {
            return { valid: false, message: 'Please enter your Telegram username' };
        }
        
        let cleanUsername = username.trim();
        
        // Remove @ if present
        if (cleanUsername.startsWith('@')) {
            cleanUsername = cleanUsername.substring(1);
        }
        
        // Check length
        if (cleanUsername.length < 5) {
            return { valid: false, message: 'Username must be at least 5 characters' };
        }
        
        // Check format
        if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
            return { valid: false, message: 'Only letters, numbers, and underscores allowed' };
        }
        
        return { 
            valid: true, 
            username: cleanUsername,
            displayName: `@${cleanUsername}`
        };
    }
    
    // Handle Submit (Register/Login)
    submitBtn.addEventListener('click', async function() {
        // Validate
        const usernameValidation = validateUsername(telegramInput.value);
        if (!usernameValidation.valid) {
            alert(usernameValidation.message);
            telegramInput.focus();
            return;
        }
        
        // Generate anonymous ID
        const anonymousId = generateAnonymousId();
        
        // Prepare user data
        const userData = {
            telegramUsername: usernameValidation.username,
            displayName: usernameValidation.displayName,
            anonymousId: anonymousId,
            timestamp: new Date().toISOString().split('T')[0]
        };
        
        // Show loading
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> CREATING IDENTITY...';
        submitBtn.disabled = true;
        
        // Simulate API call
        console.log('Processing:', userData);
        
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1200));
            
            // Success - Update UI
            showSuccessPage(userData);
            
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Show success page
    function showSuccessPage(userData) {
        // Update header
        document.querySelector('.header').innerHTML = `
            <h1 class="logo">NOPE</h1>
            <p class="tagline">Identity created successfully!</p>
        `;
        
        // Update form card to success card
        const formCard = document.querySelector('.form-card');
        formCard.innerHTML = `
            <div class="title-section">
                <h2 class="form-title">Welcome to NOPE, ${userData.displayName}</h2>
                <p class="form-subtitle">
                    <i class="fas fa-check-circle"></i>
                    Your anonymous identity is ready
                </p>
            </div>
            
            <div class="identity-display">
                <div class="identity-card">
                    <div class="identity-label">Your Anonymous ID:</div>
                    <div class="anonymous-id">${userData.anonymousId}</div>
                    <div class="identity-note">
                        <i class="fas fa-info-circle"></i>
                        Use this ID to login. Your Telegram username is not stored.
                    </div>
                </div>
            </div>
            
            <button class="submit-btn success-btn" id="continueToOnboarding">
                <i class="fas fa-arrow-right"></i>
                CONTINUE TO ONBOARDING
            </button>
            
            <div class="privacy-guarantee">
                <i class="fas fa-user-secret"></i>
                <div>
                    <strong>Next: Choose your rage topics</strong>
                    <p>In the next step, you'll select topics you want to rage about anonymously.</p>
                </div>
            </div>
        `;
        
        // Update info section
        document.querySelector('.info-section').innerHTML = `
            <h3><i class="fas fa-shield-alt"></i> Your identity is protected</h3>
            <ul class="steps">
                <li>Your anonymous ID: <code>${userData.anonymousId}</code></li>
                <li>Your Telegram username is encrypted</li>
                <li>All posts are completely anonymous</li>
                <li>No tracking, no personal data stored</li>
            </ul>
        `;
        
        // Add continue button handler
        setTimeout(() => {
            const continueBtn = document.getElementById('continueToOnboarding');
            if (continueBtn) {
                continueBtn.addEventListener('click', function() {
                    // Redirect to onboarding.html with anonymous ID
                    window.location.href = `onboarding.html?id=${encodeURIComponent(userData.anonymousId)}`;
                });
            }
        }, 100);
        
        // Log success
        console.log(`
        ✅ IDENTITY CREATED
        ===================
        Telegram: ${userData.displayName}
        Anonymous ID: ${userData.anonymousId}
        Date: ${userData.timestamp}
        Next: onboarding.html
        ===================
        `);
    }
    
    // Login Link
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simple login prompt
            const anonymousId = prompt('Enter your Anonymous ID (e.g., Silent_Rager_42):');
            if (anonymousId && anonymousId.trim() !== '') {
                // Verify with backend in real app
                
                // Redirect langsung ke onboarding.html
                window.location.href = `onboarding.html?id=${encodeURIComponent(anonymousId)}`;
            }
        });
    }
    
    // Enter key support
    telegramInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
    
    // Console welcome
    console.log(`
    ╔══════════════════════════════════╗
    ║                                  ║
    ║   NOPE - Anonymous Platform      ║
    ║   Simple Register/Login          ║
    ║   Telegram → Anonymous ID        ║
    ║   Next: onboarding.html          ║
    ║                                  ║
    ╚══════════════════════════════════╝
    `);
});
