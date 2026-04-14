# 📝 Markdown Notes Application

A high-performance, full-stack Markdown notes application built with **React**, **Node.js (Express)**, and **SQLite**. This project was developed as part of an SDE Fresher Assignment, focusing on engineering fundamentals, clean code, and a premium user experience.

---

## 🚀 Features

### **Core Functionality**
- **Full CRUD Management**: Create, edit, list, and delete notes with ease.
- **Rich Markdown Support**: Full rendering for headings, bold/italic, lists, code blocks, and hyperlinks using `react-markdown`.
- **Live Split-Screen Preview**: Real-time rendering as you type, providing an instant feedback loop for your formatting.
- **SQL Persistence**: All data is stored in a robust SQLite database, ensuring your notes are safe and structured.

### **Bonus Features (Engineered for Impact)**
- **🔐 JWT Authentication**: Secure user accounts with hashed passwords (Bcrypt) and JSON Web Tokens. Your notes are private and scoped to your account.
- **🌗 Dark Mode**: A sleek, system-aware dark theme toggle with persistence across sessions.
- **🔍 Full-Text Search**: Instantly find notes by searching through both titles and content using high-performance SQL queries.
- **⚡ Performance Optimized**: 
  - **Debounced Auto-save**: Saves changes 800ms after you stop typing to minimize API overhead while ensuring data safety.
  - **Type-Safe Inputs**: Resolved common React stale-closure bugs to ensure a perfectly smooth typing experience.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 (TypeScript), Tailwind CSS 4, Lucide Icons, Axios.
- **Backend**: Node.js, Express, JWT (json-webtoken), Bcrypt.js.
- **Database**: SQLite3 (SQL) for reliable, local-first storage.

---

## 📦 Installation & Setup

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or yarn

### **Step 1: Clone the Repository**
```bash
git clone <your-repo-url>
cd markdown-notes-app
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Environment Configuration**
Create a `.env` file in the root directory (optional but recommended for production):
```env
JWT_SECRET=your_super_secret_key
PORT=3000
```

### **Step 4: Run the Application**
```bash
npm run dev
```
The app will initialize the database automatically and start the server at `http://localhost:3000`.

---

## 🌐 Deployment

This project is configured for easy deployment on platforms like **Render**, **Railway**, or **Vercel**. For this full-stack setup, **Render** or **Railway** is recommended.

### **Option 1: Render (Recommended)**
1. **Connect your GitHub Repo**: Create a new "Web Service" on [Render](https://render.com).
2. **Environment**: Select `Node`.
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. **Environment Variables**: Add the following:
   - `JWT_SECRET`: (Anything secure)
   - `NODE_ENV`: `production`

### **Option 2: Railway**
1. **New Project**: Connect your GitHub repository.
2. **Auto-detect**: Railway will detect the `package.json` and start the server.
3. **Environment Variables**: Add `JWT_SECRET` in the "Variables" tab.

> [!TIP]
> **Persistent Data**: Since SQLite uses a local file, data will be reset on every deployment (ephemeral storage). For a production app, you would typically connect to a managed SQL database like PostgreSQL, but for this assignment, SQLite-per-deploy is perfectly acceptable!

---

## 🏗️ Project Structure

```text
├── backend/
│   ├── controllers/    # API Business logic (Auth, Notes)
│   ├── middleware/     # JWT Authentication guards
│   ├── routes/         # Express route definitions
│   └── db.ts           # SQLite initialization & migrations
├── src/
│   ├── components/     # Modular React components (Editor, Preview, Auth)
│   ├── api.ts          # Axios configuration & JWT interceptors
│   ├── App.tsx         # Root application logic & state
│   └── index.css       # Tailwind 4 styling & Dark Mode variants
├── server.ts           # Entry point (Unified Express + Vite server)
└── database.sqlite     # Local SQL Database (Auto-generated)
```

---

## 🧠 Engineering Decisions & Trade-offs

1. **Unified Server**: I chose to run Express and Vite through a single entry point (`server.ts`). This simplifies deployment and avoids CORS issues during development.
2. **Debounced Persistence**: Instead of a "Save" button, I implemented a debounced auto-save. This improves UX but requires careful handling of "stale closures" in React, which I solved using local state synchronized with `refs`.
3. **SQLite**: Chosen for its zero-config nature, making the project "clone and run" ready without requiring a global database installation (like PostgreSQL).
4. **JWT Security**: Tokens are stored in `localStorage` for persistence, and an Axios interceptor handles the `Authorization: Bearer <token>` header automatically for every request.

---

## 👨‍💻 Author
Developed by [Your Name] for the SDE Fresher Assignment.
Launched with ❤️ and clean code.
