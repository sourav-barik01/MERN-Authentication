import React from 'react'
import logo from '../assets/logo.svg';
import arrow from '../assets/arrow_icon.svg'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContent } from '../contextAPI/AppContext';
import { logout, sendVerifyEmailOTP } from '../api';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const Navbar = () => {
    const navigate = useNavigate();
    const {userData, setUserData, setLogin} = useContext(AppContent);

    const verifyEmailMutation = useMutation({
        mutationKey: ['isEmailVerified'],
        mutationFn: sendVerifyEmailOTP,
        onSuccess: (response) => {
            if(response?.data?.success == true) {
                navigate('/email-verify');
                toast.success(response?.data?.message);
            } else {
                toast.error(response?.data?.message);
            }
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    });

    const logoutMutation = useMutation({
        mutationKey: ['isLogout'],
        mutationFn: logout,
        onSuccess: (response) => {
            if(response?.data?.success == true) {
                setLogin(false);
                setUserData(false);
                toast.success(response?.data?.message);
                navigate('/');
            } else {
                toast.error(response?.data?.message);
            }
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    });

    return (
        <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
            <img 
                onClick={()=>navigate('/')} 
                src={logo} 
                alt="Img Not Available" 
                draggable={false} 
                className='w-28 sm:w-32 cursor-pointer' 
            />
            {userData ? (
                <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer'>
                    {userData?.name[0].toUpperCase()}
                    <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
                        <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
                            {!userData?.isAccountVerified && <li onClick={() => verifyEmailMutation.mutate()} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li>}
                            <li onClick={() => logoutMutation.mutate()} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
                        </ul>
                    </div>
                </div>
            ) : (
                <button onClick={() => navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2
                text-gray-800 hover:bg-gray-100 transition-all cursor-pointer'>
                    Login <img src={arrow} alt="" />
                </button>
            )}
        </div>
    )
}

export default Navbar