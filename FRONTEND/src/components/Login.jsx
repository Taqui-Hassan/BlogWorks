import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login as loginAction } from "../store/authSlice"
import { Input } from "./index"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import { getCurrentUser, loginUser } from "../api/user"

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const login = async (data) => {
    setIsLoggingIn(true)
    setError("")
    try {
      await loginUser({ email: data.email, password: data.password })
      const res = await getCurrentUser()
      const userData = res?.data?.user || res?.data || res
      if (userData?._id) {
        dispatch(loginAction(userData))
        navigate("/")
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Check your credentials")
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div style={{ background: '#faf9f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', borderTop: '3px double #1a1a18', borderBottom: '3px double #1a1a18', padding: '2rem 1.5rem', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.2rem', fontWeight: 900, color: '#1a1a18', margin: '0 0 0.3rem' }}>Welcome Back</h1>
          <p style={{ fontFamily: '"Lora", serif', fontStyle: 'italic', color: '#8a8a82', margin: 0, fontSize: '0.9rem' }}>Sign in to continue writing</p>
        </div>

        {error && (
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.8rem', color: '#c8392b', marginBottom: '1.2rem', padding: '0.7rem 1rem', border: '1px solid #c8392b', background: '#fff5f5' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(login)}>
          <div style={{ marginBottom: '1.6rem' }}>
            <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8a82', display: 'block', marginBottom: '0.4rem' }}>Email</label>
            <input
              className="editorial-input"
              type="email"
              placeholder="your@email.com"
              {...register("email", {
                required: true,
                validate: { matchPattern: (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Invalid email" }
              })}
            />
            {errors.email && <p style={{ color: '#c8392b', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8a82', display: 'block', marginBottom: '0.4rem' }}>Password</label>
            <input
              className="editorial-input"
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p style={{ color: '#c8392b', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isLoggingIn} className="btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '0.8rem' }}>
            {isLoggingIn ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.8rem', textAlign: 'center', marginTop: '1.5rem', color: '#4a4a45' }}>
          No account yet?{' '}
          <Link to="/SignUp" style={{ color: '#c8392b', textDecoration: 'none', fontWeight: 500 }}>Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
