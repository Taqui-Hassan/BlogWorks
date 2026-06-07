import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { LogoutBtn } from '../index'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home',      slug: '/',          active: authStatus },
    { name: 'All Posts', slug: '/all-posts', active: authStatus },
    { name: 'Write',     slug: '/add-Post',  active: authStatus },
    { name: 'Login',     slug: '/login',     active: !authStatus },
    { name: 'Sign Up',   slug: '/SignUp',    active: !authStatus },
  ]

  const isActive = (slug) => {
    if (slug === '/') return location.pathname === '/'
    return location.pathname.startsWith(slug)
  }

  const btnStyle = (slug) => ({
    fontFamily: '"DM Sans", sans-serif',
    fontSize: '0.72rem',
    fontWeight: isActive(slug) ? 700 : 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: isActive(slug) ? '#c8392b' : '#1a1a18',
    background: 'none',
    border: 'none',
    borderBottom: isActive(slug) ? '2px solid #c8392b' : '2px solid transparent',
    padding: '0.7rem 1.2rem',
    cursor: 'pointer',
    transition: 'color 0.15s, border-color 0.15s',
  })

  const visibleItems = navItems.filter(i => i.active)

  return (
    <header style={{ background: '#faf9f6', borderBottom: '1px solid #d4cfc4' }}>

      {/* Top strip */}
      <div style={{ borderBottom: '3px double #1a1a18', padding: '0.4rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.7rem', color: '#8a8a82' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Masthead */}
      <div style={{ textAlign: 'center', padding: '1.5rem 1rem 1rem' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 900, color: '#1a1a18', margin: 0, lineHeight: 1 }}>
            BlogWorks
          </h1>
          <p style={{ fontFamily: '"Lora", serif', fontStyle: 'italic', color: '#8a8a82', fontSize: '0.85rem', margin: '0.3rem 0 0' }}>
            Ideas worth reading
          </p>
        </Link>
      </div>

      {/* Desktop Nav */}
      <nav style={{ borderTop: '1px solid #d4cfc4', borderBottom: '1px solid #d4cfc4', position: 'relative' }} className="desktop-nav">
        {/* Center: nav items */}
        <ul style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, listStyle: 'none', margin: 0, padding: 0 }}>
          {visibleItems.map((item, idx, arr) => (
            <li key={item.name} style={{ display: 'flex', alignItems: 'center' }}>
              <button
                style={btnStyle(item.slug)}
                onClick={() => navigate(item.slug)}
                onMouseEnter={e => { if (!isActive(item.slug)) e.currentTarget.style.color = '#c8392b' }}
                onMouseLeave={e => { if (!isActive(item.slug)) e.currentTarget.style.color = '#1a1a18' }}
              >
                {item.name}
              </button>
              {idx < arr.length - 1 && <span style={{ color: '#d4cfc4', fontSize: '0.7rem' }}>·</span>}
            </li>
          ))}
        </ul>

        
        {authStatus && (
          <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)' }}>
            <LogoutBtn />
          </div>
        )}
      </nav>

      {/* Mobile Nav */}
      <nav className="mobile-nav" style={{ borderTop: '1px solid #d4cfc4', borderBottom: '1px solid #d4cfc4' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem' }}>
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a8a82' }}>Menu</span>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: '#1a1a18' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        {menuOpen && (
          <ul style={{ listStyle: 'none', margin: 0, padding: '0.5rem 1rem 1rem', borderTop: '1px solid #d4cfc4' }}>
            {visibleItems.map(item => (
              <li key={item.name} style={{ borderBottom: '1px solid #f0ece3' }}>
                <button
                  onClick={() => { navigate(item.slug); setMenuOpen(false) }}
                  style={{ ...btnStyle(item.slug), padding: '0.75rem 0', width: '100%', textAlign: 'left' }}
                >
                  {item.name}
                </button>
              </li>
            ))}
            {authStatus && <li style={{ paddingTop: '0.75rem' }}><LogoutBtn /></li>}
          </ul>
        )}
      </nav>

      <style>{`
        .desktop-nav { display: block !important; }
        .mobile-nav  { display: none  !important; }
        @media (max-width: 640px) {
          .desktop-nav { display: none  !important; }
          .mobile-nav  { display: block !important; }
        }
      `}</style>
    </header>
  )
}

export default Header