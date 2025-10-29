import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AppContextProvider } from './contextAPI/AppContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<AppContextProvider>
					<App />
					<Toaster
						position="top-right"
						reverseOrder={false}
					/>
				</AppContextProvider>
			</QueryClientProvider>
		</BrowserRouter>
	</StrictMode>
)