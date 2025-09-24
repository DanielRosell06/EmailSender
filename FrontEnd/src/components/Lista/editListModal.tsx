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

import { api } from '@/services/api.ts';

// URL da sua API

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
  const [oldListaTitle, setOldListaTitle] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmails, setNewEmails] = useState<string[]>([]);
  const [deletedEmails, setDeletedEmails] = useState<number[]>([]);
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    const fetchListaData = async () => {
      if (!isModalOpen || !listaId) {
        return;
      }

      setLoading(true);

      try {
        const response = await api(`/get_lista_by_id_com_email?id_lista=${listaId}`);
        const data = await response.json();

        setListaTitle(data.Titulo);
        setOldListaTitle(data.Titulo);
        setEmails(data.Emails);

      } catch (error) {
        console.error("Erro ao carregar dados da lista:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListaData();
  }, [isModalOpen, listaId]);

  const handleAddEmail = () => {
    if (emailInput && !emails.some(e => e.Conteudo === emailInput)) {
      const newId = emails.length > 0 ? Math.max(...emails.map(e => e.IdEmail)) + 1 : 1;
      const newEmail: Email = { IdEmail: newId, Conteudo: emailInput };
      setEmails([...emails, newEmail]);
      setNewEmails([...newEmails, emailInput])
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (IdEmail: number) => {
    const emailToRemove = emails.find(e => e.IdEmail === IdEmail);
    if (emailToRemove) {
      setEmails(emails.filter(email => email.IdEmail !== IdEmail));
      setDeletedEmails([...deletedEmails, IdEmail]);
    }
  };

  const handleSaveList = async () => {
    setSalvando(true)
    const promises = [];

    if (listaTitle !== oldListaTitle) {
      const editTitlePromise = api(`/edit_lista?id_lista=${listaId}&new_titulo=${listaTitle}`, { method: "PUT" })
        .then(response => {
          // A sua função 'api' já lida com o status 401. 
          // Você só precisa se preocupar com outros tipos de erros aqui.
          if (!response.ok) {
            throw new Error('Erro ao alterar o título da lista. Tente novamente mais tarde.');
          }
          return response.json();
        });

      promises.push(editTitlePromise);
    }

    if (newEmails.length > 0) {
      const createEmailsPromise = api(`/create_email?lista_id=${listaId}`, {
        method: "POST",
        body: JSON.stringify(newEmails)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao tentar criar novos emails. Tente novamente mais tarde.');
          }
          return response.json();
        });

      promises.push(createEmailsPromise);
    }

    if (deletedEmails.length > 0) {
      console.log(deletedEmails)
      const deleteEmailsPromise = api(`/delete_email`, {
        method: "DELETE",
        body: JSON.stringify(deletedEmails)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao tentar remover emails. Tente novamente mais tarde.');
          }
          return response.json();
        });

      promises.push(deleteEmailsPromise);
    }

    if (promises.length === 0) {
      onClose();
      return;
    }

    try {
      await Promise.all(promises);

      setOldListaTitle(listaTitle);
      setDeletedEmails([]);
      setNewEmails([]);
      onClose();
      setSalvando(false)

    } catch (error) {
      alert((error as Error).message);
      setSalvando(false)
    }
  };

  return (
    <StrictMode>
      <div className='text-center'>
        <Modal
          buttonTitle={"Editar"}
          buttonClassName=" hidden"
          modalTitle='Editar Lista'
          isModalOpen={isModalOpen}
          openModal={openModal}
          onClose={onClose}
        >
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

            <CSVReader onLoadEmails={(e: any) => {
              if (Array.isArray(e.value)) {
                const emailsToAdd = e.value
                  .filter((emailContent: string) => emailContent && !emails.some(e => e.Conteudo === emailContent))
                  .map((emailContent: any) => ({
                    IdEmail: 0, // Id temporário
                    Conteudo: emailContent
                  }));
                setEmails(prev => [...prev, ...emailsToAdd]);
                setNewEmails(prev => [...prev, ...emailsToAdd.map((e: { Conteudo: any; }) => e.Conteudo)]);
              }
            }}></CSVReader>
          </div>

          <div className='text-left'>
            <h1 className='text-xl font-bold'>E-Mails</h1>
            <h3 className='text-slate-500'>E-Mails que estão na lista até agora</h3>
            <ScrollArea className="h-48 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              <Table className="border border-slate-200 rounded-lg overflow-hidden">
                <TableBody>
                  {loading ? (
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
                    emails.slice(0, 50).map((email, index) => (
                      <TableRow
                        key={email.IdEmail || index}
                        className="border-t border-slate-200 hover:bg-slate-300/50 transition-colors"
                      >
                        <TableCell className="font-medium text-stone-700">
                          {email.Conteudo}
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            className="text-orange-500 hover:text-orange-700 transition-colors hover:cursor-pointer w-2 h-2"
                            onClick={() => handleRemoveEmail(email.IdEmail)}
                          >
                            <FaTimes />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {emails.length > 50 && (
                <div className="p-4 text-center text-stone-700">
                  e outros {emails.length - 50} e-mails
                </div>
              )}
            </ScrollArea>
            <div className='w-full text-center mt-6'>
              {loading ? (
                <Skeleton className="p-6 h-10 w-32 rounded-[12px] bg-slate-200" />
              ) : (
                <Button
                  className='p-6 hover:cursor-pointer mt-auto mb-auto ml-2 text-white text-xl font-bold h-10 rounded-[12px] hover:bg-slate-300 border 
                  bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-indigo-600/50 
                  via-fuchsia-500 to-red-500/50'
                  onClick={handleSaveList}
                  disabled={salvando}
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