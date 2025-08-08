const currentSong = new Audio();
let currentCard = null;
let songul={son1:"dfbgj"};

function resolvePath(path) {
  return new URL(path, window.location.href).href;
}

async function getSongs() {
  try {
    const baseFolder = 'songs/';
    const baseUrl = resolvePath(baseFolder);
    const folders = await fetchFolder(baseUrl);
    const songs = {};
    for (const folder of folders) {
      const folderUrl = resolvePath(`${folder}/`);
      songs[folder] = await fetchMP3Links(folderUrl);
    }
    return songs;
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    return {};
  }
}

async function fetchFolder(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  const html = await res.text();
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;

  return Array.from(wrapper.querySelectorAll('a'))
    .map(a => a.getAttribute('href') || '')
    .filter(href => href.endsWith('/') && !href.startsWith('/'))
    .map(href => href.replace(/\/$/, '')) 
    .filter(name => name !== '..');
}


async function fetchMP3Links(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  const html = await res.text();
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;

  return Array.from(wrapper.querySelectorAll('a'))
    .map(a => a.getAttribute('href') || '')
    .filter(h => h.toLowerCase().endsWith('.mp3'))
    .map(h => new URL(h, url).href);
}

async function displaysongal() {

  const playlist = await getSongs();
  console.log('Playlists:', playlist);

  const container = document.querySelector('.playlist-container');
  const ccontainer = document.querySelector('.cardContainer');
    ccontainer.innerHTML = '';
    container.innerHTML = '';
    
  for (const [folder, songs] of Object.entries(playlist)) {
    const card = document.createElement('div');
    card.className = 'playlist rounded';
    card.id = folder;
    // console.log(folder)
    const path = folder.split("\\\\")[0];
    const parts = path.split("\\");
    const folderName = parts[parts.length - 1];
    // console.log(folderName);
    card.innerHTML = `
      <img src="img/songs/${folderName}/pllogo.jpg" alt="${folder}">
      <div class="flex">
        <h2>${folderName}</h2>
        <p>Playlist • ASilentVoice</p>
      </div>
    `;
    console.log(songs)
    songul.folderName=songs
  console.log(songul)
    // songul[folderName]=songs;

    for (const songlink of songs) {
      // console.log(songlink);
      const card2 = document.createElement('div');
      card2.className = 'card rounded show';
      const s1 = songlink.split("/")
      const sn1 = s1[s1.length - 1].split(".")[0]
      const songname = sn1.replaceAll("%20", " ")
      // console.log(songname)
      card2.id = songname;
      card2.innerHTML = `
      <img src="img/songs/${folderName}/${songname}.jpg" alt="${songname}">
      <button id="${songname}" class="card-play-btn">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#1db954" />
              <polygon points="13,10 24,16 13,22" fill="#000" />
          </svg>
      </button>
      <h2 class="flex">${songname}</h2>
      <p class="flex">${folderName}</p>
    `
      ccontainer.appendChild(card2);
    }
    container.appendChild(card);


  }

}
async function displayPlaylistSongs(selectedFolder) {

  const playlist = await getSongs();
  console.log('Playlists:', playlist);

  const container = document.querySelector('.playlist-container');
  const ccontainer = document.querySelector('.cardContainer');
    ccontainer.innerHTML = '';
    container.innerHTML = '';
    
  for (const [folder, songs] of Object.entries(playlist)) {
    const card = document.createElement('div');
    card.className = 'playlist rounded';
    card.id = folder;
    // console.log(folder)
    const path = folder.split("\\\\")[0];
    const parts = path.split("\\");
    const folderName = parts[parts.length - 1];
    // console.log(folderName);
    card.innerHTML = `
      <img src="img/songs/${folderName}/pllogo.jpg" alt="${folder}">
      <div class="flex">
        <h2>${folderName}</h2>
        <p>Playlist • ASilentVoice</p>
      </div>
    `;
  
    card.style.backgroundColor = (folderName === selectedFolder)
      ? '#282828'
      : '#121212';



      
    console.log(songs)
    songul.folderName=songs
  console.log(songul)
    // songul[folderName]=songs;

    for (const songlink of songs) {
      // console.log(songlink);
      const card2 = document.createElement('div');
      card2.className = 'card rounded show';
      const s1 = songlink.split("/")
      const sn1 = s1[s1.length - 1].split(".")[0]
      const songname = sn1.replaceAll("%20", " ")
      // console.log(songname)
      card2.id = songname;

              card2.innerHTML = `
      <img src="img/songs/${folderName}/${songname}.jpg" alt="${songname}">
      <button id="${songname}" class="card-play-btn">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#1db954" />
              <polygon points="13,10 24,16 13,22" fill="#000" />
          </svg>
      </button>
      <h2 class="flex">${songname}</h2>
      <p class="flex">${folderName}</p>`
 if(folderName===selectedFolder){
      ccontainer.appendChild(card2);
      }
    }
    container.appendChild(card);


  }


}


async function displaytitles(folderName) {
  const titleContainer = document.querySelector(".righttitle");
  titleContainer.textContent = folderName;
}

function formatTime(sec) {
  if (isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function updateTimeAndSeek() {
  const current = currentSong.currentTime;
  const duration = currentSong.duration;


  document.querySelector(".songtime").textContent =
    `${formatTime(current)} / ${formatTime(duration)}`;


  if (!isNaN(duration) && duration > 0) {
    const pct = (current / duration) * 100;
    document.querySelector(".circle").style.left = `${pct}%`;
  }
}




async function main() {

  const playlist = await getSongs();
  console.log('Playlists:', playlist);

  await displaysongal();
  await displaytitles("All Songs");

  Array.from(document.querySelector(".cardContainer").getElementsByTagName("div")).forEach(e => {
    e.addEventListener("click", async () => {
      let snn = e.querySelector("h2").innerHTML.trim();
      let fdn = e.querySelector("p").innerHTML.trim();

      if (currentCard === e) {
        if (currentSong && !currentSong.paused) {
          currentSong.pause();
          e.querySelector(".card-play-btn").innerHTML = `
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#1db954" />
                    <polygon points="13,10 24,16 13,22" fill="#000" />
                </svg>`;
          play.src = "svg/play.svg";
        } else {
          currentSong.play();
          e.querySelector(".card-play-btn").innerHTML = `
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#1db954" />
                    <rect x="11" y="10" width="3" height="12" fill="#000000" />
                    <rect x="18" y="10" width="3" height="12" fill="#000000" />
                </svg>`;
          play.src = "svg/pause.svg";
        }
      } else {

        if (currentCard) {
          currentCard.querySelector(".card-play-btn").innerHTML = `
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#1db954" />
                    <polygon points="13,10 24,16 13,22" fill="#000" />
                </svg>`;
        }


        currentCard = e;


        playMusic(snn, fdn);
      }

    });


    currentSong.addEventListener("loadedmetadata", updateTimeAndSeek);
    currentSong.addEventListener("timeupdate", updateTimeAndSeek);

    currentSong.addEventListener("loadedmetadata", () => {

      updateTimeAndSeek();
    });
    currentSong.addEventListener("timeupdate", () => {
      updateTimeAndSeek();
    });


    document.querySelector(".seekbar").addEventListener("click", e => {
      let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
      document.querySelector(".circle").style.left = percent + "%";
      currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })





  });


  play.addEventListener("click", () => {
    if (!currentSong.src) return;

    if (currentSong.paused) {
      currentSong.play();
      play.src = "svg/pause.svg";


      if (currentCard) {
        currentCard.querySelector(".card-play-btn").innerHTML = `
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#1db954" />
                  <rect x="11" y="10" width="3" height="12" fill="#000000" />
                  <rect x="18" y="10" width="3" height="12" fill="#000000" />
              </svg>`;
      }
    } else {
      currentSong.pause();
      play.src = "svg/play.svg";

      if (currentCard) {
        currentCard.querySelector(".card-play-btn").innerHTML = `
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#1db954" />
                  <polygon points="13,10 24,16 13,22" fill="#000" />
              </svg>`;
      }
    }



  });


currentSong.addEventListener("ended", () => {
  play.src = "svg/play.svg";
  if (currentCard) {
    currentCard.querySelector(".card-play-btn").innerHTML = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#1db954" />
          <polygon points="13,10 24,16 13,22" fill="#000" />
      </svg>`;

    const nextCard = currentCard.nextElementSibling;
    if (nextCard && nextCard.classList.contains('card')) {
      nextCard.click();
    }
  }
});
  document.addEventListener("keydown", function (event) {

    if (event.code === "Space" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      event.preventDefault(); 

      if (currentSong.src) {
        if (currentSong.paused) {
          currentSong.play();
          play.src = "svg/pause.svg";

          if (currentCard) {
            currentCard.querySelector(".card-play-btn").innerHTML = `
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#1db954" />
                <rect x="11" y="10" width="3" height="12" fill="#000000" />
                <rect x="18" y="10" width="3" height="12" fill="#000000" />
            </svg>`;
          }
        } else {
          currentSong.pause();
          play.src = "svg/play.svg";

          if (currentCard) {
            currentCard.querySelector(".card-play-btn").innerHTML = `
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#1db954" />
                <polygon points="13,10 24,16 13,22" fill="#000" />
            </svg>`;
          }
        }
      }
    }
  });
  console.log(currentSong.src,);

  // Hamburger menu toggle
  const ham = document.querySelector(".ham");
  const cross = document.querySelector(".cross");
  const left = document.querySelector(".left");
  const mid = document.querySelector(".mid");
  ham.addEventListener("click", () => {
    left.style.left= "1.5%";
  });
  cross.addEventListener("click", () => {
    left.style.left= "-100%";
  });


const playlistContainer = document.querySelector('.playlist-container');

playlistContainer.addEventListener('click', e => {
  const card = e.target.closest('.playlist');
  if (!card) return;        
  const folderName = card.querySelector('h2').textContent.trim();
  displayPlaylistSongs(folderName);
  displaytitles(folderName);
});

document.querySelector('.home').addEventListener('click', () => {
  displaysongal(); 
  displaytitles("All Songs");
});


const ccontainer = document.querySelector('.cardContainer');
ccontainer.addEventListener('click', e => {


  const card = e.target.closest('.card');
  if (!card) return;

  const songname = card.querySelector('h2').textContent.trim();
  const foldername = card.querySelector('p').textContent.trim();


  if (currentCard && currentCard !== card) {

    currentCard.querySelector('.card-play-btn').innerHTML = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#1db954" />
        <polygon points="13,10 24,16 13,22" fill="#000" />
      </svg>`;
  }
  currentCard = card;

  playMusic(songname, foldername);
});

previous.addEventListener("click", () => {
  if (currentCard) {
    const prevCard = currentCard.previousElementSibling;
    if (prevCard) {
      prevCard.click();
    }
  }
});

next.addEventListener("click", () => {
  if (currentCard) {
    const nextCard = currentCard.nextElementSibling;
    if (nextCard) {
      nextCard.click();
    }
  }
});

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })



const profile = document.querySelector('.profile');
const profileBox = document.querySelector('.profilebox');

if (profile && profileBox) {
  profile.addEventListener('click', (e) => {
    e.stopPropagation(); 
    profileBox.classList.toggle('open');
  });


  document.addEventListener('click', (e) => {
    if (
      profileBox.classList.contains('open') &&
      !profileBox.contains(e.target) &&
      !profile.contains(e.target)
    ) {
      profileBox.classList.remove('open');
    }
  });
}

}

function setPlayingPlaylist(foldername) {

  document.querySelectorAll('.playlist').forEach(el => el.classList.remove('playing'));

  const playlistCard = Array.from(document.querySelectorAll('.playlist')).find(card => {
    const h2 = card.querySelector('h2');
    return h2 && h2.textContent.trim() === foldername;
  });
  if (playlistCard) playlistCard.classList.add('playing');
}

const playMusic = (songname, foldername) => {
  currentSong.src = `songs/${foldername.split(" ").join("%20")}/${songname.split(" ").join("%20")}.mp3`;

  currentSong.play().catch(error => {
    console.error('Error playing audio:', error);
  });
  play.src = "svg/pause.svg";
  currentCard.querySelector(".card-play-btn").innerHTML = `
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#1db954" />
                  <rect x="11" y="10" width="3" height="12" fill="#000000" />
                  <rect x="18" y="10" width="3" height="12" fill="#000000" />
              </svg>`;

  document.querySelector(".songinfo").innerHTML = songname;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

  setPlayingPlaylist(foldername);
};

document.addEventListener('DOMContentLoaded', main);
