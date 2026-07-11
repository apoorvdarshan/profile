import { useEffect, useState } from 'react'

const products = [
  ['Fud AI', 'iOS & Android', 'https://github.com/apoorvdarshan/fud-ai'],
  ['Verceltics', 'iOS', 'https://github.com/apoorvdarshan/verceltics'],
  ['Scowld', 'iOS', 'https://github.com/apoorvdarshan/scowld'],
  ['Quit All', 'iOS', 'https://apps.apple.com/us/app/quit-all-break-every-habit/id6760978934'],
  ['Crossposter', 'Web', 'https://github.com/apoorvdarshan/crossposter'],
  ['TetherShot', 'macOS', 'https://github.com/apoorvdarshan/TetherShot'],
]

const projects = [
  ['OpenGraph Studio', 'https://github.com/apoorvdarshan/opengraph-studio'],
  ['Country Filter for X', 'https://github.com/apoorvdarshan/x-country-filter'],
  ['Streaming Auto Pause', 'https://github.com/apoorvdarshan/streaming-autopause'],
  ['GitHub Contribution Graph Merger', 'https://github.com/apoorvdarshan/github-readme-contribution-merger'],
  ['Daxerly', 'https://github.com/apoorvdarshan/daxerly'],
  ['Nornlore', 'https://github.com/apoorvdarshan/nornlore'],
  ['How Rich Are You?', 'https://github.com/apoorvdarshan/how-rich-are-you'],
  ['Billionaire Smash', 'https://github.com/apoorvdarshan/billionaire-smash'],
  ['DOB Selector', 'https://github.com/apoorvdarshan/dob-selector'],
  ['Rekisei', 'https://github.com/apoorvdarshan/rekisei'],
  ['Claw C', 'https://github.com/apoorvdarshan/claw-c'],
]

const contributions = [
  ['TensorFlow', 'PR #110665', 'https://github.com/tensorflow/tensorflow/pull/110665'],
  ['Kubernetes', 'PR #137095', 'https://github.com/kubernetes/kubernetes/pull/137095'],
  ['Flutter', 'PR #182546', 'https://github.com/flutter/flutter/pull/182546'],
  ['Svelte', 'PR #17745', 'https://github.com/sveltejs/svelte/pull/17745'],
  ['Spring Boot', 'PR #49261', 'https://github.com/spring-projects/spring-boot/pull/49261'],
  ['jQuery', 'PR #5775', 'https://github.com/jquery/jquery/pull/5775'],
  ['.NET Runtime', 'PR #124498', 'https://github.com/dotnet/runtime/pull/124498'],
  ['Google zx', '2 merged PRs', 'https://github.com/google/zx/pulls?q=author%3Aapoorvdarshan'],
  ['SQLFluff', '7 merged PRs', 'https://github.com/sqlfluff/sqlfluff/pulls?q=author%3Aapoorvdarshan'],
]

const background = [
  ['B.S. Computer Science, University of the People', '2025–2026'],
  ['President’s List and Dean’s List', '2026'],
  ['Meta Front-End Developer Specialization', '2025'],
  ['Claude Code in Action, Anthropic', '2025'],
  ['YouTube channel grown to 21.5K+ subscribers and sold', '2019–2024'],
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

function ExternalLink({ href, children }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}</a>
}

function BulletList({ items, meta = false }) {
  return (
    <ul className="bullet-list">
      {items.map((item) => (
        <li key={item[0]}>
          <ExternalLink href={item[meta ? 2 : 1]}>{item[0]}</ExternalLink>
          {meta && <span className="item-meta">({item[1]})</span>}
        </li>
      ))}
    </ul>
  )
}

function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('apoorv-theme-v2')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [repoCount, setRepoCount] = useState(259)

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('apoorv-theme-v2', dark ? 'dark' : 'light')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#1f1e1d' : '#f0eee6')
  }, [dark])

  useEffect(() => {
    fetch('https://api.github.com/users/apoorvdarshan')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setRepoCount(data.public_repos))
      .catch(() => {})
  }, [])

  return (
    <div className="page-wrapper">
      <a className="skip-link" href="#content">Skip to content</a>

      <header className="header">
        <div className="container header-container">
          <a className="header-name" href="#top">Apoorv Darshan</a>
          <button className="toggle-switch" type="button" onClick={() => setDark(!dark)} aria-label={`Use ${dark ? 'light' : 'dark'} color mode`} aria-pressed={dark}>
            <span className="toggle-knob"></span>
          </button>
        </div>
      </header>

      <main className="page-main" id="content">
        <article className="container" id="top">
          <section className="intro">
            <p>Apoorv Darshan is a developer in Delhi building open-source apps, practical tools, and internet experiments across iOS, Android, and the web.</p>
            <p>His recent work includes <ExternalLink href="https://github.com/apoorvdarshan/fud-ai">Fud AI</ExternalLink>, a free AI calorie tracker with more than 4,000 downloads; <ExternalLink href="https://github.com/apoorvdarshan/verceltics">Verceltics</ExternalLink>, a native iPhone client for Vercel Analytics; and merged contributions to TensorFlow, Kubernetes, Flutter, Svelte, Spring Boot, jQuery, and .NET.</p>
            <p>Apoorv studies computer science at the University of the People. Previously, he grew a YouTube channel to more than 21,500 subscribers. He is also an ACE Certified Personal Trainer and ranked in the top 1.5% of JEE candidates in 2023.</p>
          </section>

          <section>
            <h2>Products</h2>
            <BulletList items={products} meta />
          </section>

          <section>
            <h2>Projects</h2>
            <BulletList items={projects} />
            <p className="after-list"><ExternalLink href="https://github.com/apoorvdarshan?tab=repositories">All {repoCount} public repositories</ExternalLink></p>
          </section>

          <section>
            <h2>Open source</h2>
            <BulletList items={contributions} meta />
            <p className="after-list"><ExternalLink href="https://github.com/pulls?q=is%3Apr+author%3Aapoorvdarshan">All pull requests</ExternalLink></p>
          </section>

          <section>
            <h2>Background</h2>
            <ul className="bullet-list">
              {background.map(([label, year]) => <li key={label}><span>{label}</span><span className="item-meta">({year})</span></li>)}
            </ul>
          </section>

          <section>
            <h2>Elsewhere</h2>
            <BulletList items={elsewhere} />
          </section>

          <section className="last-section">
            <h2>Contact</h2>
            <p>Email <a href="mailto:ad13dtu@gmail.com">ad13dtu@gmail.com</a>.</p>
          </section>
        </article>
      </main>
    </div>
  )
}

export default App
