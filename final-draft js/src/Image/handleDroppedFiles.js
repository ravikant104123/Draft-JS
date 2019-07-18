
import { EditorState } from 'draft-js';
import { readFiles } from './utils/file';

export default function onDropFile(config) {
  return function onDropFileInner(selection, files, { getEditorState, setEditorState }) {
    
    const {
      handleUpload,
    } = config;

    if (handleUpload) {
      const formData = new FormData();

      // Set data {files: [Array of files], formData: FormData}
      const data = { files: [], formData };
      for (const key in files) { // eslint-disable-line no-restricted-syntax
        if (files[key] && files[key] instanceof File) {
          data.formData.append('files', files[key]);
          data.files.push(files[key]);
        }
      }

      setEditorState(EditorState.acceptSelection(getEditorState(), selection));

      // Read files on client side
      readFiles(data.files).then((placeholders) => {
        // Add blocks for each image before uploading
        let editorState = getEditorState();
        placeholders.forEach((placeholder) => {
          editorState = config.addImage(editorState, placeholder.src);
        });
        setEditorState(editorState);

        
      });

      return 'handled';
    }

    return undefined;
  };
}