<template>
  <div style="padding: 16px; display: grid; gap: 16px">
    <h2>Toast UI Editor – Vue 3 Wrapper Demo</h2>

    <div style="display: flex; gap: 12px; align-items: center">
      <label>
        Mode:
        <select v-model="editType">
          <option value="markdown">markdown</option>
          <option value="wysiwyg">wysiwyg</option>
        </select>
      </label>

      <button @click="md = sample">Load sample</button>
    </div>

    <Editor v-model="md" height="420px" :initialEditType="editType" previewStyle="vertical" />

    <h3>Viewer</h3>
    <Viewer :value="md" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Editor, Viewer } from '@toast-ui/tui-editor-vue3';

const md = ref('# Hello\n\nThis is **Toast UI Editor** (Vue 3 wrapper).');
const editType = ref<'markdown' | 'wysiwyg'>('markdown');

const sample = `# Sample

- Item 1
- Item 2

\`\`\`js
console.log("hello");
\`\`\`
`;
</script>
