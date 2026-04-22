import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Terminal } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeViewer({ code, language = 'javascript', filename }: CodeViewerProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-mono text-zinc-400">{filename || `main.${language}`}</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-emerald-400 transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy
        </button>
      </div>
      <div className="max-h-[600px] overflow-auto custom-scrollbar">
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            fontSize: '0.875rem',
            background: 'transparent',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            style: { fontFamily: '"JetBrains Mono", monospace' }
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
