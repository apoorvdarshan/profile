import test from 'node:test'
import assert from 'node:assert/strict'
import { updateReadme, updateResume, entries, verifiedPRs, texEscape } from './profile-core.mjs'

function readme(rows) {return `# Hello\n## Mobile Apps\n<ul>\n<li>📱 <strong><a href="https://github.com/apoorvdarshan/app">app</a></strong> - my app</li>\n</ul>\n### Open Source Contributions\n\n<ul>\n${rows.map(([repo,desc='my custom fix'])=>`  <li>🔧 <strong><a href="https://github.com/${repo}/pull/1">${repo.split('/')[1]}</a></strong> - ${desc}</li>`).join('\n')}\n</ul>\n\n## GitHub Activity\nPRIVATE-SENTINEL-DO-NOT-EDIT\n`}
function pr(repo,number,extra={}) { return {number,title:'fix(ui): Correct <script> & $value',url:`https://github.com/${repo}/pull/${number}`,mergedAt:'2026-10-10T00:00:00Z',author:{login:'apoorvdarshan'},repository:{nameWithOwner:repo,isPrivate:false,owner:{login:repo.split('/')[0]}},...extra} }
test('filters own/private/other-author/unmerged PRs, deduplicates',()=>{
  const good=pr('org/one',1)
  assert.equal(verifiedPRs([good,good,pr('apoorvdarshan/app',1),pr('org/two',2,{author:{login:'elsewhere'}}),pr('org/two',3,{mergedAt:null}),pr('org/secret',1,{repository:{nameWithOwner:'org/secret',owner:{login:'org'},isPrivate:true}})]).length,1)
})
test('counts preserve prose, sorting and overflow; rerun is idempotent',()=>{
  const repos=Array.from({length:12},(_,i)=>`org/repo${i}`)
  const stars=Object.fromEntries(repos.map((r,i)=>[r,i]));stars['apoorvdarshan/app']=1
  const before=readme(repos.map(r=>[r]))
  const prs=[pr(repos[0],1),pr(repos[0],2)]
  const first=updateReadme(before,prs,stars)
  assert(first.readme.includes('2 merged PRs: my custom fix'))
  assert.equal(entries(first.readme)[0].repo,'org/repo11')
  const oss=first.readme.split('### Open Source Contributions')[1]
  assert.equal((oss.match(/<li>.*<strong>/g)||[]).length,10)
  assert.equal((oss.match(/<div>&bull;/g)||[]).length,2)
  assert(first.readme.endsWith('PRIVATE-SENTINEL-DO-NOT-EDIT\n'))
  assert.equal(updateReadme(first.readme,prs,stars,first.state).readme,first.readme)
  assert.throws(()=>updateReadme(first.readme,[],stars,first.state),/Previously verified PR missing/)
})
test('title is escaped as text, star badges added and removed',()=>{
  const initial=readme([['org/old']]);const stars={'apoorvdarshan/app':4,'org/old':0,'org/new':10}
  const a=updateReadme(initial,[pr('org/new',1)],stars)
  assert(a.readme.includes('Correct &lt;script&gt; &amp; $value'))
  assert(!a.readme.includes('<script>'))
  assert(a.readme.includes('repo=apoorvdarshan/app'))
  const b=updateReadme(a.readme,[pr('org/new',1)],{...stars,'apoorvdarshan/app':0})
  assert(!b.readme.includes('repo=apoorvdarshan/app'))
  assert.throws(()=>updateReadme(initial,[],{}),/Missing\/invalid stars/)
})
test('manual authored-commit credits and higher editorial counts survive',()=>{
  const a=updateReadme(readme([['org/credit','fix bug (authored commit)'],['org/old','3 merged PRs: hand-written summary']]),[pr('org/old',1)],{'apoorvdarshan/app':0,'org/credit':1,'org/old':2})
  assert(a.readme.includes('(authored commit)'))
  assert(a.readme.includes('3 merged PRs: hand-written summary'))
  assert.equal(a.warnings.length,1)
})
test('resume reorders contributions without moving projects or altering header',()=>{
  const source=String.raw`HEADER-SENTINEL
\section{Apps}
\resumeProjectHeading{\textbf{\href{https://github.com/apoorvdarshan/app}{app}} $|$ {\small $\bigstar$ 1 star $|$ \textcolor{Maroon}{$\downarrow$ 9K+}} \textnormal{ -- my app}}{}
\section{Open Source Contributions}
\resumeSubHeadingListStart
\resumeProjectHeading{\textbf{\href{https://github.com/org/old/pull/1}{old}} $|$ {\small $\bigstar$ 1 star} \textnormal{ -- resume custom description}}{}
\resumeSubHeadingListEnd
FOOTER-SENTINEL`
  const stars={'apoorvdarshan/app':0,'org/old':1,'org/new':50000}
  const r=updateReadme(readme([['org/old']]),[pr('org/new',1),pr('org/old',1),pr('org/old',2)],stars)
  const tex=updateResume(source,r.rows,stars)
  assert(tex.startsWith('HEADER-SENTINEL'))
  assert(tex.endsWith('FOOTER-SENTINEL'))
  assert(tex.includes('9K+'))
  assert(tex.includes('2 merged PRs: resume custom description'))
  assert(tex.indexOf('org/new')<tex.indexOf('org/old'))
  for (const line of tex.split('\n').filter(l=>l.includes('\\resumeProjectHeading{'))) {
    const braces = line.replace(/\\[{}]/g, '').match(/[{}]/g)
    assert.equal(braces.filter(c=>c==='{').length, braces.filter(c=>c==='}').length, 'balanced LaTeX groups')
  }
  assert.equal(updateResume(tex,r.rows,stars),tex)
  assert.equal(texEscape('a_%\\input{x}'),String.raw`a\_\%\textbackslash{}input\{x\}`)
  assert.throws(()=>updateResume(source.replace('\\resumeSubHeadingListStart',''),r.rows,stars),/list start missing/)
  assert.throws(()=>updateResume(source,r.rows,{}),/resume stars/)
})
test('resume recognizes escaped repository names and preserves their prose',()=>{
  const source=String.raw`\section{Open Source Contributions}
\resumeSubHeadingListStart
\resumeProjectHeading{\textbf{\href{https://github.com/org/curl\_cffi/pull/1}{curl\_cffi}} \textnormal{ -- keep this custom wording}}{}
\resumeSubHeadingListEnd`
  const stars={'apoorvdarshan/app':0,'org/curl_cffi':20000}
  const r=updateReadme(readme([['org/curl_cffi']]),[pr('org/curl_cffi',1)],stars)
  const tex=updateResume(source,r.rows,stars)
  assert(tex.includes('keep this custom wording'))
  assert(tex.includes('20k stars'))
  assert.equal(updateResume(tex,r.rows,stars),tex)
})
