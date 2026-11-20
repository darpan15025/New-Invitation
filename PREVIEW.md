# Invitation preview (JoyInvite / link share)

HTML file ~1 MB hai (images embed). **htmlpreview** / **githack** aksar fail ho jaate hain.

## Option A — Official link (recommended, 1 minute)

1. Open: https://github.com/darpan15025/New-Invitation/settings/pages  
2. **Build and deployment → Source:** Deploy from a branch  
3. **Branch:** `main` → folder **`/docs`** → **Save**  
4. 1–2 minute wait, then open:  
   **https://darpan15025.github.io/New-Invitation/**

(Already `docs/index.html` is in the repo; har push par workflow ise update karta hai.)

## Option B — Phone / laptop local

```bash
cd path/to/New-Invitation
python3 -m http.server 8765
```

Browser: http://127.0.0.1:8765/index.html  
(Same WiFi pe phone se: `http://<laptop-IP>:8765/index.html`)

## Option C — JoyInvite live

Download: https://github.com/darpan15025/New-Invitation/raw/main/index.html  
Upload on JoyInvite dashboard → `shaadicanvas.joyinvite.in`

## Music (optional)

1. Add an MP3 named **`wedding-music.mp3`** in the same folder as `index.html` (soft instrumental works best).
2. Tap **Music** (top-right) after opening the invite — browsers require a tap to play audio.

To use another file or URL, edit `MUSIC_SRC` in `index.html`.

## Fireworks

Tap **Fireworks** (top-right) to turn celebration bursts on or off.