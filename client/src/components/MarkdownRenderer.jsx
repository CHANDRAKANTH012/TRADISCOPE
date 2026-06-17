import React from "react";

/**
 * Lightweight markdown renderer for AI chat responses.
 * Handles: **bold**, *italic*, `code`, ### headers, - bullet lists, numbered lists, blank line paragraphs.
 * No external dependencies.
 */

const renderInline = (text) => {
  // Split on bold, italic, inline-code patterns
  const regex = /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*|`[^`]+`)/g;
  const tokens = text.split(regex);

  return tokens.map((token, i) => {
    if (token.startsWith("***") && token.endsWith("***")) {
      return (
        <strong key={i}>
          <em>{token.slice(3, -3)}</em>
        </strong>
      );
    }
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={i} className="font-semibold text-white">{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
      return <em key={i} className="italic text-gray-300">{token.slice(1, -1)}</em>;
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded text-xs font-mono bg-white/10 text-blue-300 border border-white/10"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    return token;
  });
};

const MarkdownRenderer = ({ content, className = "" }) => {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let i = 0;
  let bulletBuffer = [];

  const flushBullets = () => {
    if (bulletBuffer.length > 0) {
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1 my-2 pl-1">
          {bulletBuffer.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-300">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      bulletBuffer = [];
    }
  };

  let numberedBuffer = [];

  const flushNumbered = () => {
    if (numberedBuffer.length > 0) {
      elements.push(
        <ol key={`ol-${i}`} className="space-y-1 my-2 pl-1 list-none">
          {numberedBuffer.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-300">
              <span className="shrink-0 w-5 h-5 mt-0.5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-semibold text-white">
                {idx + 1}
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      numberedBuffer = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // H1
    if (/^# /.test(trimmed)) {
      flushBullets(); flushNumbered();
      elements.push(
        <h1 key={i} className="text-base font-bold text-white mt-3 mb-1">
          {renderInline(trimmed.slice(2))}
        </h1>
      );
    }
    // H2
    else if (/^## /.test(trimmed)) {
      flushBullets(); flushNumbered();
      elements.push(
        <h2 key={i} className="text-sm font-bold text-white mt-3 mb-1 border-b border-white/10 pb-1">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
    }
    // H3 / H4
    else if (/^#{3,} /.test(trimmed)) {
      flushBullets(); flushNumbered();
      const level = trimmed.match(/^(#+)/)[1].length;
      const text = trimmed.slice(level + 1);
      elements.push(
        <h3 key={i} className="text-sm font-semibold text-blue-300 mt-2.5 mb-0.5">
          {renderInline(text)}
        </h3>
      );
    }
    // Horizontal rule
    else if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      flushBullets(); flushNumbered();
      elements.push(<hr key={i} className="border-white/10 my-2" />);
    }
    // Bullet list: -, *, •
    else if (/^[-*•] /.test(trimmed)) {
      flushNumbered();
      bulletBuffer.push(trimmed.slice(2));
    }
    // Numbered list: 1. 2. etc.
    else if (/^\d+\. /.test(trimmed)) {
      flushBullets();
      numberedBuffer.push(trimmed.replace(/^\d+\. /, ""));
    }
    // Blockquote
    else if (/^> /.test(trimmed)) {
      flushBullets(); flushNumbered();
      elements.push(
        <blockquote key={i} className="border-l-2 border-blue-400 pl-3 text-gray-400 italic my-1.5">
          {renderInline(trimmed.slice(2))}
        </blockquote>
      );
    }
    // Empty line
    else if (trimmed === "") {
      flushBullets(); flushNumbered();
      // Only add spacing if there's content before and after
      if (elements.length > 0) {
        elements.push(<div key={`sp-${i}`} className="h-1.5" />);
      }
    }
    // Regular paragraph
    else {
      flushBullets(); flushNumbered();
      elements.push(
        <p key={i} className="text-gray-200 leading-relaxed">
          {renderInline(trimmed)}
        </p>
      );
    }

    i++;
  }

  // Flush any remaining lists
  flushBullets();
  flushNumbered();

  return <div className={`space-y-0.5 text-sm ${className}`}>{elements}</div>;
};

export default MarkdownRenderer;
