<template>
  <div ref="rootEl" style="width: 100%; min-height: 420px"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue';

type EditType = 'markdown' | 'wysiwyg';
type PreviewStyle = 'vertical' | 'tab';
type SelectionPayload = {
  mode: 'markdown' | 'wysiwyg';
  isCollapsed: boolean;
  text: string;
  from?: number; // offset markdown (se disponibile)
  to?: number;
};

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
  (
    e: 'selection-change',
    p: {
      mode: 'markdown' | 'wysiwyg';
      isCollapsed: boolean;
      text: string;
    }
  ): void;
}>();

const rootEl = ref<HTMLElement | null>(null);
let instance: any = null;
let isSettingFromOutside = false;
let lastSelectionText = '';
let onMouseUp: ((e: MouseEvent) => void) | null = null;
let onKeyUp: ((e: KeyboardEvent) => void) | null = null;
let onSelectionChange: (() => void) | null = null;

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

  attachSelectionListeners();
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

    // i listener sono sul DOM, non sull'istanza: in teoria restano validi.
    // Però se vuoi essere ultra-safe:
    detachSelectionListeners();
    attachSelectionListeners();

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
  detachSelectionListeners();

  if (instance?.destroy) instance.destroy();
  instance = null;
});

function getCurrentMode(): 'markdown' | 'wysiwyg' {
  // toast ui ha getCurrentMode() in molte versioni
  try {
    return instance?.getCurrentMode?.() ?? props.initialEditType;
  } catch {
    return props.initialEditType;
  }
}

function emitSelectionIfChanged() {
  if (!instance) return;

  const mode = getCurrentMode();
  const text = getSelectedText();
  const isCollapsed = !text;

  if (text === lastSelectionText) return;
  lastSelectionText = text;

  emit('selection-change', { mode, text, isCollapsed });
}

function attachSelectionListeners() {
  if (!rootEl.value) return;
  if (onMouseUp || onKeyUp || onSelectionChange) return; // già attaccati

  onMouseUp = () => emitSelectionIfChanged();
  onKeyUp = () => emitSelectionIfChanged();
  onSelectionChange = () => emitSelectionIfChanged();

  rootEl.value.addEventListener('mouseup', onMouseUp);
  rootEl.value.addEventListener('keyup', onKeyUp);
  document.addEventListener('selectionchange', onSelectionChange);
}

function detachSelectionListeners() {
  if (!rootEl.value) return;

  if (onMouseUp) rootEl.value.removeEventListener('mouseup', onMouseUp);
  if (onKeyUp) rootEl.value.removeEventListener('keyup', onKeyUp);
  if (onSelectionChange) document.removeEventListener('selectionchange', onSelectionChange);

  onMouseUp = null;
  onKeyUp = null;
  onSelectionChange = null;
}

function getSelectedText(): string {
  if (!instance) return '';

  const mode = getCurrentMode();

  // 1) Markdown mode (CodeMirror-like)
  if (mode === 'markdown') {
    const cm = instance.getCodeMirror?.();
    if (cm?.getSelection) return cm.getSelection();
    // fallback DOM selection
    return window.getSelection?.()?.toString?.() ?? '';
  }

  // 2) WYSIWYG mode (ProseMirror)
  const ww = instance.getWysiwygEditor?.();
  const view = ww?.view;
  const state = view?.state;
  if (!state) return window.getSelection?.()?.toString?.() ?? '';

  const { from, to } = state.selection;
  return state.doc.textBetween(from, to, '\n');
}
</script>
