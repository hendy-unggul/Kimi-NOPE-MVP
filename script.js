document.addEventListener('DOMContentLoaded', function() {
    console.log('NOPE Register Page Loaded 🔥');
    
    // State
    let selectedTags = [];
    const MAX_TAGS = 3;
    
    // Elements
    const telegramInput = document.getElementById('telegramInput');
    const hashtagOptions = document.querySelectorAll('.hashtag-option');
    const selectedTagsEl = document.getElementById('selectedTags');
    const hashtagCounter = document.getElementById('hashtagCounter');
    const submitBtn = document.getElementById('submitBtn');
    const loginLink = document.querySelector('.login-link');
    
    // Auto-focus input
    telegramInput.focus();
    
    // Hashtag Selection
    hashtagOptions.forEach(option => {
        option.addEventListener('click', function() {
            const tag = this.getAttribute('data-tag');
            const tagText = `#${tag}`;
            
            // Check if already selected
            const isSelected = this.classList.contains('selected');
            
            if (isSelected) {
                // Remove
                this.classList.remove('selected');
                selectedTags = selectedTags.filter(t => t !== tag);
            } else {
                // Check limit
                if (selectedTags.length >= MAX_TAGS) {
                    alert(`You can only select ${MAX_TAGS} hashtags`);
                    return;
                }
                
                // Add
                this.classList.add('selected');
                selectedTags.push(tag);
            }
            
            updateSelectedTags();
        });
    });
    
    // Update selected tags display
    function updateSelectedTags() {
        // Update counter
        hashtagCounter.textContent = `${selectedTags.length}/${MAX_TAGS}`;
        
        // Clear container
        selectedTagsEl.innerHTML = '';
        
        if (selectedTags.length === 0) {
            selectedTagsEl.innerHTML = '<div class="empty-state">No hashtags selected yet</div>';
            return;
        }
        
        // Add selected tags
        selectedTags.forEach(tag => {
            const tagEl = document.createElement('div');
            tagEl.className = 'selected-tag';
            tagEl.innerHTML = `
                #${tag}
                <i class="fas fa-times" data-tag="${tag}"></i>
            `;
            selectedTagsEl.appendChild(tagEl);
            
            // Add remove functionality
            const removeBtn = tagEl.querySelector('i');
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                removeTag(tag);
            });
        });
        
        // Update submit button state
        updateSubmitButton();
    }
    
    // Remove tag
    function removeTag(tag) {
        // Remove from array
        selectedTags = selectedTags.filter(t => t !== tag);
        
        // Remove visual selection
        const option = document.querySelector(`.hashtag-option[data-tag="${tag}"]`);
        if (option) {
            option.classList.remove('selected');
        }
        
        updateSelectedTags();
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
        
        // Check format (Telegram allows a-z, 0-9, underscore)
        if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
            return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
        }
        
        return { 
            valid: true, 
            username: cleanUsername,
            displayName: `@${cleanUsername}`
        };
    }
    
    // Update submit button state
    function updateSubmitButton() {
        const usernameValid = validateUsername(telegramInput.value).valid;
        const tagsValid = selectedTags.length === MAX_TAGS;
        
        submitBtn.disabled = !(usernameValid && tagsValid);
        
        if (!submitBtn.disabled) {
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        } else {
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';
        }
    }
    
    // Real-time validation
    telegramInput.addEventListener('input', updateSubmitButton);
    
    // Submit
    submitBtn.addEventListener('click', async function() {
        if (submitBtn.disabled) return;
        
        // Validate
        const usernameValidation = validateUsername(telegramInput.value);
        if (!usernameValidation.valid) {
            alert(usernameValidation.message);
            return;
        }
        
        if (selectedTags.length !== MAX_TAGS) {
            alert(`Please select exactly ${MAX_TAGS} hashtags`);
            return;
        }
        
        // Prepare data
        const userData = {
            telegramUsername: usernameValidation.username,
            displayName: usernameValidation.displayName,
            hashtags: selectedTags,
            timestamp: new Date().toISOString(),
            anonymousId: generateAnonymousId()
        };
        
        // Show loading
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> CREATING IDENTITY...';
        submitBtn.disabled = true;
        
        // Simulate API call
        console.log('Submitting registration:', userData);
        
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success
            showSuccess(userData);
            
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Generate anonymous ID
    function generateAnonymousId() {
        const chars = '0123456789abcdef';
        let id = '';
        for (let i = 0; i < 12; i++) {
            id += chars[Math.floor(Math.random() * chars.length)];
        }
        return `nope_${id}`;
    }
    
    // Show success
    function showSuccess(userData) {
        // Update UI
        document.querySelector('.form-title').textContent = 'Identity Created!';
        document.querySelector('.form-subtitle').innerHTML = `
            <i class="fas fa-check-circle"></i>
            Welcome to NOPE, ${userData.displayName}
        `;
        
        // Hide input and hashtags
        document.querySelector('.input-section').style.display = 'none';
        document.querySelector('.hashtags-section').style.display = 'none';
        
        // Update submit button
        submitBtn.innerHTML = '<i class="fas fa-rocket"></i> GO TO ANONYMOUS DASHBOARD';
        submitBtn.disabled = false;
        submitBtn.style.background = 'linear-gradient(90deg, #ff375f, #ff6b9d)';
        submitBtn.onclick = function() {
            window.location.href = `dashboard.html?user=${encodeURIComponent(userData.anonymousId)}`;
        };
        
        // Update privacy note
        const privacyNote = document.querySelector('.privacy-note');
        privacyNote.innerHTML = `
            <i class="fas fa-user-secret"></i>
            <div>
                <strong>Your anonymous identity is ready!</strong>
                <p>Your ID: <code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;">${userData.anonymousId}</code></p>
                <p style="margin-top:8px;font-size:0.85rem;">Start sharing your rage anonymously. No one will know it's you.</p>
            </div>
        `;
        
        // Log to console
        console.log(`
        🎉 REGISTRATION SUCCESSFUL!
        ===========================
        Username: ${userData.displayName}
        Anonymous ID: ${userData.anonymousId}
        Hashtags: ${selectedTags.map(t => `#${t}`).join(', ')}
        ===========================
        `);
    }
    
    // Login link
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Login feature coming soon! For now, please register.');
        });
    }
    
    // Enter key to submit
    telegramInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !submitBtn.disabled) {
            submitBtn.click();
        }
    });
    
    // Initial button state
    updateSubmitButton();
    
    // Console welcome
    console.log(`
    ╔══════════════════════════════════╗
    ║                                  ║
    ║   NOPE - Anonymous Platform      ║
    ║   Register your identity         ║
    ║                                  ║
    ╚══════════════════════════════════╝
    `);
});
