# Automatic profile, contribution, and resume refresh

`Refresh profile and resume` runs at minute 17 every six hours (UTC), and supports manual dispatch. Scheduled Actions can start later than their cron time. It commits directly to `main`; there is no review PR or AI service.

The workflow lives in `apoorvdarshan/apoorvdarshan/.github/workflows/refresh-profile.yml`, where the existing Cloudflare deployment secrets are configured. Its scripts live in this website repository. It:

1. Checks out the website and `apoorvdarshan/profile-resume-private` with separate repository-scoped write deploy keys, and the public README with its workflow token.
2. Paginates **all** merged PRs for **apoorvdarshan**, keeping only public repositories owned by other accounts. PR authors, merge timestamps, and API totals are verified. It refuses incomplete responses or loss of previously verified PRs.
3. Saves all verified PR titles/links and current star counts to `profile-automation/contributions.json` in the README repository. The README remains the source of emoji, linked attribution, and personal-project descriptions. Authored-commit entries without matching authored PRs remain intact. Historical editorial counts above API counts are preserved and called out in the run summary.
4. Adds new contribution repositories with escaped, shortened PR titles. Repositories with multiple verified merges always get a current description from the newest distinct PR titles, ordered by merge time (PR number breaks ties). Uses three titles if they fit, otherwise two shortened titles; the full cumulative count and linked attribution share a 90-character description budget. Repeated titles are shown once. Existing single-PR descriptions stay until another merge arrives. Existing multi-PR descriptions are refreshed on the first run of this policy, and later runs also pick up title corrections. This is deterministic title selection/shortening, with no AI or significance ranking. Sorts OSS by stars, with repository name as a stable tie-breaker; shows ten entries and folds the rest into Show More. Own project order is preserved; only their star badges are refreshed.
5. Mirrors generated OSS descriptions into the resume along with links, counts, ordering, and stars. Preserves the resume header, other sections, and existing single-PR/commit-credit descriptions. Missing OSS entries are added. Project star counts are refreshed in place.
6. Builds changed private LaTeX with pinned Tectonic 0.17.0. Checks page count, text bounds, required entries, and renders pages before copying the PDF to `public/Apoorv_Darshan_Resume.pdf`. No private source or page artifacts are uploaded publicly. Unchanged source reuses the validated PDF.
7. Builds the website from the exact local README and verified star snapshot, avoiding cached GitHub README/badge data.
8. Commits only changed managed files in each repository, with **Apoorv Darshan as author and committer** (`90602809+apoorvdarshan@users.noreply.github.com`) and **github-actions[bot] as co-author**, then deploys the built site with Wrangler. A dedicated SSH signing key registered on Apoorv's account gives automated commits the Verified badge, including with vigilant mode enabled. Signing failures produce warnings and fall back to unsigned commits, as requested; no branch rule blocks unsigned pushes. Pushes never force-update branches. Other failures stop the run; subsequent runs retry deployment even when there are no new commits.

The existing `/resume` and `/Apoorv_Darshan_Resume.pdf` URLs continue serving the updated PDF. The `.tex`, PDF, and their build manifest also live in the **private** resume repository. The legacy `.github/resume-pdf-parts` files are not used by the site or refresh job.

## Credentials

- `GITHUB_TOKEN`: public GitHub reads and commits to the README repository.
- `PROFILE_SITE_DEPLOY_KEY`: write access only to `apoorvdarshan/profile`.
- `RESUME_SOURCE_DEPLOY_KEY`: write access only to the private resume repository.
- `PROFILE_COMMIT_SIGNING_KEY`: dedicated SSH private signing key, registered only for signing on Apoorv's account (not authentication). The corresponding public key is pinned in the README repo's `.github/profile-signing.pub`. The runner writes it with private permissions only for the commit step and removes it afterward, including on failure. To rotate it, register a new signing public key, replace the secret and pinned public key, and confirm GitHub verifies the next automated commit before retiring the old key.
- Existing `CLOUDFLARE_API_KEY` and `CLOUDFLARE_EMAIL`: site deployment.

Only scheduled/manual runs execute this workflow. Secrets are not exposed to pull-request code. GitHub-hosted runners do the cloud work, so the Mac can be off. GitHub's normal Actions/account limits still apply.

## Mac copies and manual resume edits

`sync-local-resume.py` pulls the private repo and copies the verified source/PDF into `~/rekisei`. The two `~/Documents/Apoorv_Darshan_Resume.*` files are symlinks to the private checkout, so they follow each pull immediately. A user LaunchAgent (`com.apoorvdarshan.profile-resume-sync`) runs at login and every six hours while the Mac is awake (`StartInterval = 21600`). The Mac initiates the GitHub pull; the cloud never connects to the Mac or sends it a command. The PDF is built in the cloud, so this local job only downloads and copies the verified files. It creates dated backups before replacing files and refuses to overwrite files changed locally since the last sync. Backups live in `~/.local/share/profile-automation/resume-backups`, also linked from `~/Documents/resume-backups`. This keeps background access out of macOS's protected Documents directory without changing privacy permissions. Editing a Documents source link edits the private checkout; the dirty-check then pauses automatic pulls.

For a manual resume edit, compile and verify as usual, copy the source and PDF into `~/profile-resume-private`, update `build.json` hashes (or let the next cloud run rebuild), then commit and push that private repo. After the rekisei copies match the committed private source/PDF pair and manifest, run the sync script once to record the new baseline. Preserve the Documents symlinks; copy into their targets instead of replacing the links. It never publishes local edits automatically. A divergent local edit stops synchronization until deliberately reconciled.

## Local verification

```sh
node --test scripts/automation/*.test.mjs
PROFILE_README_PATH=/path/to/README.md PROFILE_RESUME_PATH=/private/path/Apoorv_Darshan_Resume.tex node scripts/automation/update-profile.mjs
PROFILE_RESUME_PATH=/private/path/Apoorv_Darshan_Resume.tex python3 scripts/automation/build-resume.py
PROFILE_README_PATH=/path/to/README.md PROFILE_STARS_PATH=/path/to/profile-automation/contributions.json npm run build
```

All API validation completes before source files are written. There is no automatic deletion of contributions and no automatic discovery of new personal projects. New personal projects still go at the top of their selected category when requested.
