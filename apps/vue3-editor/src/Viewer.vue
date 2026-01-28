<template>
  <div ref="rootEl" style="width: 100%; min-height: 240px"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue';

const props = defineProps({
  value: { type: String, default: '' },
});

const rootEl = ref<HTMLElement | null>(null);
let instance: any = null;

defineExpose({
  getInstance: () => instance,
});

onMounted(async () => {
  await nextTick();
  if (!rootEl.value) return;

  // Variante robusta: viewer bundle dedicato (evita ambiguità export)
  const mod: any = await import('@toast-ui/editor-npm/dist/toastui-editor-viewer');
  const ToastViewer = mod.default ?? mod.Viewer ?? mod;

  instance = new ToastViewer({
    el: rootEl.value,
    initialValue: props.value ?? '',
  });
});

watch(
  () => props.value,
  (v) => {
    if (!instance) return;
    if (instance.setMarkdown) instance.setMarkdown(v ?? '');
    else if (instance.setValue) instance.setValue(v ?? '');
  }
);

onBeforeUnmount(() => {
  if (instance?.destroy) instance.destroy();
  instance = null;
});
</script>
