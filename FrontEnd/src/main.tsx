import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import RichTextEditor from './components/Campanha/createCampanhaComponent'
import './index.css';
import EnvioPage from './components/Envio/envioPage';
import CreateListModal from './components/Lista/createModal';
import HtmlEditor from './components/Campanha/createCampanhaComponent';

const App = () => {

  return (
    <StrictMode>
      <EnvioPage></EnvioPage>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<App />);