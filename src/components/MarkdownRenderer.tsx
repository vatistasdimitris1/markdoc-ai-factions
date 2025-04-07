
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-full dark:prose-invert">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vs}
                language={match[1]}
                PreTag="div"
                className="rounded-md border my-4"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={`bg-muted px-1 py-0.5 rounded text-sm ${className}`} {...props}>
                {children}
              </code>
            );
          },
          pre({ children }) {
            return <div className="not-prose">{children}</div>;
          },
          img({ node, ...props }) {
            return (
              <img
                className="max-w-full h-auto rounded-md my-2"
                {...props}
                alt={props.alt || "Image"}
              />
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
