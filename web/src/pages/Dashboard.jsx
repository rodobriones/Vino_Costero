import React, { useEffect, useMemo, useState } from 'react'
import api from '../api/http'

const fmt1 = (n) => (Number.isFinite(n) ? n.toFixed(1) : '0.0')

export default function Dashboard() {
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load(year = anio) {
    try {
      setLoading(true)
      setError('')
      const { data } = await api.get(`/reportes/cosecha?anio=${year}`)
      setMetrics(data)
    } catch (e) {
      setError(e?.response?.data?.error?.message || 'No se pudo cargar el reporte')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const resumen = useMemo(() => {
    if (!metrics) return { promGlobal: 0, mejores: [], lotesConProm: [] }

    // Asegurar que catas y promedio sean numéricos
    const lotesConProm = (metrics.lotes || []).map(l => {
      const catasNum = Number(l.catas ?? 0)
      const promNum = Number(l.promedio ?? 0) // <— convierte string/null a número
      // Si quieres redondear a 1 decimal para mostrar, hazlo al render (fmt1)
      return { ...l, catas: Number.isFinite(catasNum) ? catasNum : 0, promedio: Number.isFinite(promNum) ? promNum : 0 }
    })

    const mejores = [...lotesConProm].sort((a, b) => (b.promedio || 0) - (a.promedio || 0)).slice(0, 5)
    const promGlobal = lotesConProm.length
      ? (+((lotesConProm.reduce((acc, x) => acc + (x.promedio || 0), 0) / lotesConProm.length).toFixed(1)))
      : 0

    return { promGlobal, mejores, lotesConProm }
  }, [metrics])

  const MiniChart = ({ data }) => {
    const values = data.map(d => Number(d.promedio || 0))
    const max = Math.max(100, ...values, 1)
    const w = 260, h = 70, pad = 10
    const bw = (w - pad * 2) / Math.max(values.length, 1)
    return (
      <svg width={w} height={h} role="img" aria-label="Promedio por lote">
        <rect x="0" y="0" width={w} height={h} fill="transparent" />
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#ddd" />
        {values.map((v, i) => {
          const barH = Math.max(2, ((v / max) * (h - pad * 2)))
          const x = pad + i * bw + 2
          const y = h - pad - barH
          return <rect key={i} x={x} y={y} width={bw - 4} height={barH} rx="3" />
        })}
      </svg>
    )
  }

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2">
        <div className="spinner-border text-primary" role="status" />
        <span>Cargando dashboard...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div className="alert alert-danger d-flex justify-content-between align-items-center">
        <div>❗ {error}</div>
        <button className="btn btn-outline-danger btn-sm" onClick={() => load()}>Reintentar</button>
      </div>
    )
  }
  if (!metrics) return null

  return (
    <div className="pb-2">
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <h4 className="m-0">Dashboard de Cosecha</h4>
        <span className="badge bg-secondary">v0.1</span>
        <div className="ms-auto d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm"
            style={{ width: 120 }}
            value={anio}
            onChange={(e) => { setAnio(e.target.value); load(e.target.value) }}
          >
            {Array.from({ length: 6 }).map((_, i) => {
              const y = new Date().getFullYear() - i
              return <option key={y} value={y}>{y}</option>
            })}
          </select>
          <button className="btn btn-sm btn-outline-primary" onClick={() => load(anio)}>
            Refrescar
          </button>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="text-muted d-flex align-items-center gap-2 mb-1">🌿 Parcelas</div>
              <div className="h3 mb-0">{metrics.totalesParcelas}</div>
              <small className="text-muted">Registradas en el sistema</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="text-muted d-flex align-items-center gap-2 mb-1">🌱 Siembras {metrics.anio}</div>
              <div className="h3 mb-1">{metrics.totalesSiembras}</div>
              <div className="progress" style={{ height: 6 }}>
                <div className="progress-bar" role="progressbar"
                  style={{ width: `${Math.min(100, Number(metrics.totalesSiembras || 0) * 10)}%` }}
                  aria-valuenow={Number(metrics.totalesSiembras || 0)} aria-valuemin="0" aria-valuemax="100" />
              </div>
              <small className="text-muted">Evolución (escala ilustrativa)</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="text-muted d-flex align-items-center gap-2 mb-1">🍷 Lotes Catados</div>
              <div className="h3 mb-0">{metrics.lotes?.length || 0}</div>
              <small className="text-muted">Promedio global: <strong>{fmt1(resumen.promGlobal)}</strong></small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="m-0">Promedio por Lote ({metrics.anio})</h6>
                <span className="badge bg-light text-dark">{metrics.lotes?.length || 0} lotes</span>
              </div>
              <div className="border rounded p-2">
                <MiniChart data={resumen.lotesConProm || []} />
              </div>
              <small className="text-muted">Escala relativa, 100 = máximo</small>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="m-0">Top 5 Lotes por Puntaje</h6>
                <span className="badge bg-success">Mejores</span>
              </div>
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: '45%' }}>Lote</th>
                      <th style={{ width: '15%' }} className="text-center">Catas</th>
                      <th style={{ width: '20%' }} className="text-center">Prom.</th>
                      <th style={{ width: '20%' }} className="text-end">Etiqueta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(resumen.mejores || []).map((l, idx) => {
                      const prom = Number(l.promedio || 0)
                      return (
                        <tr key={idx}>
                          <td className="text-truncate">{l.codigo || l.lote || '—'}</td>
                          <td className="text-center">{Number(l.catas || 0)}</td>
                          <td className="text-center">{fmt1(prom)}</td>
                          <td className="text-end">
                            {prom >= 90 ? (
                              <span className="badge bg-primary">Premium</span>
                            ) : prom >= 85 ? (
                              <span className="badge bg-info text-dark">Alta</span>
                            ) : prom >= 75 ? (
                              <span className="badge bg-secondary">Media</span>
                            ) : (
                              <span className="badge bg-light text-dark">Base</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                    {(!resumen.mejores || !resumen.mejores.length) && (
                      <tr><td colSpan="4" className="text-center text-muted py-3">Sin datos de catas en {metrics.anio}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <small className="text-muted">Clasificación simple para presentación</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
