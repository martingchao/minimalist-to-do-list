import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Task, getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';

export default function Tasks() {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortByDueDate, setSortByDueDate] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks(sortByDueDate ? 'due_date' : undefined);
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [sortByDueDate]);

  const handleCreateTask = async (description: string, dueDate: string | null) => {
    try {
      const newTask = await createTask({ description, due_date: dueDate || null });
      setTasks([newTask, ...tasks]);
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = await updateTask(task.id, { completed: !task.completed });
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (error: any) {
      console.error('Failed to update task:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to update task';
      alert(errorMessage);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task');
    }
  };

  const handleUpdateTask = async (taskId: number, description: string, dueDate: string | null) => {
    try {
      const updatedTask = await updateTask(taskId, { description, due_date: dueDate || null });
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task');
    }
  };

  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="min-h-screen p-4 relative z-10">
      <div className="max-w-2xl mx-auto">
        {/* Glass-morphic container with green theme */}
        <div className="bg-gradient-to-br from-forest-900/90 via-forest-800/85 to-forest-900/90 backdrop-blur-xl shadow-green-glow-lg rounded-2xl p-8 relative border border-forest-500/30 overflow-hidden">
          {/* Animated green accent lines */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-glow to-transparent opacity-60"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-forest-400 to-transparent opacity-40"></div>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-forest-400 to-transparent opacity-40"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-forest-400 to-transparent opacity-40"></div>
          
          {/* Decorative corner accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-forest-400/50 rounded-tl-lg"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-forest-400/50 rounded-tr-lg"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-forest-400/50 rounded-bl-lg"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-forest-400/50 rounded-br-lg"></div>

          {/* Header with leaf decorations */}
          <div className="flex justify-center gap-2 mb-2">
            <span className="text-forest-400 text-xl animate-pulse">🌿</span>
            <span className="text-forest-300 text-2xl">🍀</span>
            <span className="text-forest-400 text-xl animate-pulse">🌿</span>
          </div>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-forest-200 via-mint to-forest-200">
              🌱 TO DO LIST
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-forest-300">{user?.email}</span>
              <button
                onClick={logout}
                className="text-sm text-forest-400 hover:text-mint underline decoration-forest-600 hover:decoration-mint transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6 flex gap-4 items-center flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={sortByDueDate}
                  onChange={(e) => setSortByDueDate(e.target.checked)}
                  className="w-5 h-5 cursor-pointer appearance-none border-2 border-forest-500 rounded bg-forest-950/50 checked:bg-forest-500 checked:border-forest-400 transition-all"
                />
                {sortByDueDate && (
                  <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-forest-200 group-hover:text-mint transition-colors">Sort by due date</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="w-5 h-5 cursor-pointer appearance-none border-2 border-forest-500 rounded bg-forest-950/50 checked:bg-forest-500 checked:border-forest-400 transition-all"
                />
                {showCompleted && (
                  <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-forest-200 group-hover:text-mint transition-colors">Show completed ({completedTasks.length})</span>
            </label>
          </div>

          {/* Task Form */}
          <TaskForm onSubmit={handleCreateTask} />

          {/* Incomplete Tasks */}
          <div className="mt-8 space-y-3">
            {loading ? (
              <div className="text-center text-forest-300 py-8 flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-mint" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Loading your garden...
              </div>
            ) : incompleteTasks.length === 0 ? (
              <div className="text-center text-forest-400 py-8">
                <span className="text-4xl mb-2 block">🌻</span>
                No tasks yet. Plant one above!
              </div>
            ) : (
              incompleteTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                  onUpdate={handleUpdateTask}
                />
              ))
            )}
          </div>

          {/* Completed Tasks */}
          {showCompleted && completedTasks.length > 0 && (
            <div className="mt-12 pt-8 border-t-2 border-forest-600/50">
              <h2 className="text-xl font-semibold mb-4 text-forest-300 flex items-center gap-2">
                <span>🌾</span> Harvested Tasks
              </h2>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                    onUpdate={handleUpdateTask}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer decoration */}
        <div className="text-center mt-6 text-forest-400/60 text-sm">
          🌲 Stay productive, grow your goals 🌲
        </div>
      </div>
    </div>
  );
}
