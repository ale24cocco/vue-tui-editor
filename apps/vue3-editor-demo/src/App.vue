<template>
  <div style="padding: 16px; display: grid; gap: 16px">
    <h2>Toast UI Editor – Vue 3 Wrapper Demo</h2>

    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
      <label>
        Mode:
        <select v-model="editType">
          <option value="markdown">markdown</option>
          <option value="wysiwyg">wysiwyg</option>
        </select>
      </label>

      <button @click="md = sample">Load sample</button>

      <button
        :disabled="!selection.text"
        @click="askAboutSelection"
        title="Use the current selection as RAG query"
      >
        Ask about selection
      </button>
    </div>

    <Editor
      ref="editorRef"
      :key="editType"
      v-model="md"
      height="420px"
      :initialEditType="editType"
      previewStyle="vertical"
      @selection-change="onSelectionChange"
    />

    <!-- DEBUG BOX -->
    <div style="border: 1px solid #ddd; border-radius: 10px; padding: 12px; background: #fafafa">
      <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 12px">
        <h3 style="margin: 0">Selection debug</h3>
        <small style="opacity: 0.75">
          {{ selection.isCollapsed ? 'caret / no selection' : 'text selected' }}
        </small>
      </div>

      <div style="display: grid; gap: 8px; margin-top: 10px">
        <div style="display: flex; gap: 16px; flex-wrap: wrap">
          <div><b>mode:</b> {{ selection.mode }}</div>
          <div><b>isCollapsed:</b> {{ selection.isCollapsed }}</div>
          <div><b>length:</b> {{ selection.text.length }}</div>
        </div>

        <div>
          <b>text preview:</b>
          <div
            style="
              margin-top: 6px;
              padding: 10px;
              background: white;
              border: 1px solid #eee;
              border-radius: 8px;
              white-space: pre-wrap;
              max-height: 140px;
              overflow: auto;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
                'Courier New', monospace;
              font-size: 12px;
            "
          >
            {{ selection.text || '(nothing selected)' }}
          </div>
        </div>

        <details>
          <summary><b>raw payload</b></summary>
          <pre style="margin: 8px 0 0; font-size: 12px; overflow: auto">{{
            JSON.stringify(selection, null, 2)
          }}</pre>
        </details>
      </div>
    </div>

    <h3>Viewer</h3>
    <Viewer :value="md" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Editor, Viewer } from '@toast-ui/tui-editor-vue3';

type EditType = 'markdown' | 'wysiwyg';
type SelectionPayload = {
  mode: EditType;
  isCollapsed: boolean;
  text: string;
  from?: number;
  to?: number;
};

const editorRef = ref<any>(null);

const md = ref('# Hello\n\nThis is **Toast UI Editor** (Vue 3 wrapper).');
const editType = ref<EditType>('markdown');

const selection = ref<SelectionPayload>({
  mode: 'markdown',
  isCollapsed: true,
  text: '',
});

const sample = `# Sample

- Item 1
- Item 2

\`\`\`js
console.log("hello");
\`\`\`
`;

function onSelectionChange(p: SelectionPayload) {
  selection.value = p;
}

function askAboutSelection() {
  // push-style: già hai selection.value
  const q = selection.value.text?.trim();
  if (!q) return;

  console.log('RAG query from selection:', q);

  // pull-style (opzionale): se aggiungi getSelection nel wrapper
  // const sel = editorRef.value?.getSelection?.()
  // console.log('getSelection() ->', sel)
}
</script>
