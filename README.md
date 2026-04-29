# Procurement Management System (Frontend)

Welcome to the frontend application for our procurement workflow platform.

This app helps teams manage project procurement from intake to assignment, tracking, and completion.
In business terms, it gives teams one place to:

- See incoming and assigned procurement work
- Track project status and ownership
- Support role-based workflows (who can do what)
- Reduce manual follow-up through structured dashboards and tables

If you are new to the project, this guide gets you running quickly. We are happy you are here.

## Prerequisites

Please install these first:

- Node.js 20 or newer (recommended: latest LTS)
- npm 10 or newer
- Git

Optional but recommended:

- VS Code with TypeScript and ESLint extensions

## Quick Start (Step by Step)

1. Move into the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create your local environment file:

```bash
copy .env.example .env
```

4. Start the development server:

```bash
npm run dev
```

5. Open the app in your browser.
   Vite usually serves at `http://localhost:5173`.

## Useful Scripts

- Start dev server

```bash
npm run dev
```

- Build for production

```bash
npm run build
```

- Preview production build

```bash
npm run preview
```

- Format code (formats `src` only)

```bash
npm run format
```

- Run lint rules

```bash
npm run lint
```

## Environment Variables

Current variables used by this frontend:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Notes:

- Keep `VITE_API_BASE_URL` aligned with your backend server.

## Documentation Directory

- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Development Guide](./docs/DEVELOPMENT_GUIDE.md)
- [Project Structure Guide](./docs/PROJECT_STRUCTURE.md)
- [Component Structure Guide](./docs/COMPONENT_STRUCTURE.md)
- [Tech Stack Notes](./docs/tech-stack.md)
