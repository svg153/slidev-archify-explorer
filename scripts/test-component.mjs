import assert from 'node:assert/strict'
import { chromium } from 'playwright-chromium'

const baseUrl = process.env.SLIDEV_URL ?? 'http://localhost:3030/demo/'
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
  const interactiveRequests = []
  page.on('request', request => {
    if (new URL(request.url()).pathname.endsWith('/demo/diagrams/ai-sdlc-control-plane.html'))
      interactiveRequests.push(request.url())
  })
  await page.goto(baseUrl)
  const trigger = page.getByRole('button', { name: 'Explore diagram: AI SDLC control plane' })
  const preview = trigger.locator('img')
  await trigger.waitFor()
  assert.equal(await trigger.locator('.preview-action__badge').count(), 0, 'preview badge should not be visible')
  assert.equal(await trigger.evaluate(button => getComputedStyle(button).cursor), 'zoom-in', 'preview should advertise zoom interaction')
  assert.equal(await preview.getAttribute('alt'), 'AI SDLC control plane architecture')
  assert.match(await preview.getAttribute('src'), /\/demo\/diagrams\/ai-sdlc-control-plane\.svg$/)
  assert.ok(await preview.evaluate(image => image.complete && image.naturalWidth > 0), 'static preview must load')
  assert.equal(interactiveRequests.length, 0, 'interactive diagram should not load before opening')

  await trigger.focus()
  const interactiveRequest = page.waitForRequest(request =>
    new URL(request.url()).pathname.endsWith('/demo/diagrams/ai-sdlc-control-plane.html'))
  await page.keyboard.press('Enter')
  await interactiveRequest
  const dialog = page.locator('dialog[open]')
  await dialog.waitFor()
  assert.equal(await dialog.getAttribute('aria-label'), 'AI SDLC control plane')
  const iframeUrl = new URL(await dialog.locator('iframe').getAttribute('src'), baseUrl)
  assert.equal(iframeUrl.pathname, '/demo/diagrams/ai-sdlc-control-plane.html')
  assert.equal(iframeUrl.searchParams.get('theme'), 'dark')
  assert.equal(iframeUrl.searchParams.get('embed'), '1')
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
