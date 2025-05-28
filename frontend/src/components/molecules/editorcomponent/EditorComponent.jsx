import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useActiveFileTabStore } from "../../../stores/activeFileTabStore";
import { useEditorSocketStore } from "../../../stores/editorSocketStore";
import { extensionToFileType } from "../../../utils/extensionToFileType";
export const EditorComponent = () => {
  let timerId = null;
  const [editorState, setEditorState] = useState({ theme: null });

  const { activeFileTab } = useActiveFileTabStore();
  const { editorSocket } = useEditorSocketStore();

  async function downloadTheme() {
    const response = await fetch("/Cobalt2.json");
    const data = await response.json();
    console.log(data);
    setEditorState({ ...editorState, theme: data });
  }

  function handleEditorTheme(editor, monaco) {
    monaco.editor.defineTheme("cobalt2", editorState.theme);
    monaco.editor.setTheme("cobalt2");
  }

  function hangleChange(value) {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      const editorContent = value;
      console.log("sending writeFile event");
      editorSocket.emit("writeFile", {
        data: editorContent,
        pathToFileOrFolder: activeFileTab.path,
      });
    }, 2000);
  }

  useEffect(() => {
    downloadTheme();
  }, []);
  return (
    <div>
      {editorState.theme && (
        <Editor
          height="90vh"
          defaultLanguage={undefined}
          language={extensionToFileType(activeFileTab?.extension)}
          defaultValue="// welcome to editor"
          options={{ fontSize: 14, fontFamily: "monospace" }}
          onMount={handleEditorTheme}
          value={activeFileTab?.value}
          onChange={hangleChange}
        />
      )}
    </div>
  );
};
