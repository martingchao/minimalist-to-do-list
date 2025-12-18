import { useState } from 'react';
import { Task, updateTask } from '../api/tasks';

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
    <div className="flex items-start gap-3 group">
      <button
        onClick={() => onToggleComplete(task)}
        className={`mt-1 w-5 h-5 border-2 border-black flex-shrink-0 flex items-center justify-center ${
          task.completed ? 'bg-black' : 'bg-white'
        }`}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="w-full px-2 py-1 border-b border-gray-400 bg-transparent focus:outline-none focus:border-black"
              autoFocus
            />
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-2 py-1 border-b border-gray-400 bg-transparent focus:outline-none focus:border-black text-sm"
              />
              <button
                onClick={handleSave}
                className="text-sm text-gray-600 hover:text-black underline"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="text-sm text-gray-600 hover:text-black underline"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className={`flex-1 cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
              onClick={() => setIsEditing(true)}
            >
              <span>{task.description}</span>
              {task.due_date && (
                <span className={`ml-3 text-sm ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                  {formatDate(task.due_date)}
                  {isOverdue && ' (overdue)'}
                </span>
              )}
            </div>
            <button
              onClick={() => onDelete(task.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-black text-sm transition-opacity"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

