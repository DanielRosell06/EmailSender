import { StrictMode, useState, useEffect } from 'react';
import Modal from '../Modal.tsx';
import CSVReader from './CSVReader.tsx';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { FaPlus, FaTimes } from 'react-icons/fa';

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

// URL da sua API
const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

interface Email {
  IdEmail: number;
  Conteudo: string;
}

// Define a interface para as propriedades do componente
interface EditListModalProps {
  isModalOpen: boolean;
  openModal: () => void;
  onClose: () => void;
  listaId: number | null;
}

const EditListModal: React.FC<EditListModalProps> = ({ isModalOpen, openModal, onClose, listaId }) => {
  const [listaTitle, setListaTitle] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Adiciona o estado de loading

  // Use useEffect para carregar os dados da lista quando o modal abrir
  useEffect(() => {
    if (isModalOpen && listaId) {
      setLoading(true); // Inicia o carregamento
      fetch(`${backendUrl}/get_lista_by_id_com_email?id_lista=${listaId}`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setListaTitle(data.Titulo);
          const emailStrings = data.Emails.map((emailObj: { Conteudo: any; }) => emailObj.Conteudo);
          setEmails(emailStrings);
        })
        .finally(() => {
          setLoading(false); // Finaliza o carregamento, independentemente do resultado
        });
    }
  }, [isModalOpen, listaId]);

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

  // Função para salvar a lista (agora para editar)
  const handleSaveList = async () => {
    try {
      const updatedLista = {
        Titulo: listaTitle,
        Emails: emails
      };

      // TODO: Altere o método para 'PUT' ou 'PATCH' para atualizar a lista
      const response = await fetch(`${backendUrl}/listas/${listaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLista),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar a lista.');
      }

      console.log('Lista salva com sucesso!');

      // Limpa os estados e fecha o modal
      setListaTitle('');
      setEmails([]);
      onClose();

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <StrictMode>
      <div className='text-center'>
        <Modal
          buttonTitle={"Editar"} // O botão de abrir o modal
          buttonClassName=" hidden"
          modalTitle='Editar Lista'
          isModalOpen={isModalOpen} // Passa o estado de visibilidade
          openModal={openModal} // Passa a função de abrir
          onClose={onClose} // Passa a função de fechar
        >
          {/* Seção de Título */}
          <div className='flex h-10'>
            <h1 className='mt-auto mb-auto font-bold mr-2 text-xl'>Título:</h1>
            {loading ? (
              <Skeleton className="h-full w-[250px] rounded-full bg-slate-200" />
            ) : (
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
            )}
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

            {/* Seção de Arquivo .csv */}
            <CSVReader onLoadEmails={(e: any) => {
              if (Array.isArray(e.value)) {
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
                  {loading ? (
                    // Exibe skeletons se estiver carregando
                    <>
                      <TableRow className="border-t border-slate-200">
                        <TableCell><Skeleton className="h-6 w-full bg-slate-200" /></TableCell>
                      </TableRow>
                      <TableRow className="border-t border-slate-200">
                        <TableCell><Skeleton className="h-6 w-full bg-slate-200" /></TableCell>
                      </TableRow>
                      <TableRow className="border-t border-slate-200">
                        <TableCell><Skeleton className="h-6 w-full bg-slate-200" /></TableCell>
                      </TableRow>
                      <TableRow className="border-t border-slate-200">
                        <TableCell><Skeleton className="h-6 w-full bg-slate-200" /></TableCell>
                      </TableRow>
                      <TableRow className="border-t border-slate-200">
                        <TableCell><Skeleton className="h-6 w-full bg-slate-200" /></TableCell>
                      </TableRow>
                    </>
                  ) : (
                    // Exibe os e-mails se o carregamento estiver completo
                    emails.slice(0, 50).map((email, index) => (
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
                    ))
                  )}
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
              {loading ? (
                <Skeleton className="p-6 h-10 w-32 rounded-[12px] bg-slate-200"/>
              ) : (
                <Button
                  className='p-6 hover:cursor-pointer mt-auto mb-auto ml-2 text-white text-xl font-bold h-10 rounded-[12px] hover:bg-slate-300 border 
                  bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-indigo-600/50 
                  via-fuchsia-500 to-red-500/50'
                  onClick={handleSaveList}
                >
                  Salvar
                </Button>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </StrictMode>
  );
};

export default EditListModal;