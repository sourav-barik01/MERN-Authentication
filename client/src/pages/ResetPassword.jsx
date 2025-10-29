import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import emailIcon from "../assets/mail_icon.svg";
import passwordIcon from "../assets/lock_icon.svg";
import { passwordResetOTP, newPasswordChange } from '../api';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const ResetPassword = () => {
	const navigate = useNavigate();
	const inputRefs = useRef([]);
	const [email, setEmail] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [emailSent, setEmailSent] = useState('');
	const [otp, setOtp] = useState(0);
	const [otpSubmit, setOtpSubmit] = useState(false);

	const emailForPasswordResetOtpMutation = useMutation({
		mutationKey: ['requestEmailForOTP'],
		mutationFn: passwordResetOTP,
		onSuccess: (response) => {
			if(response?.data?.success == true) {
				setEmailSent(true);
				toast.success(response?.data?.message);
			} else {
				toast.error(response?.data?.message);
			}
		},
		onError: (error) => {
			toast.error(error?.response?.data?.message || 'Something went wrong')
		}
	});
	const onSubmitEmail = async (e) => {
		e.preventDefault();
		try {
			emailForPasswordResetOtpMutation.mutate({email: email});
		} catch (error) {
			toast.error(error?.message || "Unexpected Error!! Try Again after Sometime");
		}
	};

	const onSubmitOTP = async (e) => {
		e.preventDefault();
		const otpArray = inputRefs.current.map(e => e.value);
		setOtp(otpArray.join(''));
		setOtpSubmit(true);
	}

	const newPasswordChangeMutation = useMutation({
		mutationKey: ['newPasswordChange'],
		mutationFn: newPasswordChange,
		onSuccess: (response) => {
			if(response?.data?.success == true) {
				toast.success(response?.data?.message);
				navigate('/login')
			} else {
				toast.error(response?.data?.message);
			}
		},
		onError: (error) => {
			toast.error(error?.response?.data?.message || 'Something went wrong')
		}
	});
	const onSubmitNewPassword = async (e) => {
		e.preventDefault();
		try {
			newPasswordChangeMutation.mutate({email: email, otp: otp, newPassword: newPassword});
		} catch (error) {
			toast.error(error?.message || "Unexpected Error!! Try Again after Sometime");
		}
	}

	const handleInput = (e, idx) => {
		if(e.target.value.length > 0 && idx < inputRefs.current.length - 1) {
			inputRefs.current[idx + 1].focus();
		}
	}

	const handleKeyDown = (e, idx) => {
		if(e.key === 'Backspace' && e.target.value === '' && idx > 0) {
			inputRefs.current[idx - 1].focus();
		}
	}

	const handlePaste = (e) => {
		const paste = e.clipboardData.getData('text');
		const pasteArray = paste.split('');
		pasteArray.forEach((char, idx) => {
			if(inputRefs.current[idx]) {
				inputRefs.current[idx].value = char;
			}
		})
	}

	return (
		<div className='flex items-center justify-center min-h-screen'>
			{/* Reset Password -> Email-id Needed for OTP */}
			{!emailSent && <form onSubmit={onSubmitEmail} className='bg-[#D0D0D0] p-8  rounded-lg shadow-lg w-96 text-sm'>
				<h1 className='text-black text-2xl font-semibold text-center mb-4'>Reset Password</h1>
				<p className='text-center mb-6 text-gray-500'>Enter your registered email addess</p>
				<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#E0E0E0]'>
					<img 
						src={emailIcon} 
						alt="Email Img" 
						className="brightness-0 saturate-100"
					/>
					<input 
						type="email"
						className='bg-transparent outline-none text-gray-500' 
						placeholder='abc@email.com'  
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
				</div>
				<button className='w-full py-2.5 bg-linear-to-r from-gray-500 to-gray-700 text-white rounded-full cursor-pointer mt-3'>Submit</button>
			</form>}

			{/* OTP Form */}
			{!otpSubmit && emailSent && <form onSubmit={onSubmitOTP} className='bg-[#D0D0D0] p-8  rounded-lg shadow-lg w-96 text-sm'>
				<h1 className='text-black text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
				<p className='text-center mb-6 text-gray-500'>Enter 6-digit OTP sent to your email</p>
				<div className='flex justify-between mb-8' onPaste={handlePaste}>
					{Array(6).fill(0).map((_, idx) => {
						return <input
							type="text"
							required
							maxLength='1'
							className='w-12 h-12 bg-[#E0E0E0] text-gray-500 text-center text-xl rounded-md outline-none'
							onInput={(e) => handleInput(e, idx)}
							onKeyDown={(e) => handleKeyDown(e, idx)}
							ref={e => inputRefs.current[idx] = e}
							key={idx}
						/>
					})}
				</div>
				<button className='w-full py-2.5 bg-linear-to-r from-gray-500 to-gray-700 text-white rounded-full cursor-pointer'>Submit</button>
			</form>}

			{/* Enter New Password Form */}
			{otpSubmit && emailSent && <form onSubmit={onSubmitNewPassword} className='bg-[#D0D0D0] p-8  rounded-lg shadow-lg w-96 text-sm'>
				<h1 className='text-black text-2xl font-semibold text-center mb-4'>New Password</h1>
				<p className='text-center mb-6 text-gray-500'>Enter New Password</p>
				<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#E0E0E0]'>
					<img 
						src={passwordIcon} 
						alt="Email Img" 
						className="brightness-0 saturate-100"
					/>
					<input 
						type="password"
						className='bg-transparent outline-none text-gray-500' 
						placeholder='Password'  
						value={newPassword}
						onChange={e => setNewPassword(e.target.value)}
						required
					/>
				</div>
				<button className='w-full py-2.5 bg-linear-to-r from-gray-500 to-gray-700 text-white rounded-full cursor-pointer mt-3'>Submit</button>
			</form>}
		</div>
	)
}

export default ResetPassword