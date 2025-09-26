import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input, Logo } from './index'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { useForm } from 'react-hook-form'

import './login.css'

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("")
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const login = async (data) => {

        setIsLoggingIn(true)
        setTimeout(async()=>{

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
                setIsLoggingIn(false)
            }
        })
    }

    return (
        <div className=''>


            {/* <div className={`pb-0 w-full bg-white ${isLoggingIn?'slide-out-left' :'slide-in-left'}`}>
                            
            </div> */}
            <div className="h-[585px] flex justify-center items-center bg-[url('/public/bgHome.webp')]">
                <div className="w-full">


                    {/* <h2 className="text-center text-sm font-bold leading-tight text-black">Sign in to your account</h2> */}

                    {error && <p className='text-red-600 mt-15 text-xs'>{error}</p>}

                    <div className='text-black font-satoshi font-mono text-7xl'>BLOG IN! </div>

                    <form onSubmit={handleSubmit(login)} className='mt-8'>
                        <div className='space-y-5 text-sm text-black'>
                            <Input //label="Email:"
                                placeholder='EMAIL'
                                className={`font-bold p-2 rounded border placeholder-textColor bg-gray-200  placeholder-shown:bg-loginColor  focus:bg-white 
                           `}
                                // className='w-full p-2 placeholder-gray-500 placeholder-bg-blue  '
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
                                className='font-bold p-2 rounded border bg-gray-200 placeholder-shown:bg-loginColor  focus:bg-white '
                                placeholder='PASSWORD'
                                {
                                ...register('password', {
                                    required: "Password is required",
                                })
                                } />
                            {errors.password && (
                                <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>
                            )}
                            <button
                                type="submit"
                                className="bg-black text-news text-bold cursor-pointer p-2 rounded-3xl hover:bg-white"
                            >Log Me IN!</button>
                        </div>

                    </form>
                    <p className="mt-2 text-center text-xl font-bold text-black">
                        Don&apos;t have any account?&nbsp;
                        <Link
                            to="/SignUp"
                            className="font-medium text-primary transition-all duration-200 hover:underline"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login