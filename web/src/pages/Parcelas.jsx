import React, { useEffect, useState } from 'react'
import api from '../api/http'
import { useAuth } from '../context/auth'

export default function Parcelas() {
  const [rows, setRows] = useState([])
  const [nombre, setNombre] = useState('')
  const [hectareas, setHectareas] = useState('')
  const [err, setErr] = useState('')
  const { rol } = useAuth()

  async function load() {
    const { data } = await api.get('/parcelas')
    setRows(data)
  }
  useEffect(() => { load() }, [])

  async function crear(e) {
    e.preventDefault()
    setErr('')
    try {
      await api.post('/parcelas', { nombre, hectareas: Number(hectareas), activo: true })
      setNombre(''); setHectareas('')
      await load()
    } catch (e) {
      setErr(e?.response?.data?.error?.message || 'Error')
    }
  }

  return (
    <div>
      <h4 className="mb-3">Parcelas</h4>
      {rol === 'admin' && (
      <form onSubmit={crear} className="row g-2 mb-3">
        <div className="col-sm-5"><input required value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Nombre" className="form-control" /></div>
        <div className="col-sm-3"><input required type="number" step="0.01" value={hectareas} onChange={e=>setHectareas(e.target.value)} placeholder="Hectáreas" className="form-control" /></div>
        <div className="col-sm-2"><button className="btn btn-primary w-100">Crear</button></div>
        {err && <div className="col-12"><div className="alert alert-danger">{err}</div></div>}
      </form>)}
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Nombre</th><th>Hectáreas</th><th>Activo</th></tr></thead>
        <tbody>
          {rows.map(r => <tr key={r.id}><td>{r.id}</td><td>{r.nombre}</td><td>{r.hectareas}</td><td>{r.activo ? 'Sí' : 'No'}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
