# Task Management App

A modern Task Management (To-Do List) application built as a front-end technical test. Features a polished dark glassmorphism UI with full CRUD operations, real-time filter, form validation, and comprehensive unit tests.

![Task Manager Preview](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-ff4154?logo=reactquery&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-green?logo=vitest&logoColor=white)

---

## Features

| Feature | Description |
|---|---|
| **View Tasks** | Loads 20 real tasks from JSONPlaceholder API on start |
| **Add Task** | Form with real-time Zod validation (min 3, max 100 chars) |
| **Toggle Status** | Mark tasks as Done / Undone with optimistic UI update |
| **Delete Task** | Remove tasks instantly with optimistic UI |
| **Filter** | Switch between All / Pending / Completed with live counts |
| **Loading State** | Animated spinner shown while fetching |
| **Error State** | Error message with retry button when API fails |
| **Empty State** | Context-aware empty messages per filter |
| **Responsive** | Mobile-first design, works on all screen sizes |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation & Run

```bash
# Clone the repository
git clone <your-repo-url>
cd task-management-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Production build (TypeScript check + Vite build)
npm run preview       # Preview production build locally
npm run test          # Run unit tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run lint          # Lint source code
```

---

## API Endpoints

This app uses **[JSONPlaceholder](https://jsonplaceholder.typicode.com)** as a mock REST API.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/todos?_limit=20` | Fetch initial 20 tasks |
| `POST` | `/todos` | Create a new task (mocked) |
| `PATCH` | `/todos/:id` | Toggle task completion (mocked) |
| `DELETE` | `/todos/:id` | Delete a task (mocked) |

> **Note:** JSONPlaceholder is a read-only fake API — POST, PATCH, and DELETE calls return valid responses but do not persist data on the server. The app handles this with **optimistic local state**: mutations are applied immediately in the UI without waiting for the server, giving a seamless experience.

---

## Architecture

### Project Structure

```
src/
├── types/
│   └── task.ts              # TypeScript interfaces (Task, FilterType, etc.)
├── schemas/
│   └── taskSchema.ts        # Zod validation schema for the task form
├── services/
│   └── taskService.ts       # API layer — all fetch calls to JSONPlaceholder
├── hooks/
│   ├── useTasks.ts          # Main data hook (TanStack Query + optimistic state)
│   └── useTaskFilter.ts     # Filter state + memoized filtered task list
├── utils/
│   ├── filterTasks.ts       # Pure filter functions
│   └── filterTasks.test.ts  # Unit tests
├── components/
│   ├── ui/
│   │   ├── Button.tsx        # Reusable button (primary/ghost/danger/icon)
│   │   ├── Spinner.tsx       # Loading spinner
│   │   └── EmptyState.tsx    # Context-aware empty state
│   ├── TaskForm/
│   │   ├── TaskForm.tsx      # Add task form (react-hook-form + Zod)
│   │   └── TaskForm.test.tsx # Unit tests
│   ├── TaskFilter/
│   │   └── TaskFilter.tsx    # All / Pending / Completed filter tabs
│   ├── TaskItem/
│   │   ├── TaskItem.tsx      # Single task row (checkbox + delete)
│   │   └── TaskItem.test.tsx # Unit tests
│   └── TaskList/
│       └── TaskList.tsx      # List container (loading/error/empty/tasks)
├── test/
│   └── setup.ts             # Vitest + @testing-library/jest-dom setup
├── App.tsx                  # Root component — composes all pieces
├── main.tsx                 # React entry point with QueryClientProvider
└── index.css                # Full design system (CSS custom properties)
```

### Architectural Decisions

#### State Management

Server state is managed by **TanStack Query** — handles caching, deduplication, background refetch, and error/loading states automatically.

Client mutations (add/toggle/delete) use **optimistic UI**: the UI updates instantly before the API call resolves. On error, the state is rolled back.

Three separate state slices in `useTasks`:
- `localNew` — tasks added by the user (not yet confirmed by server)
- `localOverrides` — toggled tasks (server version overridden locally)
- `deletedIds` — IDs of deleted tasks (excluded from render)

#### Layered Architecture

```
Components → Hooks → Services → API
```

Each layer has a single responsibility. Components never call `fetch()` directly — they use hooks, which use services.

#### Validation

**Zod** schemas define validation rules once and are shared between the form resolver and runtime type checking. `react-hook-form` + `@hookform/resolvers/zod` provides performant, accessible form state.

#### Styling

Vanilla CSS with **CSS custom properties** as a design token system. No CSS-in-JS or utility framework — easy to audit, fast at runtime.

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 8 | Build tool & dev server |
| TanStack Query | 5 | Server state management |
| react-hook-form | 7 | Form state management |
| Zod | 4 | Schema validation |
| Vitest | 4 | Unit testing |
| React Testing Library | 16 | Component testing |

---

## Testing

```bash
npm run test
```

Tests cover:
- `filterTasks` utility — all filter modes, edge cases, empty arrays
- `TaskForm` — rendering, validation errors, successful submit, loading state
- `TaskItem` — rendering, checkbox state, toggle callback args, delete callback

---

*Built with React + TypeScript + TanStack Query as a Front-End Developer technical test*
