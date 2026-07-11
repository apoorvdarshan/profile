import { useEffect, useState } from 'react'
import profile from './profileData.generated.json'

const ROUTES = new Set(['/', '/projects', '/open-source', '/about'])

const NAME_OVERRIDES = {
  'fud-ai': 'Fud AI',
  'freeCodeCamp': 'freeCodeCamp',
  tensorflow: 'TensorFlow',
  jquery: 'jQuery',
  jupyterlab: 'JupyterLab',
  springboot: 'Spring Boot',
  'spring-boot': 'Spring Boot',
  'opengraph-studio': 'OpenGraph Studio',
  'github-readme-contribution-merger': 'GitHub README Contribution Merger',
  'macbook-24x7-agents': 'MacBook 24×7 Agents',
  'linkedin-connection-sender': 'LinkedIn Connection Sender',
  'axentra-os-affiliate': 'Axentra OS Affiliate',
  iitjee: 'IIT JEE',
  Xscore: 'XScore',
  WeasyPrint: 'WeasyPrint',
  TEAMMATES: 'TEAMMATES',
  CodexBar: 'CodexBar',
}

const WORD_FORMS = {
  ai: 'AI', api: 'API', bmw: 'BMW', cli: 'CLI', css: 'CSS', dob: 'DOB',
  github: 'GitHub', html: 'HTML', ios: 'iOS', macos: 'macOS', mcp: 'MCP',
  os: 'OS', pr: 'PR', readme: 'README', sql: 'SQL', ui: 'UI', url: 'URL',
}

function displayName(name) {
  if (NAME_OVERRIDES[name]) return NAME_OVERRIDES[name]
  return name
    .split(/[-_]/)
    .map((word) => WORD_FORMS[word.toLowerCase()] || `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ')
}

function currentPath() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  return ROUTES.has(path) ? path : '/'
}

function ExternalLink({ href, children, className = '' }) {
  const isWeb = href.startsWith('http')
  return <a className={className} href={href} target={isWeb ? '_blank' : undefined} rel={isWeb ? 'noreferrer' : undefined}>{children}</a>
}

function InternalLink({ to, onNavigate, children, className = '' }) {
  const handleClick = (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    onNavigate(to)
  }

  return <a className={className} href={to} onClick={handleClick}>{children}</a>
}

function EntryList({ items, limit }) {
  const visible = typeof limit === 'number' ? items.slice(0, limit) : items
  return (
    <ul className="bullet-list entry-list">
      {visible.map((item) => (
        <li key={`${item.name}-${item.url}`}>
          <ExternalLink href={item.url}>{displayName(item.name)}</ExternalLink>
          {item.status && <span className="item-status">({item.status})</span>}
          {item.description && <span className="entry-summary"> — {item.description}</span>}
        </li>
      ))}
    </ul>
  )
}

function DetailList({ items }) {
  return (
    <ul className="bullet-list detail-list">
      {items.map((item) => (
        <li key={`${item.name}-${item.url}`}>
          <ExternalLink href={item.url}>{displayName(item.name)}</ExternalLink>
          {item.status && <span className="item-status">({item.status})</span>}
          {item.description && <span className="entry-summary"> — {item.description}</span>}
        </li>
      ))}
    </ul>
  )
}

function PageHeading({ title, children }) {
  return (
    <section className="page-heading">
      <h1>{title}</h1>
      <p>{children}</p>
    </section>
  )
}

function GitHubActivity() {
  return (
    <ExternalLink className="activity-link" href={profile.activityImage}>
      <img className="activity-graph" src={profile.activityImage} alt="Apoorv Darshan's merged GitHub contribution graph" />
    </ExternalLink>
  )
}

function HomePage({ navigate }) {
  return (
    <>
      <section className="intro">
        <p>Apoorv Darshan is an AI-powered builder in Delhi, building web apps, mobile apps, bots, APIs, and everything in between.</p>
        <p>{profile.intro.statement}</p>
      </section>

      <section>
        <h2>Apps</h2>
        <EntryList items={profile.apps} />
      </section>

      <section>
        <h2>Chrome extensions</h2>
        <EntryList items={profile.extensions} />
      </section>

      <section>
        <h2>Projects</h2>
        <EntryList items={profile.projects} limit={8} />
        <p className="after-list"><InternalLink to="/projects" onNavigate={navigate}>View all {profile.projects.length} projects →</InternalLink></p>
      </section>

      <section>
        <h2>Open source</h2>
        <EntryList items={profile.openSource} limit={8} />
        <p className="after-list"><InternalLink to="/open-source" onNavigate={navigate}>View all {profile.openSource.length} contributions →</InternalLink></p>
      </section>

      <section>
        <h2>GitHub activity</h2>
        <GitHubActivity />
      </section>

      <section>
        <h2>More</h2>
        <ul className="bullet-list">
          <li><InternalLink to="/about" onNavigate={navigate}>Technologies, activity, recognition, links, and personal notes</InternalLink></li>
          <li><ExternalLink href={profile.source.url}>Read the source GitHub profile README</ExternalLink></li>
        </ul>
      </section>

      <section className="last-section">
        <h2>Contact</h2>
        <p>Email <a href="mailto:ad13dtu@gmail.com">ad13dtu@gmail.com</a>.</p>
      </section>
    </>
  )
}

function ProjectsPage() {
  return (
    <>
      <PageHeading title="Projects">Every project listed in Apoorv’s GitHub profile README. Each title opens the project or its live site.</PageHeading>
      <section className="detail-section">
        <DetailList items={profile.projects} />
      </section>
    </>
  )
}

function OpenSourcePage() {
  return (
    <>
      <PageHeading title="Open source">All {profile.openSource.length} contributions from Apoorv’s GitHub profile README. Select any project to open the pull request or contribution history.</PageHeading>
      <section className="detail-section">
        <DetailList items={profile.openSource} />
      </section>
    </>
  )
}

function AboutPage() {
  return (
    <>
      <PageHeading title="Complete profile">The remaining details from Apoorv’s GitHub profile README, kept together without using LinkedIn as a content source.</PageHeading>

      <section>
        <h2>Technologies</h2>
        <p className="technology-list">{profile.technologies.join(' · ')}</p>
      </section>

      <section>
        <h2>GitHub activity</h2>
        <GitHubActivity />
      </section>

      <section>
        <h2>What I’m doing</h2>
        <ul className="bullet-list">
          {profile.currentWork.map((item) => <li key={item.name}><strong>{item.name}</strong><span className="entry-summary"> — {item.description}</span></li>)}
        </ul>
      </section>

      <section>
        <h2>Writing</h2>
        <ul className="bullet-list"><li><ExternalLink href={profile.writing.url}>{profile.writing.name}</ExternalLink><span className="entry-summary"> — {profile.writing.description}</span></li></ul>
      </section>

      <section>
        <h2>Recognition</h2>
        <ul className="bullet-list">{profile.recognition.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section>
        <h2>Connect</h2>
        <ul className="bullet-list link-columns">{profile.connect.map((item) => <li key={item.name}><ExternalLink href={item.url}>{item.name}</ExternalLink></li>)}</ul>
      </section>

      <section>
        <h2>Philosophy</h2>
        <blockquote>{profile.philosophy}</blockquote>
      </section>

      <section className="last-section">
        <h2>Random facts</h2>
        <ul className="bullet-list">{profile.randomFacts.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
    </>
  )
}

function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('apoorv-theme-v2')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('apoorv-theme-v2', dark ? 'dark' : 'light')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#1f1e1d' : '#f0eee6')
  }, [dark])

  useEffect(() => {
    const handlePopState = () => setPath(currentPath())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const titles = {
      '/': 'Apoorv Darshan — Developer',
      '/projects': 'Projects — Apoorv Darshan',
      '/open-source': 'Open Source — Apoorv Darshan',
      '/about': 'Complete Profile — Apoorv Darshan',
    }
    document.title = titles[path]
  }, [path])

  const navigate = (to) => {
    if (to === path) return
    window.history.pushState({}, '', to)
    setPath(to)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  let page
  if (path === '/projects') page = <ProjectsPage />
  else if (path === '/open-source') page = <OpenSourcePage />
  else if (path === '/about') page = <AboutPage />
  else page = <HomePage navigate={navigate} />

  return (
    <div className="page-wrapper">
      <a className="skip-link" href="#content">Skip to content</a>

      <header className="header">
        <div className="container header-container">
          <InternalLink className="header-name" to="/" onNavigate={navigate}>Apoorv Darshan</InternalLink>
          <div className="header-actions">
            {path !== '/' && <InternalLink className="home-link" to="/" onNavigate={navigate}>Home</InternalLink>}
            <button className="toggle-switch" type="button" onClick={() => setDark(!dark)} aria-label={`Use ${dark ? 'light' : 'dark'} color mode`} aria-pressed={dark}>
              <span className="toggle-knob"></span>
            </button>
          </div>
        </div>
      </header>

      <main className="page-main" id="content">
        <article className="container page-enter" key={path}>
          {page}
          <p className="source-note">Content synced from the <ExternalLink href={profile.source.url}>{profile.source.label}</ExternalLink>.</p>
        </article>
      </main>
    </div>
  )
}

export default App
