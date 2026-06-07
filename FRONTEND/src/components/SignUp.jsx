import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { registerUser } from "../api/user"

function SignUp() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const create = async (data) => {
    setIsSubmitting(true)
    try {
      await registerUser({ fullName: data.fullName, email: data.email, password: data.password })
      toast.success("Account created! Please sign in.")
      reset()
      navigate("/login")
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong"
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ background: '#faf9f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', borderTop: '3px double #1a1a18', borderBottom: '3px double #1a1a18', padding: '2rem 1.5rem', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.2rem', fontWeight: 900, color: '#1a1a18', margin: '0 0 0.3rem' }}>Start Your Story</h1>
          <p style={{ fontFamily: '"Lora", serif', fontStyle: 'italic', color: '#8a8a82', margin: 0, fontSize: '0.9rem' }}>Join BlogWorks and start writing</p>
        </div>

        <form onSubmit={handleSubmit(create)}>
          <div style={{ marginBottom: '1.6rem' }}>
            <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8a82', display: 'block', marginBottom: '0.4rem' }}>Full Name</label>
            <input className="editorial-input" placeholder="Your name" {...register("fullName", { required: true })} />
          </div>

          <div style={{ marginBottom: '1.6rem' }}>
            <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8a82', display: 'block', marginBottom: '0.4rem' }}>Email</label>
            <input className="editorial-input" type="email" placeholder="your@email.com"
              {...register("email", {
                required: true,
                validate: { matchPattern: (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Invalid email" }
              })}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8a82', display: 'block', marginBottom: '0.4rem' }}>Password</label>
            <input className="editorial-input" type="password" placeholder="••••••••" {...register("password", { required: true })} />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '0.8rem' }}>
            {isSubmitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.8rem', textAlign: 'center', marginTop: '1.5rem', color: '#4a4a45' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#c8392b', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
