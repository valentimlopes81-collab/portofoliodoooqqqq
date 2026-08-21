The music player no longer needs local files.

Songs are loaded as 30-second previews from the iTunes Search API, driven
by the QUERIES list at the top of assets/js/audio-player.js. Edit that list
to change the playlist — nothing needs to go in this folder.

(If you later want full-length tracks, drop .mp3 files here and point each
track's `src` at them in audio-player.js instead of using QUERIES.)
