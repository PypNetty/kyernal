import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

export default function TerminalComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 13,
      fontFamily: 'JetBrains Mono, Fira Code, monospace',
      theme: {
        background: '#0f0f0f',
        foreground: '#e8e8e8',
        cursor: '#60a5fa',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);
    fitAddon.fit();

    term.writeln(
      '\x1b[1;32m[KLIXY ARENA]\x1b[0m — Session interactive initialisée',
    );
    term.writeln(
      'Connexion SSH établie avec \x1b[1;34mvm-apprenant-01\x1b[0m (Debian 13)',
    );
    term.writeln('');
    term.write('\x1b[1;32mapprenant\x1b[0m@\x1b[1;34mvm-01\x1b[0m:~$ ');

    termRef.current = term;

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
}
