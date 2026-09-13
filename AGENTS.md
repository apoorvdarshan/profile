# Profile site — AGENTS.md

Guidance for agents working on `apoorvdarshan/profile` (https://apoorvdarshan.com): a Vite React SPA on Cloudflare Workers static assets, with a small Worker for `/resume`.

## Resume public download

- Canonical share URL: `https://apoorvdarshan.com/resume` (serves the PDF; downloads/views as `Apoorv_Darshan_Resume.pdf`).
- Source file in this repo: `public/Apoorv_Darshan_Resume.pdf` (fallback also at `/Apoorv_Darshan_Resume.pdf` after build).
- After every rekisei resume rebuild: copy the compiled PDF into `public/Apoorv_Darshan_Resume.pdf`, commit, push, and `npm run deploy` so GitHub + site View/Download stay current.
- Keep site header / Resume section links pointing at `/resume`. Do **not** put a Resume badge in Connect (Resume has its own section).
- Do not auto-upload resumes to LinkedIn.
- Keep `AGENTS.md` and `CLAUDE.md` parallel when changing this guidance.

## Other content

- GitHub profile README syncs into `src/profileData.generated.json` via `scripts/sync-profile-readme.mjs` on build/dev.
- LinkedIn experience/education are hand-maintained in `src/linkedinExperience.js` and `src/linkedinEducation.js`.

## Description Length

- Descriptions in **Apps**, **Games**, **Chrome Extensions**, **Projects**, and **Open Source Contributions** must stay on **one rendered line** at normal desktop width (GitHub README profile view and apoorvdarshan.com).
- Never let a description wrap to a second line on desktop. If it would wrap, **shorten the wording** (keep the metric suffix like `(8K+ downloads)` when present).
- Prefer ~90 characters or fewer for the plain description text after the name/badge.
- On apoorvdarshan.com, desktop list rows also use CSS ellipsis as a backstop (`white-space: nowrap; overflow: hidden; text-overflow: ellipsis`) — still shorten the source text; do not rely on clipping alone.
