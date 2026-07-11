import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Code2,
  GitBranch,
  BriefcaseBusiness,
  Mail,
  MapPin,
  Menu,
  Star,
  X,
} from 'lucide-react'

const projects = [
  { name: 'Fud AI', kind: 'Mobile', mark: '🥦', note: 'Free, open-source AI calorie tracker for iOS and Android.', proof: '4K+ downloads · 265 stars', stack: 'Swift · Kotlin', url: 'https://github.com/apoorvdarshan/fud-ai', live: 'https://fud-ai.app', tone: 'blue' },
  { name: 'Verceltics', kind: 'Mobile', mark: '📈', note: 'Vercel Web Analytics in your pocket: visitors, pages, deployments, and traffic.', proof: 'iOS · 22 stars', stack: 'SwiftUI · Swift Charts', url: 'https://github.com/apoorvdarshan/verceltics', live: 'https://apps.apple.com/us/app/vercel-analytics-verceltics/id6761645656', tone: 'apricot' },
  { name: 'Scowld', kind: 'Mobile', mark: '🦫', note: 'An open-source AI companion with a live VRM avatar that can see and speak.', proof: 'BYOK · 6 stars', stack: 'SwiftUI · VRM · AI', url: 'https://github.com/apoorvdarshan/scowld', live: 'https://apps.apple.com/in/app/scowld-ai-voice-companion/id6760672848', tone: 'pink' },
  { name: 'Crossposter', kind: 'Web', mark: '📣', note: 'Private, local-first publishing to eleven social platforms. No hosted middleman.', proof: 'Open source · 8 stars', stack: 'Next.js · TypeScript', url: 'https://github.com/apoorvdarshan/crossposter', live: 'https://crossposter.apoorvdarshan.com', tone: 'blue' },
  { name: 'TetherShot', kind: 'Desktop', mark: '📸', note: 'A macOS menu-bar app that captures an iPhone screen straight to a chosen folder.', proof: 'Native macOS · npm install', stack: 'Swift · AVFoundation', url: 'https://github.com/apoorvdarshan/TetherShot', live: 'https://tethershot.apoorvdarshan.com', tone: 'apricot' },
  { name: 'OpenGraph Studio', kind: 'Web', mark: '🌐', note: 'Crop, compress, edit, and preview social metadata across every major platform.', proof: 'Browser-only processing', stack: 'Next.js · Canvas', url: 'https://github.com/apoorvdarshan/opengraph-studio', live: 'https://opengraph.website', tone: 'pink' },
  { name: 'Country Filter for X', kind: 'Extensions', mark: '🗺️', note: 'A Chrome extension that hides posts from countries you choose.', proof: 'Chrome Web Store', stack: 'JavaScript · MV3', url: 'https://github.com/apoorvdarshan/x-country-filter', live: 'https://chromewebstore.google.com/detail/country-filter-for-x-twit/cocohplmilpblbkoikolbhakjipccioa', tone: 'blue' },
  { name: 'Streaming Auto Pause', kind: 'Extensions', mark: '⏸️', note: 'Pauses Netflix and Prime Video when you switch away, resumes when you return.', proof: 'Chrome Web Store', stack: 'JavaScript · MV3', url: 'https://github.com/apoorvdarshan/streaming-autopause', live: 'https://chromewebstore.google.com/detail/streaming-auto-pauseresum/nafnjeielmlkeinkmbfppfecpfebgcbl', tone: 'apricot' },
  { name: 'GitHub Graph Merger', kind: 'Tools', mark: '▦', note: 'Merge multiple GitHub contribution graphs into one SVG heatmap.', proof: '12 stars · Public API', stack: 'HTML · SVG', url: 'https://github.com/apoorvdarshan/github-readme-contribution-merger', live: 'https://github-contribution-merger.apoorvdarshan.com', tone: 'pink' },
  { name: 'Daxerly', kind: 'Web', mark: '🧾', note: 'Proof of work, formatted as a receipt — with a price tag on it.', proof: 'Open source', stack: 'TypeScript', url: 'https://github.com/apoorvdarshan/daxerly', live: 'https://daxerly.apoorvdarshan.com', tone: 'blue' },
  { name: 'Nornlore', kind: 'Web', mark: '🌌', note: 'Discover what the universe was doing on the day you were born.', proof: 'NASA-powered', stack: 'TypeScript · APIs', url: 'https://github.com/apoorvdarshan/nornlore', live: 'https://nornlore.apoorvdarshan.com', tone: 'apricot' },
  { name: 'How Rich Are You?', kind: 'Experiments', mark: '💸', note: 'A 90s-style global income rank calculator with meme reactions.', proof: 'Web1 energy', stack: 'JavaScript · CSS', url: 'https://github.com/apoorvdarshan/how-rich-are-you', live: 'https://how-rich-are-you.apoorvdarshan.com', tone: 'pink' },
  { name: 'Billionaire Smash', kind: 'Experiments', mark: '💰', note: 'Facemash for the Forbes real-time billionaires list.', proof: 'Head-to-head rankings', stack: 'TypeScript', url: 'https://github.com/apoorvdarshan/billionaire-smash', live: 'https://bsmash.app', tone: 'blue' },
]

const contributions = [
  ['TensorFlow', 'Fixed resource misclassification for unsorted read-only inputs.', '#110665'],
  ['Flutter', 'Removed Material imports from navigator and overlay tests.', '#182546'],
  ['Kubernetes', 'Migrated SignerName to declarative validation.', '#137095'],
  ['Svelte', 'Kept select values current when effects are deferred.', '#17745'],
  ['Spring Boot', 'Aligned TestRestTemplate cookie handling with RestTemplate.', '#49261'],
  ['jQuery', 'Used createElementNS correctly for XSLT documents.', '#5775'],
  ['.NET Runtime', 'Corrected fractional-token AttemptAcquire(0) behavior.', '#124498'],
  ['freeCodeCamp', 'Corrected a Spanish curriculum example.', '#66544'],
  ['Google zx', 'Improved cwd validation and remote-script error handling.', '2 merged'],
  ['SQLFluff', 'Fixed SQL dialect parsing, grammar, and Jinja encoding.', '7 merged'],
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
  ['Schedule a call', 'https://cal.com/apoorvdarshan'],
]

function ExternalLink({ href, children, className = '', ...props }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>
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
  }, [])

  const categories = ['All', ...new Set(projects.map((project) => project.kind))]
  const visibleProjects = useMemo(() => {
    const filtered = category === 'All' ? projects : projects.filter((project) => project.kind === category)
    return showAll || category !== 'All' ? filtered : filtered.slice(0, 8)
  }, [category, showAll])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to work</a>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Apoorv Darshan, home">AD<span>®</span></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation">
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#opensource" onClick={closeMenu}>Open source</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
        <div className="availability"><span></span> Open to build</div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow"><MapPin size={14} /> Delhi, India · Developer</p>
            <h1>I build things<br />that <span>earn their<br />place</span> on your screen.</h1>
            <p className="hero-intro">I’m Apoorv. I ship mobile apps, browser tools, web experiments, and open-source fixes—usually because something useful should already exist.</p>
            <div className="hero-actions">
              <a className="button primary" href="#work">Explore the work <ArrowDownRight size={18} /></a>
              <ExternalLink className="button secondary" href="mailto:ad13dtu@gmail.com">Start a conversation <ArrowUpRight size={18} /></ExternalLink>
            </div>
          </div>

          <div className="hero-switchboard" aria-label="Apoorv's building output">
            <div className="switchboard-head">
              <span>FIELD UNIT / AD-01</span><span>LIVE INDEX</span>
            </div>
            <div className="repo-dial">
              <span className="dial-number">{repoCount}</span>
              <span className="dial-label">public<br />repositories</span>
              <div className="dial-orbit"><span>BUILD</span><span>FIX</span><span>SHIP</span></div>
            </div>
            <div className="output-strip">
              <div><strong>iOS + Android</strong><span>products</span></div>
              <div><strong>Web</strong><span>tools + oddities</span></div>
              <div><strong>Open source</strong><span>upstream fixes</span></div>
            </div>
            <p className="switch-note">Current signal: building in public, one practical problem at a time.</p>
          </div>

          <div className="hero-foot">
            <span>Independent maker / CS student</span>
            <span>GitHub since 2021</span>
            <span>Last verified July 2026</span>
          </div>
        </section>

        <section className="proof-band" aria-label="Highlights">
          <div><strong>4K+</strong><span>Fud AI downloads</span></div>
          <div><strong>13K</strong><span>LinkedIn followers</span></div>
          <div><strong>265</strong><span>stars on Fud AI</span></div>
          <div><strong>10+</strong><span>major upstream projects</span></div>
        </section>

        <section className="work-section" id="work">
          <div className="section-heading">
            <div><p className="eyebrow">Selected output</p><h2>The project<br />switchboard.</h2></div>
            <p>Not concepts. Things you can open, install, inspect, or use right now.</p>
          </div>
          <div className="filter-bar" role="group" aria-label="Filter projects">
            {categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => { setCategory(item); setShowAll(true) }}>{item}</button>)}
          </div>
          <div className="project-grid">
            {visibleProjects.map((project, index) => (
              <article className={`project-card ${project.tone}`} key={project.name}>
                <div className="card-top"><span className="project-mark">{project.mark}</span><span>{String(index + 1).padStart(2, '0')} / {project.kind}</span></div>
                <h3>{project.name}</h3>
                <p>{project.note}</p>
                <div className="project-meta"><span>{project.stack}</span><span>{project.proof}</span></div>
                <div className="project-links">
                  <ExternalLink href={project.live}>Open product <ArrowUpRight size={16} /></ExternalLink>
                  <ExternalLink href={project.url} aria-label={`${project.name} source on GitHub`}><GitBranch size={18} /></ExternalLink>
                </div>
              </article>
            ))}
          </div>
          {category === 'All' && !showAll && <button className="show-more" onClick={() => setShowAll(true)}>Show the full project board <ChevronDown size={18} /></button>}
        </section>

        <section className="opensource-section" id="opensource">
          <div className="opensource-intro">
            <p className="eyebrow light">Open-source field notes</p>
            <h2>I don’t wait for permission to fix the code.</h2>
            <p>From machine-learning infrastructure to frameworks used across the web, the pattern is simple: find a real edge case, make the smallest clean fix, and leave tests behind.</p>
            <ExternalLink className="text-link light-link" href="https://github.com/pulls?q=is%3Apr+author%3Aapoorvdarshan">See every pull request <ArrowUpRight size={17} /></ExternalLink>
          </div>
          <div className="contribution-list">
            {contributions.map(([name, note, pr], index) => (
              <a href={`https://github.com/search?q=author%3Aapoorvdarshan+${encodeURIComponent(name)}&type=pullrequests`} target="_blank" rel="noreferrer" className="contribution" key={name}>
                <span className="contrib-index">{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{name}</h3><p>{note}</p></div>
                <span className="pr-label">{pr}</span>
                <ArrowUpRight size={18} />
              </a>
            ))}
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="portrait-panel">
            <img src="https://avatars.githubusercontent.com/u/90602809?v=4" alt="Apoorv Darshan" />
            <div className="portrait-tag"><span>APOORV DARSHAN</span><span>DELHI / 2026</span></div>
          </div>
          <div className="about-copy">
            <p className="eyebrow">The person behind the commits</p>
            <h2>Curious enough to wander. Stubborn enough to ship.</h2>
            <p className="lead">I’m a computer science student and independent developer working across web, mobile, AI, automation, APIs, and whatever else a problem requires.</p>
            <p>I like software with a point of view: a nutrition tracker that stays free with your own AI key, analytics built natively for the iPhone, or a deliberately terrible date picker that makes 130,000 people laugh. I use Claude Code and Codex to move faster, but the taste, decisions, and responsibility stay human.</p>
            <div className="beliefs">
              <div><Code2 /><span><strong>Build across boundaries</strong>Swift one week, TypeScript the next, C when the idea calls for it.</span></div>
              <div><Check /><span><strong>Fix the real thing</strong>Contribute upstream instead of working around a bug forever.</span></div>
              <div><Star /><span><strong>Learn in public</strong>Ship the code, share the process, and let useful work compound.</span></div>
            </div>
          </div>
        </section>

        <section className="story-section">
          <div className="section-heading compact">
            <div><p className="eyebrow">Proof beyond products</p><h2>Signals &amp;<br />side quests.</h2></div>
            <p>The non-linear route is the point.</p>
          </div>
          <div className="story-grid">
            <article className="story-card wide"><span>Academic</span><h3>President’s List + Dean’s List</h3><p>B.S. Computer Science at University of the People. Magna Cum Laude track, with recognition for high academic performance.</p><strong>2025—2026</strong></article>
            <article className="story-card"><span>Audience</span><h3>21.5K YouTube subscribers</h3><p>Built a channel organically over five years, then sold it to a private buyer.</p><strong>2019—2024</strong></article>
            <article className="story-card accent"><span>Competitive</span><h3>Top 1.5% in JEE 2023</h3><p>97.15 percentile in JEE Main; AIR 15,796 in JEE Advanced.</p><strong>2023</strong></article>
            <article className="story-card"><span>Credentials</span><h3>Meta Front-End + Anthropic</h3><p>Meta Front-End Developer Specialization and Claude Code in Action certification.</p><strong>2025</strong></article>
            <article className="story-card wide quote"><span>Recommendation</span><blockquote>“Apoorv stood out for his consistency and genuine curiosity… a hardworking and driven Computer Science graduate.”</blockquote><p>— Saqib Sadiq, CS 3303 instructor</p></article>
            <article className="story-card"><span>Beyond code</span><h3>ACE Certified Personal Trainer</h3><p>NCCA-accredited. Because systems, feedback loops, and consistency work off-screen too.</p><strong>2024</strong></article>
          </div>
        </section>

        <section className="index-section">
          <div className="index-title"><p className="eyebrow">The longer index</p><h2>More things<br />that exist.</h2></div>
          <div className="index-list">
            {moreWork.map(([name, note]) => <ExternalLink href={`https://github.com/apoorvdarshan/${name}`} key={name}><span>{name}</span><p>{note}</p><ArrowUpRight size={18} /></ExternalLink>)}
          </div>
        </section>

        <section className="stack-section">
          <p className="eyebrow">Current toolkit</p>
          <div className="stack-marquee" aria-label="Technologies used"><span>SwiftUI</span><i>+</i><span>Kotlin</span><i>+</i><span>TypeScript</span><i>+</i><span>React</span><i>+</i><span>Next.js</span><i>+</i><span>Python</span><i>+</i><span>PostgreSQL</span><i>+</i><span>Docker</span><i>+</i><span>Three.js</span><i>+</i><span>AI APIs</span></div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-copy">
            <p className="eyebrow light">Have a useful problem?</p>
            <h2>Let’s make it<br />exist.</h2>
            <a className="contact-mail" href="mailto:ad13dtu@gmail.com">ad13dtu@gmail.com <ArrowUpRight /></a>
          </div>
          <div className="contact-side">
            <p>Available for product engineering, ambitious collaborations, and open-source work.</p>
            <div className="social-grid">
              {socials.map(([name, url]) => <ExternalLink href={url} key={name}>{name}<ArrowUpRight size={15} /></ExternalLink>)}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div><span className="wordmark footer-mark">AD<span>®</span></span><p>Built from public GitHub and LinkedIn data.<br />Designed to stay curious.</p></div>
        <div className="footer-links"><ExternalLink href="https://github.com/apoorvdarshan"><GitBranch /> GitHub</ExternalLink><ExternalLink href="https://www.linkedin.com/in/apoorvdarshan"><BriefcaseBusiness /> LinkedIn</ExternalLink><a href="mailto:ad13dtu@gmail.com"><Mail /> Email</a></div>
        <p>© {new Date().getFullYear()} Apoorv Darshan</p>
      </footer>
    </div>
  )
}

export default App
