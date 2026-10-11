# Automatic profile, contribution, and resume refresh

`Refresh profile and resume` runs at minute 17 every six hours (UTC), and supports manual dispatch. Scheduled Actions can start later than their cron time. It commits directly to `main`; there is no review PR or AI service.

The workflow lives in `apoorvdarshan/apoorvdarshan/.github/workflows/refresh-profile.yml`, where the existing Cloudflare deployment secrets are configured. Its scripts live in this website repository. It:

1. Checks out the website and `apoorvdarshan/profile-resume-private` with separate repository-scoped write deploy keys, and the public README with its workflow token.
2. Paginates **all** merged PRs for **apoorvdarshan**, keeping only public repositories owned by other accounts. PR authors, merge timestamps, and API totals are verified. It refuses incomplete responses or loss of previously verified PRs.
3. Saves all verified PR titles/links and current star counts to `profile-automation/contributions.json` in the README repository. The README remains the source of emoji, linked attribution, and personal-project descriptions. Authored-commit entries without matching authored PRs remain intact. Historical editorial counts above API counts are preserved and called out in the run summary.
4. Adds new contribution repositories with escaped, shortened PR titles. Repositories with multiple verified merges always get a current description from the newest distinct PR titles, ordered by merge time (PR number breaks ties). Uses three titles if they fit, otherwise two shortened titles; the full cumulative count and linked attribution share a 90-character description budget. Repeated titles are shown once. Existing single-PR descriptions stay until another merge arrives. Existing multi-PR descriptions are refreshed on the first run of this policy, and later runs also pick up title corrections. This is deterministic title selection/shortening, with no AI or significance ranking. Sorts OSS by stars, with repository name as a stable tie-breaker; shows ten entries and folds the rest into Show More. Own project order is preserved; their star badges are refreshed, and configured iOS and npm download badges are refreshed daily as described below.
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
- `ASC_REPORTS_KEY_ID`, `ASC_REPORTS_ISSUER_ID`, `ASC_REPORTS_PRIVATE_KEY`: the dedicated **Profile Download Reporting** ASC team key, with Sales and Reports access. It reads reports for all six configured iOS apps. Only this reporting key is stored here; existing app publishing, notarization and RevenueCat keys remain separate. The issuer is shared with other team keys.
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

## Daily App Store downloads

`ios_downloads.py` checks Apple once per UTC day during the first successful six-hour refresh (normally the 00:17 UTC run / 05:47 IST). Later runs reuse that day's verified totals. Failed checks retry on the next run. Manual dispatch can set `refresh_ios_downloads` to force another check.

The managed apps/links are in `ios-downloads.json`: Fud AI, Verceltics, Scowld, Quit All, PCM Notes (iitjee), and ABYSM. Adding an app requires an explicit config entry, an existing README/resume download badge, and an Admin-created ONGOING report request. The daily reporting key cannot create requests or publish app releases.

The updater reads **App Downloads Standard**, DAILY instances only, paginates all API lists, verifies every compressed segment's size/checksum, and aggregates all rows/segments within each instance. For an event date repeated across instances, the latest `processingDate` replaces the entire date partition; it never sums overlapping instances or deduplicates legitimate identical rows. Badges use **lifetime first-time downloads**, excluding redownloads, restores and updates. Exact first-time counts, redownloads, and first-time + redownload totals are retained privately. Apple completes this report after two days. Each app's cutoff is the latest observed report processing date minus two days, capped at UTC today minus two days; a previously verified later cutoff is retained. Delayed reports never promote a partially reported day. Quiet apps may keep an older data-through date until another report arrives. The private snapshot and run summary show each app's date.

`ios-download-history.json` in **private** `profile-resume-private` stores per-day aggregates, processed-instance IDs, and the complete daily lifetime history verified against the App Store Connect Analytics UI on 2026-10-11 (through 2026-10-09). This survives Apple's 35-day report retention and runner/cache resets. Fresh ONE_TIME_SNAPSHOT requests were made on 2026-10-11 for all six apps; once generated, the job automatically imports the full report history and reconciles the bootstrapped UI history. It validates the snapshot covers the known app history. The checked daily totals are saved as private `ios-downloads.json`. Raw reports, signed download URLs and credentials are never committed.

Fud AI adds **2,512 Android installs from the last verified Google Play listing**, recorded separately in the app config; this job does not refresh Google Play. All other configured badges use iOS alone. Milestones round down (35 → 30+, 188 → 100+, 1,358 → 1K+). Project descriptions, order, extension user counts and other download badges remain curated.

The exact same labels update the GitHub README and private resume source before the existing PDF build/site sync. Both public PDF URLs therefore follow automatically. The Mac's existing six-hour pull brings the private history, source and PDF down; Documents resume symlinks and the rekisei mirror follow. `~/Documents/asc_downloads.json` is a symlink to the current private aggregate file after its original snapshot was archived; read the current `apps` mapping rather than the legacy array format.

Managed iOS and npm README badges use `https://apoorvdarshan.com/badges/downloads/v1/<encoded-label>.svg`. The Cloudflare Worker renders the same maroon tile directly, without calling Shields or Apple when an image loads. Each milestone has its own immutable URL, so count changes bypass older image caches. GitHub still proxies external images through Camo. The website parses the unchanged `Downloads:` alt text and the resume uses text, so neither depends on badge images. Other curated badges remain unchanged.

On an API, schema, checksum, or pagination failure, no download outputs are written. The workflow warns and continues the other profile updates using previous verified download badges. A gap longer than 32 days requires a fresh full historical snapshot so missing report history is never silently treated as zero. Use an Admin key **locally** to POST `/v1/analyticsReportRequests` with `accessType: ONE_TIME_SNAPSHOT` for the affected app; do not grant Admin to the scheduled reporting key. The next successful run imports the generated history and recovers automatically. ONGOING requests stopped for inactivity also require Admin reactivation. Apple may take time to prepare new reports.

Local check (keep credentials in the environment or a private key file):

```sh
ASC_REPORTS_KEY_ID=... ASC_REPORTS_ISSUER_ID=... \
ASC_REPORTS_PRIVATE_KEY_PATH=/private/path/AuthKey.p8 \
PROFILE_README_PATH=/path/to/README.md \
PROFILE_RESUME_PATH=/private/path/Apoorv_Darshan_Resume.tex \
python3 scripts/automation/ios_downloads.py
```

Apple references: [Analytics Reports](https://developer.apple.com/documentation/analytics-reports), [App Downloads](https://developer.apple.com/documentation/analytics-reports/app-download), [Data Completeness and Corrections](https://developer.apple.com/documentation/analytics-reports/data-completeness-corrections).

## Daily npm downloads

`npm_downloads.py` refreshes the five explicitly configured packages in `npm-downloads.json` once per UTC day during the six-hour workflow. No npm token, npmrc, publishing permission, or 2FA bypass is used. It reads the public registry metadata and public download-count API. `refresh_npm_downloads` in manual dispatch (or local `NPM_DOWNLOADS_FORCE=true`) forces a fresh check.

The metric is **lifetime npm package downloads**, across all versions from each package's creation date through the latest completed date available for all five packages. Downloads include repeat installs and automated/CI requests; they are not unique users, GitHub release downloads, or Homebrew installs. The existing project download badge displays this npm-only count, rounded down with the same milestone rules as iOS. Fud AI and extension user counts are managed separately.

Each daily refresh verifies the exact package name, maintainer, repository, and pinned creation date. Scoped packages are queried individually. Full history is fetched again in non-overlapping inclusive windows of at most 365 days, below npm's 18-month request limit. Responses must cover the exact requested interval with a nonnegative integer count. This incorporates corrected statistics without incrementally double-counting downloads. Packages created before npm's available history (2015-01-10) require an explicit historical policy before being added.

The public audit snapshot is `profile-automation/npm-downloads.json` in the profile README repository. It records exact totals, dates, milestone labels, configuration fingerprint, and source URLs for every interval. Normal later runs that day reuse that snapshot. Config changes force a refresh. API/identity/schema failures leave the previous npm counts and snapshot intact, show a workflow warning, and retry next run while other updates continue.

The same run updates the five existing README and private resume labels, rebuilds the PDF, syncs the website, signs commits, and deploys. Badges use the existing Cloudflare SVG route. Both resume URLs and the Mac's six-hour pull follow the same existing process.

Local check: `PROFILE_README_PATH=/path/to/README.md PROFILE_RESUME_PATH=/private/path/resume.tex python3 scripts/automation/npm_downloads.py`.

Source: [npm download-count API](https://github.com/npm/registry/blob/main/docs/download-counts.md).
