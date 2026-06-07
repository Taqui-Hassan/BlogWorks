import React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { login, logout } from "./store/authSlice"
import Header from './components/Header/Header'
import { Outlet } from 'react-router-dom'
import './index.css'
import { Toaster } from 'sonner'
import { getCurrentUser } from './api/user'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    let mounted = true
    async function initAuth() {
      try {
        const res = await getCurrentUser()
        const userData = res?.data?.user || res?.data || res
        if (userData?._id && mounted) dispatch(login(userData))
        else if (mounted) dispatch(logout())
      } catch {
        if (mounted) dispatch(logout())
      } finally {
        if (mounted) setLoading(false)
      }
    }
    initAuth()
    return () => { mounted = false }
  }, [dispatch])

  return !loading ? (
    <div style={{ minHeight: '100vh', background: '#faf9f6' }}>
      <Header />
      <main>
        <Outlet />
      </main>
      <footer style={{ borderTop: '3px double #1a1a18', padding: '2rem 1.5rem', textAlign: 'center', marginTop: '4rem' }}>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a8a82', margin: 0 }}>
          Made with ❤️ by Taqui
        </p>
      </footer>
      <Toaster richColors closeButton position="top-center" duration={3000} />
    </div>
  ) : null
}

export default App
