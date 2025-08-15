import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import RichTextEditor from './components/Campanha/createCampanhaComponent'
import './index.css';
import EnvioPage from './components/Envio/envioPage';

const App = () => {

  return (
    <StrictMode>
      <EnvioPage></EnvioPage>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<App />);