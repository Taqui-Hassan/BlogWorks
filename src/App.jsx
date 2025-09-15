import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from './appwrite/auth';
import { login, logout } from "./store/authSlice"
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Outlet } from 'react-router-dom';
import Home from './pages/Home';

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
    <div className='min-h-screen flex flex-wrap
    bg-gray-600 
    '>
      <div className='w-full block'>
        <Header/>
        <Home/>
        {/* <main className='bg-black'>
          <Outlet/>
        </main> */}
        <Footer/>
      </div>
    </div>
  ) : null
}

export default App
