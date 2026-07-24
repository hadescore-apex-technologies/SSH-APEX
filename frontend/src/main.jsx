import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './components/Toast.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { HelmetProvider } from 'react-helmet-async'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminApp from './admin/AdminApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Admin routes will match /admin/* */}
              <Route path="/admin/*" element={<AdminApp />} />
              {/* Main app matches everything else */}
              <Route path="/*" element={<App />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)
