import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import authService from './appwrite/auth';
import { login, logout } from "./store/authSlice"
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Outlet } from 'react-router-dom';

import './App.css'

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    authService.getCurrentUser().
      then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        }
        else{
          dispatch(logout())
        }

      })
      .finally(()=>setLoading(false))
  }, [])


  return !loading ? (
    <div className='min-h-screen flex flex-wrap bg-center bg-no-repeat  bg-cover bg-[url("./bgimage.webp'>
      <div className='w-full block")]'>
        <Header/>
          
        <main className='text-center text-4xl text-white flex-row
        justify-center items-center p-2 '>
          
          <Outlet/>
        </main>
        {/* <Footer/> */}
      </div>
    </div>
  ) : null
}

export default App
