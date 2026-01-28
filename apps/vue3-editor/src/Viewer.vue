<template>
  <div ref="rootEl"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { Viewer } from '@toast-ui/editor';

const props = defineProps<{
  value: string;
}>();

const rootEl = ref<HTMLElement | null>(null);
let instance: any = null;

onMounted(() => {
  instance = new Viewer({
    el: rootEl.value!,
    initialValue: props.value ?? '',
  });
});

onBeforeUnmount(() => {
  instance?.destroy?.();
  instance = null;
});

watch(
  () => props.value,
  (val) => {
    if (!instance) return;
    instance.setMarkdown?.(val ?? '');
  }
);

defineExpose({
  getInstance: () => instance,
});
</script>
