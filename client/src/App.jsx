import React from 'react'
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import EmailVerify from './pages/EmailVerify';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Layout from './pages/Layout';

const App = () => {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/email-verify' element={<EmailVerify />} />
				<Route path='/reset-password' element={<ResetPassword />} />
			</Route>
		</Routes>
	)
}

export default App