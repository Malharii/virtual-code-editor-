import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { AttachAddon } from "@xterm/addon-attach";
import "@xterm/xterm/css/xterm.css";
import { useTerminalSocketStore } from "../../../store/terminalSocketStore";

export const BrowserTerminal = () => {
  const terminalRef = useRef(null);
  const { terminalSocket } = useTerminalSocketStore();

  useEffect(() => {
    if (!terminalRef.current || !terminalSocket) return;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily:
        "JetBrains Mono, Fira Code, Source Code Pro, Menlo, Consolas, monospace",
      lineHeight: 1.25,
      convertEol: true,
      theme: {
        background: "#1e1e1e",
        foreground: "#d4d4d4",
        cursor: "#aeafad",
        selection: "#264f78",
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);

    // ✅ Delay fit until layout is ready
    requestAnimationFrame(() => {
      fitAddon.fit();
      term.focus();
    });

    // ✅ REQUIRED for proper keyboard handling
    terminalSocket.binaryType = "arraybuffer";

    const attach = () => {
      const attachAddon = new AttachAddon(terminalSocket);
      term.loadAddon(attachAddon);
    };

    // ✅ Handle already-open socket
    if (terminalSocket.readyState === WebSocket.OPEN) {
      attach();
    } else {
      terminalSocket.onopen = attach;
    }

    return () => {
      term.dispose();
    };
  }, [terminalSocket]);

  return (
    <div
      ref={terminalRef}
      tabIndex={0}
      style={{
        height: "25vh", // ✅ IMPORTANT
        width: "100%",
        overflow: "hidden",
        outline: "none",
      }}
    />
  );
};
