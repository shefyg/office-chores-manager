# Office Chores Manager

A full-stack web application for managing team chores with calendar views, recurring schedules, and completion tracking.

## Tech Stack

**Frontend:** React 18, React Router 6, Vite 5, Tailwind CSS 3
**Backend:** Node.js (ES Modules), Express 4
**Storage:** JSON files (no database)

## Project Structure

```
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Calendar/      # CalendarView, MonthView, WeekView, DayCell
│   │   │   ├── Chores/        # ChoreForm, ChoreDetails, ChoreCard
│   │   │   ├── Team/          # TeamList, MemberForm
│   │   │   ├── History/       # HistoryView
│   │   │   └── common/        # Modal, Button
│   │   ├── services/api.js    # API client layer
│   │   ├── utils/             # dateUtils.js, recurrence.js
│   │   └── App.jsx            # Root with routing
│   └── vite.config.js         # Dev server proxies /api to :3001
│
└── server/                    # Express backend
    ├── index.js               # Server entry, port 3001
    ├── routes/                # chores.js, team.js, history.js
    ├── services/              # Business logic layer
    │   ├── choreService.js    # Chore CRUD + completion
    │   ├── teamService.js     # Team member CRUD
    │   ├── historyService.js  # History queries
    │   └── storage.js         # JSON file I/O abstraction
    └── data/                  # JSON data files
        ├── chores.json
        ├── team.json
        └── history.json
```

## Build & Run

**Client** (from `client/`):
```bash
npm run dev      # Dev server at http://localhost:5173
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

**Server** (from `server/`):
```bash
npm run dev      # Watch mode (node --watch)
npm run start    # Production mode
```

Server runs on port 3001 (or PORT env var). Health check: `GET /api/health`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/chores | List all chores |
| GET | /api/chores/:id | Get chore by ID |
| POST | /api/chores | Create chore (requires: title, dueDate) |
| PUT | /api/chores/:id | Update chore |
| DELETE | /api/chores/:id | Delete chore |
| POST | /api/chores/:id/complete | Mark complete, creates history entry |
| GET | /api/team | List team members |
| POST | /api/team | Create member (requires: name) |
| PUT | /api/team/:id | Update member |
| DELETE | /api/team/:id | Delete member (unassigns their chores) |
| GET | /api/history | Get completion history |

## Data Models

**Chore:** id, title, description, assigneeId, priority (low/medium/high), notes, status (pending/completed), dueDate, recurrence (type: daily/weekly/monthly, daysOfWeek), createdAt, updatedAt

**Team Member:** id, name, email, color (hex), createdAt

**History Entry:** id, choreId, choreTitle, completedBy, completedByName, completedAt, notes

## Key Implementation Notes

- Recurring chores stored as single record, expanded to occurrences at render time (`client/src/utils/recurrence.js:3`)
- All file I/O through storage abstraction (`server/services/storage.js:8`)
- Container components manage state, presentational components render (`client/src/components/Calendar/CalendarView.jsx:9`)
- API client centralizes all fetch calls (`client/src/services/api.js:3`)

## Additional Documentation

- `.claude/docs/architectural_patterns.md` - Design patterns, conventions, and architectural decisions
