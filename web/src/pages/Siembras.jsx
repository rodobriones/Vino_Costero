import React, { useEffect, useState } from 'react'
import api from '../api/http'
import { useAuth } from '../context/auth'

export default function Siembras() {
  const [rows, setRows] = useState([])
  const [parcelas, setParcelas] = useState([])
  const [tipos, setTipos] = useState([])

  const [parcela_id, setParcelaId] = useState('')
  const [tipo_uva_id, setTipoId] = useState('')
  const [fecha, setFecha] = useState('')
  const [responsable, setResp] = useState('')
  const [err, setErr] = useState('')
  const { rol } = useAuth()

  async function load() {
    const [a,b,c] = await Promise.all([
      api.get('/siembras'),
      api.get('/parcelas'),
      api.get('/tipos-uva')
    ])
    setRows(a.data); setParcelas(b.data); setTipos(c.data)
  }
  useEffect(() => { load() }, [])

  async function crear(e) {
    e.preventDefault()
    setErr('')
    try {
      await api.post('/siembras', { parcela_id: Number(parcela_id), tipo_uva_id: Number(tipo_uva_id), fecha, responsable })
      setParcelaId(''); setTipoId(''); setFecha(''); setResp('')
      await load()
    } catch (e) {
      setErr(e?.response?.data?.error?.message || 'Error')
    }
  }

  return (
    <div>
      <h4 className="mb-3">Siembras</h4>
      {rol === 'admin' && (
      <form onSubmit={crear} className="row g-2 mb-3">
        <div className="col-sm-3">
          <select required value={parcela_id} onChange={e=>setParcelaId(e.target.value)} className="form-select">
            <option value="">Parcela</option>
            {parcelas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
        <div className="col-sm-3">
          <select required value={tipo_uva_id} onChange={e=>setTipoId(e.target.value)} className="form-select">
            <option value="">Tipo Uva</option>
            {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
        </div>
        <div className="col-sm-3">
          <input required type="date" value={fecha} onChange={e=>setFecha(e.target.value)} className="form-control" />
        </div>
        <div className="col-sm-2">
          <input placeholder="Responsable" value={responsable} onChange={e=>setResp(e.target.value)} className="form-control" />
        </div>
        <div className="col-sm-1"><button className="btn btn-primary w-100">Crear</button></div>
        {err && <div className="col-12"><div className="alert alert-danger">{err}</div></div>}
      </form>)}
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Parcela</th><th>Tipo Uva</th><th>Fecha</th><th>Responsable</th></tr></thead>
        <tbody>
          {rows.map(r => <tr key={r.id}><td>{r.id}</td><td>{r.parcela}</td><td>{r.tipo_uva}</td><td>{r.fecha?.slice(0,10)}</td><td>{r.responsable||''}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
