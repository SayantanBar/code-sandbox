import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { AttachAddon } from "@xterm/addon-attach";
import { useTerminalSocketStore } from "../../../stores/terminalSocketStore";

export const BrowserTerminal = () => {
  const terminalRef = useRef(null);
  const socket = useRef(null);
  const { projectId: projectIdFromUrl } = useParams();

  const { terminalSocket } = useTerminalSocketStore();
  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: "block",
      fontSize: 14,
      fontFamily: "Fira Code, monospace",
      theme: {
        background: "#1e1e2f",
        foreground: "#ffffff",
        cursor: "#00ffab",
      },
      rows: 20,
      disableStdin: false,
      convertEol: true,
    });

    term.open(terminalRef.current);
    let fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    requestAnimationFrame(() => {
      fitAddon.fit();
    });

    // const ws = new WebSocket(
    //   "ws://localhost:3000/terminal?projectId=" + projectIdFromUrl
    // );

    if (terminalSocket) {
      terminalSocket.onopen = () => {
        const attachAddon = new AttachAddon(terminalSocket);
        term.loadAddon(attachAddon);
        // socket.current = ws;
      };
    }

    return () => {
      term.dispose();
    };
  }, [terminalSocket]);

  return (
    <div
      ref={terminalRef}
      className="h-[200px] w-full bg-[#1e1e2f] text-white rounded-md shadow-inner overflow-hidden"
    ></div>
  );
};
