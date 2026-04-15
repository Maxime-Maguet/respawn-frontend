import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';

import { BrowserRouter } from "react-router";

import {
   QueryClient,
   QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
      <QueryClientProvider client={queryClient}>
         <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
               <StrictMode>
                  <App />
               </StrictMode>
            </PersistGate>
         </Provider>
      </QueryClientProvider>
   </BrowserRouter>
)
