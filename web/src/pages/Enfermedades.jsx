import { useEffect, useState } from 'react'
import api from '../api/http'
import { useAuth } from '../context/auth'

export default function Enfermedades() {
  const { rol } = useAuth() // para ocultar el formulario si no eres admin
  const [rows, setRows] = useState([])
  const [siembras, setSiembras] = useState([])
  const [err, setErr] = useState('')

  const [form, setForm] = useState({
    siembra_id: '',
    tipo: '',
    severidad: '',
    fecha: new Date().toISOString().slice(0, 10), // hoy por defecto
    observaciones: ''
  })

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
    setErr('')
    try {
      await api.post('/enfermedades', {
        siembra_id: Number(form.siembra_id),
        tipo: form.tipo.trim(),
        severidad: form.severidad,            // Debe ser Baja/Media/Alta
        fecha: form.fecha,                    // YYYY-MM-DD
        observaciones: form.observaciones?.trim() || null
      })
      // limpiar y recargar
      setForm(f => ({ ...f, tipo: '', severidad: '', observaciones: '' }))
      await load()
    } catch (e) {
      setErr(e?.response?.data?.error?.message || 'Error al guardar')
      console.error(e)
    }
  }

  return (
    <div>
      <h4 className="mb-3">Enfermedades</h4>

      {/* Formulario solo visible para admin */}
      {rol === 'admin' && (
        <form className="row g-2 mb-3" onSubmit={handleSubmit}>
          <div className="col-md-3">
            <select
              className="form-select"
              value={form.siembra_id}
              onChange={e => setForm({ ...form, siembra_id: e.target.value })}
              required
            >
              <option value="">Seleccionar siembra...</option>
              {siembras.map(s => (
                <option key={s.id} value={s.id}>
                  {s.parcela} - {s.tipo_uva}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Tipo (ej. Mildew)"
              value={form.tipo}
              onChange={e => setForm({ ...form, tipo: e.target.value })}
              required
            />
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={form.severidad}
              onChange={e => setForm({ ...form, severidad: e.target.value })}
              required
            >
              <option value="">Severidad</option>
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
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

          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Observaciones"
              value={form.observaciones}
              onChange={e => setForm({ ...form, observaciones: e.target.value })}
            />
          </div>

          <div className="col-md-1">
            <button className="btn btn-primary w-100">Guardar</button>
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
          <tr>
            <th>ID</th><th>Siembra</th><th>Tipo</th><th>Severidad</th><th>Fecha</th><th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.siembra}</td>
              <td>{r.tipo}</td>
              <td>{r.severidad}</td>
              <td>{r.fecha?.slice(0, 10)}</td>
              <td>{r.observaciones || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
