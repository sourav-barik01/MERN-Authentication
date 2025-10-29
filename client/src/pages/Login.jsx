import React, { useContext } from 'react'
import { useState } from 'react';
import name from "../assets/person_icon.svg";
import email from "../assets/mail_icon.svg";
import password from "../assets/lock_icon.svg";
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../contextAPI/AppContext';
import {useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {register, login} from "../api";

const Login = () => {
	const navigate = useNavigate();
	const {setLogin, refetch} = useContext(AppContent);
	const [state, setState] = useState('Sign Up');
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: ''
	});

	const registerMuation = useMutation({
		mutationFn: register,
		onSuccess: (response) => {
			if(response?.data?.success == true) {
				setLogin(true);
				refetch();
				navigate('/');
				toast.success(response?.data?.message)
			} else {
				toast.error(response?.data?.message);
			}
		},
		onError: (error) => {
			toast.error(error.data?.message || 'Something went wrong')
		}
	});

	const loginMuation = useMutation({
		mutationFn: login,
		onSuccess: (response) => {
			if(response?.data?.success == true) {
				setLogin(true);
				refetch();
				navigate('/');
				toast.success(response?.data?.message)
			} else {
				toast.error(response?.data?.message);
			}
		},
		onError: (error) => {
			toast.error(error?.data?.message || 'Something went wrong')
		}
	});

	const onSubmitHandler = async (e) => {
		try {
			e.preventDefault();
			if(state === 'Sign Up'){
				registerMuation.mutate(formData);
			} else {
				const { email, password } = formData;
				loginMuation.mutate({ email, password });
			}
		} catch (error) {
			toast.error("Unexpected Error!! Try Again after Sometime")
		}
	}

	return (
		<div className='flex items-center justify-center min-h-screen px-6 sm:px-0'>
			<div className='bg-[#D0D0D0] p-10 rounded-lg shadow-lg w-full sm:w-96 text-gray-500 text-sm'>
				<h2 className='text-3xl font-semibold text-black text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
				<p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create Your Account' : 'Login to your Account!!'}</p>
				<form onSubmit={onSubmitHandler}>
					{state === 'Sign Up' && (<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#E0E0E0]'>
						<img src={name} alt="Img Not Available" className="brightness-0 saturate-100" />
						<input 
							onChange={(e)=>setFormData((prev)=>({...prev, name: e.target.value}))} 
							value={formData?.name}
							type="text" 
							className='bg-transparent outline-none' 
							placeholder='Full Name' 
							required 	
						/>
					</div>)}
					<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#E0E0E0]'>
						<img src={email} alt="Img Not Available" className="brightness-0 saturate-100" />
						<input 
							onChange={(e)=>setFormData((prev)=>({...prev, email: e.target.value}))} 
							value={formData?.email}
							type="email" 
							className='bg-transparent outline-none' 
							placeholder='abc@email.com' 
							required 
						/>
					</div>
					<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#E0E0E0]'>
						<img src={password} alt="Img Not Available" className="brightness-0 saturate-100" />
						<input 
							onChange={(e)=>setFormData((prev)=>({...prev, password: e.target.value}))} 
							value={formData?.password}
							type="password" 
							className='bg-transparent outline-none' 
							placeholder='Password' 
							required 
						/>
					</div>
					<p onClick={()=>navigate('/reset-password')} className='mb-4 text-gray-500 cursor-pointer'>Forgot Password ?</p>
					<button className="w-full cursor-pointer py-2.5 rounded-full bg-linear-to-r from-gray-500 to-gray-700 text-white font-medium">{state}</button>
				</form>
				{state === 'Sign Up' ? (<p className='text-gray-500 text-center text-xs mt-4'>Already have an account ?{' '}
					<span className='text-blue-600 cursor-pointer underline' onClick={() => setState('Login')}>Login Here</span>
				</p>) : (<p className='text-gray-500 text-center text-xs mt-4'>Don't Have Account ?{' '}
					<span className='text-blue-600 cursor-pointer underline' onClick={() => setState('Sign Up')}>Sign Up</span>
				</p>)}

			</div>
		</div>
	)
}

export default Login