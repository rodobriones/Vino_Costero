import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Parcelas from './pages/Parcelas.jsx'
import TiposUva from './pages/TiposUva.jsx'
import Siembras from './pages/Siembras.jsx'
import ReporteCosecha from './pages/ReporteCosecha.jsx'
import Catas from './pages/Catas.jsx'
import Enfermedades from './pages/Enfermedades.jsx'
import Lotes from './pages/Lotes.jsx'
import { AuthProvider, useAuth } from './context/auth.jsx'

function Protected({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function Layout({ children }) {
  const { token, logout, rol } = useAuth()
  return (
    <div className="container py-3">
      <nav className="d-flex gap-3 mb-3 align-items-center">
        <Link to="/">Dashboard</Link>
        <Link to="/parcelas">Parcelas</Link>
        <Link to="/tipos-uva">Tipos de Uva</Link>
        <Link to="/siembras">Siembras</Link>
        <Link to="/catas">Catas</Link>
        <Link to="/enfermedades">Enfermedades</Link>
        <Link to="/reporte">Reporte</Link>
        <Link to="/lotes">Lotes</Link>
        <div className="ms-auto">
          {token ? (
            <>
              <span className="me-3 badge bg-secondary">{rol}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={logout}>Salir</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          )}
        </div>
      </nav>
      {children}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout><Protected><Dashboard /></Protected></Layout>} />
        <Route path="/parcelas" element={<Layout><Protected><Parcelas /></Protected></Layout>} />
        <Route path="/tipos-uva" element={<Layout><Protected><TiposUva /></Protected></Layout>} />
        <Route path="/siembras" element={<Layout><Protected><Siembras /></Protected></Layout>} />
        <Route path="/catas" element={<Layout><Protected><Catas /></Protected></Layout>} />
        <Route path="/enfermedades" element={<Layout><Protected><Enfermedades /></Protected></Layout>} />
        <Route path="/reporte" element={<Layout><Protected><ReporteCosecha /></Protected></Layout>} />
        <Route path="/lotes" element={<Layout><Protected><Lotes /></Protected></Layout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  )
}
