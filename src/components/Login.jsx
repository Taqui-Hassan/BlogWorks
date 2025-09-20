import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input, Logo } from './index'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { useForm } from 'react-hook-form'



function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("")
    const { register, handleSubmit ,formState:{errors}} = useForm();

    const login = async (data) => {
        setError('')
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if (userData) dispatch(authLogin(userData))
                navigate("/")
            }
            // if(data=""){
            //     {error && <p className='text-red-600 mt-8'>{error}</p>}
            // }

        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="flex items-center justify-center w-full p-23">
      <div className="w-full max-w-md bg-white rounded-xl p-10 border border-black/10">
        
                
                <h2 className="text-center text-sm font-bold leading-tight text-black">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/SignUp"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className='text-red-600 mt-8 text-xs'>{error}</p>}


                
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5 text-sm text-black'>
                        <Input //label="Email:"
                            placeholder='Enter your email'
                            className='w-full rounded-4xl border border-gray-300 p-2'
                            type='email'
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",


                                }

                            })}

                        />
                        {errors.email && (
    <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>
)}
                        <Input //label='Password'
                            type='password'
                            className='w-full rounded-md border border-gray-300 p-2'
                            placeholder='Enter your password'
                            {
                            ...register('password', {
                                required: "Password is required",
                            })
                            } />
                             {errors.password && (
    <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>
)}
                        <Button
                            type="submit"
                            className="w-full cursor-pointer"
                        >Sign in</Button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Login