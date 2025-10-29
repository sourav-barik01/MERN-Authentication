import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createContext, useState } from "react";
import { userDetails, isAuthenticated } from "../api";
import toast from 'react-hot-toast';
export const AppContent = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [login, setLogin] = useState(false);
    const [userData, setUserData] = useState(false);

    // User Details Query ----->
    const {data, refetch, isSuccess, isError, error} = useQuery({
        queryKey: ['userDetails'],
        queryFn: userDetails,
        refetchOnWindowFocus: false,
        retry: false,
        enabled: false,
    });

    useEffect(() => {
        if (isSuccess && data) {
            setUserData(data?.data?.userData);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (isError && error) {
            toast.error(error?.response?.data?.message || "An error occurred");
        }
    }, [isError, error]);

    // Authentication Check Query ----->
    const {data: isAuth, isSuccess: isAuthnSuccess, isError: isAuthnError, error: error1} = useQuery({
        queryKey: ['isAuthn'],
        queryFn: isAuthenticated,
        refetchOnWindowFocus: false,
        retry: false,
    });

    useEffect(() => {
        if (isAuthnSuccess && isAuth) {
            if (isAuth?.data?.success === true) {
                setLogin(true);
                refetch();
            }
        }
    }, [isAuthnSuccess, isAuth]);

    useEffect(() => {
        if (isAuthnError && error1) {
            toast.error(error1?.response?.data?.message || "Authentication failed");
        }
    }, [isAuthnError, error1]);

    const value = {backendUrl, login, setLogin, userData, setUserData, refetch};

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}