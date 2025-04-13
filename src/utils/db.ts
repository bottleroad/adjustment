import fs from 'fs';
import path from 'path';
import { Task } from '@/contexts/TaskContext';

const DB_PATH = path.join(process.cwd(), 'src/data/tasks.json');

// Type for the database structure
interface DB {
  tasks: Task[];
}

// Read the database
export const readDB = (): DB => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist or is corrupted, return empty DB
    return { tasks: [] };
  }
};

// Write to the database
export const writeDB = (db: DB): void => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch {
    throw new Error('Failed to write to database');
  }
};

// Get all tasks
export const getAllTasks = (): Task[] => {
  const db = readDB();
  return db.tasks;
};

// Add a new task
export const addTaskToDB = (task: Task): void => {
  const db = readDB();
  db.tasks.push(task);
  writeDB(db);
};

// Update a task
export const updateTaskInDB = (taskId: number, updates: Partial<Task>): void => {
  const db = readDB();
  db.tasks = db.tasks.map(task =>
    task.id === taskId ? { ...task, ...updates } : task
  );
  writeDB(db);
};

// Delete a task
export const deleteTaskFromDB = (taskId: number): void => {
  const db = readDB();
  db.tasks = db.tasks.filter(task => task.id !== taskId);
  writeDB(db);
}; 