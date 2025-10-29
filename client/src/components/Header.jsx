import React, { useContext } from 'react'
import { AppContent } from '../contextAPI/AppContext'

const Header = () => {
    const {userData} = useContext(AppContent);
    return (
        <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
            <h1 className='flex items-center text-xl sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name : 'Developer'}!!</h1>
            <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to MERN Auth</h2>
            <p className='mb-8 max-w-md'>
                Feel a complete MERN Authentication System with Email Verification and Password Reset features. 
                Our app securely handles user authentication using JWT and a 6-digit OTP sent directly to the 
                user’s email. Experience modern authentication with React, Node.js, Express, and MongoDB.
            </p>
        </div>
    )
}

export default Header