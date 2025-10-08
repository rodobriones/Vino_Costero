import { useEffect, useState } from 'react'
import api from '../api/http'
import { useAuth } from '../context/auth'

export default function Catas() {
  const { rol } = useAuth() // admin puede crear/editar/borrar; visor solo lee
  const [rows, setRows] = useState([])
  const [lotes, setLotes] = useState([])
  const [err, setErr] = useState('')

  const [form, setForm] = useState({
    lote_id: '',
    puntaje: '',
    fecha: new Date().toISOString().slice(0, 10),
    notas: ''
  })
  const [editing, setEditing] = useState(null) // id de cata

  async function load() {
    const [catasRes, lotesRes] = await Promise.all([
      api.get('/catas'),                      // listado catas
      api.get('/catas/lotes?anio=' + new Date().getFullYear()) // lotes del año
    ])
    setRows(catasRes.data)
    setLotes(lotesRes.data)
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setErr('')
    try {
      const payload = {
        lote_id: Number(form.lote_id),
        puntaje: Number(form.puntaje),
        fecha: form.fecha,
        notas: form.notas?.trim() || null
      }

      if (editing) {
        // BACKEND usa PATCH, no PUT
        await api.patch(`/catas/${editing}`, payload)
      } else {
        await api.post('/catas', payload)
      }

      setForm(f => ({ ...f, lote_id: '', puntaje: '', notas: '' }))
      setEditing(null)
      await load()
    } catch (e) {
      setErr(e?.response?.data?.error?.message || 'Error al guardar')
      console.error(e)
    }
  }

  function handleEdit(row) {
    // row viene del GET /catas con { id, lote (codigo), lote_id, puntaje, notas, fecha }
    setEditing(row.id)
    setForm({
      lote_id: row.lote_id,
      puntaje: row.puntaje,
      fecha: row.fecha?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      notas: row.notas || ''
    })
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar cata?')) return
    try {
      await api.delete(`/catas/${id}`)
      await load()
    } catch (e) {
      setErr(e?.response?.data?.error?.message || 'Error al eliminar')
    }
  }

  return (
    <div>
      <h4 className="mb-3">Catas</h4>

      {/* Form solo para admin */}
      {rol === 'admin' && (
        <form className="row g-2 mb-3" onSubmit={handleSubmit}>
          <div className="col-md-3">
            <select
              className="form-select"
              value={form.lote_id}
              onChange={e => setForm({ ...form, lote_id: e.target.value })}
              required
            >
              <option value="">Seleccionar lote...</option>
              {lotes.map(l => (
                <option key={l.id} value={l.id}>{l.codigo} (año {l.anio})</option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Puntaje (0-100)"
              min={0} max={100}
              value={form.puntaje}
              onChange={e => setForm({ ...form, puntaje: e.target.value })}
              required
            />
          </div>

          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={form.fecha}
              onChange={e => setForm({ ...form, fecha: e.target.value })}
              required
            />
          </div>

          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Notas"
              value={form.notas}
              onChange={e => setForm({ ...form, notas: e.target.value })}
            />
          </div>

          <div className="col-md-1">
            <button className="btn btn-primary w-100">
              {editing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>

          {err && (
            <div className="col-12">
              <div className="alert alert-danger mt-2">{err}</div>
            </div>
          )}
        </form>
      )}

      <table className="table table-striped">
        <thead>
          <tr><th>ID</th><th>Lote</th><th>Puntaje</th><th>Fecha</th><th>Notas</th>{rol==='admin' && <th></th>}</tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.lote}</td>
              <td>{r.puntaje}</td>
              <td>{r.fecha?.slice(0,10)}</td>
              <td>{r.notas || ''}</td>
              {rol === 'admin' && (
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(r)}>✏️</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>🗑️</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
