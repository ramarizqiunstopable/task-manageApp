import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTasks } from './hooks/useTasks'
import { useTaskFilter } from './hooks/useTaskFilter'
import { TaskForm } from './components/TaskForm/TaskForm'
import { TaskFilter } from './components/TaskFilter/TaskFilter'
import { TaskList } from './components/TaskList/TaskList'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function TaskApp() {
  const { tasks, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, addTask, toggleTask, removeTask, isAdding } =
    useTasks()
  const { activeFilter, setActiveFilter, filteredTasks, counts } =
    useTaskFilter(tasks)

  return (
    <div className="app">
      {/* Background decorations */}
      <div className="app__bg-orb app__bg-orb--1" aria-hidden="true" />
      <div className="app__bg-orb app__bg-orb--2" aria-hidden="true" />

      <main className="app__main">
        {/* Header */}
        <header className="app__header">
          <div className="app__logo" aria-hidden="true">✓</div>
          <h1 className="app__title">Task Manager</h1>
          <p className="app__subtitle">
            {counts.all > 0
              ? `${counts.completed} of ${counts.all} tasks completed`
              : 'Start by adding your first task'}
          </p>

          {/* Progress bar */}
          {counts.all > 0 && (
            <div
              className="app__progress"
              role="progressbar"
              aria-valuenow={counts.completed}
              aria-valuemin={0}
              aria-valuemax={counts.all}
              aria-label={`${counts.completed} of ${counts.all} tasks completed`}
            >
              <div
                className="app__progress-fill"
                style={{
                  width: `${Math.round((counts.completed / counts.all) * 100)}%`,
                }}
              />
            </div>
          )}
        </header>

        {/* Card */}
        <section className="app__card" aria-label="Task management">
          <TaskForm onAddTask={addTask} isLoading={isAdding} />

          <div className="app__divider" aria-hidden="true" />

          <TaskFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={counts}
          />

          <TaskList
            tasks={filteredTasks}
            isLoading={isLoading}
            isError={isError}
            activeFilter={activeFilter}
            onToggle={toggleTask}
            onDelete={removeTask}
            onRetry={refetch}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </section>

        {/* Footer */}
        <footer className="app__footer">
          <p>
            Built with React + TypeScript + TanStack Query ·{' '}
            <a
              href="https://jsonplaceholder.typicode.com/todos"
              target="_blank"
              rel="noopener noreferrer"
              className="app__footer-link"
            >
              JSONPlaceholder API
            </a>
          </p>
        </footer>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <TaskApp />
    </QueryClientProvider>
  )
}
