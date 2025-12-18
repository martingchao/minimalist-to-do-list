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
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task');
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
    <div className="min-h-screen p-4 bg-paper-light">
      <div className="max-w-2xl mx-auto">
        {/* Paper-like container with notepad effect */}
        <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] rounded-sm p-8 relative border border-black/10">
          {/* Notepad left edge effect */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-paper-dark border-r-2 border-black/20"></div>
          {/* Notepad bottom edge effect */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-paper-dark border-t-2 border-black/20"></div>
          {/* Decorative top line with dots */}
          <div className="relative mb-6">
            <div className="absolute left-0 right-0 top-3 border-t border-black"></div>
            <div className="absolute left-2 top-2.5 w-1.5 h-1.5 bg-black rounded-full"></div>
            <div className="absolute right-2 top-2.5 w-1.5 h-1.5 bg-black rounded-full"></div>
            <div className="text-center relative">
              <span className="text-2xl">✦</span>
              <span className="text-3xl mx-2">✦</span>
              <span className="text-2xl">✦</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-normal tracking-wide">TO DO LIST</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-black underline"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6 flex gap-4 items-center flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sortByDueDate}
                onChange={(e) => setSortByDueDate(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm">Sort by due date</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm">Show completed tasks</span>
            </label>
          </div>

          {/* Task Form */}
          <TaskForm onSubmit={handleCreateTask} />

          {/* Incomplete Tasks */}
          <div className="mt-8 space-y-3">
            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading...</div>
            ) : incompleteTasks.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No tasks yet. Add one above!</div>
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

          {/* Completed Tasks (hidden by default) */}
          {showCompleted && completedTasks.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-300">
              <h2 className="text-xl font-normal mb-4 text-gray-600">Completed Tasks</h2>
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
      </div>
    </div>
  );
}

