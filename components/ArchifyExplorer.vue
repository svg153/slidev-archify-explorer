<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { slidesTitle, useNav } from '@slidev/client'

const props = withDefaults(defineProps<{
  src: string
  title: string
  preview?: string
  alt?: string
  buttonLabel?: string
  closeLabel?: string
  syncKey?: string
  syncSession?: string
}>(), {
  alt: undefined,
  buttonLabel: 'Explore diagram',
  closeLabel: 'Close',
})

const dialog = ref<HTMLDialogElement>()
const frame = ref<HTMLIFrameElement>()
const { currentSlideNo, isPresenter, isPrintMode } = useNav()
const slots = useSlots()
const withBase = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
const interactiveUrl = computed(() => withBase(props.src))
const previewUrl = computed(() => props.preview ? withBase(props.preview) : undefined)
const hasPreview = computed(() => !!props.preview || !!slots.default)
const componentScope = computed(() => props.syncKey || `${props.src}|${props.title}`)

type ExplorerSyncMessage = {
  source: 'slidev-addon-archify-explorer'
  version: 1
  deck: string
  session: string
  component: string
  slide: number
  open: boolean
  focus: string | null
}

let syncChannel: BroadcastChannel | undefined
let focusObserver: MutationObserver | undefined
let frameWindow: Window | undefined
let pendingRemoteFocus: string | null | undefined

function syncSession() {
  return props.syncSession || `${window.location.origin}|${import.meta.env.BASE_URL}|${slidesTitle}`
}

function channelName() {
  return `slidev-addon-archify-explorer:${encodeURIComponent(slidesTitle)}:${encodeURIComponent(import.meta.env.BASE_URL)}`
}

function focusFromFrame() {
  try {
    const active = frame.value?.contentDocument?.querySelector('svg[data-focus-active]')
      ?.getAttribute('data-focus-active')
    return active?.trim().split(/\s+/)[0] || null
  }
  catch {
    return null
  }
}

function publish(open: boolean, focus: string | null) {
  if (!isPresenter.value || !syncChannel) return
  const message: ExplorerSyncMessage = {
    source: 'slidev-addon-archify-explorer',
    version: 1,
    deck: slidesTitle,
    session: syncSession(),
    component: componentScope.value,
    slide: currentSlideNo.value,
    open,
    focus: open ? focus : null,
  }
  syncChannel.postMessage(message)
}

function applyFocus(focus: string | null) {
  try {
    const window = frame.value?.contentWindow
    if (!window || !frame.value?.contentDocument) return
    const url = new URL(window.location.href)
    url.hash = focus ? `focus=${encodeURIComponent(focus)}` : ''
    if (url.href === window.location.href) return
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
    window.dispatchEvent(new window.HashChangeEvent('hashchange'))
  }
  catch {
    // A custom/remote iframe stays standalone when same-origin access is unavailable.
  }
}

function applyPendingRemoteFocus() {
  if (pendingRemoteFocus !== undefined) {
    applyFocus(pendingRemoteFocus)
  }
}

function stopFocusObserver() {
  focusObserver?.disconnect()
  focusObserver = undefined
  if (frameWindow) {
    try {
      frameWindow.removeEventListener('hashchange', publishFocus)
    }
    catch {
      // A custom/remote iframe may have navigated cross-origin since load.
    }
    frameWindow = undefined
  }
}

function publishFocus() {
  if (isPresenter.value && dialog.value?.open) {
    publish(true, focusFromFrame())
  }
}

function observeFrame() {
  stopFocusObserver()
  try {
    const svg = frame.value?.contentDocument?.querySelector('svg')
    if (!svg) return
    focusObserver = new MutationObserver(publishFocus)
    focusObserver.observe(svg, { attributes: true, attributeFilter: ['data-focus-active'] })
    frameWindow = frame.value?.contentWindow || undefined
    frameWindow?.addEventListener('hashchange', publishFocus)
    applyPendingRemoteFocus()
    publishFocus()
  }
  catch {
    // A cross-origin custom iframe remains usable without presenter focus sync.
    stopFocusObserver()
  }
}

function onFrameLoad() {
  observeFrame()
}

function onDialogClosed() {
  pendingRemoteFocus = undefined
  if (isPresenter.value) publish(false, null)
}

function open() {
  dialog.value?.showModal()
  publish(true, focusFromFrame())
}

function close() {
  dialog.value?.close()
}

function receive(event: MessageEvent<unknown>) {
  // BroadcastChannel is same-origin by definition; retain explicit checks for testable message validation.
  if (event.origin && event.origin !== window.location.origin) return
  if (event.source && event.source !== window) return
  const message = event.data as Partial<ExplorerSyncMessage> | null
  if (!message || message.source !== 'slidev-addon-archify-explorer' || message.version !== 1) return
  if (message.deck !== slidesTitle || message.session !== syncSession() || message.component !== componentScope.value) return
  if (message.slide !== currentSlideNo.value || typeof message.open !== 'boolean') return
  if (isPresenter.value || (message.open && message.focus !== null && typeof message.focus !== 'string')) return
  if (!message.open) {
    pendingRemoteFocus = null
    applyFocus(null)
    dialog.value?.close()
    return
  }
  pendingRemoteFocus = message.focus ?? null
  if (!dialog.value?.open) dialog.value?.showModal()
  nextTick(applyPendingRemoteFocus)
}

watch(currentSlideNo, () => {
  pendingRemoteFocus = null
  applyFocus(null)
  if (dialog.value?.open) dialog.value.close()
  else if (isPresenter.value) publish(false, null)
})

onMounted(() => {
  if (typeof BroadcastChannel === 'undefined') return
  syncChannel = new BroadcastChannel(channelName())
  syncChannel.addEventListener('message', receive)
})

onBeforeUnmount(() => {
  stopFocusObserver()
  syncChannel?.removeEventListener('message', receive)
  syncChannel?.close()
  syncChannel = undefined
})
</script>

<template>
  <template v-if="isPrintMode">
    <slot v-if="slots.default" />
    <img v-else-if="previewUrl" class="diagram-preview" :src="previewUrl" :alt="alt ?? title" />
  </template>

  <button
    v-else
    class="explore-button"
    :class="{ 'explore-button--preview': hasPreview }"
    type="button"
    :aria-label="`${buttonLabel}: ${title}`"
    :title="`${buttonLabel}: ${title}`"
    @click="open"
  >
    <template v-if="hasPreview">
      <slot>
        <img class="diagram-preview" :src="previewUrl" :alt="alt ?? title" />
      </slot>
    </template>
    <template v-else>{{ buttonLabel }}</template>
  </button>

  <dialog v-if="!isPrintMode" ref="dialog" class="explorer-dialog" :aria-label="title" @click.self="close" @close="onDialogClosed">
    <header class="explorer-header">
      <strong>{{ title }}</strong>
      <button class="close-button" type="button" @click="close">{{ closeLabel }}</button>
    </header>
    <iframe ref="frame" :src="interactiveUrl" :title="`${title}, interactive diagram`" loading="lazy" allow="fullscreen" @load="onFrameLoad" />
  </dialog>
</template>

<style scoped>
.explore-button,
.close-button {
  border: 1px solid rgb(166 164 255 / 55%);
  border-radius: 999px;
  background: #171550;
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 0.8em;
  padding: 0.45em 1em;
}

.explore-button {
  white-space: nowrap;
}

.explore-button:focus-visible,
.close-button:focus-visible {
  outline: 3px solid #ff9d22;
  outline-offset: 3px;
}

.explore-button--preview {
  display: block;
  width: 100%;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  cursor: zoom-in;
  font-size: inherit;
  padding: 0;
  text-align: left;
  white-space: normal;
}

.diagram-preview {
  display: block;
  max-height: 375px;
  width: 100%;
  object-fit: contain;
}

.explorer-dialog {
  width: min(96vw, 1600px);
  height: min(90vh, 1000px);
  max-width: none;
  max-height: none;
  overflow: hidden;
  padding: 0;
  border: 1px solid rgb(166 164 255 / 55%);
  border-radius: 14px;
  background: #080d22;
  color: #fff;
}

.explorer-dialog::backdrop {
  background: rgb(3 5 20 / 84%);
}

.explorer-header {
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  font-size: 0.9rem;
}

.explorer-dialog iframe {
  display: block;
  width: 100%;
  height: calc(100% - 48px);
  border: 0;
  background: #080d22;
}

@media print {
  .explore-button,
  .explorer-dialog {
    display: none !important;
  }
}
</style>
