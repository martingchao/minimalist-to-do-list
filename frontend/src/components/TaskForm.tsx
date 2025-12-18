import { useState } from 'react';

interface TaskFormProps {
  onSubmit: (description: string, dueDate: string | null) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit(description.trim(), dueDate || null);
      setDescription('');
      setDueDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-3">
      <div className="w-5 h-5 flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a new task..."
          className="w-full px-2 py-1 border-b border-gray-400 bg-transparent focus:outline-none focus:border-black placeholder-gray-400"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="px-2 py-1 border-b border-gray-400 bg-transparent focus:outline-none focus:border-black text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={!description.trim()}
        className="px-4 py-1 border border-black bg-white hover:bg-black hover:text-white transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add
      </button>
    </form>
  );
}

