'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://tlffsjvkyccwxdpdmcxs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZmZzanZreWNjd3hkcGRtY3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzM1NDYsImV4cCI6MjA5NTY0OTU0Nn0.l839UdiUMyLrJBsf5OAH7FHLqLJRMOJYeOjJog0Sq9I'
)

export default function Customers() {
const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '', age: '', job: '', phone: '', status: '상담중', score: '', memo: ''
  })
  const [adding, setAdding] = useState(false)

  useEffect(() => { fetchCustomers() }, [])

async function fetchCustomers() {
    const { data, error } = await supabase
      .from('customers')
     .select('name,age,job,phone,status,score,memo')
      
    console.log('data:', data, 'error:', error)
    if (data) setCustomers(data)
    setLoading(false)
  }

async function addCustomer() {
  if (!form.name) return alert('이름을 입력해주세요')
  setAdding(true)
  const { error } = await supabase.from('customers').insert([{
    name: form.name,
    age: parseInt(form.age) || null,
    job: form.job,
    phone: form.phone,
    status: form.status,
    score: parseInt(form.score) || 0,
    memo: form.memo,
  }])
  console.log('insert error:', error)
  setForm({ name: '', age: '', job: '', phone: '', status: '상담중', score: '', memo: '' })
  await fetchCustomers()
  setAdding(false)
}

  async function deleteCustomer(id: any) {
    if (!confirm('삭제할까요?')) return
    await supabase.from('customers').delete().eq('name', id)
    fetchCustomers()
  }

  const STATUS_COLOR = {
    '상담중': '#E6F1FB', '이탈위험': '#FCEBEB',
    '갱신임박': '#FAEEDA', '성약완료': '#EAF3DE', '휴면': '#F1EFE8'
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '900px' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>고객 관리</h1>
      <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>새 고객 추가</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <input placeholder="이름 *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <input placeholder="나이" value={form.age} onChange={e => setForm({...form, age: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <input placeholder="직업" value={form.job} onChange={e => setForm({...form, job: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <input placeholder="연락처" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}>
            <option>상담중</option>
            <option>이탈위험</option>
            <option>갱신임박</option>
            <option>성약완료</option>
            <option>휴면</option>
          </select>
          <input placeholder="성약 가능성 (0~100)" value={form.score} onChange={e => setForm({...form, score: e.target.value})} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }} />
        </div>
        <input placeholder="메모" value={form.memo} onChange={e => setForm({...form, memo: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '10px' }} />
        <button onClick={addCustomer} disabled={adding} style={{ padding: '8px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          {adding ? '추가 중...' : '+ 고객 추가'}
        </button>
      </div>
      {loading ? <p>로딩 중...</p> : customers.length === 0 ? <p>등록된 고객이 없어요.</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee', background: '#f9f9f9' }}>
              <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px' }}>이름</th>
              <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px' }}>나이</th>
              <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px' }}>직업</th>
              <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px' }}>연락처</th>
              <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px' }}>상태</th>
              <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px' }}>점수</th>
              <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px' }}>삭제</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.name} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px', fontWeight: '500' }}>{c.name}</td>
                <td style={{ padding: '10px', color: '#666' }}>{c.age}</td>
                <td style={{ padding: '10px', color: '#666' }}>{c.job}</td>
                <td style={{ padding: '10px', color: '#666', fontSize: '13px' }}>{c.phone}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{ background: STATUS_COLOR[c.status] || '#eee', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{c.status}</span>
                </td>
                <td style={{ padding: '10px', color: '#666' }}>{c.score}</td>
                <td style={{ padding: '10px' }}>
                  <button onClick={() => deleteCustomer(c.name)} style={{ background: 'none', border: '1px solid #ddd', borderRadius: '4px', padding: '3px 8px', cursor: 'pointer', color: '#999', fontSize: '12px' }}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}