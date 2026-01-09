"use client"

import { createContext, useContext, ReactNode } from "react";
import { toast, ToastContainer,ToastOptions } from "react-toastify";
import "react-toastify/ReactToastify.css";

type NotifyType = 
"success" |
"error" | 
"info" | 
"warning" 

interface NotificationContextType {
	notify: (message: string, type?: NotifyType, options?: ToastOptions) => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
	const notify = (
		message: string,
		type: NotifyType = "info",
		options?: ToastOptions
	) => {
		toast[type](message, {
			position: "bottom-right",
			autoClose: 3000,
			hideProgressBar: false,
			pauseOnHover: true,
			...options
		})
	}

	return (
		<NotificationContext.Provider value={{ notify }}>
			{children}
			<ToastContainer />
		</NotificationContext.Provider>
	)
}
	

export const useNotification = () => {
	const ctx = useContext(NotificationContext)

	if (!ctx) {
		throw new Error("useNotification must be inside a NotificationProvider");
	}

	return ctx
}
