# Profile site — CLAUDE.md

Guidance for agents working on `apoorvdarshan/profile` (https://apoorvdarshan.com): a Vite React SPA on Cloudflare Workers static assets, with a small Worker for `/resume`.

## Resume public download

- Canonical share URL: `https://apoorvdarshan.com/resume` (serves the PDF; downloads/views as `Apoorv_Darshan_Resume.pdf`).
- Source file in this repo: `public/Apoorv_Darshan_Resume.pdf` (fallback also at `/Apoorv_Darshan_Resume.pdf` after build).
- After every rekisei resume rebuild: copy the compiled PDF into `public/Apoorv_Darshan_Resume.pdf`, commit, push, and `npm run deploy` so GitHub + site View/Download stay current.
- Keep site header / Resume section links pointing at `/resume`. Do **not** put a Resume badge in Connect (Resume has its own section).
- Do not auto-upload resumes to LinkedIn.
- Keep `CLAUDE.md` and `AGENTS.md` parallel when changing this guidance.

## Other content

- GitHub profile README syncs into `src/profileData.generated.json` via `scripts/sync-profile-readme.mjs` on build/dev.
- LinkedIn experience/education are hand-maintained in `src/linkedinExperience.js` and `src/linkedinEducation.js`.

## Download counts (ASC)

- Snapshot: `~/Documents/asc_downloads.json` (App Store Connect Analytics, App Downloads Standard).
- For badges/copy use **first-time** downloads, never the all-events `total` (updates inflate it — Fud AI ~37K all-events vs ~6K first-time as of 2026-09-11).
- Site/resume **Fud AI 8K+** = ASC first-time (~6K) + Play/other (~2K). Do not replace 8K+ with the ASC all-events total.
- GitHub README uses maroon download shield tiles (`alt="Downloads: N"`); the site sync parses those (fallback: trailing `(Nk+ downloads)`) into a `downloads` field and renders plain `↓ {count}` text beside ★ — same `.star-count` look (secondary color), **not** a maroon pill/tile.
