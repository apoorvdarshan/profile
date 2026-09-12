# Profile site — AGENTS.md

Guidance for agents working on `apoorvdarshan/profile` (https://apoorvdarshan.com).

## Resume public download

- Canonical share URL: `https://apoorvdarshan.com/resume` (serves the PDF; downloads/views as `Apoorv_Darshan_Resume.pdf`).
- Source file in this repo: `public/Apoorv_Darshan_Resume.pdf` (also available at `/Apoorv_Darshan_Resume.pdf` after build).
- After every rekisei resume rebuild, agents must copy the compiled PDF into `public/Apoorv_Darshan_Resume.pdf`, commit, push, and `npm run deploy` so GitHub + site View/Download stay current.
- Keep site header / Resume section links pointing at `/resume`. Do not auto-upload resumes to LinkedIn.
- Keep `AGENTS.md` and `CLAUDE.md` parallel when changing this guidance.
