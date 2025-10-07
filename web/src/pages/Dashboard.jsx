import React, { useEffect, useState } from 'react'
import api from '../api/http'

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  useEffect(() => {
    (async () => {
      const year = new Date().getFullYear()
      const { data } = await api.get(`/reportes/cosecha?anio=${year}`)
      setMetrics(data)
    })()
  }, [])
  if (!metrics) return <div>Cargando...</div>
  return (
    <div>
      <h4 className="mb-3">Dashboard</h4>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card p-3">
            <div className="text-muted">Parcelas</div>
            <div className="h3">{metrics.totalesParcelas}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <div className="text-muted">Siembras {metrics.anio}</div>
            <div className="h3">{metrics.totalesSiembras}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <div className="text-muted">Lotes Catas</div>
            <div className="h3">{metrics.lotes.length}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
