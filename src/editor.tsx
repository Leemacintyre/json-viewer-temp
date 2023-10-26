import React, { useEffect, useRef, useState } from "react";
import "jsoneditor/dist/jsoneditor.css";
import JSONEditor from "jsoneditor";
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
    jsonEditor.setText(JSON.stringify(res));
  }

  return (
    <div style={{ width: '100%', height: '95vh', overflow: 'hidden' }}>
      <button
        type="button"
        onClick={handleClick}

      >
        unmarshal
      </button>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default JSONEditorComponent;