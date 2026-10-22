import assert from 'node:assert/strict'
import { chromium } from 'playwright-chromium'

const baseUrl = process.env.SLIDEV_URL ?? 'http://localhost:3030/demo/'
const previewPath = new URL('diagrams/ai-sdlc-control-plane.svg', baseUrl).pathname
const interactivePath = new URL('diagrams/ai-sdlc-control-plane.html', baseUrl).pathname
const deckTitle = 'Archify Explorer for Slidev'
const channelName = `slidev-addon-archify-explorer:${encodeURIComponent(deckTitle)}:${encodeURIComponent(new URL(baseUrl).pathname)}`
const componentScope = 'diagrams/ai-sdlc-control-plane.html?theme=dark&embed=1|AI SDLC control plane'
const sessionScope = `http://localhost:3030|/demo/|${deckTitle}`
const deadline = Date.now() + 30_000
while (Date.now() < deadline) {
  try {
    if ((await fetch(baseUrl)).ok) break
  } catch {}
  await new Promise(resolve => setTimeout(resolve, 250))
}
assert.ok((await fetch(baseUrl)).ok, `Slidev demo did not start at ${baseUrl}`)

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext()
const isolatedContext = await browser.newContext()
try {
  const audience = await context.newPage()
  const presenter = await context.newPage()
  const isolatedAudience = await isolatedContext.newPage()
  const interactiveRequests = []
  audience.on('request', request => {
    if (new URL(request.url()).pathname === interactivePath)
      interactiveRequests.push(request.url())
  })
  await audience.goto(baseUrl)
  await presenter.goto(new URL('presenter/1', baseUrl).href)
  await isolatedAudience.goto(baseUrl)
  const trigger = audience.getByRole('button', { name: 'Explore diagram: AI SDLC control plane' })
  const preview = trigger.locator('img')
  await trigger.waitFor()
  assert.equal((await trigger.innerText()).trim(), '', 'preview should not show a visible action label')
  assert.equal(await trigger.evaluate(button => getComputedStyle(button).cursor), 'zoom-in', 'preview should advertise zoom interaction')
  assert.equal(await preview.getAttribute('alt'), 'AI SDLC control plane architecture')
  assert.equal(new URL(await preview.getAttribute('src'), baseUrl).pathname, previewPath)
  assert.ok(await preview.evaluate(image => image.complete && image.naturalWidth > 0), 'static preview must load')
  assert.equal(interactiveRequests.length, 0, 'interactive diagram should not load before opening')

  await trigger.focus()
  const interactiveRequest = audience.waitForRequest(request =>
    new URL(request.url()).pathname === interactivePath)
  await audience.keyboard.press('Enter')
  await interactiveRequest
  const dialog = audience.locator('dialog[open]')
  await dialog.waitFor()
  assert.equal(await dialog.getAttribute('aria-label'), 'AI SDLC control plane')
  const iframeUrl = new URL(await dialog.locator('iframe').getAttribute('src'), baseUrl)
  assert.equal(iframeUrl.pathname, interactivePath)
  assert.equal(iframeUrl.searchParams.get('theme'), 'dark')
  assert.equal(iframeUrl.searchParams.get('embed'), '1')
  await audience.keyboard.press('Escape')
  await audience.waitForFunction(() => !document.querySelector('dialog')?.open)
  assert.equal(await audience.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Explore diagram: AI SDLC control plane')

  await preview.click()
  await dialog.waitFor()
  await dialog.getByRole('button', { name: 'Close' }).click()
  await audience.waitForFunction(() => !document.querySelector('dialog')?.open)

  const presenterTrigger = presenter.getByRole('button', { name: 'Explore diagram: AI SDLC control plane' })
  await presenterTrigger.click()
  const presenterDialog = presenter.locator('dialog[open]')
  const audienceDialog = audience.locator('dialog[open]')
  await presenterDialog.waitFor()
  await audienceDialog.waitFor()
  await isolatedAudience.waitForTimeout(100)
  assert.equal(await isolatedAudience.locator('dialog[open]').count(), 0, 'a separate browser context must not receive presenter sync')

  const presenterFrame = presenterDialog.locator('iframe').contentFrame()
  const node = presenterFrame.locator('[data-node-id]').first()
  const nodeId = await node.getAttribute('data-node-id')
  assert.ok(nodeId, 'interactive diagram should expose a focusable node id')
  await node.click()
  await audience.waitForFunction(id => {
    const iframe = document.querySelector('dialog[open] iframe')
    return iframe?.contentDocument?.querySelector('svg')?.getAttribute('data-focus-active') === id
  }, nodeId)

  await presenter.goto(new URL('presenter/2', baseUrl).href)
  await presenter.waitForFunction(() => location.pathname.endsWith('/presenter/2'))
  await audience.waitForFunction(() => location.pathname.endsWith('/demo/2') && !document.querySelector('dialog')?.open)
  assert.equal(await presenter.locator('dialog[open]').count(), 0, 'slide navigation must close the presenter explorer')
  await audience.waitForFunction(() => !document.querySelector('dialog')?.open)

  await audience.evaluate(({ channel, slide, session, component }) => {
    const invalid = new BroadcastChannel(channel)
    const post = (overrides) => invalid.postMessage({
      source: 'slidev-addon-archify-explorer',
      version: 1,
      deck: 'Archify Explorer for Slidev',
      session,
      component: 'unrelated-component',
      slide,
      open: true,
      focus: null,
      ...overrides,
    })
    post({})
    post({ session: 'unrelated-session', component })
    post({ component: 'unrelated-component', slide: slide + 1 })
    invalid.close()
  }, { channel: channelName, slide: 2, session: sessionScope, component: componentScope })
  await audience.waitForTimeout(100)
  assert.equal(await audience.locator('dialog[open]').count(), 0, 'unrelated sync scopes must not open the audience')
  console.log('Component checks passed: preview, base path, accessibility, standalone dialog behavior, presenter sync, focus mirroring, and scope isolation.')
} finally {
  await isolatedContext.close()
  await context.close()
  await browser.close()
}
