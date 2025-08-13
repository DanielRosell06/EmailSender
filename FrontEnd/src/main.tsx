import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import RichTextEditor from './components/Campanha/createCampanhaComponent'
import './index.css';

const App = () => {

  return (
    <StrictMode>
      <RichTextEditor></RichTextEditor>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<App />);