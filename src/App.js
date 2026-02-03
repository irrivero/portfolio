import React, { useState, useRef, useEffect } from 'react';

export default function TerminalPortfolio() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('term-theme') || 'dark'; } catch { return 'dark'; }
  });
  const [output, setOutput] = useState([
    "Welcome to Irene's Portfolio! Type 'help' to see available commands.",
    "\n",
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState(() => {
    try { const raw = localStorage.getItem('term-history'); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const urls = {
    github: 'https://github.com/irrivero',
    linkedin: 'https://www.linkedin.com/in/irriverocas/',
    transcendence: 'https://github.com/irrivero/ft_transcendence',
    cv: 'mailto:irene.rivero.casal@gmail.com?subject=CV%20Request'
  };

  
  const commands = {
    help: [
      "Available commands:",
      "- about: Learn about Irene",
      "- 42: 42 Cursus summary",
      "- transcendence: ft_transcendence overview",
      "- projects: View project portfolio",
      "- skills: See technical skills",
      "- contact: Get contact information",
      "- history: Show previous commands",
      "- theme [dark|light|hacker]: Switch theme",
      "- open <github|linkedin|transcendence|cv>: Open links",
      "- echo <text>: Print text",
      "- date: Show current date/time",
      "- clear: Clear the terminal",
      "Tip: try 'help -a' for more details"
    ],
    'help -a': [
      "Aliases: ls->projects, whoami/info->about, portfolio->projects, cls->clear",
      "Autocomplete: Tab to complete commands",
      "Navigation: ArrowUp/ArrowDown for history",
    ],
    about: [
      "Irene Rivero Casal",
      "Role: System Administrator / DevOps Engineer",
      "42 Graduate — specialized in systems, networking, and automation.",
      "Passionate about Linux, containers, CI/CD, and resilient infra.",
    ],
    '42': [
      "42 Cursus:",
      "- Core projects: Libft, Get_next_line, Born2beroot, Minishell, Philosophers, NetPractice, MiniRT/Webserv, Inception",
      "- Focus: Unix, networking, C/C++, Docker, Nginx, MariaDB, shell, git",
      "- Campus: 42 Berlin",
    ],
    transcendence: [
      "ft_transcendence:",
      "- Stack: NestJS/Node, PostgreSQL, Prisma, Docker, JWT OAuth, WebSocket",
      "- Frontend: TypeScript, React/Vite (or your stack) with UI components",
      "- Features: Auth, 2FA, chat, matchmaking, real-time Pong, profiles",
      "- Repo: "+urls.transcendence,
    ],
    projects: [
      "Projects:",
      "1) Webserv — HTTP server in C++ (CGI, config, concurrency)",
      "2) Minishell — custom shell in C (parsing, pipes, signals)",
      "3) Inception — Dockerized services (Nginx, MariaDB, WordPress)",
      "4) ft_transcendence — full-stack real-time app (see 'transcendence')",
      "GitHub: "+urls.github,
    ],
    skills: [
      "Skills:",
      "- Systems: Linux, Bash, systemd, pkg mgmt",
      "- Networking: TCP/IP, HTTP, DNS, TLS, firewalls",
      "- Containers/DevOps: Docker, Compose, CI/CD basics",
      "- Web: Nginx, Node/NestJS, React",
      "- Databases: PostgreSQL, MariaDB, SQLite",
      "- Tools: Git, Make, Vim",
    ],
    contact: [
      "Contact:",
      "Email: irene.rivero.casal@gmail.com",
      "GitHub: "+urls.github,
      "LinkedIn: "+urls.linkedin,
    ],
    ascii: [
      "       (|_|)",
      "       (o.o)  <-- A little bunny hacker!", 
      "       (> <)"
    ],
      };

  const commandAliases = {
    ls: "projects",
    whoami: "about",
    info: "about",
    portfolio: "projects",
    cls: "clear",
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [output]);

  useEffect(() => {
    try { localStorage.setItem('term-history', JSON.stringify(commandHistory)); } catch {}
  }, [commandHistory]);

  useEffect(() => {
    try { localStorage.setItem('term-theme', theme); } catch {}
  }, [theme]);

  const printWithTypingEffect = (lines, index = 0) => {
    if (index < lines.length) {
      setTimeout(() => {
        setOutput(prev => [...prev, lines[index]]);
        printWithTypingEffect(lines, index + 1);
      }, 35);
    }
  };

  const execOpen = (arg) => {
    const key = (arg || '').toLowerCase();
    if (!urls[key]) return [`Unknown target: ${arg}`, `Usage: open <${Object.keys(urls).join('|')}>`];
    try { window.open(urls[key], '_blank', 'noopener,noreferrer'); } catch {}
    return [
      `Opening ${key}...`,
      urls[key],
    ];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const raw = currentCommand;
    const trimmed = raw.trim();
    const lowered = trimmed.toLowerCase();

    // Parameterized commands parsing
    const [cmd, ...args] = lowered.split(/\s+/);
    const displayCmd = `$ ${raw}`;
    const newOutput = [...output, displayCmd];

    const resolved = commandAliases[cmd] || cmd;

    const run = () => {
      if (!resolved) return setOutput([...newOutput, ""]);

      if (resolved === 'clear') {
        setOutput(["Welcome to Irene's Portfolio! Type 'help' to see available commands."]);
        return;
      }

      if (resolved === 'history') {
        const hist = commandHistory.slice(-20).map((h, i) => `${i+1}. ${h}`);
        setOutput([...newOutput, ...(hist.length ? hist : ['(empty)'])]);
        return;
      }

      if (resolved === 'echo') {
        setOutput([...newOutput, args.join(' ')]);
        return;
      }

      if (resolved === 'date') {
        setOutput([...newOutput, new Date().toString()]);
        return;
      }

      if (resolved === 'open') {
        setOutput(newOutput);
        printWithTypingEffect(execOpen(args[0]));
        return;
      }

      if (resolved === 'theme') {
        const t = args[0];
        const allowed = ['dark','light','hacker'];
        if (!t || !allowed.includes(t)) {
          setOutput([...newOutput, `Current theme: ${theme}`, `Usage: theme <${allowed.join('|')}>`]);
        } else {
          setTheme(t);
          setOutput([...newOutput, `Theme set to ${t}`]);
        }
        return;
      }

      if (commands[resolved]) {
        setOutput(newOutput);
        printWithTypingEffect(commands[resolved]);
        return;
      }

      setOutput([...newOutput, `Command not found: ${cmd}`]);
    };

    if (trimmed) {
      setCommandHistory(prev => [...prev, trimmed]);
    }

    run();

    setCurrentCommand('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 
          ? historyIndex + 1 
          : commandHistory.length - 1;
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
        setHistoryIndex(newIndex);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > -1) {
        const newIndex = historyIndex - 1;
        setCurrentCommand(newIndex >= 0 ? commandHistory[commandHistory.length - 1 - newIndex] : "");
        setHistoryIndex(newIndex);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const keys = Object.keys(commands).concat(['history','theme','open','echo','date','clear']);
      const matches = keys.filter(cmd => cmd.startsWith(currentCommand.toLowerCase()));
      if (matches.length === 1) {
        setCurrentCommand(matches[0]);
      }
    }
  };

  const themeStyles = {
    dark: { fg: '#FFFFFF', bg: '#000000', prompt: '#FFFFFF' },
    light: { fg: '#111111', bg: '#FAFAFA', prompt: '#111111' },
    hacker: { fg: '#00FF7F', bg: '#000000', prompt: '#00FF7F' },
  }[theme] || { fg: '#FFFFFF', bg: '#000000', prompt: '#FFFFFF' };

  return (
    <div 
      ref={terminalRef}
      className="p-4 font-mono text-sm h-screen overflow-auto border rounded-lg shadow-lg"
      style={{ color: themeStyles.fg, backgroundColor: themeStyles.bg, minHeight: '100vh', fontFamily: 'Courier New, monospace' }}
    >
      {output.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
      <form onSubmit={handleSubmit} className="flex">
        <span className="mr-2" style={{ color: themeStyles.prompt }}>$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none flex-grow border-none focus:ring-0"
          style={{ 
            color: themeStyles.fg,
            backgroundColor: 'transparent', 
            border: 'none', 
            boxShadow: 'none',
            outline: 'none', 
            caretColor: theme === 'hacker' ? '#00FF7F' : themeStyles.fg,
            fontFamily: 'Courier New, monospace' 
          }}
          autoFocus
        />
      </form>
    </div>
  );
}