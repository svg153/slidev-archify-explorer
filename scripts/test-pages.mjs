import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const output = resolve(root, 'dist')
const site = await readFile(resolve(output, 'index.html'), 'utf8')
const demo = await readFile(resolve(output, 'demo/index.html'), 'utf8')

for (const path of [
  'styles.css',
  'favicon.svg',
  'media/archify-explorer-demo.png',
  'demo/diagrams/ai-sdlc-control-plane.svg',
  'demo/diagrams/ai-sdlc-control-plane.html',
]) {
  await access(resolve(output, path))
}

assert.match(site, /<title>Archify Explorer for Slidev<\/title>/)
assert.match(site, /href="\.\/styles\.css"/)
assert.match(site, /src="\.\/demo\/" title="Navigable Slidev demo presentation/)
assert.match(site, /href="\.\/demo\/" target="_blank"/)
assert.match(site, /<th scope="col">Prop \/ slot<\/th>/)
assert.match(site, /npm install --save-dev slidev-addon-archify-explorer/)
assert.match(demo, /\/slidev-archify-explorer\/demo\//)

console.log('Pages checks passed: docs, assets, demo route, Archify assets, and package instructions.')
