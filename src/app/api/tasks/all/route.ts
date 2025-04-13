import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE() {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .neq('id', 0); // Delete all tasks except id 0 if exists

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'All tasks deleted successfully' });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete all tasks' },
      { status: 500 }
    );
  }
} 