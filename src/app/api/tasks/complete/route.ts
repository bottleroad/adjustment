import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed: true })
      .eq('store', '일시불')
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { message: '일시불 항목 정산 완료 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 