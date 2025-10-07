import { useEffect, useState } from 'react'
import api from '../api/http'

export default function Catas() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ lote: '', puntaje: '', notas: '' })
  const [editing, setEditing] = useState(null)

  async function load() {
    const { data } = await api.get('/catas')
    setRows(data)
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (editing) {
      await api.put(`/catas/${editing}`, form)
    } else {
      await api.post('/catas', form)
    }
    setForm({ lote: '', puntaje: '', notas: '' })
    setEditing(null)
    load()
  }

  async function handleEdit(row) {
    setForm({ lote: row.lote, puntaje: row.puntaje, notas: row.notas })
    setEditing(row.id)
  }

  async function handleDelete(id) {
    if (confirm('¿Eliminar registro?')) {
      await api.delete(`/catas/${id}`)
      load()
    }
  }

  return (
    <div className="p-4">
      <h2 className="mb-3">Catas</h2>

      <form className="row g-2 mb-3" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <input className="form-control" placeholder="Lote" value={form.lote}
            onChange={e => setForm({ ...form, lote: e.target.value })} required />
        </div>
        <div className="col-md-3">
          <input type="number" className="form-control" placeholder="Puntaje" value={form.puntaje}
            onChange={e => setForm({ ...form, puntaje: e.target.value })} required />
        </div>
        <div className="col-md-4">
          <input className="form-control" placeholder="Notas" value={form.notas}
            onChange={e => setForm({ ...form, notas: e.target.value })} />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100">{editing ? 'Actualizar' : 'Guardar'}</button>
        </div>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr><th>ID</th><th>Lote</th><th>Puntaje</th><th>Notas</th><th></th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.lote}</td>
              <td>{r.puntaje}</td>
              <td>{r.notas}</td>
              <td>
                <button onClick={() => handleEdit(r)} className="btn btn-sm btn-warning me-2">✏️</button>
                <button onClick={() => handleDelete(r.id)} className="btn btn-sm btn-danger">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
