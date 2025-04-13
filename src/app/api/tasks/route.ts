import { NextResponse } from 'next/server';
import { getAllTasks, addTaskToDB, updateTaskInDB, deleteTaskFromDB } from '../utils/db';
import { Task } from '@/contexts/TaskContext';

export async function GET() {
  try {
    const tasks = getAllTasks();
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const task: Task = await request.json();
    addTaskToDB(task);
    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, updates } = await request.json();
    updateTaskInDB(id, updates);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    deleteTaskFromDB(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
} 