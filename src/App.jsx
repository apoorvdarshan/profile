import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronDown,
  GitBranch,
  Mail,
  MapPin,
  Menu,
  X,
} from 'lucide-react'

const projects = [
  { name: 'Fud AI', kind: 'Mobile', mark: '🥦', note: 'Free, open-source AI calorie and nutrition tracking for iOS and Android.', proof: '4K+ downloads · 265 stars', stack: 'Swift · Kotlin', url: 'https://github.com/apoorvdarshan/fud-ai', live: 'https://fud-ai.app', tone: 'blue' },
  { name: 'Verceltics', kind: 'Mobile', mark: '↗', note: 'Vercel Web Analytics in your pocket: visitors, pages, deployments, and traffic.', proof: 'Open-source iOS app · 22 stars', stack: 'SwiftUI · Swift Charts', url: 'https://github.com/apoorvdarshan/verceltics', live: 'https://apps.apple.com/us/app/vercel-analytics-verceltics/id6761645656', tone: 'peach' },
  { name: 'Scowld', kind: 'Mobile', mark: '◉', note: 'An open-source AI companion with a live VRM avatar that can see and speak.', proof: 'BYOK · 6 stars', stack: 'SwiftUI · VRM · AI', url: 'https://github.com/apoorvdarshan/scowld', live: 'https://apps.apple.com/in/app/scowld-ai-voice-companion/id6760672848', tone: 'orchid' },
  { name: 'Crossposter', kind: 'Web', mark: '⌁', note: 'Private, local-first publishing to eleven social platforms. No hosted middleman.', proof: 'Open source · 8 stars', stack: 'Next.js · TypeScript', url: 'https://github.com/apoorvdarshan/crossposter', live: 'https://crossposter.apoorvdarshan.com', tone: 'ink' },
  { name: 'TetherShot', kind: 'Desktop', mark: '⌗', note: 'A macOS menu-bar app that captures an iPhone screen straight to a chosen folder.', proof: 'Native macOS · npm install', stack: 'Swift · AVFoundation', url: 'https://github.com/apoorvdarshan/TetherShot', live: 'https://tethershot.apoorvdarshan.com', tone: 'peach' },
  { name: 'OpenGraph Studio', kind: 'Web', mark: '◇', note: 'Crop, compress, edit, and preview social metadata across every major platform.', proof: 'Browser-only processing', stack: 'Next.js · Canvas', url: 'https://github.com/apoorvdarshan/opengraph-studio', live: 'https://opengraph.website', tone: 'blue' },
  { name: 'Country Filter for X', kind: 'Extensions', mark: '◎', note: 'A Chrome extension that hides posts from countries you choose.', proof: 'Chrome Web Store', stack: 'JavaScript · MV3', url: 'https://github.com/apoorvdarshan/x-country-filter', live: 'https://chromewebstore.google.com/detail/country-filter-for-x-twit/cocohplmilpblbkoikolbhakjipccioa', tone: 'orchid' },
  { name: 'Streaming Auto Pause', kind: 'Extensions', mark: 'Ⅱ', note: 'Pauses Netflix and Prime Video when you switch away, then resumes on return.', proof: 'Chrome Web Store', stack: 'JavaScript · MV3', url: 'https://github.com/apoorvdarshan/streaming-autopause', live: 'https://chromewebstore.google.com/detail/streaming-auto-pauseresum/nafnjeielmlkeinkmbfppfecpfebgcbl', tone: 'peach' },
  { name: 'GitHub Graph Merger', kind: 'Tools', mark: '▦', note: 'Merge multiple GitHub contribution graphs into one SVG heatmap.', proof: '12 stars · Public API', stack: 'HTML · SVG', url: 'https://github.com/apoorvdarshan/github-readme-contribution-merger', live: 'https://github-contribution-merger.apoorvdarshan.com', tone: 'blue' },
  { name: 'Daxerly', kind: 'Web', mark: '▤', note: 'Proof of work, formatted as a receipt — with a price tag on it.', proof: 'Open source', stack: 'TypeScript', url: 'https://github.com/apoorvdarshan/daxerly', live: 'https://daxerly.apoorvdarshan.com', tone: 'orchid' },
  { name: 'Nornlore', kind: 'Web', mark: '✦', note: 'Discover what the universe was doing on the day you were born.', proof: 'NASA-powered', stack: 'TypeScript · APIs', url: 'https://github.com/apoorvdarshan/nornlore', live: 'https://nornlore.apoorvdarshan.com', tone: 'ink' },
  { name: 'How Rich Are You?', kind: 'Experiments', mark: '$', note: 'A 90s-style global income-rank calculator with meme reactions.', proof: 'Web1 energy', stack: 'JavaScript · CSS', url: 'https://github.com/apoorvdarshan/how-rich-are-you', live: 'https://how-rich-are-you.apoorvdarshan.com', tone: 'peach' },
  { name: 'Billionaire Smash', kind: 'Experiments', mark: '×', note: 'Facemash for the Forbes real-time billionaires list.', proof: 'Head-to-head rankings', stack: 'TypeScript', url: 'https://github.com/apoorvdarshan/billionaire-smash', live: 'https://bsmash.app', tone: 'orchid' },
]

const contributions = [
  { name: 'TensorFlow', note: 'Replaced a flawed pointer scan with a set lookup so unsorted read-only resources are classified correctly.', pr: '#110665', url: 'https://github.com/tensorflow/tensorflow/pull/110665' },
  { name: 'Kubernetes', note: 'Migrated SignerName to declarative validation, moving a core API rule into the safer validation system.', pr: '#137095', url: 'https://github.com/kubernetes/kubernetes/pull/137095' },
  { name: 'Svelte', note: 'Kept select.__value current when an effect is deferred, fixing a small state edge case with visible consequences.', pr: '#17745', url: 'https://github.com/sveltejs/svelte/pull/17745' },
  { name: 'Flutter', note: 'Removed unnecessary Material imports from navigator and overlay tests.', pr: '#182546', url: 'https://github.com/flutter/flutter/pull/182546' },
  { name: 'Spring Boot', note: 'Aligned TestRestTemplate cookie handling with RestTemplate.', pr: '#49261', url: 'https://github.com/spring-projects/spring-boot/pull/49261' },
  { name: 'jQuery', note: 'Used createElementNS correctly for XSLT documents.', pr: '#5775', url: 'https://github.com/jquery/jquery/pull/5775' },
  { name: '.NET Runtime', note: 'Corrected fractional-token AttemptAcquire(0) behavior.', pr: '#124498', url: 'https://github.com/dotnet/runtime/pull/124498' },
]

const moreWork = [
  ['macbook-24x7-agents', 'Run agents continuously on a MacBook, safely and reversibly.'],
  ['wellfound-bot', 'Human-paced automation for a Wellfound job search.'],
  ['rekisei', 'Edit a concise LaTeX résumé by chatting with Claude or Codex.'],
  ['dob-selector', 'An intentionally bad date picker that reached 130K+ Reddit views.'],
  ['claw-c', 'A Claude Code-style coding agent reimplemented in pure C.'],
  ['gesture-keyboard', 'A hands-free virtual keyboard powered by MediaPipe.'],
  ['zombie-game', 'A 3D zombie survival FPS built with Three.js.'],
  ['Xscore', 'An X account engagement scorer using the open-source algorithm.'],
]

const socials = [
  ['GitHub', 'https://github.com/apoorvdarshan'],
  ['LinkedIn', 'https://www.linkedin.com/in/apoorvdarshan'],
  ['X / Twitter', 'https://x.com/apoorvdarshan'],
  ['YouTube', 'https://youtube.com/@apoorvdarshan'],
  ['Bluesky', 'https://bsky.app/profile/apoorvdarshan.com'],
  ['Dev.to', 'https://dev.to/apoorvdarshan'],
  ['Product Hunt', 'https://www.producthunt.com/@apoorvdarshan'],
  ['Book a call', 'https://cal.com/apoorvdarshan'],
]

function ExternalLink({ href, children, className = '', ...props }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>
}

function ProductVisual({ index }) {
  if (index === 0) return <div className="nutrition-visual" aria-hidden="true"><div className="calorie-ring"><span>1,847</span><small>kcal today</small></div><div className="macro-bars"><i></i><i></i><i></i></div></div>
  if (index === 1) return <div className="analytics-visual" aria-hidden="true"><span>12.8K</span><small>visitors this month</small><div>{[42, 68, 51, 84, 73, 96, 62, 88].map((height, i) => <i key={i} style={{ height: `${height}%` }}></i>)}</div></div>
  if (index === 2) return <div className="companion-visual" aria-hidden="true"><div className="companion-orb"><i></i><i></i><i></i></div><span>Listening…</span></div>
  return <div className="publish-visual" aria-hidden="true"><div className="publish-core">1×</div>{['X', 'in', 'B', 'M', '▶'].map((item) => <i key={item}>{item}</i>)}</div>
}

function App() {
  const [category, setCategory] = useState('All')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [repoCount, setRepoCount] = useState(259)

  useEffect(() => {
    fetch('https://api.github.com/users/apoorvdarshan')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setRepoCount(data.public_repos))
      .catch(() => {})

    const elements = document.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('revealed'))
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const categories = ['All', ...new Set(projects.map((project) => project.kind))]
  const visibleProjects = useMemo(() => {
    const catalog = projects.slice(4)
    const filtered = category === 'All' ? catalog : catalog.filter((project) => project.kind === category)
    return showAll || category !== 'All' ? filtered : filtered.slice(0, 6)
  }, [category, showAll])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="page">
      <a className="skip-link" href="#main">Skip to profile</a>
      <header className="site-header">
        <a className="monogram" href="#top" aria-label="Apoorv Darshan, home">A/D</a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#opensource" onClick={closeMenu}>Open source</a>
          <a href="#profile" onClick={closeMenu}>Profile</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
        <a className="header-status" href="mailto:ad13dtu@gmail.com"><i></i> Available for opportunities</a>
      </header>

      <main id="main">
        <section className="identity-hero" id="top">
          <p className="hero-location"><MapPin size={14} /> Delhi, India · Independent developer</p>
          <div className="hero-stage">
            <h1 className="hero-name"><span className="name-first">Apoorv</span><span className="name-last">Darshan</span></h1>
            <figure className="hero-portrait">
              <img src="/assets/apoorv-anime-v3.webp" alt="Anime-style illustration of Apoorv Darshan working on a laptop" />
              <figcaption><span>Developer / Builder</span><span>2026</span></figcaption>
            </figure>
            <div className="hero-summary">
              <span className="summary-rule"></span>
              <p>I build useful software, playful internet experiments, and upstream fixes—across mobile, web, and open source.</p>
              <a href="#work">See what I’ve shipped <ArrowDownRight size={17} /></a>
            </div>
            <div className="hero-aside">
              <span>Computer science</span>
              <span>Product engineering</span>
              <span>Building in public</span>
            </div>
          </div>
          <div className="hero-proof" aria-label="Profile highlights">
            <p><strong>{repoCount}</strong><span>public repositories</span></p>
            <p><strong>4K+</strong><span>Fud AI downloads</span></p>
            <p><strong>13K</strong><span>LinkedIn community</span></p>
            <p className="proof-note">Public figures verified<br />July 2026</p>
          </div>
        </section>

        <section className="thesis" data-reveal>
          <p className="section-label">How I work</p>
          <p className="thesis-line">I follow the problem across boundaries.</p>
          <div className="modes">
            <article><span>Useful products</span><h2>Make the missing thing.</h2><p>Native apps and focused tools that solve a concrete annoyance without unnecessary layers.</p></article>
            <article><span>Internet oddities</span><h2>Leave room for play.</h2><p>Bad date pickers, cosmic birthdays, and curious experiments keep the work unmistakably human.</p></article>
            <article><span>Upstream fixes</span><h2>Fix it at the source.</h2><p>If the bug lives in a framework millions use, a clean pull request beats another workaround.</p></article>
          </div>
        </section>

        <section className="featured-work" id="work">
          <header className="section-intro" data-reveal>
            <div><p className="section-label">Selected work</p><h2>Four products.<br />Four real reasons.</h2></div>
            <p>Built to be opened, installed, inspected, and used—not parked in a mockup.</p>
          </header>
          <div className="case-grid">
            {projects.slice(0, 4).map((project, index) => (
              <article className={`case-study case-${index + 1}`} key={project.name} data-reveal>
                <div className="case-copy">
                  <div className="case-top"><span>{project.kind}</span><span>{project.stack}</span></div>
                  <h3>{project.name}</h3>
                  <p>{project.note}</p>
                  <strong>{project.proof}</strong>
                  <div className="case-links">
                    <ExternalLink href={project.live}>Open product <ArrowUpRight size={16} /></ExternalLink>
                    <ExternalLink href={project.url}>Source <GitBranch size={15} /></ExternalLink>
                  </div>
                </div>
                <div className="case-art"><ProductVisual index={index} /></div>
              </article>
            ))}
          </div>
        </section>

        <section className="open-source" id="opensource">
          <header className="os-header" data-reveal>
            <p className="section-label light">Open source</p>
            <h2>No permission<br />required.</h2>
            <p>Read the code. Find the edge case. Make the smallest clean fix. Leave tests behind.</p>
            <ExternalLink href="https://github.com/pulls?q=is%3Apr+author%3Aapoorvdarshan">View all pull requests <ArrowUpRight size={17} /></ExternalLink>
          </header>
          <div className="os-stories">
            {contributions.slice(0, 3).map((item) => (
              <ExternalLink href={item.url} className="os-story" key={item.name} data-reveal>
                <div><span>Merged pull request</span><strong>{item.pr}</strong></div>
                <h3>{item.name}</h3>
                <p>{item.note}</p>
                <span className="story-action">Read the fix <ArrowUpRight size={16} /></span>
              </ExternalLink>
            ))}
            <div className="os-minor" data-reveal>
              {contributions.slice(3).map((item) => <ExternalLink href={item.url} key={item.name}><span>{item.name}</span><p>{item.note}</p><strong>{item.pr}</strong><ArrowUpRight size={15} /></ExternalLink>)}
            </div>
          </div>
        </section>

        <section className="profile-section" id="profile">
          <div className="profile-statement" data-reveal>
            <p className="section-label">Apoorv, off the repository graph</p>
            <h2>Curious enough to wander.<br /><em>Stubborn enough to ship.</em></h2>
            <div className="profile-body">
              <p>I’m a computer science student and independent developer working across web, mobile, AI, automation, APIs, and whatever else a problem requires.</p>
              <p>I use Claude Code and Codex to move faster, but taste, judgment, and responsibility stay human. Outside the keyboard, mathematics, physics, electronics, and training keep me curious.</p>
            </div>
          </div>

          <div className="path" data-reveal>
            <p className="section-label">Path so far</p>
            <div className="path-list">
              <article><time>2026</time><div><h3>President’s List · B.S. Computer Science</h3><p>University of the People; following a Dean’s List term and a Magna Cum Laude academic track.</p></div></article>
              <article><time>2025</time><div><h3>Meta Front-End + Anthropic</h3><p>Completed the Meta Front-End Developer Specialization and Claude Code in Action certification.</p></div></article>
              <article><time>2024</time><div><h3>Built an audience, then sold the channel</h3><p>Grew a YouTube channel organically to 21.5K+ subscribers over five years.</p></div></article>
              <article><time>2024</time><div><h3>ACE Certified Personal Trainer</h3><p>NCCA-accredited—systems and consistency work away from the screen, too.</p></div></article>
              <article><time>2023</time><div><h3>Top 1.5% in JEE</h3><p>97.15 percentile in JEE Main; AIR 15,796 in JEE Advanced.</p></div></article>
            </div>
          </div>

          <blockquote className="recommendation" data-reveal>
            <span>In someone else’s words</span>
            <p>“Apoorv stood out for his consistency and genuine curiosity. He approached the course with a strong work ethic… I have no doubt he’ll bring that same commitment into his professional career.”</p>
            <footer>— Saqib Sadiq, CS 3303 instructor</footer>
          </blockquote>
        </section>

        <section className="work-index">
          <header className="section-intro small" data-reveal>
            <div><p className="section-label">More work</p><h2>The rest of<br />the workbench.</h2></div>
            <p>Developer tools, browser extensions, useful utilities, and experiments.</p>
          </header>
          <div className="filter-bar" role="group" aria-label="Filter projects">
            {categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => { setCategory(item); setShowAll(true) }}>{item}</button>)}
          </div>
          <div className="project-index">
            {visibleProjects.map((project) => (
              <article className="index-card" key={project.name} data-reveal>
                <span className={`index-mark ${project.tone}`}>{project.mark}</span>
                <div><span>{project.kind} · {project.stack}</span><h3>{project.name}</h3><p>{project.note}</p></div>
                <div className="index-actions"><ExternalLink href={project.live} aria-label={`Open ${project.name}`}><ArrowUpRight /></ExternalLink><ExternalLink href={project.url} aria-label={`${project.name} source`}><GitBranch /></ExternalLink></div>
              </article>
            ))}
          </div>
          {category === 'All' && !showAll && <button className="show-more" onClick={() => setShowAll(true)}>Show all projects <ChevronDown size={17} /></button>}
          <div className="more-list" data-reveal>
            {moreWork.map(([name, note]) => <ExternalLink href={`https://github.com/apoorvdarshan/${name}`} key={name}><span>{name}</span><p>{note}</p><ArrowUpRight size={17} /></ExternalLink>)}
          </div>
        </section>

        <section className="toolkit" aria-label="Technologies Apoorv uses">
          <p>SwiftUI</p><i>✦</i><p>Kotlin</p><i>✦</i><p>TypeScript</p><i>✦</i><p>React</p><i>✦</i><p>Python</p><i>✦</i><p>PostgreSQL</p><i>✦</i><p>Docker</p><i>✦</i><p>Three.js</p>
        </section>

        <section className="contact" id="contact">
          <div className="contact-main" data-reveal>
            <p className="section-label light">What should we build?</p>
            <h2>Bring me a<br /><span>real problem.</span></h2>
            <p>Open to product engineering roles, focused freelance builds, founder collaborations, and meaningful open-source work.</p>
            <div className="contact-actions"><a href="mailto:ad13dtu@gmail.com">Email Apoorv <Mail size={17} /></a><ExternalLink href="https://cal.com/apoorvdarshan">Book a call <ArrowUpRight size={17} /></ExternalLink></div>
          </div>
          <div className="contact-links" data-reveal>
            {socials.map(([name, url]) => <ExternalLink href={url} key={name}><span>{name}</span><ArrowUpRight size={16} /></ExternalLink>)}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div><a className="monogram footer-monogram" href="#top">A/D</a><p>Apoorv Darshan · Delhi, India</p></div>
        <div className="footer-icons"><ExternalLink href="https://github.com/apoorvdarshan"><GitBranch /> GitHub</ExternalLink><ExternalLink href="https://www.linkedin.com/in/apoorvdarshan"><BriefcaseBusiness /> LinkedIn</ExternalLink></div>
        <p>Built from public GitHub and LinkedIn data · © {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
