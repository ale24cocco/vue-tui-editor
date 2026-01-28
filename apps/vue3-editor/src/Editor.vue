<template>
  <div ref="rootEl"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import Editor from '@toast-ui/editor';

type EditType = 'markdown' | 'wysiwyg';
type PreviewStyle = 'vertical' | 'tab';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    height?: string;
    initialEditType?: EditType;
    previewStyle?: PreviewStyle;
    placeholder?: string;
    autofocus?: boolean;
    usageStatistics?: boolean;
  }>(),
  {
    height: '500px',
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    placeholder: '',
    autofocus: false,
    usageStatistics: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}>();

const rootEl = ref<HTMLElement | null>(null);
let instance: Editor | null = null;
let isSettingFromOutside = false;

onMounted(() => {
  instance = new Editor({
    el: rootEl.value!,
    height: props.height,
    initialEditType: props.initialEditType,
    previewStyle: props.previewStyle,
    initialValue: props.modelValue ?? '',
    placeholder: props.placeholder,
    autofocus: props.autofocus,
    usageStatistics: props.usageStatistics,
  });

  instance.on('change', () => {
    if (!instance) return;
    if (isSettingFromOutside) return;

    const md = instance.getMarkdown();
    emit('update:modelValue', md);
    emit('change', md);
  });
});

onBeforeUnmount(() => {
  instance?.destroy();
  instance = null;
});

watch(
  () => props.modelValue,
  (val) => {
    if (!instance) return;
    const current = instance.getMarkdown();
    if ((val ?? '') === current) return;

    isSettingFromOutside = true;
    instance.setMarkdown(val ?? '', false);
    isSettingFromOutside = false;
  },
);

// API per chi usa ref al componente
defineExpose({
  getInstance: () => instance,
  getMarkdown: () => instance?.getMarkdown(),
  getHTML: () => instance?.getHTML(),
  setMarkdown: (v: string) => instance?.setMarkdown(v ?? '', false),
  setHTML: (v: string) => instance?.setHTML(v ?? ''),
});
</script>
