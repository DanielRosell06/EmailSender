import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Modal from './components/Modal.tsx';
import CSVReader from './components/CSVReader.tsx';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import { FaPlus } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

// URL da sua API
const API_URL = "http://127.0.0.1:8000";

const App = () => {
  const [listaTitle, setListaTitle] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);

  // Função para adicionar um e-mail ao estado
  const handleAddEmail = () => {
    if (emailInput && !emails.includes(emailInput)) {
      setEmails([...emails, emailInput]);
      setEmailInput('');
    }
  };

  // Função para remover um e-mail do estado
  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  // Função para criar a lista na API
  const handleSaveList = async () => {
    try {
      const newLista = {
        Titulo: listaTitle,
        Emails: emails
      };

      const response = await fetch(`${API_URL}/listas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLista),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar a lista.');
      }

      const savedList = await response.json();
      console.log('Lista salva com sucesso:', savedList);

      // Limpa o estado
      setListaTitle('');
      setEmails([]);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <StrictMode>
      <div className='h-[100vh] w-[100vw] text-center'>
        <Modal
          buttonTitle='Criar Lista'
          buttonClassName='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium items-center gap-2 hover:opacity-90 transition-opacity'
          modalTitle='Criar Lista'
          onClose={() => setEmails([])}
        >
          {/* Seção de Título */}
          <div className='flex h-10'>
            <h1 className='mt-auto mb-auto font-bold mr-2 text-xl'>Título:</h1>
            <Input
              className="mt-auto mb-auto border-slate-300 placeholder:text-slate-400 
                transition-all ease-in-out duration-300
                focus:bg-slate-200 rounded-full
                focus:ring-0 focus:ring-offset-0 focus:ring-transparent 
                focus:border-none focus:outline-none"
              placeholder="Insira um Título"
              value={listaTitle}
              onChange={(e) => setListaTitle(e.target.value)}
            />
          </div>

          {/* Seção de Adicionar E-mail */}
          <div className='flex text-left mt-4'>
            <div className='w-[300px] mr-6'>
              <h1 className='font-bold text-xl'>Adicionar E-mail</h1>
              <h3 className='text-slate-500'>Digite o e-mail e aperte o botão ao lado.</h3>
              <div className='flex mt-2'>
                <Input
                  className="w-60 mt-auto mb-auto border-slate-300 placeholder:text-slate-400 
                    transition-all ease-in-out duration-300
                    focus:bg-slate-200 rounded-full
                    focus:ring-0 focus:ring-offset-0 focus:ring-transparent 
                    focus:border-none focus:outline-none"
                  placeholder="insira um e-mail"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
                />
                <Button
                  className='mt-auto mb-auto ml-2 w-10 h-10 rounded-full bg-slate-300 transition-all ease-in-out duration-300 hover:cursor-pointer
                    hover:bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-indigo-600/50 
                    via-fuchsia-500 to-red-500/50 text-white'
                  onClick={handleAddEmail}
                >
                  <FaPlus className='text-white'></FaPlus>
                </Button>
              </div>
            </div>

            {/* Seção de Arquivo .csv (mantida sem funcionalidade de API) */}
            <CSVReader onLoadEmails={(e: any) => {
              if (Array.isArray(e.value)) {
                // value é um array de e-mails do CSV
                setEmails(prev => [
                  ...prev,
                  ...e.value.filter(
                    (email: string) => email && !prev.includes(email)
                  ),
                ]);
                e.value = []
              }
            }}></CSVReader>
          </div>

          {/* Seção de E-Mails */}
          <div className='text-left'>
            <h1 className='text-xl font-bold'>E-Mails</h1>
            <h3 className='text-slate-500'>E-Mails que estão na lista até agora</h3>
            <ScrollArea className="h-48 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              <Table className="border border-slate-200 rounded-lg overflow-hidden">
                <TableBody>
                  {emails.slice(0, 50).map((email, index) => (
                    <TableRow
                      key={index}
                      className="border-t border-slate-200 hover:bg-slate-300/50 transition-colors"
                    >
                      <TableCell className="font-medium text-stone-700">
                        {email}
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          className="text-orange-500 hover:text-orange-700 transition-colors hover:cursor-pointer w-2 h-2"
                          onClick={() => handleRemoveEmail(email)}
                        >
                          <FaTimes />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}


                </TableBody>
              </Table>
              {/* Mostre o contador de e-mails restantes se a lista original for maior que 50 */}
              {emails.length > 50 && (
                <div className="p-4 text-center text-stone-700">
                  e outros {emails.length - 50} e-mails
                </div>
              )}
            </ScrollArea>
            <div className='w-full text-center mt-6'>
              <Button
                className='p-6 hover:cursor-pointer mt-auto mb-auto ml-2 text-white text-xl font-bold h-10 rounded-[12px] hover:bg-slate-300 border 
                  bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-indigo-600/50 
                  via-fuchsia-500 to-red-500/50'
                onClick={handleSaveList}
              >
                Salvar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<App />);