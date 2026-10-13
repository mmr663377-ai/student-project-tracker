# Student Project Tracker

A hands-on web app development workshop project. The application lets users add, display, edit, and delete projects. Project data is stored in a local SQLite database.

## Run locally

### Requirements
- Node.js 22.18 or later, but below 23, as specified by the workshop
- Git
- Visual Studio Code

### Installation and startup

Open a PowerShell terminal in the project root and run:

```powershell
npm.cmd ci
npm.cmd start
```

Open the application in your browser:

http://localhost:3000

To stop the server, press `Ctrl+C` in the terminal running it.

## How it works

The application follows this flow:

**Browser HTML/CSS/JavaScript → HTTP requests → Express API → SQLite database → JSON responses → Updated page**

### File structure

- `public/index.html` — page structure and project form.
- `public/style.css` — styling and responsive layout.
- `public/script.js` — form handling, API requests, rendering, and user feedback.
- `server.js` — starts the local server.
- `app.js` — API routes, validation, and responses.
- `database.js` — SQLite database operations and table setup.
- `data/projects.db` — local SQLite database created by the application.

## API endpoints

- `GET /api/health` — checks API health.
- `GET /api/projects` — lists projects.
- `POST /api/projects` — creates a project.
- `PUT /api/projects/:id` — updates a project.
- `DELETE /api/projects/:id` — deletes a project.

## Verification

Checks performed during development:

- Created and listed projects using the frontend and API.
- Edited project statuses and verified the updated records.
- Deleted a test project and checked the remaining records.
- Tested a save attempt while the server was stopped, then restarted the server and retried.
- Inspected SQLite records and API responses to verify saved project data.

Additional checks to complete if not already performed:

- Test the initial loading and empty states.
- Test feedback during a slow save and verify repeated clicks do not send extra requests.
- Test editing cancellation and cancelled deletion.
- Run `npm.cmd test` if `test/crud.test.js` is present.
- Test the layout on a mobile-sized screen.

The automated API test suite, if supplied, tests API behavior using a temporary database; it does not replace browser interaction tests.

## Workshop limitations

This is a local teaching application. It does not include sign-in or per-user permissions, so browsers using the same server share the same project collection.

The local SQLite database and `node_modules` are not uploaded to GitHub. A hosted deployment requires separate server and database configuration.