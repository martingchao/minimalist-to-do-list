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
    <form onSubmit={handleSubmit} className="flex items-start gap-3 bg-forest-950/40 p-4 rounded-xl border border-forest-600/30">
      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center text-forest-400">
        🌱
      </div>
      <div className="flex-1 space-y-2">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Plant a new task..."
          className="w-full px-3 py-2 border-b-2 border-forest-600 bg-transparent focus:outline-none focus:border-mint placeholder-forest-500 text-forest-100 transition-colors"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="px-3 py-1 border-b-2 border-forest-600 bg-transparent focus:outline-none focus:border-mint text-sm text-forest-200 transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={!description.trim()}
        className="px-5 py-2 bg-gradient-to-r from-forest-600 to-forest-500 hover:from-forest-500 hover:to-forest-400 text-white font-medium rounded-lg shadow-green-glow transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:shadow-green-glow-lg hover:scale-105 active:scale-95"
      >
        🌿 Add
      </button>
    </form>
  );
}
