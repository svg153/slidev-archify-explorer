import assert from 'node:assert/strict'
import { chromium } from 'playwright-chromium'

const baseUrl = process.env.SLIDEV_URL ?? 'http://127.0.0.1:3030/demo/'
const deadline = Date.now() + 30_000
while (Date.now() < deadline) {
  try {
    if ((await fetch(baseUrl)).ok) break
  } catch {}
  await new Promise(resolve => setTimeout(resolve, 250))
}
assert.ok((await fetch(baseUrl)).ok, `Slidev demo did not start at ${baseUrl}`)

const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  await page.goto(baseUrl)
  const trigger = page.getByRole('button', { name: 'Explore diagram: AI SDLC control plane' })
  const preview = trigger.locator('img')
  await trigger.waitFor()
  assert.equal(await preview.getAttribute('alt'), 'AI SDLC control plane architecture')
  assert.match(await preview.getAttribute('src'), /\/demo\/diagrams\/ai-sdlc-control-plane\.svg$/)
  assert.ok(await preview.evaluate(image => image.complete && image.naturalWidth > 0), 'static preview must load')

  await trigger.focus()
  await page.keyboard.press('Enter')
  const dialog = page.locator('dialog[open]')
  await dialog.waitFor()
  assert.equal(await dialog.getAttribute('aria-label'), 'AI SDLC control plane')
  assert.match(await dialog.locator('iframe').getAttribute('src'), /\/demo\/diagrams\/ai-sdlc-control-plane\.html$/)
  await page.keyboard.press('Escape')
  await page.waitForFunction(() => !document.querySelector('dialog')?.open)
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Explore diagram: AI SDLC control plane')

  await preview.click()
  await dialog.waitFor()
  await dialog.getByRole('button', { name: 'Close' }).click()
  await page.waitForFunction(() => !document.querySelector('dialog')?.open)
  console.log('Component checks passed: preview, base path, accessible trigger, keyboard/dialog behavior.')
} finally {
  await browser.close()
}
