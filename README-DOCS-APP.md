# Documentation host

A minimal app that serves the Markdown in `docs/` (this folder’s Markdown as a simple doc site.

## Run

```bash
npm install
npm start
```

Open **http://localhost:3333**. Use the sidebar to open pages; internal `.md` links work inside the app.

**Restarted the server or changed `server.js`?** Stop the running server (Ctrl+C), run `npm start` again, then hard-refresh the browser (Cmd+Shift+R / Ctrl+Shift+R) so the new tree and routes load.

## What’s included

- **Server** (`server.js`) – Express app that:
  - Serves the static UI from `public/`
  - Exposes `GET /api/tree` (list of doc paths)
  - Exposes `GET /api/doc?path=...` (Markdown rendered to HTML)
- **Frontend** (`public/index.html`) – Single-page UI with:
  - Sidebar built from the doc tree
  - Main area that loads and renders the selected doc
  - Link rewriting so relative doc links stay in-app

No build step. To change the port, set `PORT` (e.g. `PORT=4000 npm start`).
