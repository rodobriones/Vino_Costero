import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthCtx = createContext()

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [rol, setRol] = useState(localStorage.getItem('rol') || '')
  const [nombre, setNombre] = useState(localStorage.getItem('nombre') || '')

  useEffect(() => {
    axios.defaults.baseURL = API
    axios.interceptors.request.use(cfg => {
      if (token) cfg.headers.Authorization = `Bearer ${token}`
      return cfg
    })
  }, [token])

  function login(data) {
    setToken(data.token)
    setRol(data.rol)
    setNombre(data.nombre)
    localStorage.setItem('token', data.token)
    localStorage.setItem('rol', data.rol)
    localStorage.setItem('nombre', data.nombre)
  }
  function logout() {
    setToken(''); setRol(''); setNombre('')
    localStorage.removeItem('token'); localStorage.removeItem('rol'); localStorage.removeItem('nombre')
  }

  return <AuthCtx.Provider value={{ token, rol, nombre, login, logout }}>
    {children}
  </AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
