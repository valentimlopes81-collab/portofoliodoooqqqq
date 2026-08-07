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

## To set up before going live
- **Contact button / footer links** — replace the placeholders:
  - Instagram: `https://instagram.com/` → your profile
  - Email: `mailto:hello@example.com` → your email
  - WhatsApp: `https://wa.me/351000000000` → your number
  The header **Contact** button currently scrolls to the footer (`#contact`).
- Replace the placeholder cover/content SVGs in `assets/img/` with real work.

## Fonts
Uses **Archivo** (bold, uppercase) via Google Fonts to match the reference look.
