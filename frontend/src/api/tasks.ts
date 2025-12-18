import client from './client';

export interface Task {
  id: number;
  user_id: number;
  description: string;
  due_date: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  description: string;
  due_date?: string | null;
}

export interface UpdateTaskData {
  description?: string;
  due_date?: string | null;
  completed?: boolean;
}

export const getTasks = async (sort?: 'due_date'): Promise<Task[]> => {
  const params = sort ? { sort } : {};
  const response = await client.get<Task[]>('/tasks', { params });
  return response.data;
};

export const createTask = async (data: CreateTaskData): Promise<Task> => {
  const response = await client.post<Task>('/tasks', data);
  return response.data;
};

export const updateTask = async (id: number, data: UpdateTaskData): Promise<Task> => {
  const response = await client.put<Task>(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await client.delete(`/tasks/${id}`);
};

