import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Modal from './components/Modal.tsx'
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

import { FaPlus } from 'react-icons/fa'
import { FaTimes } from 'react-icons/fa'
import { FiUpload } from 'react-icons/fi';

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className='h-[100vh] w-[100vw] text-center'>
      <Modal buttonTitle='Criar Lista' buttonClassName='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium items-center gap-2 hover:opacity-90 transition-opacity' modalTitle='Criar Lista'>
        <div className='flex h-10'>
          <h1 className='mt-auto mb-auto font-bold mr-2 text-xl'>Título:</h1>
          <Input
            className="mt-auto mb-auto border-slate-300 placeholder:text-slate-400 
              transition-all ease-in-out duration-300
             focus:bg-slate-200 rounded-full
             focus:ring-0 focus:ring-offset-0 focus:ring-transparent 
             focus:border-none focus:outline-none"
            placeholder="Insira um Título"
          />
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
              />
              <Button className='mt-auto mb-auto ml-2 w-10 h-10 rounded-full bg-slate-300 transition-all ease-in-out duration-300 hover:cursor-pointer
                hover:bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-indigo-600/50 
                via-fuchsia-500 to-red-500/50 text-white"
              '>
                <FaPlus className='text-white'></FaPlus>
              </Button>
            </div>
          </div>
          <div className='w-[350px]'>
            <h1 className='font-bold text-xl'>Inserir Arquivo .csv</h1>
            <h3 className='text-slate-500'>Insira um arquivo .csv, todas as célualas da planilha que possuem a formatação XXXX@XXXX.XXX serão adicionadas à lista.</h3>

            <div className="flex flex-col gap-2 w-full max-w-md mt-2">
              <div
                className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-slate-400 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  {/* Botão com gradiente */}
                  <button
                    type="button"
                    className="bg-slate-300 px-4 py-2 rounded-md hover:cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <FiUpload className="text-lg" />
                    <span>Selecionar</span>
                  </button>

                  {/* Nome do arquivo */}
                  <span className="text-slate-600 truncate flex-1">
                    {'Nenhum arquivo selecionado'}
                  </span>
                </div>
              </div>

              {/* Input escondido */}
              <input
                type="file"
                className="hidden"
              />
            </div>
          </div>
        </div>
        <div className='text-left'>
          <h1 className='text-xl font-bold'>E-Mails</h1>
          <h3 className='text-slate-500'>E-Mails que estão na lista até agora</h3>
          <ScrollArea className="h-48 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">            <Table className="border border-slate-200 rounded-lg overflow-hidden">
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow
                  key={invoice.invoice}
                  className="border-t border-slate-300 hover:bg-slate-200/50 transition-colors"
                >
                  <TableCell className="font-medium text-slate-600">
                    user{invoice.invoice.slice(-2)}@example.com
                  </TableCell>

                  <TableCell className="text-right">
                    <button className="text-pink-500 hover:text-pink-700 transition-colors hover:cursor-pointer w-2 h-2">
                      <FaTimes />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </ScrollArea>
          <div className='w-full text-center mt-6'>
            <Button className='p-6 hover:cursor-pointer mt-auto mb-auto ml-2 text-white text-xl font-bold h-10 rounded-[12px] hover:bg-slate-300 border 
                bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-indigo-600/50 
                via-fuchsia-500 to-red-500/50 "
              '>
              Salvar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  </StrictMode>
)
