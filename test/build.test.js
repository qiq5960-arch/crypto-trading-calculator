import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'

test('生产构建生成无需外部本地资源的单文件网页', () => {
  execFileSync(process.execPath, ['scripts/build.js'])

  const html = readFileSync('dist/index.html', 'utf8')
  assert.match(html, /<style>[\s\S]*\.terminal/)
  assert.match(html, /<script>[\s\S]*function calculateTrade/)
  assert.match(html, /<section class="terminal">/)
  assert.doesNotMatch(html, /<script[^>]+src=/)
  assert.doesNotMatch(html, /<link[^>]+href=/)
  assert.doesNotMatch(html, /\b(?:import|export)\s/)
  assert.deepEqual(readdirSync('dist').sort(), ['.nojekyll', 'index.html'])
  assert.equal(existsSync('dist/src'), false)
})
