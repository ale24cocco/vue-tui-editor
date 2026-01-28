<template>
  <div ref="rootEl" style="width: 100%; min-height: 420px"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue';

type EditType = 'markdown' | 'wysiwyg';
type PreviewStyle = 'vertical' | 'tab';

const props = defineProps({
  modelValue: { type: String, default: '' },
  height: { type: String, default: '420px' },
  initialEditType: { type: String as () => EditType, default: 'markdown' },
  previewStyle: { type: String as () => PreviewStyle, default: 'vertical' },
  placeholder: { type: String, default: '' },
  autofocus: { type: Boolean, default: false },
  usageStatistics: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'change', v: string): void;
}>();

const rootEl = ref<HTMLElement | null>(null);
let instance: any = null;
let isSettingFromOutside = false;

defineExpose({
  getInstance: () => instance,
  getMarkdown: () => instance?.getMarkdown?.() ?? '',
  setMarkdown: (v: string) => instance?.setMarkdown?.(v ?? ''),
});

onMounted(async () => {
  await nextTick();
  if (!rootEl.value) return;

  const mod: any = await import('@toast-ui/editor-npm');
  const ToastEditor = mod.default ?? mod.Editor ?? mod;

  instance = new ToastEditor({
    el: rootEl.value,
    height: props.height,
    initialEditType: props.initialEditType,
    previewStyle: props.previewStyle,
    initialValue: props.modelValue ?? '',
    placeholder: props.placeholder,
    autofocus: props.autofocus,
    usageStatistics: props.usageStatistics,
  });

  instance.on('change', () => {
    if (isSettingFromOutside) return;
    const md = instance.getMarkdown();
    emit('update:modelValue', md);
    emit('change', md);
  });
});

watch(
  () => props.modelValue,
  (v) => {
    if (!instance) return;
    const current = instance.getMarkdown();
    if (v === current) return;

    isSettingFromOutside = true;
    try {
      instance.setMarkdown(v ?? '');
    } finally {
      isSettingFromOutside = false;
    }
  }
);

watch(
  () => props.height,
  (h) => {
    if (!instance) return;
    if (typeof instance.setHeight === 'function') instance.setHeight(h);
  }
);

watch(
  () => [props.initialEditType, props.previewStyle] as const,
  async () => {
    if (!instance || !rootEl.value) return;

    const currentValue = instance.getMarkdown?.() ?? props.modelValue ?? '';
    instance.destroy?.();
    instance = null;

    const mod: any = await import('@toast-ui/editor-npm');
    const ToastEditor = mod.default ?? mod.Editor ?? mod;

    instance = new ToastEditor({
      el: rootEl.value,
      height: props.height,
      initialEditType: props.initialEditType,
      previewStyle: props.previewStyle,
      initialValue: currentValue,
      placeholder: props.placeholder,
      autofocus: props.autofocus,
      usageStatistics: props.usageStatistics,
    });

    instance.on('change', () => {
      if (isSettingFromOutside) return;
      const md = instance.getMarkdown();
      emit('update:modelValue', md);
      emit('change', md);
    });
  }
);

onBeforeUnmount(() => {
  if (instance?.destroy) instance.destroy();
  instance = null;
});
</script>
