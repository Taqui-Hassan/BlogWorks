import React, { useState } from 'react';
import authService from '../appwrite/auth';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { Button, Input, Logo } from './index';
import { useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const { register, handleSubmit,reset } = useForm();
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const create = async (data) => {
    setError("");
    setIsLoggingIn(true)
    setSuccessMessage("")
    try {
      const userData = await authService.createAccount(data);
      if (userData) {
        setSuccessMessage("Account Created Successfully! You may Login now...");
        reset();

        
      }
    } catch (error) {
      setError(error.message);
    } finally {

      setIsLoggingIn(false)
    }
  };

  return (
    <div className=''>
      <div className="h-[585px] flex justify-center items-center bg-[url('/public/bgHome.webp')]">
        <div className="w-full ">

          {/* <h2 className="text-center text-sm font-bold leading-tight text-black">Sign up to create account</h2> */}

          {error && <p className="text-black mt-8 text-center text-xs">{error}</p>}
          {successMessage && <p className="text-black font-bold mt-8 text-center text-xl">{successMessage}</p>}

          <form className='text-sm text-black mt-8 m-8' onSubmit={handleSubmit(create)}>
            <div className='pl-20 pb-2 text-black font-satoshi font-mono text-7xl mb-2'>Start Your Chapter... </div>
            <div className=" text-sm space-y-5">
              <Input
                //label="Full Name: "
                placeholder="USERNAME"
                className='w-full rounded-md text-sm  placeholder-shown:bg-loginColor'

                {...register("name", {
                  required: true,
                })}
              />
              <Input
                // label="Email: "
                placeholder="EMAIL"
                className='w-full rounded-md border border-gray-300 p-2  placeholder-shown:bg-loginColor'
                type="email"
                {...register("email", {
                  required: true,
                  validate: {
                    matchPattern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                      "Email address must be a valid address",
                  },
                })}
              />
              <Input
                // label="Password: "
                type="password"
                className='w-full rounded-md border border-gray-300 p-2  placeholder-shown:bg-loginColor'
                placeholder="PASSWORD"
                {...register("password", {
                  required: true,
                })}
              />
              <button type="submit" className="bg-black text-news text-bold cursor-pointer p-2 rounded-3xl hover:bg-white">
                Create Account
              </button>
            </div>
          </form>
          <p className="mt-2 font-bold text-center text-xl text-black">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary transition-all duration-200 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
