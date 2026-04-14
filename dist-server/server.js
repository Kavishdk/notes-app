import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import authRoutes from './backend/routes/authRoutes';
import notesRoutes from './backend/routes/notesRoutes';
import { authMiddleware } from './backend/middleware/authMiddleware';
import { initDb } from './backend/db';
async function startServer() {
    const app = express();
    const PORT = process.env.PORT || 3000;
    // Middleware
    app.use(cors());
    app.use(express.json());
    // Initialize Database
    await initDb();
    // Public Routes
    app.use('/api/auth', authRoutes);
    // Protected Routes
    app.use('/api/notes', authMiddleware, notesRoutes);
    // Vite middleware for development
    if (process.env.NODE_ENV !== 'production') {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });
        app.use(vite.middlewares);
    }
    else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
