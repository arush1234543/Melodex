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

// ── Recent songs helpers ─────────────────────────────────────────────────────
const MAX_RECENT = 5;

function getRecentSongs() {
    try {
        return JSON.parse(localStorage.getItem('melodexRecent') || '[]');
    } catch { return []; }
}

function addToRecent(song) {
    let recent = getRecentSongs();
    // Remove duplicate
    recent = recent.filter(s => s.src !== song.src);
    // Add to front
    recent.unshift({ name: song.name, artist: song.artist, img: song.img, src: song.src });
    // Keep only last MAX_RECENT
    recent = recent.slice(0, MAX_RECENT);
    localStorage.setItem('melodexRecent', JSON.stringify(recent));
}

function saveLastSong(song, index) {
    localStorage.setItem('melodexLastSong', JSON.stringify({ song, index }));
}

function getLastSong() {
    try {
        return JSON.parse(localStorage.getItem('melodexLastSong') || 'null');
    } catch { return null; }
}

// ── Init ─────────────────────────────────────────────────────────────────────
function init() {
    loadSongs();
    renderPlaylist();
    renderCards('');
    setupEventListeners();
    renderAuth();
    showResumeBanner();
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

// ── Resume Banner ────────────────────────────────────────────────────────────
function showResumeBanner() {
    const lastSong = getLastSong();
    if (!lastSong) return;

    const banner = document.getElementById('resumeBanner');
    if (!banner) return;

    document.getElementById('resumeThumb').style.backgroundImage = `url('${lastSong.song.img}')`;
    document.getElementById('resumeSongName').textContent = lastSong.song.name;
    document.getElementById('resumeSongArtist').textContent = lastSong.song.artist;

    banner.classList.add('visible');

    banner.querySelector('.resume-play-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        // Try to find song in current library
        const idx = songs.findIndex(s => s.src === lastSong.song.src);
        if (idx !== -1) {
            playSong(idx);
        } else {
            // Song was removed; just load it directly
            playSongDirect(lastSong.song);
        }
        banner.classList.remove('visible');
    });

    banner.querySelector('.resume-dismiss').addEventListener('click', (e) => {
        e.stopPropagation();
        banner.classList.remove('visible');
        localStorage.removeItem('melodexLastSong');
    });
}

function playSongDirect(song) {
    audio.src = song.src;
    audio.load();
    audio.play().catch(err => console.error('Error playing audio:', err));
    trackNameEl.textContent = song.name;
    artistNameEl.textContent = song.artist;
    nowThumb.style.backgroundImage = `url('${song.img}')`;
    masterPlay.innerHTML = pauseSVG;
}

// ── Render ───────────────────────────────────────────────────────────────────
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

    // Track recent songs and last song
    addToRecent(song);
    saveLastSong(song, index);

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

function playNext() {
    if (songs.length === 0) return;
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(nextIndex);
}

function playPrevious() {
    if (songs.length === 0) return;
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(prevIndex);
}

function filterSongs(filter) {
    if (!filter) return songs;
    return songs.filter(song =>
        song.name.toLowerCase().includes(filter) ||
        song.artist.toLowerCase().includes(filter)
    );
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
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
        // Close sidebar
        if (navbar.classList.contains('open') &&
            !navbar.contains(e.target) &&
            e.target !== sidebarToggle) {
            navbar.classList.remove('open');
        }
        // Close profile dropdown
        const wrapper = document.querySelector('.profile-wrapper');
        if (wrapper && !wrapper.contains(e.target)) {
            closeProfileDropdown();
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

// ── Auth & Profile Dropdown ──────────────────────────────────────────────────
const authArea = document.getElementById("authArea");

function renderAuth() {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");

    if (token && email) {
        const firstLetter = email.charAt(0).toUpperCase();
        authArea.innerHTML = `
            <div class="profile-wrapper">
                <div class="profile-circle" id="profileCircle" aria-label="Profile menu" role="button" tabindex="0">
                    ${firstLetter}
                </div>
                <div class="profile-dropdown" id="profileDropdown">
                    <div class="dropdown-header">
                        <div class="dropdown-email">${escapeHtml(email)}</div>
                        <div class="dropdown-label">Logged in</div>
                    </div>
                    <div class="dropdown-section-title">Recently Played</div>
                    <div class="recent-songs-list" id="dropdownRecentList"></div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-actions">
                        <div class="dropdown-action-item" id="ddAddSong">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                            Add Song
                        </div>
                        <div class="dropdown-action-item" id="ddShuffle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
                            Shuffle Play
                        </div>
                        <div class="dropdown-action-item" id="ddClearRecent">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                            Clear History
                        </div>
                        <div class="dropdown-action-item danger" id="ddLogout">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                            Log Out
                        </div>
                    </div>
                </div>
            </div>
        `;

        renderDropdownRecent();

        document.getElementById('profileCircle').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleProfileDropdown();
        });

        document.getElementById('ddAddSong').addEventListener('click', () => {
            closeProfileDropdown();
            openAddModal();
        });

        document.getElementById('ddShuffle').addEventListener('click', () => {
            closeProfileDropdown();
            if (songs.length === 0) return;
            const randIdx = Math.floor(Math.random() * songs.length);
            playSong(randIdx);
        });

        document.getElementById('ddClearRecent').addEventListener('click', () => {
            localStorage.removeItem('melodexRecent');
            localStorage.removeItem('melodexLastSong');
            renderDropdownRecent();
            const banner = document.getElementById('resumeBanner');
            if (banner) banner.classList.remove('visible');
        });

        document.getElementById('ddLogout').addEventListener('click', () => {
            logout();
        });

    } else {
        authArea.innerHTML = `
            <button class="btn login-btn" onclick="goLogin()">Login</button>
            <button class="btn signup-btn" onclick="goSignup()">Sign Up</button>
        `;
    }
}

function renderDropdownRecent() {
    const list = document.getElementById('dropdownRecentList');
    if (!list) return;

    const recent = getRecentSongs();
    if (recent.length === 0) {
        list.innerHTML = `<div style="padding: 6px 10px 10px; font-size: 12px; color: var(--text-subdim);">Nothing played yet</div>`;
        return;
    }

    list.innerHTML = recent.map((song, i) => `
        <div class="recent-song-item" data-recent-idx="${i}">
            <div class="recent-song-thumb" style="background-image: url('${song.img}')"></div>
            <div class="recent-song-info">
                <div class="recent-song-name">${escapeHtml(song.name)}</div>
                <div class="recent-song-artist">${escapeHtml(song.artist)}</div>
            </div>
            <div class="recent-song-play-icon">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
        </div>
    `).join('');

    list.querySelectorAll('.recent-song-item').forEach(item => {
        item.addEventListener('click', () => {
            const song = recent[parseInt(item.dataset.recentIdx)];
            const idx = songs.findIndex(s => s.src === song.src);
            if (idx !== -1) {
                playSong(idx);
            } else {
                playSongDirect(song);
            }
            closeProfileDropdown();
        });
    });
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    const circle = document.getElementById('profileCircle');
    if (!dropdown) return;

    const isOpen = dropdown.classList.contains('open');
    if (isOpen) {
        closeProfileDropdown();
    } else {
        renderDropdownRecent(); // Refresh before opening
        dropdown.classList.add('open');
        circle && circle.classList.add('active');
    }
}

function closeProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    const circle = document.getElementById('profileCircle');
    if (dropdown) dropdown.classList.remove('open');
    if (circle) circle.classList.remove('active');
}

function goLogin() {
    window.location.href = "login.html";
}

function goSignup() {
    window.location.href = "register.html";
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    location.reload();
}

init();