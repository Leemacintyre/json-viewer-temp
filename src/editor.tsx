import React, { useEffect, useRef, useState } from "react";
import "jsoneditor/dist/jsoneditor.css";
import type JSONEditor from "jsoneditor";
import type { JSONEditorOptions } from "jsoneditor";
import { api } from "~@/utils/api";

const JSONEditorComponent = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [jsonEditor, setJsonEditor] = useState<JSONEditor | null>(null);
  const { mutateAsync } = api.post.create.useMutation();

  useEffect(() => {
    if (!loaded) {
      const loadJSONEditor = async () => {
        const JSONEditorModule = await import('jsoneditor');
        const JSONEditor = JSONEditorModule.default;
        if (containerRef.current) {
          const dom = new DOMParser().parseFromString(containerRef.current.innerHTML, 'text/html');
          const editor = dom.getElementsByClassName('jsoneditor');
          if (Array.from(editor).length) {
            return;
          }

          const options: JSONEditorOptions = {
            mode: "code",
          };

          setJsonEditor(new JSONEditor(containerRef.current, options));
          setLoaded(true);
        }
      };

      void loadJSONEditor();
    }

    return () => {
      jsonEditor?.destroy();
    };
  }, [jsonEditor, loaded]);

  async function handleClick() {
    if (!jsonEditor) return;
    const res = await mutateAsync({ name: jsonEditor.getText() });
    if (!res) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_key, value] of Object.entries(res)) {
      if (value === undefined) {
        return;
      }
    }
    jsonEditor.setText(JSON.stringify(res));
  }

  return (
    <div style={{ width: '100%', height: '95vh', }}>
      <button
        type="button"
        className={"bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center m-1"}
        onClick={handleClick}
      >
        Unmarshal
      </button>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default JSONEditorComponent;