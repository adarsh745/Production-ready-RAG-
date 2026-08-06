import React from 'react';
import Avatar from '../common/Avatar';
import { useChat } from '../../hooks/useChat';
import { formatTime } from '../../utils/helpers';
import { FileText, ExternalLink, Library } from 'lucide-react';
import TypingIndicator from './TypingIndicator';

export const AssistantMessage = ({ message }) => {
  const { content, timestamp, sources } = message;
  const { setSelectedSource, openPdfViewer } = useChat();

  // Simple Markdown & Citation parser
  const renderFormattedContent = (text) => {
    if (!text) return null;

    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const codeLines = part.slice(3, -3).trim().split('\n');
        const language = codeLines[0] && !codeLines[0].startsWith(' ') ? codeLines[0] : 'code';
        const codeContent = codeLines.slice(language === 'code' ? 0 : 1).join('\n');

        return (
          <div key={index} className="my-3 font-mono text-xs rounded-xl overflow-hidden border border-border-app shadow-lg">
            <div className="bg-sidebar-app px-4 py-1.5 border-b border-border-app flex items-center justify-between text-[10px] text-muted-app font-bold select-none uppercase tracking-wider">
              <span>{language}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(codeContent)}
                className="hover:text-text-app transition-colors cursor-pointer"
              >
                Copy
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-left bg-bg-app/60 text-text-app/80 selection:bg-primary-app/20 leading-relaxed">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      let formattedText = part;
      const lines = formattedText.split('\n');
      
      return lines.map((line, lIndex) => {
        let isBullet = false;
        let lineContent = line;

        if (line.startsWith('* ') || line.startsWith('- ')) {
          isBullet = true;
          lineContent = line.substring(2);
        } else if (line.match(/^\d+\.\s/)) {
          isBullet = true;
        }

        const parseInlineElements = (str) => {
          const tokenRegex = /(\*\*.*?\*\*|`.*?`|\[\d+(?:,\s*\d+)*\])/g;
          const tokens = str.split(tokenRegex);

          return tokens.map((token, tIdx) => {
            if (token.startsWith('**') && token.endsWith('**')) {
              return <strong key={tIdx} className="font-bold text-text-app dark:text-white">{token.slice(2, -2)}</strong>;
            }
            if (token.startsWith('`') && token.endsWith('`')) {
              return <code key={tIdx} className="px-1.5 py-0.5 rounded bg-border-app text-accent-app font-mono text-[11px]">{token.slice(1, -1)}</code>;
            }
            if (token.startsWith('[') && token.endsWith(']')) {
              const citationsStr = token.slice(1, -1);
              const citations = citationsStr.split(',').map(n => parseInt(n.trim(), 10));

              return (
                <span key={tIdx} className="inline-flex gap-0.5 mx-0.5 select-none">
                  {citations.map((num, nIdx) => {
                    const sourceDoc = sources?.[num - 1];
                    return (
                      <button
                        key={nIdx}
                        type="button"
                        onClick={() => {
                          if (sourceDoc) {
                            setSelectedSource(sourceDoc);
                            if (openPdfViewer) openPdfViewer(sourceDoc);
                          }
                        }}
                        className="inline-flex items-center justify-center w-4.5 h-4.5 rounded-md bg-primary-app/15 border border-primary-app/20 text-[9px] font-bold text-primary-app hover:bg-primary-app/25 hover:border-primary-app/40 hover:text-white transition-all shadow-[0_0_8px_rgba(124,58,237,0.1)] cursor-pointer"
                        title={sourceDoc ? `Open PDF Viewer: ${sourceDoc.filename || sourceDoc.title} (Page ${sourceDoc.page || 1})` : 'Open PDF Source'}
                      >
                        {num}
                      </button>
                    );
                  })}
                </span>
              );
            }
            return token;
          });
        };

        const processedLine = parseInlineElements(lineContent);

        if (isBullet) {
          return (
            <li key={lIndex} className="ml-5 list-disc list-outside text-sm text-text-app/90 leading-relaxed mb-1.5">
              {processedLine}
            </li>
          );
        }

        return (
          <p key={lIndex} className="text-sm text-text-app/95 leading-relaxed mb-2.5 min-h-[1em]">
            {processedLine}
          </p>
        );
      });
    });
  };

  return (
    <div className="flex items-start gap-3.5 max-w-3xl mr-auto w-full group select-none">
      {/* Brand Avatar */}
      <Avatar role="assistant" size="sm" className="mt-5" />

      {/* Reply Container */}
      <div className="flex flex-col gap-1.5 max-w-[85%]">
        
        {/* Header Metadata */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] font-semibold text-text-app">Assistant</span>
          <span className="text-[10px] text-muted-app/60">
            {formatTime(timestamp)}
          </span>
        </div>

        {/* Content Bubble */}
        <div className="px-4 py-3 rounded-2xl bg-card-app/60 border border-border-app text-left select-text shadow-sm selection:bg-primary-app/30">
          {!content ? (
            <div className="flex items-center gap-2.5 text-muted-app text-xs py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-app opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-app"></span>
              </span>
              <span className="text-xs text-text-app/80 font-mono animate-pulse">
                Searching vector database & generating answer...
              </span>
            </div>
          ) : (
            renderFormattedContent(content)
          )}

          {/* Sources Quick Grid at bottom of response */}
          {sources && sources.length > 0 && (
            <div className="mt-4 pt-3.5 border-t border-border-app space-y-2">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-app uppercase tracking-wider select-none">
                <Library size={10} className="text-primary-app" />
                <span>Reference Sources ({sources.length}) • Click to Open PDF Viewer</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 select-none">
                {sources.map((src, index) => (
                  <div
                    key={src.document_id || index}
                    onClick={() => {
                      setSelectedSource(src);
                      if (openPdfViewer) openPdfViewer(src);
                    }}
                    className="flex items-center justify-between p-2 rounded-xl bg-card-app border border-border-app hover:border-primary-app/40 transition-all duration-300 cursor-pointer shadow-sm group/card"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="p-1.5 rounded-lg bg-bg-app border border-border-app text-muted-app">
                        <FileText size={11} className="text-primary-app" />
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-[10px] font-semibold text-text-app truncate group-hover/card:text-primary-app transition-colors">
                          {src.filename || src.title || `Source ${index + 1}`}
                        </span>
                        <span className="text-[8px] text-muted-app">
                          Page {src.page || 1} • Chunk {src.chunk_id || (index + 1)}
                        </span>
                      </div>
                    </div>
                    <ExternalLink size={10} className="text-muted-app/60 group-hover/card:text-primary-app shrink-0 ml-1 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AssistantMessage;
