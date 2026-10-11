# Profile site — AGENTS.md

Guidance for agents working on `apoorvdarshan/profile` (https://apoorvdarshan.com): a Vite React SPA on Cloudflare Workers static assets, with a small Worker for `/resume`.

## Resume public download

- Canonical share URL: `https://apoorvdarshan.com/resume` (serves the PDF; downloads/views as `Apoorv_Darshan_Resume.pdf`).
- Source file in this repo: `public/Apoorv_Darshan_Resume.pdf` (fallback also at `/Apoorv_Darshan_Resume.pdf` after build).
- After every rekisei resume rebuild: copy the compiled PDF into `public/Apoorv_Darshan_Resume.pdf`, commit, push, and `npm run deploy` so GitHub + site View/Download stay current.
- Keep site header / Resume section links pointing at `/resume`. Do **not** put a Resume badge in Connect (Resume has its own section).

## Other content

- Automatic profile refresh runs every six hours from `apoorvdarshan/apoorvdarshan/.github/workflows/refresh-profile.yml`, using this repo's `scripts/automation/`. It updates verified merges/stars for `apoorvdarshan` only, commits directly, rebuilds the resume, syncs this site, and deploys to Cloudflare. No review PR or AI service. See `scripts/automation/README.md` for operations.
- For manual resume edits, also commit/push the verified source and PDF to the private `~/profile-resume-private` repo. Never put personal LaTeX in this public repo. Local Documents/rekisei copies sync from the private cloud copy every 30 minutes with dated backups and local-edit protection.
- Preserve curated project order, personal-project descriptions, download counts, and the resume header. Only OSS entries sort by stars automatically. Multi-PR OSS descriptions refresh from the newest 2–3 distinct merged PR titles within the one-line limit, retaining cumulative counts and linked attribution; mirror generated descriptions into the resume.
- Preserve the Documents resume symlinks to `~/profile-resume-private`. Background sync updates the private checkout and rekisei copies; backups live in `~/.local/share/profile-automation/resume-backups` (linked from Documents). Do not make background Python access the protected Documents folder.

- GitHub profile README syncs into `src/profileData.generated.json` via `scripts/sync-profile-readme.mjs` on build/dev. Cloudflare Workers `prebuild` re-runs that sync so a redeploy picks up the current README.
- `## What I Use` `### Hardware` / `### Software` shields.io logo tiles on GitHub README; sync → `uses.hardware` / `uses.software` (`name`, `badgeUrl`, `url`). **Site renders text links like Connect** (not badge images). Never the resume.
- LinkedIn experience/education are hand-maintained in `src/linkedinExperience.js` and `src/linkedinEducation.js`.

## Download counts (ASC)

- Snapshot: `~/Documents/asc_downloads.json` (App Store Connect Analytics, App Downloads Standard).
- For badges/copy use **first-time** downloads, never the all-events `total` (updates inflate it — Fud AI ~37K all-events vs ~6K first-time as of 2026-09-11).
- Site/resume **Fud AI 8K+** = ASC first-time (~6K) + Play/other (~2K). Do not replace 8K+ with the ASC all-events total.
- GitHub README uses maroon download shield tiles (`alt="Downloads: N"`); the site sync parses those (fallback: trailing `(Nk+ downloads)`) into a `downloads` field and renders plain `↓ {count}` text beside ★ — same `.star-count` look (secondary color), **not** a maroon pill/tile.

- Chrome Web Store public listings may use README `Users: N` shields; sync maps those into the same `downloads` / ↓ chip on the site.

## Description Length

- Descriptions in **Apps**, **Games**, **Chrome Extensions**, **Projects**, and **Open Source Contributions** must stay on **one rendered line** at normal desktop width (GitHub README profile view and apoorvdarshan.com).
- Never let a description wrap to a second line on desktop. If it would wrap, **shorten the wording** (keep download shield badges in the GitHub README when present).
- Prefer ~90 characters or fewer for the plain description text after the name/badge.
- On apoorvdarshan.com, desktop list rows also use CSS ellipsis as a backstop (`white-space: nowrap; overflow: hidden; text-overflow: ellipsis`) — still shorten the source text; do not rely on clipping alone.
