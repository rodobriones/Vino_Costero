import React, { useEffect, useState } from 'react'
import api from '../api/http'
import { useAuth } from '../context/auth'

export default function TiposUva() {
  const [rows, setRows] = useState([])
  const [nombre, setNombre] = useState('')
  const [codigo, setCodigo] = useState('')
  const [err, setErr] = useState('')
  const { rol } = useAuth()

  async function load() {
    const { data } = await api.get('/tipos-uva')
    setRows(data)
  }
  useEffect(() => { load() }, [])

  async function crear(e) {
    e.preventDefault()
    setErr('')
    try {
      await api.post('/tipos-uva', { nombre, codigo })
      setNombre(''); setCodigo('')
      await load()
    } catch (e) {
      setErr(e?.response?.data?.error?.message || 'Error')
    }
  }

  return (
    <div>
      <h4 className="mb-3">Tipos de Uva</h4>
      {rol === 'admin' && (
      <form onSubmit={crear} className="row g-2 mb-3">
        <div className="col-sm-5"><input required value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Nombre" className="form-control" /></div>
        <div className="col-sm-3"><input required value={codigo} onChange={e=>setCodigo(e.target.value)} placeholder="Código" className="form-control" /></div>
        <div className="col-sm-2"><button className="btn btn-primary w-100">Crear</button></div>
        {err && <div className="col-12"><div className="alert alert-danger">{err}</div></div>}
      </form>)}
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Nombre</th><th>Código</th></tr></thead>
        <tbody>
          {rows.map(r => <tr key={r.id}><td>{r.id}</td><td>{r.nombre}</td><td>{r.codigo}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
