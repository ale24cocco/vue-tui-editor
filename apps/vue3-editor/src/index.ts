import Editor from './Editor.vue';
import Viewer from './Viewer.vue';

// CSS (puoi decidere se farli importare al consumer: qui li importiamo per UX “plug&play”)
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

export { Editor, Viewer };
export default Editor;
