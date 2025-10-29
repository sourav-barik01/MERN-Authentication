import React, {useContext, useEffect, useRef} from 'react';
import { verifyAccountUsingOTP } from '../api';
import toast from 'react-hot-toast';
import { AppContent } from '../contextAPI/AppContext';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

const EmailVerify = () => {
	const {login, userData, refetch} = useContext(AppContent);
	const navigate = useNavigate();
	const inputRefs = useRef([]);

	const verifyAccountMutation = useMutation({
		mutationKey: ['verifyAccount'],
		mutationFn: verifyAccountUsingOTP,
		onSuccess: (response) => {
			if(response?.data?.success == true) {
				toast.success(response?.data?.message);
				refetch();
				navigate('/');
			} else {
				toast.error(response?.data?.message);
			}
		},
		onError: (error) => {
			toast.error(error?.response?.data?.message || 'Something went wrong')
		}
	});

	const onSubmitHandler = async (e) => {
		try {
			e.preventDefault();
			const otpArray = inputRefs.current.map(e => e.value);
			const otp = otpArray.join('');
			verifyAccountMutation.mutate({otp: otp});
		} catch (error) {
			toast.error("Unexpected Error!! Try Again after Sometime")
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

	useEffect(() => {
		login && userData && userData?.isAccountVerified && navigate('/')
	}, [login, userData])

	return (
		<div className='flex items-center justify-center min-h-screen'>
			<form onSubmit={onSubmitHandler} className='bg-[#D0D0D0] p-8  rounded-lg shadow-lg w-96 text-sm'>
				<h1 className='text-black text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
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
				<button className='w-full py-3 bg-linear-to-r from-gray-500 to-gray-700 text-white rounded-full cursor-pointer'>Verify Email</button>
			</form>
		</div>
	)
}

export default EmailVerify