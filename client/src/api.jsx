import axios from 'axios';
const backendBaseUrl = import.meta.env.VITE_BACKEND_URL || "https://mern-authentication-xi7x.onrender.com";

axios.defaults.withCredentials = true;  // This tells Axios: “Always include cookies and authentication headers when making HTTP requests — even across different origins.”
// axios.defaults.baseURL = 'http://localhost:4000';

export const register = async(data) => {
    const response = await axios.post(`${backendBaseUrl}/api/auth/register`, data);
    return response;
}

export const login = async(data) => {
    const response = await axios.post(`${backendBaseUrl}/api/auth/login`, data);
    return response;
}

export const userDetails = async () => {
    const response = await axios.get(`${backendBaseUrl}/api/user/data`);
    return response;
}

export const isAuthenticated = async () => {
    const response = await axios.get(`${backendBaseUrl}/api/auth/is-auth`);
    return response;
}

export const logout = async () => {
    const response = await axios.post(`${backendBaseUrl}/api/auth/logout`);
    return response;
}

export const sendVerifyEmailOTP = async () => {
    const response = await axios.post(`${backendBaseUrl}/api/auth/send-verify-otp`);
    return response;
}

export const verifyAccountUsingOTP = async (otp) => {
    const response = await axios.post(`${backendBaseUrl}/api/auth/verify-account`, otp);
    return response;
}

export const passwordResetOTP = async (email) => {
    const response = await axios.post(`${backendBaseUrl}/api/auth/send-reset-otp`, email);
    return response;
}

export const newPasswordChange = async (newPassword) => {
    const response = await axios.post(`${backendBaseUrl}/api/auth/reset-password`, newPassword);
    return response;
}
