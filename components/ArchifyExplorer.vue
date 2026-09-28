<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { useNav } from '@slidev/client'

const props = withDefaults(defineProps<{
  src: string
  title: string
  preview?: string
  alt?: string
  buttonLabel?: string
  closeLabel?: string
}>(), {
  alt: undefined,
  buttonLabel: 'Explore diagram',
  closeLabel: 'Close',
})

const dialog = ref<HTMLDialogElement>()
const { isPrintMode } = useNav()
const slots = useSlots()
const withBase = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
const interactiveUrl = computed(() => withBase(props.src))
const previewUrl = computed(() => props.preview ? withBase(props.preview) : undefined)
const hasPreview = computed(() => !!props.preview || !!slots.default)

function close() {
  dialog.value?.close()
}
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
    @click="dialog?.showModal()"
  >
    <template v-if="hasPreview">
      <slot>
        <img class="diagram-preview" :src="previewUrl" :alt="alt ?? title" />
      </slot>
    </template>
    <template v-else>{{ buttonLabel }}</template>
  </button>

  <dialog v-if="!isPrintMode" ref="dialog" class="explorer-dialog" :aria-label="title" @click.self="close">
    <header class="explorer-header">
      <strong>{{ title }}</strong>
      <button class="close-button" type="button" @click="close">{{ closeLabel }}</button>
    </header>
    <iframe :src="interactiveUrl" :title="`${title}, interactive diagram`" loading="lazy" allow="fullscreen" />
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
