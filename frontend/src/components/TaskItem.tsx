import { useState } from 'react';
import { Task } from '../api/tasks';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onUpdate: (taskId: number, description: string, dueDate: string | null) => void;
}

export default function TaskItem({ task, onToggleComplete, onDelete, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.due_date || '');

  const handleSave = () => {
    if (description.trim()) {
      onUpdate(task.id, description.trim(), dueDate || null);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setDescription(task.description);
    setDueDate(task.due_date || '');
    setIsEditing(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = task.due_date && !task.completed && new Date(task.due_date) < new Date();

  return (
    <div className={`flex items-start gap-3 group p-3 rounded-xl transition-all duration-300 ${
      task.completed 
        ? 'bg-forest-950/30 opacity-70' 
        : 'bg-forest-900/40 hover:bg-forest-800/50 hover:shadow-green-glow'
    } border border-forest-600/20`}>
      <button
        onClick={() => onToggleComplete(task)}
        className={`mt-0.5 w-6 h-6 border-2 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
          task.completed 
            ? 'bg-forest-500 border-forest-400 shadow-green-glow' 
            : 'bg-forest-950/50 border-forest-500 hover:border-mint hover:bg-forest-800'
        }`}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed && (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1 border-b-2 border-forest-500 bg-forest-950/50 focus:outline-none focus:border-mint text-forest-100 rounded transition-colors"
              autoFocus
            />
            <div className="flex gap-3 items-center">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-3 py-1 border-b-2 border-forest-500 bg-forest-950/50 focus:outline-none focus:border-mint text-sm text-forest-200 rounded transition-colors"
              />
              <button
                onClick={handleSave}
                className="text-sm text-mint hover:text-forest-200 font-medium transition-colors"
              >
                ✓ Save
              </button>
              <button
                onClick={handleCancel}
                className="text-sm text-forest-400 hover:text-forest-200 transition-colors"
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className={`flex-1 cursor-pointer ${task.completed ? 'line-through text-forest-500' : 'text-forest-100'}`}
              onClick={() => setIsEditing(true)}
            >
              <span>{task.description}</span>
              {task.due_date && (
                <span className={`ml-3 text-sm px-2 py-0.5 rounded-full ${
                  isOverdue 
                    ? 'text-red-300 bg-red-900/40 border border-red-500/30' 
                    : 'text-forest-300 bg-forest-800/50'
                }`}>
                  📅 {formatDate(task.due_date)}
                  {isOverdue && ' ⚠️'}
                </span>
              )}
            </div>
            <button
              onClick={() => onDelete(task.id)}
              className="opacity-0 group-hover:opacity-100 text-forest-500 hover:text-red-400 text-sm transition-all duration-200 px-2 py-1 rounded hover:bg-red-900/30"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
