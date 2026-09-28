import { spawnSync } from 'node:child_process'
import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const output = resolve(root, 'dist')
const slidev = resolve(root, 'node_modules/@slidev/cli/bin/slidev.mjs')

await rm(output, { recursive: true, force: true })

const build = spawnSync(process.execPath, [
  slidev,
  'build',
  '--out', 'dist/demo',
  '--base', '/slidev-archify-explorer/demo/',
  '--router-mode', 'hash',
], { cwd: root, stdio: 'inherit' })

if (build.error)
  throw build.error
if (build.status !== 0)
  process.exit(build.status ?? 1)

await mkdir(output, { recursive: true })
for (const entry of await readdir(resolve(root, 'site')))
  await cp(resolve(root, 'site', entry), resolve(output, entry), { recursive: true })
await cp(resolve(root, 'media'), resolve(output, 'media'), { recursive: true })

console.log(`GitHub Pages site built in ${output}.`)
