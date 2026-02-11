# Architectural Patterns

## Service Layer Pattern (Backend)

Business logic is separated from HTTP handling through a service layer.

**Structure:**
```
Routes (HTTP) -> Services (Logic) -> Storage (Persistence)
```

**Examples:**
- `server/routes/chores.js:7-15` - Route delegates to service
- `server/services/choreService.js:16-34` - Service handles business logic
- `server/services/storage.js:8-24` - Storage abstracts file I/O

**Convention:** Routes only handle HTTP concerns (parsing params, validation, status codes). Services handle all business logic and data manipulation.

## Repository/Storage Abstraction

All file I/O goes through a single storage module that abstracts the persistence layer.

**Implementation:** `server/services/storage.js:8-24`
- `readData(filename)` - Returns parsed JSON or empty array if file missing
- `writeData(filename, data)` - Writes formatted JSON to file

**Usage:** All services import from storage.js rather than using fs directly.

## RESTful API Design

Standard REST conventions with consistent response patterns.

**Endpoints Pattern:**
```
GET    /api/{resource}      - List all
GET    /api/{resource}/:id  - Get one
POST   /api/{resource}      - Create
PUT    /api/{resource}/:id  - Update
DELETE /api/{resource}/:id  - Delete
```

**Error Responses:** Consistent HTTP status codes:
- 400 for validation errors (`server/routes/chores.js:36-41`)
- 404 for not found (`server/routes/chores.js:22-24`)
- 500 for server errors (`server/routes/chores.js:11-14`)

## Container/Presentational Components (Frontend)

Components are organized by responsibility.

**Container Components** (manage state, data fetching):
- `client/src/components/Calendar/CalendarView.jsx:9-192` - Manages calendar state
- `client/src/components/Team/TeamList.jsx` - Manages team state

**Presentational Components** (display only):
- `client/src/components/Chores/ChoreCard.jsx` - Renders chore card
- `client/src/components/Calendar/DayCell.jsx` - Renders single day
- `client/src/components/common/Modal.jsx` - Reusable modal wrapper

**Pattern:** Container components fetch data via `useEffect`, store in `useState`, pass to children as props.

## API Client Service Layer (Frontend)

All API calls go through a centralized service module.

**Implementation:** `client/src/services/api.js:3-17`
- Single `request()` wrapper handles headers, error checking, JSON parsing
- Exported functions grouped by resource (team, chores, history)

**Example:**
```javascript
// Components use:
import { fetchChores, createChore } from '../../services/api';

// Never:
fetch('/api/chores', {...})
```

## State Management with Hooks

Local state management using React hooks, no global state library.

**Pattern:** `client/src/components/Calendar/CalendarView.jsx:10-16`
- `useState` for component state (view, currentDate, chores, team)
- `useEffect` for data fetching on mount (`CalendarView.jsx:27-29`)
- Parent callbacks refresh data after mutations (`CalendarView.jsx:73-81`)

**Data Flow:**
```
useEffect -> fetchData -> setState -> render
user action -> apiCall -> parent.loadData() -> re-render
```

## Utility Functions

Pure functions extracted to utility modules for reuse.

**Date Utilities:** `client/src/utils/dateUtils.js`
- Calendar generation (`getMonthDays`, `getWeekDays`)
- Date manipulation (`addDays`, `addMonths`)
- Date comparison (`isSameDay`)

**Recurrence Engine:** `client/src/utils/recurrence.js:3-94`
- `expandRecurrence(chore, startDate, endDate)` - Expands recurring chores to date occurrences
- Supports daily, weekly (with specific days), monthly
- Safety limit of 400 iterations (`recurrence.js:61`)

## Modal Pattern

Consistent modal behavior across the application.

**Implementation:** `client/src/components/common/Modal.jsx`
- Escape key closes modal
- Backdrop click closes modal
- Fixed positioning with backdrop overlay

**Usage:**
```jsx
{showModal && (
  <Modal onClose={handleClose}>
    <ContentComponent />
  </Modal>
)}
```

## Data Cascade on Deletion

Related data is updated when entities are deleted.

**Example:** Deleting a team member unassigns their chores
- `server/services/teamService.js` - On member delete, updates all chores with that assigneeId

## UUID-Based Identification

All entities use UUID v4 for unique identification.

**Implementation:** `server/services/choreService.js:1,19`
```javascript
import { v4 as uuidv4 } from 'uuid';
id: uuidv4(),
```

## Timestamp Tracking

All entities track creation and modification times.

**Fields:**
- `createdAt` - Set on creation (ISO8601)
- `updatedAt` - Updated on every modification

**Example:** `server/services/choreService.js:28-29,52`
