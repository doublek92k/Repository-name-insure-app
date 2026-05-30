'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://tlffsjvkyccwxdpdmcxs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZmZzanZreWNjd3hkcGRtY3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzM1NDYsImV4cCI6MjA5NTY0OTU0Nn0.l839UdiUMyLrJBsf5OAH7FHLqLJRMOJYeOjJog0Sq9I'
)

export default function Home() {
  const [status, setStatus] = useState('연결 중...')

  useEffect(() => {
    supabase.from('customers').select('count').then(({ error }) => {
      if (error) setStatus('오류: ' + error.message)
      else setStatus('Supabase 연결 성공!')
    })
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>보험영업사 AI 툴킷</h1>
      <p>{status}</p>
    </div>
  )
}