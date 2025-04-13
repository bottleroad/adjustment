"use client"

import { createContext, useContext, useState, useEffect } from 'react'

export interface Task {
  id: number
  title: string
  cardType: 'shinhan' | 'hyundai' | 'samsung' | 'bc' | 'kb' | 'lotte' | 'other'
  amount: number
  time: string
  store: string
  date: string
  completed: boolean
}

interface AddTaskInput {
  title: string
  memo: string  // Message content for parsing card information
}

interface TaskContextType {
  tasks: Task[]
  addTask: (input: AddTaskInput) => void
  toggleTaskCompletion: (taskId: number) => void
  deleteTask: (taskId: number) => void
  deleteAllTasks: () => void
  totalAmount: number
  cardTotals: Record<string, number>
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([])

  // Load tasks from API on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };
    loadTasks();
  }, []);

  const totalAmount = tasks.reduce((sum, task) => sum + task.amount, 0)
  
  const cardTotals = tasks.reduce((acc, task) => {
    acc[task.cardType] = (acc[task.cardType] || 0) + task.amount
    return acc
  }, {} as Record<string, number>)

  const parseCardMessage = (memo: string): { cardType: Task['cardType']; amount: number; time: string; store: string } => {
    // Remove "[Web발신]" and split into lines
    const lines = memo
      .replace(/\[Web발신\]/g, '')
      .split('\n')
      .filter(line => line.trim() !== '');

    // Get the first line and extract first two syllables for card type detection
    const firstLine = lines[0] || '';
    const firstTwoSyllables = firstLine.slice(0, 2);
    
    // Extract card type from the first two syllables
    let cardType: Task['cardType'] = 'other';
    if (firstTwoSyllables === '신한') cardType = 'shinhan';
    else if (firstTwoSyllables === '현대') cardType = 'hyundai';
    else if (firstTwoSyllables === '삼성') cardType = 'samsung';
    else if (firstTwoSyllables === 'BC') cardType = 'bc';
    else if (firstTwoSyllables === 'KB') cardType = 'kb';
    else if (firstTwoSyllables === '롯데') cardType = 'lotte';

    // Filter out cumulative amount lines and join remaining lines
    const cleanedMemo = lines
      .filter(line => !line.includes('누적'))
      .join('\n');

    // Extract amount (assuming format like "12,000원")
    const amountMatch = cleanedMemo.match(/[\d,]+원/);
    const amount = amountMatch 
      ? parseInt(amountMatch[0].replace(/[,원]/g, ''))
      : 0;

    // Extract time (assuming format like "12:34")
    const timeMatch = cleanedMemo.match(/\d{2}:\d{2}/);
    const time = timeMatch ? timeMatch[0] : '';

    // Extract store name (assuming it's after the amount)
    const storeMatch = cleanedMemo.match(/[\d,]+원\s+(.+?)(?:\s+\d|$)/);
    const store = storeMatch ? storeMatch[1].trim() : '';

    return { cardType, amount, time, store };
  };

  const addTask = async (input: AddTaskInput) => {
    const parsedData = parseCardMessage(input.memo);
    
    const newTask: Task = {
      id: Date.now(),
      title: input.title,
      cardType: parsedData.cardType,
      amount: parsedData.amount,
      time: parsedData.time,
      store: parsedData.store,
      date: new Date().toLocaleDateString('ko-KR'),
      completed: false,
    };

    try {
      // Add task through API
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error('Failed to add task');

      // Update local state
      setTasks(prev => [...prev, newTask]);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const toggleTaskCompletion = async (taskId: number) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updates = { completed: !task.completed };

      // Update through API
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId, updates }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      // Update local state
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      ));
    } catch (error) {
      console.error('Failed to toggle completion:', error);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId }),
      });

      if (!response.ok) throw new Error('Failed to delete task');

      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const deleteAllTasks = async () => {
    try {
      const response = await fetch('/api/tasks/all', {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete all tasks');

      setTasks([]);
    } catch (error) {
      console.error('Failed to delete all tasks:', error);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTaskCompletion,
        deleteTask,
        deleteAllTasks,
        totalAmount,
        cardTotals,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export const useTask = () => {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
} 