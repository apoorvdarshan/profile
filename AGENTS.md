# Agent notes — apoorvdarshan.com profile

This repo powers [apoorvdarshan.com](https://apoorvdarshan.com): a Vite React SPA deployed to Cloudflare Workers static assets, with a small Worker for `/resume`.

## Resume updates

After rebuilding the resume in [rekisei](https://github.com/apoorvdarshan/rekisei):

1. **Copy the PDF** from `~/Documents/Apoorv_Darshan_Resume.pdf` to [`public/Apoorv_Darshan_Resume.pdf`](public/Apoorv_Darshan_Resume.pdf). The filename must stay exactly `Apoorv_Darshan_Resume.pdf`.
2. **Commit and deploy** — push to `main`; Cloudflare Workers Builds runs `npm run build` and `wrangler deploy`.
3. **Keep public links at `/resume`** — the canonical share URL is [apoorvdarshan.com/resume](https://apoorvdarshan.com/resume). On-site links in `src/App.jsx` use `/resume`; the Connect badge URL is normalized in `scripts/sync-profile-readme.mjs`. Do not change these to the long PDF path.
4. **Do not upload to LinkedIn** — the site is the public resume; LinkedIn profile experience/education live in `src/linkedinExperience.js` and `src/linkedinEducation.js` separately.

The long path `/Apoorv_Darshan_Resume.pdf` remains a fallback after deploy; prefer `/resume` for sharing.

## Other content

- **GitHub profile README** → synced into `src/profileData.generated.json` via `scripts/sync-profile-readme.mjs` on build/dev.
- **LinkedIn experience/education** → hand-maintained JS snapshots; not auto-synced from LinkedIn.
