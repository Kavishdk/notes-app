import React, { useState, useEffect, useCallback } from 'react';
import { NotesList } from './components/NotesList';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { AuthPage } from './components/AuthPage';
import { ThemeToggle } from './components/ThemeToggle';
import { Note, User, AuthResponse, getNotes, createNote, updateNote, deleteNote } from './api';
import { FileText, LogOut } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadNotes = useCallback(async (search?: string) => {
    try {
      setIsLoading(true);
      const fetchedNotes = await getNotes(search);
      setNotes(fetchedNotes);
      if (fetchedNotes.length > 0 && !selectedNoteId) {
        setSelectedNoteId(fetchedNotes[0].id);
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedNoteId]);

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  // Search effect with debounce
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      loadNotes(searchTerm || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleAuthSuccess = (data: AuthResponse) => {
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setNotes([]);
    setSelectedNoteId(null);
    setSearchTerm('');
  };

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({ title: 'New Note', content: '' });
      setNotes([newNote, ...notes]);
      setSelectedNoteId(newNote.id);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleUpdateNote = async (id: number, title: string, content: string) => {
    try {
      const updatedNote = await updateNote(id, { title, content });
      setNotes(currentNotes => currentNotes.map(note => note.id === id ? updatedNote : note));
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleLocalChange = (title: string, content: string) => {
    if (selectedNoteId) {
      setNotes(currentNotes => currentNotes.map(note => 
        note.id === selectedNoteId ? { ...note, title, content } : note
      ));
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await deleteNote(id);
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      if (selectedNoteId === id) {
        setSelectedNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  // Not logged in → show auth page
  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Loading notes...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="flex flex-col w-72 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">My Notes</h2>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={`Logout (${user.username})`}
            >
              <LogOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <NotesList
          notes={notes}
          selectedNoteId={selectedNoteId}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSelectNote={setSelectedNoteId}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>
      
      {selectedNote ? (
        <div className="flex-1 flex">
          <Editor 
            note={selectedNote} 
            onChange={handleLocalChange}
            onSave={handleUpdateNote} 
          />
          <Preview content={selectedNote.content} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900">
          <FileText className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg">Select a note or create a new one</p>
        </div>
      )}
    </div>
  );
}
