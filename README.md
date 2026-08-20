# DOOOQQQQ — Afonso Quintela portfolio

Static portfolio site. No build step — just open `index.html` or host the
folder on any static host (GitHub Pages, Netlify, Vercel, etc.).

## Pages
- `index.html` — home: `DOOOQQQQ` title, short bio, and 4 category buttons
  (**Stills · Film · Creative Direction · Design**) that expand slightly on hover.
- `stills.html` — grid of photos (click any to open it in a lightbox).
- `film.html` — grid of videos with a title + role overlay and a play button.
- `creative-direction.html` / `design.html` — grids with a title + role overlay.

Clicking any item opens it in a **lightbox**: the item's overlay text disappears
and the rest of the site is blurred and darkened so clients can focus on the work.

## How to add / change content

### Images (Stills, Creative Direction, Design)
1. Drop your image into `assets/img/` (jpg, png, webp, or svg).
2. Copy one of the `.item` blocks in the relevant `.html` page and update:
   - `data-full="assets/img/your-file.jpg"` → the full-size image shown in the lightbox
   - `<img src="assets/img/your-file.jpg">` → the thumbnail
   - `item__title` → the project title (overlay)
   - `item__role` → your role / short description (overlay)

### Videos (Film)
- To play a real video in the lightbox, set `data-full` to a video file
  (`.mp4`, `.webm`, `.mov`), and keep `data-poster` pointing at a preview image:
  ```html
  <div class="item item--video" data-type="video"
       data-poster="assets/img/my-poster.jpg"
       data-full="assets/img/my-film.mp4">
    <img src="assets/img/my-poster.jpg" alt="" />
    <span class="item__play"></span>
    <div class="item__overlay">
      <span class="item__title">My Film</span>
      <span class="item__role">Short Film · Director</span>
    </div>
  </div>
  ```

## Music player (floating, top-left, on every page)
A small round button in the top-left corner opens a floating player with
play/pause, previous/next, a seek bar, volume, and a playlist. It keeps
playing as visitors move between pages (position, volume and current track
are remembered), though browsers may require one click before audio can
resume automatically on a fresh page load — that's a browser autoplay rule,
not a bug.

**To add your own songs:**
1. Drop `.mp3` files into `assets/audio/` (e.g. `track-1.mp3`).
2. Open `assets/js/audio-player.js` and edit the `TRACKS` list at the top:
   ```js
   const TRACKS = [
     { title: 'Song Name', artist: 'Artist', src: 'assets/audio/track-1.mp3' },
     // add as many as you like
   ];
   ```
Add, remove, or reorder entries freely — the player and playlist adapt
automatically.

## Contact page (`contact.html`)
A 3-step questionnaire — **Date → Service → Details** — in English:
1. **Date** — pick a day from the calendar (past days are disabled).
2. **Service** — Photo · Video · Creative Direction · Design.
3. **Details** — Name, Email, @instagram, **Budget** selector
   (Not specified · Flexible · up to €150 · €150–300 · €300–450 · €450–600 ·
   €600–900 · €900–1200 · €1200+), Location, and “Tell me your idea briefly”.

On **Send Request** it opens the visitor's email app pre-filled with all the
answers, addressed to `CONTACT_EMAIL`.
**Set your real email** in `assets/js/contact.js` (the `CONTACT_EMAIL` constant).

## To set up before going live
- **Footer links** — replace the placeholders:
  - Instagram: `https://instagram.com/` → your profile
  - Email: `mailto:hello@example.com` → your email
  - WhatsApp: `https://wa.me/351000000000` → your number
- **Contact email** — `CONTACT_EMAIL` in `assets/js/contact.js`.
- Replace the placeholder cover/content SVGs in `assets/img/` with real work.

## Fonts
Uses **Archivo** (bold, uppercase) via Google Fonts to match the reference look.
