import test from 'node:test'
import assert from 'node:assert/strict'
import worker from '../../src/worker/index.js'
import { texEscape } from './profile-core.mjs'

test('fuzz badge paths and LaTeX input escaping across 2000 hostile inputs', async () => {
  let seed = 67231
  const chars = '<>"\'\\{}$&#_%~^0123456789abcdef+/'
  const random = () => (seed = (seed * 1664525 + 1013904223) >>> 0)
  for (let i = 0; i < 2000; i++) {
    const raw = Array.from({length: 1 + random() % 80}, () => chars[random() % chars.length]).join('')
    const req = new Request(`https://example.com/badges/users/v1/${encodeURIComponent(raw)}.svg`)
    const response = await worker.fetch(req, {ASSETS: {fetch() {throw new Error('Unexpected assets fallback')}}})
    assert.equal(response.status, /^\d{1,6}[KM]?\+?$/.test(raw) ? 200 : 404)
    const body = await response.text()
    assert(!body.includes('<script'))
    const escaped = texEscape(raw)
    assert(!escaped.includes('\\input{'))
    assert(!escaped.includes('\\write18'))
  }
})
