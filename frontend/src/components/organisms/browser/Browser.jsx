import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useEditorSocketStore } from "../../../stores/editorSocketStore";

export const Browser = ({ port }) => {
  const { projectId } = useParams();
  const iframeRef = useRef(null);
  const { editorSocket } = useEditorSocketStore();

  useEffect(() => {
    if (!port) return;
  }, [port]);
  if (port) {
    var url = `http://localhost:${port.port}/`;
  }
  console.log("the iframe url is ", url);

  const reloadIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.location.reload();
    }
  };

  return (
    <iframe
      width="760"
      height="800"
      src="http://localhost:32995/"
      title="React App Preview"
      sandbox="allow-scripts allow-same-origin"
    ></iframe>
  );
};
