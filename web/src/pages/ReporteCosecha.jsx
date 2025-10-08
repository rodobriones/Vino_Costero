import React, { useEffect, useMemo, useState } from 'react'
import api from '../api/http'

const toNum = v => Number.isFinite(Number(v)) ? Number(v) : 0
const fmt1 = n => Number.isFinite(n) ? n.toFixed(1) : '0.0'

export default function ReporteCosecha() {
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState({ by: 'codigo', dir: 'asc' })

  async function load(year = anio) {
    try {
      setLoading(true)
      setError('')
      const { data } = await api.get(`/reportes/cosecha?anio=${year}`)
      setData(data)
    } catch (e) {
      setError(e?.response?.data?.error?.message || 'No se pudo generar el reporte')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const resumen = useMemo(() => {
    if (!data) return { promedioGlobal: 0, lotes: [] }
    const lotes = (data.lotes || []).map(l => ({
      ...l,
      catas: toNum(l.catas),
      promedio: toNum(l.promedio)
    }))
    const promedioGlobal = lotes.length
      ? +(lotes.reduce((acc, x) => acc + (x.promedio || 0), 0) / lotes.length).toFixed(1)
      : 0
    return { promedioGlobal, lotes }
  }, [data])

  const lotesFiltrados = useMemo(() => {
    let rows = [...(resumen.lotes || [])]
    if (q.trim()) {
      const qq = q.trim().toLowerCase()
      rows = rows.filter(r => (r.codigo || '').toLowerCase().includes(qq))
    }
    rows.sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1
      if (sort.by === 'codigo') return a.codigo.localeCompare(b.codigo) * dir
      if (sort.by === 'catas') return (a.catas - b.catas) * dir
      if (sort.by === 'promedio') return (a.promedio - b.promedio) * dir
      return 0
    })
    return rows
  }, [resumen.lotes, q, sort])

  function toggleSort(by) {
    setSort(s => s.by === by ? { by, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { by, dir: 'asc' })
  }

  function exportCSV() {
    const headers = ['Año','Lote','Catas','Promedio']
    const rows = lotesFiltrados.map(l => [data.anio, l.codigo, l.catas, fmt1(l.promedio)])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte_cosecha_${data?.anio || anio}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <h4 className="m-0">Reporte por Cosecha</h4>
        <span className="badge bg-secondary">v0.2</span>
        <div className="ms-auto d-flex gap-2">
          <input
            type="number"
            className="form-control form-control-sm"
            style={{ width: 110 }}
            value={anio}
            onChange={e => setAnio(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load(anio)}
          />
          <button className="btn btn-sm btn-outline-primary" onClick={() => load(anio)}>Generar</button>
          {data && <button className="btn btn-sm btn-outline-success" onClick={exportCSV}>Exportar CSV</button>}
        </div>
      </div>

      {loading && (
        <div className="d-flex align-items-center gap-2">
          <div className="spinner-border text-primary" role="status" />
          <span>Cargando...</span>
        </div>
      )}

      {!!error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <div>❗ {error}</div>
          <button className="btn btn-outline-danger btn-sm" onClick={() => load(anio)}>Reintentar</button>
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* tarjetas resumen */}
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="text-muted">Año</div>
                  <div className="h4 mb-0">{data.anio}</div>
                  <small className="text-muted">Periodo seleccionado</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="text-muted">Parcelas</div>
                  <div className="h4 mb-0">{data.totalesParcelas}</div>
                  <small className="text-muted">Registradas</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="text-muted">Promedio Global</div>
                  <div className="h4 mb-1">{fmt1(resumen.promedioGlobal)}</div>
                  <div className="progress" style={{ height: 6 }}>
                    <div className="progress-bar" style={{ width: `${Math.min(100, resumen.promedioGlobal)}%` }} />
                  </div>
                  <small className="text-muted">Escala 0–100</small>
                </div>
              </div>
            </div>
          </div>

          {/* filtros tabla */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="m-0">Lotes ({lotesFiltrados.length})</h6>
            <input
              className="form-control form-control-sm"
              placeholder="Buscar por código…"
              style={{ width: 220 }}
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>

          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table table-hover table-sm align-middle m-0">
                <thead>
                  <tr>
                    <th role="button" onClick={() => toggleSort('codigo')}>
                      Lote {sort.by === 'codigo' && (sort.dir === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="text-center" role="button" onClick={() => toggleSort('catas')}>
                      # Catas {sort.by === 'catas' && (sort.dir === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="text-center" role="button" onClick={() => toggleSort('promedio')}>
                      Promedio {sort.by === 'promedio' && (sort.dir === 'asc' ? '▲' : '▼')}
                    </th>
                    <th style={{ width: 200 }}>Calidad</th>
                  </tr>
                </thead>
                <tbody>
                  {lotesFiltrados.map((l, i) => {
                    const prom = toNum(l.promedio)
                    const badge = prom >= 90 ? 'bg-primary'
                      : prom >= 85 ? 'bg-info text-dark'
                      : prom >= 75 ? 'bg-secondary'
                      : 'bg-light text-dark'
                    const label = prom >= 90 ? 'Premium'
                      : prom >= 85 ? 'Alta'
                      : prom >= 75 ? 'Media'
                      : 'Base'
                    return (
                      <tr key={i}>
                        <td className="text-truncate">{l.codigo}</td>
                        <td className="text-center">{l.catas}</td>
                        <td className="text-center">{fmt1(prom)}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress flex-grow-1" style={{ height: 6 }}>
                              <div className="progress-bar" style={{ width: `${Math.min(100, prom)}%` }} />
                            </div>
                            <span className={`badge ${badge}`}>{label}</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {!lotesFiltrados.length && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">
                        No hay lotes para {data.anio} con ese filtro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
