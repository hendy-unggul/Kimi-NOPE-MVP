// DATA HASHTAG
const hashtags = [
    { text: "#FilmEndingGaje", desc: "Ending film bikin bingung" },
    { text: "#BellTiketJualGinjal", desc: "Harga tiket kayak jual ginjal" },
    { text: "#InfluencerNgchek", desc: "Influenser resek abis" },
    { text: "#DiGhostingGebetan", desc: "Dibaca tapi nggak dibales" },
    { text: "#DiajakJalanTapiKempes", desc: "Janji jalan tapi batal" },
    { text: "#MagangDigajiSertifikat", desc: "Magang cuma dapat sertifikat" },
    { text: "#RencanaPinPlan", desc: "Wacana doang, nggak realisasi" },
    { text: "#DramaQueenAnjay", desc: "Drama berlebihan" },
    { text: "#BacotLambeTurah", desc: "Banyak bicara, sedikit aksi" }
];

let selected = [];
let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;

// INITIALIZE
function init() {
    const tinder = document.querySelector('.tinder');
    tinder.innerHTML = '';
    
    // Buat kartu pertama
    createCard(0);
    
    // Update counter
    updateCounter();
}

// BUAT KARTU
function createCard(index) {
    if (index >= hashtags.length) {
        document.querySelector('.tinder').innerHTML = '<div class="card"><h3>SUDAH SEMUA!</h3><p>Refresh untuk ulang</p></div>';
        return;
    }
    
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h3>${hashtags[index].text}</h3>
        <p class="desc">${hashtags[index].desc}</p>
    `;
    
    // Overlay untuk swipe
    const overlayYes = document.createElement('div');
    overlayYes.className = 'overlay overlay-yes';
    overlayYes.textContent = 'PILIH ✅';
    
    const overlayNo = document.createElement('div');
    overlayNo.className = 'overlay overlay-no';
    overlayNo.textContent = 'LEWATI ❌';
    
    card.appendChild(overlayYes);
    card.appendChild(overlayNo);
    
    // Event listeners untuk drag
    card.addEventListener('mousedown', startDrag);
    card.addEventListener('touchstart', startDragTouch, { passive: false });
    
    document.querySelector('.tinder').appendChild(card);
}

// DRAG START
function startDrag(e) {
    const card = e.currentTarget;
    isDragging = true;
    startX = e.clientX || e.touches[0].clientX;
    card.style.transition = 'none';
    
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', onDragTouch, { passive: false });
    document.addEventListener('touchend', stopDrag);
}

// DRAG MOVE
function onDrag(e) {
    if (!isDragging) return;
    
    const card = document.querySelector('.card');
    currentX = (e.clientX || e.touches[0].clientX) - startX;
    const rotate = currentX * 0.1;
    
    card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
    
    // Tampilkan overlay
    const overlayYes = card.querySelector('.overlay-yes');
    const overlayNo = card.querySelector('.overlay-no');
    
    if (currentX > 50) {
        overlayYes.style.opacity = Math.min(currentX / 150, 1);
        overlayNo.style.opacity = 0;
    } else if (currentX < -50) {
        overlayNo.style.opacity = Math.min(-currentX / 150, 1);
        overlayYes.style.opacity = 0;
    } else {
        overlayYes.style.opacity = 0;
        overlayNo.style.opacity = 0;
    }
}

// DRAG STOP
function stopDrag() {
    if (!isDragging) return;
    
    const card = document.querySelector('.card');
    card.style.transition = 'transform 0.5s, opacity 0.5s';
    
    if (currentX > 100) {
        // SWIPE KANAN = PILIH
        selectCard();
    } else if (currentX < -100) {
        // SWIPE KIRI = LEWATI
        rejectCard();
    } else {
        // KEMBALI KE TENGAH
        card.style.transform = '';
    }
    
    // Reset
    setTimeout(() => {
        card.querySelector('.overlay-yes').style.opacity = 0;
        card.querySelector('.overlay-no').style.opacity = 0;
    }, 300);
    
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', onDragTouch);
    document.removeEventListener('touchend', stopDrag);
}

// PILIH KARTU
function selectCard() {
    const card = document.querySelector('.card');
    selected.push(hashtags[currentIndex].text);
    
    card.style.transform = `translateX(500px) rotate(30deg)`;
    card.style.opacity = '0';
    
    setTimeout(() => {
        currentIndex++;
        createCard(currentIndex);
        updateCounter();
    }, 300);
}

// LEWATI KARTU
function rejectCard() {
    const card = document.querySelector('.card');
    
    card.style.transform = `translateX(-500px) rotate(-30deg)`;
    card.style.opacity = '0';
    
    setTimeout(() => {
        currentIndex++;
        createCard(currentIndex);
    }, 300);
}

// UPDATE COUNTER
function updateCounter() {
    document.getElementById('selected-count').textContent = selected.length;
    const container = document.getElementById('selected-hashtags');
    container.innerHTML = selected.map(tag => `<div>${tag}</div>`).join('');
    
    // Jika sudah pilih 3, selesai
    if (selected.length >= 3) {
        setTimeout(() => {
            alert(`KAMU SUDAH PILIH 3 HASHTAG:\n${selected.join('\n')}\n\nLANJUT KE RAGE!`);
        }, 500);
    }
}

// TOMBOL MANUAL
document.querySelector('.skip-btn').addEventListener('click', rejectCard);
document.querySelector('.pick-btn').addEventListener('click', selectCard);

// TOUCH SUPPORT
function startDragTouch(e) {
    startDrag(e);
    e.preventDefault();
}

function onDragTouch(e) {
    onDrag(e);
    e.preventDefault();
}

// START!
init();
