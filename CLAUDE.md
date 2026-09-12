# Profile site — CLAUDE.md

Guidance for agents working on `apoorvdarshan/profile` (https://apoorvdarshan.com): a Vite React SPA on Cloudflare Workers static assets, with a small Worker for `/resume`.

## Resume public download

- Canonical share URL: `https://apoorvdarshan.com/resume` (serves the PDF; downloads/views as `Apoorv_Darshan_Resume.pdf`).
- Source file in this repo: `public/Apoorv_Darshan_Resume.pdf` (fallback also at `/Apoorv_Darshan_Resume.pdf` after build).
- After every rekisei resume rebuild: copy the compiled PDF into `public/Apoorv_Darshan_Resume.pdf`, commit, push, and `npm run deploy` so GitHub + site View/Download stay current.
- Keep site header / Resume section links pointing at `/resume`. `scripts/sync-profile-readme.mjs` normalizes the Connect Resume badge to that URL.
- Do not auto-upload resumes to LinkedIn.
- Keep `CLAUDE.md` and `AGENTS.md` parallel when changing this guidance.

## Other content

- GitHub profile README syncs into `src/profileData.generated.json` via `scripts/sync-profile-readme.mjs` on build/dev.
- LinkedIn experience/education are hand-maintained in `src/linkedinExperience.js` and `src/linkedinEducation.js`.
