import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom';
import router from  './router.jsx';
// import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <React.Suspense fallback="Loading...">
        <RouterProvider router={router} />
        {/* <Toaster /> */}
  </React.Suspense>
</React.StrictMode>,
)