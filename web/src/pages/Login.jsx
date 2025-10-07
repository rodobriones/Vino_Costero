import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/http'
import { useAuth } from '../context/auth'

export default function Login() {
  const [email, setEmail] = useState('admin@vc.com')
  const [password, setPassword] = useState('Admin123!')
  const [err, setErr] = useState('')
  const nav = useNavigate()
  const { login } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      login(data)
      nav('/')
    } catch (e) {
      setErr(e?.response?.data?.error?.message || 'Error')
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h3 className="mt-4 mb-3">Ingresar</h3>
      <form onSubmit={onSubmit} className="card p-3 shadow-sm">
        {err && <div className="alert alert-danger">{err}</div>}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="form-control" type="email" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} className="form-control" type="password" required />
        </div>
        <button className="btn btn-primary w-100">Entrar</button>
      </form>
    </div>
  )
}
