// src/main.tsx - VERIFIQUE SE O SEU ESTÁ IGUAL A ESTE

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import router from './routes'; // Importa nossa configuração central
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* É AQUI QUE A MÁGICA ACONTECE. NADA DE <App /> */}
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}