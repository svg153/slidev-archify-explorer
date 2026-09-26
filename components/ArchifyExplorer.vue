<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNav } from '@slidev/client'

const props = withDefaults(defineProps<{
  src: string
  title: string
  buttonLabel?: string
  closeLabel?: string
}>(), {
  buttonLabel: 'Explore diagram',
  closeLabel: 'Close',
})

const dialog = ref<HTMLDialogElement>()
const { isPrintMode } = useNav()
const interactiveUrl = computed(() => `${import.meta.env.BASE_URL}${props.src.replace(/^\/+/, '')}`)

function close() {
  dialog.value?.close()
}
</script>

<template>
  <button v-if="!isPrintMode" class="explore-button" type="button" @click="dialog?.showModal()">
    {{ buttonLabel }}
  </button>

  <dialog v-if="!isPrintMode" ref="dialog" class="explorer-dialog" :aria-label="title" @click.self="close">
    <header class="explorer-header">
      <strong>{{ title }}</strong>
      <button class="close-button" type="button" @click="close">{{ closeLabel }}</button>
    </header>
    <iframe :src="interactiveUrl" :title="`${title}, interactive diagram`" allow="fullscreen" />
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
