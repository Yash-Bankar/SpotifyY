// --- GLOBAL VARIABLES ---
const currentSong = new Audio();
let playlists = {};
let currentCard = null;

async function getSongs() {
    try {
        // Corrected filename from song.json to songs.json
        const response = await fetch('song.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        playlists = await response.json();
        console.log("Successfully loaded playlists:", playlists);
    } catch (error) {
        console.error("Fatal Error: Could not fetch songs.json.", error);
        document.querySelector('.cardContainer').innerHTML = `<p style="color: white; padding: 20px;">Could not load songs. Please ensure songs.json exists and is correctly formatted.</p>`;
    }
}

function displayAllSongs() {
    const playlistContainer = document.querySelector('.playlist-container');
    const cardContainer = document.querySelector('.cardContainer');
    playlistContainer.innerHTML = '';
    cardContainer.innerHTML = '';

    for (const folderName in playlists) {
        // Display the playlist in the left library
        const playlistCard = document.createElement('div');
        playlistCard.className = 'playlist rounded';
        playlistCard.id = folderName;
        playlistCard.innerHTML = `
            <img src="img/songs/${folderName}/pllogo.jpg" alt="${folderName}">
            <div class="flex">
                <h2>${folderName}</h2>
                <p>Playlist • ASilentVoice</p>
            </div>
        `;
        playlistContainer.appendChild(playlistCard);

        // Display all songs from that playlist in the main container
        for (const songSrc of playlists[folderName]) {
            displaySongCard(songSrc, folderName, cardContainer);
        }
    }
    updateTitles("All Songs");
}

/**
 * Displays only the songs from a specific, selected playlist.
 * @param {string} selectedFolder The name of the playlist to display.
 */
function displayPlaylistSongs(selectedFolder) {
    const cardContainer = document.querySelector('.cardContainer');
    cardContainer.innerHTML = '';

    const songs = playlists[selectedFolder] || [];
    for (const songSrc of songs) {
        displaySongCard(songSrc, selectedFolder, cardContainer);
    }
    updateTitles(selectedFolder);

    document.querySelectorAll('.playlist').forEach(card => {
        card.style.backgroundColor = (card.id === selectedFolder) ? '#282828' : '';
    });
}

/**
 * Creates and appends a single song card to a given container.
 * @param {string} songSrc The full path to the song file.
 * @param {string} folderName The name of the parent playlist/folder.
 * @param {HTMLElement} container The container to append the card to.
 */
function displaySongCard(songSrc, folderName, container) {
    const songName = songSrc.split('/').pop().replace('.mp3', '').replaceAll('%20', ' ');
    const card = document.createElement('div');
    card.className = 'card rounded show';
    card.dataset.songSrc = songSrc;
    card.dataset.folderName = folderName;

    card.innerHTML = `
        <img src="img/songs/${folderName}/${songName}.jpg" alt="${songName}">
        <button class="card-play-btn">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#1db954" />
                <polygon points="13,10 24,16 13,22" fill="#000" />
            </svg>
        </button>
        <h2 class="flex">${songName}</h2>
        <p class="flex">${folderName}</p>
    `;
    container.appendChild(card);
}

/**
 * Updates the main title in the right panel header.
 * @param {string} title The text to display.
 */
function updateTitles(title) {
    document.querySelector(".righttitle").textContent = title;
}


const ICONS = {
    play: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#1db954" /><polygon points="13,10 24,16 13,22" fill="#000" /></svg>`,
    pause: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#1db954" /><rect x="11" y="10" width="3" height="12" fill="#000" /><rect x="18" y="10" width="3" height="12" fill="#000" /></svg>`
};

/**
 * Plays a new song and updates all relevant UI elements.
 * @param {HTMLElement} card The song card that was clicked.
 */
function playMusic(card) {
    const songSrc = card.dataset.songSrc;
    const songName = card.querySelector('h2').textContent.trim();

    if (currentCard && currentCard !== card) {
        currentCard.querySelector('.card-play-btn').innerHTML = ICONS.play;
    }

    currentCard = card;
    currentSong.src = songSrc;
    currentSong.play().catch(e => console.error("Error playing audio:", e));

    document.getElementById('play').src = "svg/pause.svg";
    card.querySelector('.card-play-btn').innerHTML = ICONS.pause;

    document.querySelector(".songinfo").innerHTML = songName;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

function togglePlayPause() {
    if (!currentSong.src) return;

    if (currentSong.paused) {
        currentSong.play();
        document.getElementById('play').src = "svg/pause.svg";
        if (currentCard) {
            currentCard.querySelector('.card-play-btn').innerHTML = ICONS.pause;
        }
    } else {
        currentSong.pause();
        document.getElementById('play').src = "svg/play.svg";
        if (currentCard) {
            currentCard.querySelector('.card-play-btn').innerHTML = ICONS.play;
        }
    }
}

function playNextSong() {
    if (!currentCard) return;
    const nextCard = currentCard.nextElementSibling;
    if (nextCard && nextCard.classList.contains('card')) {
        playMusic(nextCard); // Use the card itself
    }
}

function playPreviousSong() {
    if (!currentCard) return;
    const prevCard = currentCard.previousElementSibling;
    if (prevCard && prevCard.classList.contains('card')) {
        playMusic(prevCard);
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00"; // Simplified return for clarity
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${String(secs).padStart(2, '0')}`;
}

function addAllEventListeners() {
    document.getElementById('play').addEventListener('click', togglePlayPause);
    document.getElementById('next').addEventListener('click', playNextSong);
    document.getElementById('previous').addEventListener('click', playPreviousSong);

    document.querySelector('.cardContainer').addEventListener('click', e => {
        const card = e.target.closest('.card');
        if (card) {
            if (currentCard === card && !currentSong.paused) {
                togglePlayPause();
            } else {
                playMusic(card);
            }
        }
    });

    document.querySelector('.playlist-container').addEventListener('click', e => {
        const card = e.target.closest('.playlist');
        if (card) {
            displayPlaylistSongs(card.id);
        }
    });

    document.querySelector('.home.rounded').addEventListener('click', displayAllSongs);

    currentSong.addEventListener('timeupdate', () => {
        const currentTime = currentSong.currentTime;
        const duration = currentSong.duration;
        if (duration) {
             document.querySelector(".songtime").textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
             document.querySelector(".circle").style.left = (currentTime / duration) * 100 + "%";
        }
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        if (currentSong.duration) {
            const percent = (e.offsetX / e.target.getBoundingClientRect().width);
            currentSong.currentTime = percent * currentSong.duration;
        }
    });

    currentSong.addEventListener('ended', playNextSong);

    document.querySelector(".vol-range").addEventListener("input", (e) => {
        currentSong.volume = e.target.value / 100;
        document.getElementById("volume").src = currentSong.volume > 0 ? "svg/volume.svg" : "svg/mute.svg";
    });

    document.querySelector(".ham").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    });

    const profile = document.querySelector('.profile');
    const profileBox = document.querySelector('.profilebox');
    if (profile && profileBox) {
        profile.addEventListener('click', (e) => {
            e.stopPropagation();
            profileBox.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!profileBox.contains(e.target) && !profile.contains(e.target)) {
                profileBox.classList.remove('open');
            }
        });
    }

    // --- NEW: SPACEBAR EVENT LISTENER ---
    document.addEventListener('keydown', (event) => {
        // Check if the pressed key is the spacebar
        if (event.code === 'Space') {
            // Prevent the default action (like scrolling the page)
            // only if the user is not typing in an input field.
            const activeEl = document.activeElement;
            if (activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA') {
                event.preventDefault();
                togglePlayPause();
            }
        }
    });
}


async function main() {
    await getSongs();
    displayAllSongs();
    addAllEventListeners();
}

document.addEventListener('DOMContentLoaded', main);