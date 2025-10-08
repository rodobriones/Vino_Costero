import { useEffect, useState } from 'react'
import api from '../api/http'
import { useAuth } from '../context/auth'

export default function Lotes() {
  const { rol } = useAuth()
  const [rows, setRows] = useState([])
  const [parcelas, setParcelas] = useState([])
  const [err, setErr] = useState('')

  const [form, setForm] = useState({
    codigo: '',
    anio: new Date().getFullYear(),
    parcela_id: ''
    // si tu tabla tiene extras, agrega aquí: fecha_cosecha, cantidad_litros, notas
  })

  async function load() {
    const [lotesRes, parcRes] = await Promise.all([
      api.get('/lotes'),
      api.get('/parcelas')
    ])
    setRows(lotesRes.data)
    setParcelas(parcRes.data)
  }
  useEffect(() => { load() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setErr('')
    try {
      await api.post('/lotes', {
        codigo: form.codigo.trim(),
        anio: Number(form.anio),
        parcela_id: Number(form.parcela_id)
        // agrega extras si los usas: fecha_cosecha: form.fecha_cosecha || null, ...
      })
      setForm({ codigo: '', anio: new Date().getFullYear(), parcela_id: '' })
      await load()
    } catch (e) {
      setErr(e?.response?.data?.error?.message || 'Error al guardar lote')
      console.error(e)
    }
  }

  return (
    <div>
      <h4 className="mb-3">Lotes</h4>

      {rol === 'admin' && (
        <form className="row g-2 mb-3" onSubmit={handleSubmit}>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Código (ej. L-2025-003)"
              value={form.codigo}
              onChange={e => setForm({ ...form, codigo: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Año"
              value={form.anio}
              onChange={e => setForm({ ...form, anio: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={form.parcela_id}
              onChange={e => setForm({ ...form, parcela_id: e.target.value })}
              required
            >
              <option value="">Seleccionar parcela...</option>
              {parcelas.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.hectareas} ha)</option>)}
            </select>
          </div>
          <div className="col-md-2">
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
          <tr><th>ID</th><th>Código</th><th>Año</th><th>Parcela</th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.codigo}</td>
              <td>{r.anio}</td>
              <td>{r.parcela}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
