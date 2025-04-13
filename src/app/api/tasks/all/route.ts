import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE() {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .neq('id', 0); // Delete all records

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete all tasks:', error);
    return NextResponse.json({ error: 'Failed to delete all tasks' }, { status: 500 });
  }
} 