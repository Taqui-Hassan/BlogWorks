import React, { useState } from 'react';
import authService from '../appwrite/auth';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { Button, Input, Logo } from './index';
import { useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";

function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const create = async (data) => {
    setError("");
    try {
      const userData = await authService.createAccount(data);
      if (userData) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(login(userData));
          navigate('/');
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center w-full p-15">
      <div className="w-full max-w-md  p-6">
        
        {/* <h2 className="text-center text-sm font-bold leading-tight text-black">Sign up to create account</h2> */}
        
        {error && <p className="text-red-600 mt-8 text-center text-xs">{error}</p>}

        <form className='text-sm text-black mt-8 m-8' onSubmit={handleSubmit(create)}>
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
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </div>
        </form>
        <p className="mt-2 text-center text-base text-black/60">
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
  );
}

export default SignUp;
