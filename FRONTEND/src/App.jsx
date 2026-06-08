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

      const toastId = toast.loading("Connecting to server… (first load may take ~30 sec)")
      try {
        const res = await getCurrentUser()

      } catch {
        if (mounted) dispatch(logout())
      } finally {
        toast.dismiss(toastId)
        if (mounted) setLoading(false)
      }
    }
    initAuth()
    return () => { mounted = false }
  }, [dispatch])

  return loading ? (
    <div style={{
      minHeight: '100vh', background: '#faf9f6',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1rem'
    }}>
      <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', fontWeight: 900, color: '#1a1a18' }}>
        BlogWorks
      </div>
      <p style={{ fontFamily: '"Lora", serif', fontStyle: 'italic', color: '#8a8a82', fontSize: '0.9rem' }}>
        Waking up the server…
      </p>
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c8392b', display: 'inline-block', animation: `bounce 1s ${i * 0.15}s infinite ease-in-out` }} />
        ))}
      </div>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-10px)} }`}</style>
    </div>
  ) : (
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
  )
}

export default App
