import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'
function LogoutBtn() {
    const dispatch = useDispatch();
    const logoutHandler =()=>{
        authService.logout().then(()=>{
            dispatch(logout())
        })
    }
  return (
    <button className='inline-block px-6 py-2 border border-colorOrange duration-200 hover:bg-blue-300 hover:border-white  rounded-full text-black ' onClick={logoutHandler}>Logout</button>
  )
}

export default LogoutBtn