import { useEffect, useState } from 'react'

const products = [
  { name: 'Fud AI', description: 'Free and open-source AI calorie tracking for iOS and Android; 4K+ downloads.', meta: 'Mobile', url: 'https://github.com/apoorvdarshan/fud-ai' },
  { name: 'Verceltics', description: 'Vercel Web Analytics on the iPhone, built natively with SwiftUI.', meta: 'iOS', url: 'https://github.com/apoorvdarshan/verceltics' },
  { name: 'Scowld', description: 'Open-source AI companion with a live VRM avatar, vision, and voice.', meta: 'iOS', url: 'https://github.com/apoorvdarshan/scowld' },
  { name: 'Quit All', description: 'A native app for quitting habits and tracking time, money, and cravings.', meta: 'iOS', url: 'https://apps.apple.com/us/app/quit-all-break-every-habit/id6760978934' },
  { name: 'Crossposter', description: 'Private, local-first publishing and scheduling for eleven social platforms.', meta: 'Web', url: 'https://github.com/apoorvdarshan/crossposter' },
  { name: 'TetherShot', description: 'A macOS menu-bar app that saves iPhone screenshots directly to a folder.', meta: 'macOS', url: 'https://github.com/apoorvdarshan/TetherShot' },
]

const projects = [
  ['OpenGraph Studio', 'Edit and preview social metadata across major platforms.', 'https://github.com/apoorvdarshan/opengraph-studio'],
  ['Country Filter for X', 'Hide posts from selected countries on X.', 'https://github.com/apoorvdarshan/x-country-filter'],
  ['Streaming Auto Pause', 'Pause Netflix and Prime Video when switching away.', 'https://github.com/apoorvdarshan/streaming-autopause'],
  ['GitHub Graph Merger', 'Combine multiple contribution graphs into one SVG heatmap.', 'https://github.com/apoorvdarshan/github-readme-contribution-merger'],
  ['Daxerly', 'Proof of work formatted as a receipt with a price tag.', 'https://github.com/apoorvdarshan/daxerly'],
  ['Nornlore', 'See what the universe was doing on the day you were born.', 'https://github.com/apoorvdarshan/nornlore'],
  ['How Rich Are You?', 'A 90s-style global income-rank calculator.', 'https://github.com/apoorvdarshan/how-rich-are-you'],
  ['Billionaire Smash', 'Head-to-head voting for the Forbes billionaire list.', 'https://github.com/apoorvdarshan/billionaire-smash'],
  ['DOB Selector', 'An intentionally bad date picker seen 130K+ times on Reddit.', 'https://github.com/apoorvdarshan/dob-selector'],
  ['Rekisei', 'Edit a concise LaTeX résumé by chatting with Claude or Codex.', 'https://github.com/apoorvdarshan/rekisei'],
  ['Claw C', 'A coding agent implemented in pure C.', 'https://github.com/apoorvdarshan/claw-c'],
]

const contributions = [
  ['TensorFlow', 'Fixed resource misclassification for unsorted read-only inputs.', '#110665', 'https://github.com/tensorflow/tensorflow/pull/110665'],
  ['Kubernetes', 'Migrated SignerName to declarative validation.', '#137095', 'https://github.com/kubernetes/kubernetes/pull/137095'],
  ['Flutter', 'Removed Material imports from navigator and overlay tests.', '#182546', 'https://github.com/flutter/flutter/pull/182546'],
  ['Svelte', 'Kept select values current when an effect is deferred.', '#17745', 'https://github.com/sveltejs/svelte/pull/17745'],
  ['Spring Boot', 'Aligned TestRestTemplate cookie handling with RestTemplate.', '#49261', 'https://github.com/spring-projects/spring-boot/pull/49261'],
  ['jQuery', 'Used createElementNS correctly for XSLT documents.', '#5775', 'https://github.com/jquery/jquery/pull/5775'],
  ['.NET Runtime', 'Corrected fractional-token AttemptAcquire(0) behavior.', '#124498', 'https://github.com/dotnet/runtime/pull/124498'],
  ['Google zx', 'Improved cwd validation and remote-script error handling.', '2 merged', 'https://github.com/google/zx/pulls?q=author%3Aapoorvdarshan'],
  ['SQLFluff', 'Fixed SQL parsing, grammar, and Jinja encoding edge cases.', '7 merged', 'https://github.com/sqlfluff/sqlfluff/pulls?q=author%3Aapoorvdarshan'],
]

const background = [
  ['B.S. Computer Science, University of the People', '2025–2026'],
  ['President’s List and Dean’s List', '2026'],
  ['Meta Front-End Developer Specialization', '2025'],
  ['Claude Code in Action, Anthropic', '2025'],
  ['Grew a YouTube channel to 21.5K+ subscribers and sold it', '2019–2024'],
  ['ACE Certified Personal Trainer', '2024'],
  ['Top 1.5% in JEE; AIR 15,796 in JEE Advanced', '2023'],
]

const elsewhere = [
  ['GitHub', 'https://github.com/apoorvdarshan'],
  ['LinkedIn', 'https://www.linkedin.com/in/apoorvdarshan'],
  ['Writing', 'https://apoorvdarshan.com'],
  ['X', 'https://x.com/apoorvdarshan'],
  ['YouTube', 'https://youtube.com/@apoorvdarshan'],
  ['Bluesky', 'https://bsky.app/profile/apoorvdarshan.com'],
  ['Dev.to', 'https://dev.to/apoorvdarshan'],
  ['Product Hunt', 'https://www.producthunt.com/@apoorvdarshan'],
]

function ExternalLink({ href, children, className = '' }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>
}

function LinkList({ items, type = 'standard' }) {
  return (
    <ul className={`link-list ${type}`}>
      {items.map((item) => type === 'products' ? (
        <li key={item.name}>
          <div><ExternalLink href={item.url}>{item.name}</ExternalLink><span>{item.description}</span></div>
          <small>{item.meta}</small>
        </li>
      ) : (
        <li key={item[0]}><div><ExternalLink href={item[2]}>{item[0]}</ExternalLink><span>{item[1]}</span></div></li>
      ))}
    </ul>
  )
}

function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('apoorv-color-mode')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [repoCount, setRepoCount] = useState(259)

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('apoorv-color-mode', dark ? 'dark' : 'light')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#222528' : '#eeeee8')
  }, [dark])

  useEffect(() => {
    fetch('https://api.github.com/users/apoorvdarshan')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setRepoCount(data.public_repos))
      .catch(() => {})
  }, [])

  return (
    <div className="site">
      <a className="skip-link" href="#content">Skip to content</a>
      <header className="header">
        <a className="name" href="#top">Apoorv Darshan</a>
        <nav aria-label="Primary navigation">
          <ExternalLink href="https://github.com/apoorvdarshan">GitHub</ExternalLink>
          <ExternalLink href="https://www.linkedin.com/in/apoorvdarshan">LinkedIn</ExternalLink>
          <button className="theme-toggle" type="button" onClick={() => setDark(!dark)} aria-label={`Use ${dark ? 'light' : 'dark'} color mode`} aria-pressed={dark}><span></span></button>
        </nav>
      </header>

      <main id="content">
        <article id="top">
          <section className="intro">
            <p>Apoorv Darshan is a developer in Delhi building open-source apps, practical tools, and internet experiments across iOS, Android, and the web. He studies computer science at the University of the People and contributes fixes to widely used open-source projects.</p>
            <details className="bio-more">
              <summary>More</summary>
              <div>
                <p>His recent work includes <ExternalLink href="https://github.com/apoorvdarshan/fud-ai">Fud AI</ExternalLink>, a free AI calorie tracker with more than 4,000 downloads; <ExternalLink href="https://github.com/apoorvdarshan/verceltics">Verceltics</ExternalLink>, a native iPhone client for Vercel Analytics; and merged contributions to TensorFlow, Kubernetes, Flutter, Svelte, Spring Boot, jQuery, and .NET.</p>
                <p>Before focusing on software, Apoorv grew a YouTube channel to more than 21,500 subscribers. He is also an ACE Certified Personal Trainer and ranked in the top 1.5% of JEE candidates in 2023.</p>
              </div>
            </details>
          </section>

          <section><h2>Products</h2><LinkList items={products} type="products" /></section>

          <section>
            <h2>Projects</h2>
            <LinkList items={projects} />
            <p className="section-note"><ExternalLink href="https://github.com/apoorvdarshan?tab=repositories">All {repoCount} public repositories</ExternalLink></p>
          </section>

          <section>
            <h2>Open source</h2>
            <ul className="link-list contributions">
              {contributions.map(([name, description, pr, url]) => (
                <li key={`${name}-${pr}`}><div><ExternalLink href={url}>{name}</ExternalLink><span>{description}</span></div><small>{pr}</small></li>
              ))}
            </ul>
            <p className="section-note"><ExternalLink href="https://github.com/pulls?q=is%3Apr+author%3Aapoorvdarshan">All pull requests</ExternalLink></p>
          </section>

          <section>
            <h2>Background</h2>
            <ul className="simple-list">{background.map(([item, year]) => <li key={item}><span>{item}</span><small>({year})</small></li>)}</ul>
          </section>

          <section>
            <h2>Elsewhere</h2>
            <ul className="inline-list">{elsewhere.map(([name, url]) => <li key={name}><ExternalLink href={url}>{name}</ExternalLink></li>)}</ul>
          </section>

          <section className="contact">
            <h2>Contact</h2>
            <p>For product engineering roles, focused builds, founder collaborations, or open-source work, email <a href="mailto:ad13dtu@gmail.com">ad13dtu@gmail.com</a>.</p>
          </section>
        </article>
      </main>

      <footer><p>Delhi, India</p><p>Last updated July 2026</p></footer>
    </div>
  )
}

export default App
