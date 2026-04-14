import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Note } from '../api';
import debounce from 'lodash/debounce';

interface EditorProps {
  note: Note;
  onChange: (title: string, content: string) => void;
  onSave: (id: number, title: string, content: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ note, onChange, onSave }) => {
  const [localTitle, setLocalTitle] = useState(note.title);
  const [localContent, setLocalContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);

  // Refs to hold the latest values for the debounced function
  const latestRef = useRef({ title: note.title, content: note.content });

  // Sync local state when a different note is selected
  useEffect(() => {
    setLocalTitle(note.title);
    setLocalContent(note.content);
    latestRef.current = { title: note.title, content: note.content };
  }, [note.id]);

  // Stable debounced save — reads from ref so it always has fresh values
  const debouncedSave = useMemo(
    () =>
      debounce((id: number) => {
        const { title, content } = latestRef.current;
        onSave(id, title, content);
        setIsSaving(false);
      }, 800),
    [onSave]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    latestRef.current.title = newTitle;
    onChange(newTitle, latestRef.current.content);
    setIsSaving(true);
    debouncedSave(note.id);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    latestRef.current.content = newContent;
    onChange(latestRef.current.title, newContent);
    setIsSaving(true);
    debouncedSave(note.id);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <input
          type="text"
          value={localTitle}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className="text-xl font-semibold text-gray-800 dark:text-gray-100 bg-transparent border-none focus:outline-none focus:ring-0 w-full placeholder-gray-400 dark:placeholder-gray-500"
        />
        <div className="text-xs text-gray-400 dark:text-gray-500 ml-4 whitespace-nowrap">
          {isSaving ? 'Saving...' : 'Saved'}
        </div>
      </div>
      <div className="flex-1 p-4">
        <textarea
          value={localContent}
          onChange={handleContentChange}
          placeholder="Write your markdown here..."
          className="w-full h-full resize-none bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 dark:text-gray-300 font-mono text-sm placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>
    </div>
  );
};
