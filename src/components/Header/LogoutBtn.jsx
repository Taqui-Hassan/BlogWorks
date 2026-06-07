import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'
import { Navigate, useNavigate } from 'react-router-dom'
function LogoutBtn() {
    const dispatch = useDispatch();
    const navigate =useNavigate();
    const logoutHandler =()=>{
        authService.logout().then(()=>{
            dispatch(logout())
        })
        navigate('/login')
        
    }
  return (
    <button   className='bg-black inline-block px-6 py-2 border border-colorOrange duration-200 hover:bg-blue-300 hover:border-white  rounded-full text-news  ' onClick={logoutHandler}>Logout</button>
  )
}

export default LogoutBtn