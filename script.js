const audio = document.getElementById('audio-player');
const playBtnWrapper = document.getElementById('playBtnWrapper');
const masterPlay = document.getElementById('masterPlay');
const seekBar = document.getElementById('seekBar');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const trackNameEl = document.getElementById('trackName');
const artistNameEl = document.getElementById('artistName');
const nowThumb = document.getElementById('nowThumb');
const cardContainer = document.getElementById('cardContainer');
const playlistList = document.getElementById('playlistList');
const searchInput = document.getElementById('searchInput');
const navbar = document.getElementById('navbar');
const sidebarToggle = document.getElementById('sidebarToggle');
const volumeIcon = document.getElementById('volIcon');
const volumeSlider = document.getElementById('volume');
const modalOverlay = document.getElementById('modalOverlay');
const inputName = document.getElementById('inputName');
const inputArtist = document.getElementById('inputArtist');
const inputSrc = document.getElementById('inputSrc');
const inputImg = document.getElementById('inputImg');

const playSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M15.9453 12.3948C15.7686 13.0215 14.9333 13.4644 13.2629 14.3502C11.648 15.2064 10.8406 15.6346 10.1899 15.4625C9.9209 15.3913 9.6758 15.2562 9.47812 15.0701C9 14.6198 9 13.7465 9 12C9 10.2535 9 9.38018 9.47812 8.92995C9.6758 8.74381 9.9209 8.60868 10.1899 8.53753C10.8406 8.36544 11.648 8.79357 13.2629 9.64983C14.9333 10.5356 15.7686 10.9785 15.9453 11.6052C16.0182 11.8639 16.0182 12.1361 15.9453 12.3948Z" />
</svg>`;

const pauseSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.5 9L9.5 15M14.5 9V15" />
</svg>`;

const deleteSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" />
    <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" />
    <path d="M9.5 16.5L9.5 10.5" />
    <path d="M14.5 16.5L14.5 10.5" />
</svg>`;

let songs = [];
let currentIndex = -1;


function init() {
    loadSongs();
    renderPlaylist();
    renderCards('');
    setupEventListeners();
}

function loadSongs() {
    const saved = localStorage.getItem('melodexSongs');
    if (saved) {
        try {
            songs = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading saved songs:', e);
            songs = getDefaultSongs();
        }
    } else {
        songs = getDefaultSongs();
    }
}

function getDefaultSongs() {
    return [
        {
            name: 'Lofi Study',
            artist: 'Chill Beats',
            img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop',
            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        },
        {
            name: 'Midnight City',
            artist: 'M83',
            img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop',
            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
        },
        {
            name: 'Ocean Waves',
            artist: 'Nature Sounds',
            img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
        },
        {
            name: 'Retro Soul',
            artist: 'Vintage',
            img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop',
            src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
        }
    ];
}


function saveSongs() {
    try {
        localStorage.setItem('melodexSongs', JSON.stringify(songs));
    } catch (e) {
        console.error('Error saving songs:', e);
    }
}

function renderCards(filter = '') {
    cardContainer.innerHTML = '';
    const filtered = filterSongs(filter);

    filtered.forEach(song => {
        const realIdx = songs.indexOf(song);
        const isPlaying = realIdx === currentIndex && !audio.paused;
        const isCurrentSong = realIdx === currentIndex;

        const card = document.createElement('div');
        card.className = `card${isCurrentSong ? ' playing' : ''}`;
        card.dataset.index = realIdx;

        card.innerHTML = `
            <div class="cardimg" style="background-image: url('${song.img}')">
                <div class="card-play-overlay">
                    ${isPlaying ? pauseSVG : playSVG}
                </div>
            </div>
            <div class="card-title">${escapeHtml(song.name)}</div>
            <div class="card-artist">${escapeHtml(song.artist)}</div>
        `;

        card.addEventListener('click', () => {
            if (realIdx === currentIndex) {
                togglePlay();
            } else {
                playSong(realIdx);
            }
        });

        cardContainer.appendChild(card);
    });

    if (filtered.length === 0) {
        cardContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 40px;">No songs found</p>';
    }
}

function renderPlaylist() {
    playlistList.innerHTML = '';

    songs.forEach((song, idx) => {
        const item = document.createElement('div');
        item.className = `playlist-item${idx === currentIndex ? ' active' : ''}`;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'playlist-name';
        nameSpan.textContent = song.name;
        nameSpan.title = song.name;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'playlist-delete-icon';
        deleteBtn.innerHTML = deleteSVG;
        deleteBtn.setAttribute('aria-label', `Delete ${song.name}`);
        deleteBtn.type = 'button';

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteSong(idx);
        });

        item.addEventListener('click', () => playSong(idx));

        item.appendChild(nameSpan);
        item.appendChild(deleteBtn);
        playlistList.appendChild(item);
    });
}

function playSong(index) {
    if (index < 0 || index >= songs.length) return;

    const song = songs[index];
    currentIndex = index;

    audio.src = song.src;
    audio.load();
    audio.play().catch(err => {
        console.error('Error playing audio:', err);
        alert('Could not play song. Check the audio URL.');
    });

    trackNameEl.textContent = song.name;
    artistNameEl.textContent = song.artist;
    nowThumb.style.backgroundImage = `url('${song.img}')`;
    masterPlay.innerHTML = pauseSVG;

    renderCards(searchInput.value.toLowerCase());
    renderPlaylist();
}

function togglePlay() {
    if (!audio.src) return;

    if (audio.paused) {
        audio.play().catch(err => console.error('Play error:', err));
        masterPlay.innerHTML = pauseSVG;
    } else {
        audio.pause();
        masterPlay.innerHTML = playSVG;
    }

    renderCards(searchInput.value.toLowerCase());
}

function playPrevious() {
    const newIndex = currentIndex <= 0 ? songs.length - 1 : currentIndex - 1;
    playSong(newIndex);
}

function playNext() {
    const newIndex = currentIndex >= songs.length - 1 ? 0 : currentIndex + 1;
    playSong(newIndex);
}

function formatTime(seconds) {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function filterSongs(query) {
    if (!query.trim()) return songs;
    const q = query.toLowerCase();
    return songs.filter(song =>
        song.name.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q)
    );
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function deleteSong(index) {
    if (confirm(`Delete "${songs[index].name}"?`)) {
        if (index === currentIndex) {
            audio.pause();
            currentIndex = -1;
            masterPlay.innerHTML = playSVG;
            trackNameEl.textContent = 'Select a song';
            artistNameEl.textContent = '—';
            nowThumb.style.backgroundImage = '';
        } else if (index < currentIndex) {
            currentIndex--;
        }

        songs.splice(index, 1);
        saveSongs();
        renderCards(searchInput.value.toLowerCase());
        renderPlaylist();
    }
}

audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;

    const percent = (audio.currentTime / audio.duration) * 100;
    seekBar.value = percent;
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
    playNext();
});

audio.addEventListener('error', () => {
    console.error('Audio error');
    alert('Error loading audio file');
});

seekBar.addEventListener('input', (e) => {
    if (audio.duration) {
        audio.currentTime = (e.target.value / 100) * audio.duration;
    }
});

volumeSlider.addEventListener('input', (e) => {
    audio.volume = parseFloat(e.target.value);
    updateVolumeIcon();
});

function setupEventListeners() {
    playBtnWrapper.addEventListener('click', togglePlay);
    document.getElementById('prevBtn').addEventListener('click', playPrevious);
    document.getElementById('nextBtn').addEventListener('click', playNext);

    volumeIcon.addEventListener('click', () => {
        audio.muted = !audio.muted;
        updateVolumeIcon();
    });

    searchInput.addEventListener('input', (e) => {
        renderCards(e.target.value.toLowerCase());
    });
    sidebarToggle.addEventListener('click', () => {
        navbar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (navbar.classList.contains('open') &&
            !navbar.contains(e.target) &&
            e.target !== sidebarToggle) {
            navbar.classList.remove('open');
        }
    });

    document.getElementById('openAddModal').addEventListener('click', openAddModal);
    document.getElementById('cancelModal').addEventListener('click', closeAddModal);
    document.getElementById('confirmAdd').addEventListener('click', confirmAdd);

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeAddModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
            closeAddModal();
        }
    });
}

function updateVolumeIcon() {
    const isMuted = audio.muted;
    const volume = parseFloat(volumeSlider.value);

    if (isMuted || volume === 0) {
        volumeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 14.8135V9.18646C14 6.04126 14 4.46866 13.0747 4.0773C12.1494 3.68593 11.0603 4.79793 8.88232 7.02192C7.75439 8.17365 7.11085 8.42869 5.50604 8.42869C4.10257 8.42869 3.40084 8.42869 2.89675 8.77262C1.85035 9.48655 2.00852 10.882 2.00852 12C2.00852 13.118 1.85035 14.5134 2.89675 15.2274C3.40084 15.5713 4.10257 15.5713 5.50604 15.5713C7.11085 15.5713 7.75439 15.8264 8.88232 16.9781C11.0603 19.2021 12.1494 20.3141 13.0747 19.9227C14 19.5313 14 17.9587 14 14.8135Z" />
    <path d="M18 10L22 14M18 14L22 10" />
</svg>`;
    } else if (volume < 0.5) {
        volumeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 9C19.6254 9.81968 20 10.8634 20 12C20 13.1366 19.6254 14.1803 19 15" />
    <path d="M16 14.8135V9.18646C16 6.04126 16 4.46866 15.0747 4.0773C14.1494 3.68593 13.0604 4.79793 10.8823 7.02192C9.7544 8.17365 9.11086 8.42869 7.50605 8.42869C6.10259 8.42869 5.40086 8.42869 4.89677 8.77262C3.85036 9.48655 4.00854 10.882 4.00854 12C4.00854 13.118 3.85036 14.5134 4.89677 15.2274C5.40086 15.5713 6.10259 15.5713 7.50605 15.5713C9.11086 15.5713 9.7544 15.8264 10.8823 16.9781C13.0604 19.2021 14.1494 20.3141 15.0747 19.9227C16 19.5313 16 17.9587 16 14.8135Z" />
</svg>`;
    } else {
        volumeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 14.8135V9.18646C14 6.04126 14 4.46866 13.0747 4.0773C12.1494 3.68593 11.0603 4.79793 8.88232 7.02192C7.75439 8.17365 7.11085 8.42869 5.50604 8.42869C4.10257 8.42869 3.40084 8.42869 2.89675 8.77262C1.85035 9.48655 2.00852 10.882 2.00852 12C2.00852 13.118 1.85035 14.5134 2.89675 15.2274C3.40084 15.5713 4.10257 15.5713 5.50604 15.5713C7.11085 15.5713 7.75439 15.8264 8.88232 16.9781C11.0603 19.2021 12.1494 20.3141 13.0747 19.9227C14 19.5313 14 17.9587 14 14.8135Z" />
    <path d="M17 9C17.6254 9.81968 18 10.8634 18 12C18 13.1366 17.6254 14.1803 17 15" />
    <path d="M20 7C21.2508 8.36613 22 10.1057 22 12C22 13.8943 21.2508 15.6339 20 17" />
</svg>`;
    }
}

function openAddModal() {
    modalOverlay.classList.add('open');
    inputName.focus();
}

function closeAddModal() {
    modalOverlay.classList.remove('open');
    inputName.value = '';
    inputArtist.value = '';
    inputSrc.value = '';
    inputImg.value = '';
}

function confirmAdd() {
    const name = inputName.value.trim();
    const artist = inputArtist.value.trim();
    const src = inputSrc.value.trim();
    const img = inputImg.value.trim();

    if (!name || !artist || !src) {
        alert('Please fill in: Song Name, Artist, and Audio URL');
        return;
    }

    if (!src.match(/^https?:\/\/.+\.(mp3|wav|ogg|m4a)$/i)) {
        alert('Please provide a valid audio URL (must end with .mp3, .wav, .ogg, or .m4a)');
        return;
    }

    songs.push({
        name,
        artist,
        src,
        img: img || `https://images.unsplash.com/photo-${Date.now() % 1000000}?w=200&h=200&fit=crop`
    });

    saveSongs();
    closeAddModal();
    renderCards(searchInput.value.toLowerCase());
    renderPlaylist();

    playSong(songs.length - 1);
}


init();