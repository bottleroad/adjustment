import { NextResponse } from 'next/server';
import { writeDB } from '../../utils/db';

export async function DELETE() {
  try {
    // Clear all tasks
    writeDB({ tasks: [] });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete all tasks' }, { status: 500 });
  }
} 