import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css"; //  requred all style for terminal
export const BrowserTerminal = () => {
  const terminalRef = useRef(null);
  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "Ubuntu Mono",
      convertEol: true,
      theme: {
        background: "#282a37",
        foreground: "#f8f8f3",
        cursor: "f8f8f3",
        cursorAccent: "#282a37",
        red: "#ff5544",
        green: "#50fa7c",
        yellow: "#f1fa8c",
        cyan: "#8be9fd",
      },
    });
    term.open(terminalRef.current);
    let fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();
  }, []);
  return (
    <div
      ref={terminalRef}
      style={{
        height: "25vh",
        overflow: "auto",
      }}
    ></div>
  );
};
