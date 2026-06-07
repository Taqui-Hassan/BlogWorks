import React from 'react'
import { useDispatch } from 'react-redux'
import { logout as logoutAction } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../../api/user'
import { toast } from 'sonner'

function LogoutBtn() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = async () => {
    await logoutUser()
    dispatch(logoutAction())
    toast.success("See you next time!")
    navigate('/login')
  }

  return (
    <button
      onClick={logoutHandler}
      style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '0.72rem',
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        background: '#1a1a18',
        color: '#faf9f6',
        border: '1px solid #1a1a18',
        padding: '0.4rem 1.1rem',
        cursor: 'pointer',
        transition: 'background 0.15s, color 0.15s',
      }}
      onMouseEnter={e => { e.target.style.background = '#c8392b'; e.target.style.borderColor = '#c8392b'; }}
      onMouseLeave={e => { e.target.style.background = '#1a1a18'; e.target.style.borderColor = '#1a1a18'; }}
    >
      Sign Out
    </button>
  )
}

export default LogoutBtn
