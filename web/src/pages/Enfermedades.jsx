import { useEffect, useState } from 'react'
import api from '../api/http'

export default function Enfermedades() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ siembra_id: '', tipo: '', severidad: '', observaciones: '' })
  const [siembras, setSiembras] = useState([])
  const [editing, setEditing] = useState(null)

  async function load() {
    const [r1, r2] = await Promise.all([
      api.get('/enfermedades'),
      api.get('/siembras')
    ])
    setRows(r1.data)
    setSiembras(r2.data)
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (editing) {
      await api.put(`/enfermedades/${editing}`, form)
    } else {
      await api.post('/enfermedades', form)
    }
    setForm({ siembra_id: '', tipo: '', severidad: '', observaciones: '' })
    setEditing(null)
    load()
  }

  async function handleEdit(row) {
    setForm({
      siembra_id: row.siembra_id,
      tipo: row.tipo,
      severidad: row.severidad,
      observaciones: row.observaciones
    })
    setEditing(row.id)
  }

  async function handleDelete(id) {
    if (confirm('¿Eliminar registro?')) {
      await api.delete(`/enfermedades/${id}`)
      load()
    }
  }

  return (
    <div className="p-4">
      <h2 className="mb-3">Enfermedades</h2>

      <form className="row g-2 mb-3" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <select className="form-select" value={form.siembra_id}
            onChange={e => setForm({ ...form, siembra_id: e.target.value })} required>
            <option value="">Seleccionar siembra...</option>
            {siembras.map(s => <option key={s.id} value={s.id}>{s.parcela} - {s.tipo_uva}</option>)}
          </select>
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Tipo" value={form.tipo}
            onChange={e => setForm({ ...form, tipo: e.target.value })} required />
        </div>
        <div className="col-md-2">
          <input className="form-control" placeholder="Severidad" value={form.severidad}
            onChange={e => setForm({ ...form, severidad: e.target.value })} />
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Observaciones" value={form.observaciones}
            onChange={e => setForm({ ...form, observaciones: e.target.value })} />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100">{editing ? 'Actualizar' : 'Guardar'}</button>
        </div>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr><th>ID</th><th>Siembra</th><th>Tipo</th><th>Severidad</th><th>Observaciones</th><th></th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.siembra}</td>
              <td>{r.tipo}</td>
              <td>{r.severidad}</td>
              <td>{r.observaciones}</td>
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
