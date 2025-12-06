<script>
  let selected = [];
  const maxSelections = 3;
  
  // INIT
  document.getElementById('rageSection').classList.remove('active');
  
  // HASHTAG SELECTION
  document.querySelectorAll('.hashtag').forEach(item => {
    item.addEventListener('click', function() {
      const tag = this.dataset.tag;
      const zone = this.dataset.zone;
      
      if (this.classList.contains('selected')) {
        this.classList.remove('selected');
        selected = selected.filter(t => t !== tag);
      } else {
        if (selected.length >= maxSelections) {
          alert('Maksimal 3 pilihan!');
          return;
        }
        
        const zoneUsed = selected.some(t => 
          document.querySelector(`[data-tag="${t}"]`).dataset.zone === zone
        );
        
        if (zoneUsed) {
          alert('Hanya 1 per zona!');
          return;
        }
        
        this.classList.add('selected');
        selected.push(tag);
      }
      
      // Update button
      const btn = document.getElementById('continueBtn');
      btn.disabled = selected.length !== maxSelections;
    });
  });
  
  // SWITCH TO RAGE
  document.getElementById('continueBtn').addEventListener('click', function() {
    if (selected.length !== maxSelections) return;
    
    document.getElementById('hashtagSection').classList.remove('active');
    setTimeout(() => {
      document.getElementById('rageSection').classList.add('active');
      document.getElementById('displayTags').textContent = selected.join(', ');
    }, 100);
  });
  
  // BACK TO HASHTAG
  document.getElementById('backBtn').addEventListener('click', function() {
    document.getElementById('rageSection').classList.remove('active');
    setTimeout(() => {
      document.getElementById('hashtagSection').classList.add('active');
    }, 100);
  });
  
  // CHARACTER COUNT
  document.getElementById('rageText').addEventListener('input', function() {
    const len = this.value.length;
    document.getElementById('charCount').textContent = `${len}/280`;
  });
  
  // SUBMIT
  document.getElementById('submitBtn').addEventListener('click', function() {
    const text = document.getElementById('rageText').value.trim();
    if (text.length < 10) {
      alert('Minimal 10 karakter!');
      return;
    }
    alert('✅ Keselananmu terkirim!');
    document.getElementById('rageText').value = '';
  });
</script>
