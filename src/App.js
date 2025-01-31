import React, { useState, useRef, useEffect } from 'react';

export default function TerminalPortfolio() {
  const [output, setOutput] = useState([
    "Welcome to Irene's Portfolio! Type 'help' to see available commands.",
    "\n",
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const commands = {
    help: [
      "Available commands:",
      "- about: Learn about Irene",
      "- projects: View project portfolio",
      "- skills: See technical skills",
      "- contact: Get contact information",
      "- clear: Clear the terminal"
    ],
    about: [
      "Irene Rivero Casal",
      "Role: System Administrator / DevOps Engineer",
      "Passionate about Linux, automation, and infrastructure."
    ],
    projects: [
      "1. Webserv - HTTP server in C++",
      "2. Minishell - Custom shell in C",
      "3. Inception - Docker & Virtualization setup",
      "Want to know more? Visit github.com/irrivero"
    ],
    skills: [
      "Technical Skills:",
      "- Linux",
      "- Docker",
      "- Bash",
      "- Networking",
      "- MariaDB",
      "- Nginx"
    ],
    contact: [
      "Contact Information:",
      "Email: irene.rivero.casal@gmail.com",
      "GitHub: github.com/irrivero"
    ],
    ascii: [
      "       (|_|)",
      "       (o.o)  <-- A little bunny hacker!", 
      "       (> <)"
    ]
  };

  const commandAliases = {
    ls: "projects",
    whoami: "about",
    info: "about",
    portfolio: "projects"
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [output]);

  const printWithTypingEffect = (lines, index = 0) => {
    if (index < lines.length) {
      setTimeout(() => {
        setOutput(prev => [...prev, lines[index]]);
        printWithTypingEffect(lines, index + 1);
      }, 50);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedCommand = currentCommand.trim().toLowerCase();
    const resolvedCommand = commandAliases[trimmedCommand] || trimmedCommand;
    const newOutput = [...output, `$ ${currentCommand}`];

    if (resolvedCommand === "clear") {
      setOutput(["Welcome to Irene's Portfolio! Type 'help' to see available commands."]);
    } else if (commands[resolvedCommand]) {
      setOutput(newOutput);
      printWithTypingEffect(commands[resolvedCommand]);
    } else {
      setOutput([...newOutput, `Command not found: ${trimmedCommand}`]);
    }

    if (trimmedCommand) {
      setCommandHistory(prev => [...prev, trimmedCommand]);
    }

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
      const matches = Object.keys(commands).filter(cmd => cmd.startsWith(currentCommand));
      if (matches.length === 1) {
        setCurrentCommand(matches[0]);
      }
    }
  };

  return (
    <div 
      ref={terminalRef}
      className="bg-black text-white-400 p-4 font-mono text-sm h-screen overflow-auto border border-white-500 rounded-lg shadow-lg"
      style={{ color: '#FFFFFF', backgroundColor: '#000', minHeight: '100vh', fontFamily: 'Courier New, monospace' }}
    >
      {output.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
      <form onSubmit={handleSubmit} className="flex">
        <span className="mr-2" style={{ color: '#FFFFFF' }}>$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent text-green-400 outline-none flex-grow caret-transparent border-none focus:ring-0"
          style={{ 
            color: '#FFFFFF', 
            backgroundColor: 'transparent', 
            border: 'none', 
            boxShadow: 'none',
            outline: 'none', 
            caretColor: 'transparent',
            fontFamily: 'Courier New, monospace' 
            
          }}
          autoFocus
        />
      </form>
    </div>
  );
}