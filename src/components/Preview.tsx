import React from 'react';
import Markdown from 'react-markdown';

interface PreviewProps {
  content: string;
}

export const Preview: React.FC<PreviewProps> = ({ content }) => {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-white dark:bg-gray-900 p-6">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        {content ? (
          <Markdown>{content}</Markdown>
        ) : (
          <div className="text-gray-400 dark:text-gray-500 italic mt-4">Preview will appear here...</div>
        )}
      </div>
    </div>
  );
};
