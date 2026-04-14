import { getDb } from '../db';
export const getNotes = async (req, res) => {
    try {
        const db = getDb();
        const searchTerm = req.query.search;
        let notes;
        if (searchTerm && searchTerm.trim()) {
            const like = `%${searchTerm.trim()}%`;
            notes = await db.all('SELECT * FROM notes WHERE user_id = ? AND (title LIKE ? OR content LIKE ?) ORDER BY updated_at DESC', [req.userId, like, like]);
        }
        else {
            notes = await db.all('SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC', [req.userId]);
        }
        res.status(200).json(notes);
    }
    catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
};
export const getNoteById = async (req, res) => {
    try {
        const db = getDb();
        const note = await db.get('SELECT * FROM notes WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
        if (!note) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        res.status(200).json(note);
    }
    catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ error: 'Failed to fetch note' });
    }
};
export const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || content === undefined) {
            res.status(400).json({ error: 'Title and content are required' });
            return;
        }
        const db = getDb();
        const result = await db.run('INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)', [title, content, req.userId]);
        const newNote = await db.get('SELECT * FROM notes WHERE id = ?', [result.lastID]);
        res.status(201).json(newNote);
    }
    catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Failed to create note' });
    }
};
export const updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || content === undefined) {
            res.status(400).json({ error: 'Title and content are required' });
            return;
        }
        const db = getDb();
        const result = await db.run('UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?', [title, content, req.params.id, req.userId]);
        if (result.changes === 0) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        const updatedNote = await db.get('SELECT * FROM notes WHERE id = ?', [req.params.id]);
        res.status(200).json(updatedNote);
    }
    catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Failed to update note' });
    }
};
export const deleteNote = async (req, res) => {
    try {
        const db = getDb();
        const result = await db.run('DELETE FROM notes WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
        if (result.changes === 0) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        res.status(200).json({ message: 'Note deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
};
