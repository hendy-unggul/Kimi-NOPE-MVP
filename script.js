// Redirect after successful login
function redirectToOnboarding() {
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.textContent = '...';
        submitBtn.disabled = true;
    }
    
    // Simulate processing
    setTimeout(() => {
        // Redirect to onboarding
        window.location.href = 'rage.html';
    }, 800);
}
