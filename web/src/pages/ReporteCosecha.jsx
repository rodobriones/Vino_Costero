import React, { useEffect, useState } from 'react'
import api from '../api/http'

export default function ReporteCosecha() {
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [data, setData] = useState(null)

  async function load() {
    const { data } = await api.get(`/reportes/cosecha?anio=${anio}`)
    setData(data)
  }
  useEffect(() => { load() }, [])

  return (
    <div>
      <h4 className="mb-3">Reporte por Cosecha</h4>
      <div className="row g-2 mb-3">
        <div className="col-auto">
          <input type="number" className="form-control" value={anio} onChange={e=>setAnio(e.target.value)} />
        </div>
        <div className="col-auto">
          <button className="btn btn-secondary" onClick={load}>Generar</button>
        </div>
      </div>
      {!data ? 'Cargando...' : (
        <div className="card p-3">
          <div className="mb-2"><b>Año:</b> {data.anio}</div>
          <div className="mb-2"><b>Parcelas:</b> {data.totalesParcelas} | <b>Siembras:</b> {data.totalesSiembras}</div>
          <table className="table">
            <thead><tr><th>Lote</th><th># Catas</th><th>Promedio</th></tr></thead>
            <tbody>
              {data.lotes.map((l,i)=>(
                <tr key={i}><td>{l.codigo}</td><td>{l.catas}</td><td>{l.promedio ? Number(l.promedio).toFixed(1): '-'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
