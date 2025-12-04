// 🚀 Interactive Functionality

// Hashtag Selection
let selectedHashtags = [];
const maxHashtags = 3;

const hashtagButtons = document.querySelectorAll('.hashtag-btn');
const counter = document.getElementById('counter');
const postBtn = document.getElementById('postBtn');
const postInput = document.getElementById('postInput');
const charCount = document.getElementById('charCount');

// Hashtag selection logic
hashtagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const hashtag = btn.textContent;
        
        if (btn.classList.contains('selected')) {
            // Deselect
            btn.classList.remove('selected');
            selectedHashtags = selectedHashtags.filter(h => h !== hashtag);
        } else {
            // Select if under limit
            if (selectedHashtags.length < maxHashtags) {
                btn.classList.add('selected');
                selectedHashtags.push(hashtag);
            } else {
                // Shake animation when limit reached
                btn.style.animation = 'shake 0.3s';
                setTimeout(() => btn.style.animation = '', 300);
            }
        }
        
        updateCounter();
    });
});

function updateCounter() {
    counter.textContent = selectedHashtags.length;
    
    // Enable/disable post button based on selection
    if (selectedHashtags.length === maxHashtags) {
        postBtn.disabled = false;
        postBtn.style.opacity = '1';
    } else {
        postBtn.disabled = true;
        postBtn.style.opacity = '0.5';
    }
}

// Character counter
postInput.addEventListener('input', (e) => {
    const count = e.target.value.length;
    charCount.textContent = count;
    
    // Change color when approaching limit
    if (count > 250) {
        charCount.style.color = 'var(--color-tertiary)';
    } else {
        charCount.style.color = 'var(--color-text)';
    }
});

// CSS Animation for shake
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-4px); }
        75% { transform: translateX(4px); }
    }
`;
document.head.appendChild(style);

// Initialize
updateCounter();
