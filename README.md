# 🎵 SpotifyY

A clean, responsive, JavaScript-based music player that supports playlists, song previews, and basic controls. It loads songs dynamically from a JSON file and displays them beautifully.

---

## 🚀 Features

- 🎧 Play / Pause / Next / Previous
- 📁 Playlist loading from `songs.json`
- 🕒 Real-time seek bar and time display
- 🔊 Volume control with mute toggle
- ⌨️ Spacebar to toggle play/pause
- 📱 Mobile responsive with side navigation
- 👤 Click-to-toggle profile dropdown

---

## 📁 Folder Structure

```
project-root/
├── index.html
├── script.js
├── style.css
├── songs.json
├── img/
│   └── songs/
│       ├── Playlist1/
│       │   ├── pllogo.jpg
│       │   ├── song1.mp3
│       │   ├── song1.jpg
│       │   └── ...
│       └── Playlist2/
│           ├── pllogo.jpg
│           ├── song2.mp3
│           ├── song2.jpg
│           └── ...
├── svg/
│   ├── play.svg
│   ├── pause.svg
│   ├── volume.svg
│   └── mute.svg
```

---

## 📄 `songs.json` Format

```json
{
  "Playlist1": [
    "songs/Playlist1/song1.mp3",
    "songs/Playlist1/song2.mp3"
  ],
  "Playlist2": [
    "songs/Playlist2/track1.mp3"
  ]
}
```

> 🎨 Note: For every `.mp3`, a `.jpg` image (same name) should exist in the same folder.

---

## 🛠 How to Use

1. Clone the project or download the files.
2. Make sure your folder structure matches the one above.
3. Open `index.html` in your browser.
4. Enjoy the music!

---

## ⌨️ Controls

| Action          | Key/Button         |
|-----------------|--------------------|
| Play/Pause      | `Spacebar` or button |
| Next Song       | `Next` button       |
| Previous Song   | `Previous` button   |
| Seek Song       | Click on seek bar   |
| Change Volume   | Slide volume bar    |

---

## 🖼 Song & Playlist Art

- Playlist logo → `img/songs/PlaylistName/pllogo.jpg`
- Song cover → `img/songs/PlaylistName/songName.jpg`

---

## 🔧 Customization

- Add playlists or songs via `songs.json`
- Change icons in `/svg/`
- Modify colors, layout in `style.css`

---

## 🧠 Technologies Used

- Vanilla JavaScript
- HTML5
- CSS3 (Flexbox, Media Queries)

---


