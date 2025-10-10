// src/components/layout/Layout.tsx
import { Mail } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaPaperPlane, FaUsers, FaHome, FaCog, FaChartBar } from 'react-icons/fa';
import { Outlet, useNavigate } from 'react-router-dom';
import { api } from './services/api';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface UserData {
  Nome: String,
  Email: String
}

const Layout: React.FC = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState('/'); // Exemplo de estado ativo
  const [userData, setUserData] = useState<UserData>({
    Nome: "", // Inicialização com string vazia
    Email: "" // Inicialização com string vazia
  })

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    // Garante que activePath seja sempre o caminho atual da URL
    setActivePath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const fetchUserName = async () => {
      if (backendUrl === "") {
        return;
      }
      try {
        const res = await api(`/get_dados_usuario_by_token`);
        const userReceivedData = await res.json();
        setUserData(userReceivedData);
      } catch (error) {
        console.error("Erro ao buscar dados do usuario:", error);
        setUserData({ Nome: "", Email: "" });
      } finally {
        console.log("Dados: " + userData)
      }
    };

    fetchUserName();
  }, [backendUrl]);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white/85 text-slate-700 p-4 shadow-lg fixed z-10 w-[100vw] top-0 backdrop-blur-sm">
        <div className="w-[90vw] ml-auto mr-auto flex items-center justify-between relative">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-200 rounded-md transition-colors duration-200 z-20"
            aria-label="Abrir menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2 z-10">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EmailSender
            </span>
          </div>

          <div className="flex items-center space-x-4 z-20">
            <HoverCard>
              <HoverCardTrigger>Olá <span className='hover:underline hover:cursor-pointer'>{userData.Nome}</span></HoverCardTrigger>
              <HoverCardContent className='bg-white border-none'>
                {userData.Email}
              </HoverCardContent>
            </HoverCard>
            <button onClick={() => {
              localStorage.removeItem('token')
              navigate("/login")
            }} className="hover:cursor-pointer px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium hover:scale-110 transition-all duration-200">
              Sair
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`transition-opacity duration-300 ${sidebarOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          } backdrop-blur-[5px] fixed inset-0 bg-black/10 z-15`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <div
        className={`rounded-2xl bg-white/90 fixed top-0 mt-[2.5vh] left-0 h-[95vh] w-[300px] shadow-lg transform transition-transform duration-300 z-20 overflow-y-auto ${sidebarOpen ? 'translate-x-[20px]' : '-translate-x-full'
          }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={closeSidebar}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
              aria-label="Fechar menu"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className='flex flex-col gap-2'>
            <button className={`hover:bg-gradient-to-br from-indigo-500 to-purple-600 hover:text-white flex flex-row items-center p-2 rounded-md transition-colors duration-200 ${activePath === '/' ? 'bg-gray-200' : ''
              }`}
              onClick={() => {
                closeSidebar()
                navigate('/')
              }}
            >
              <FaHome className='w-[20px] h-[20px] mr-3' />
              <h1 className='text-[18px]'>Home</h1>
            </button>
            <button
              onClick={() => {
                closeSidebar()
                navigate('/lista')
              }}
              className={`flex flex-row items-center w-full p-2 rounded-md transition-colors duration-200 cursor-pointer justify-between ${activePath === '/lista' ? 'bg-gray-200' : 'hover:bg-gradient-to-br from-indigo-600/50 via-fuchsia-500 to-red-500/50 hover:text-white'
                }`}
            >
              <div className='flex flex-row items-center'>
                <FaUsers className='w-[20px] h-[20px] mr-3' />
                <h1 className='text-[18px]'>Listas</h1>
              </div>
            </button>
            <button
              onClick={() => {
                closeSidebar()
                navigate('/campanha')
              }}
              className={`flex flex-row items-center w-full p-2 rounded-md transition-colors duration-200 cursor-pointer justify-between ${activePath === '/campanha' ? 'bg-gray-200' : 'hover:bg-gradient-to-br from-blue-600/60 via-indigo-500 to-cyan-500/60 hover:text-white'
                }`}
            >
              <div className='flex flex-row items-center'>
                <FaEnvelope className='w-[20px] h-[20px] mr-3' />
                <h1 className='text-[18px]'>Campanhas</h1>
              </div>
            </button>
            <button className={`hover:bg-gradient-to-br from-green-600/60 via-emerald-500 to-teal-500/60 hover:text-white flex flex-row items-center p-2 rounded-md transition-colors duration-200 ${activePath === '/create_envio' ? 'bg-gray-200' : ''
              }`}
              onClick={() => {
                closeSidebar()
                navigate('/create_envio')
              }}
            >
              <FaPaperPlane className='w-[20px] h-[20px] mr-3' />
              <h1 className='text-[18px]'>Enviar</h1>
            </button>
            <button className={`hover:bg-gradient-to-br from-red-500 to-orange-500 hover:text-white flex flex-row items-center p-2 rounded-md transition-colors duration-200 ${activePath === '/dashboard_page' ? 'bg-gray-200' : ''
              }`}
              onClick={() => {
                closeSidebar()
                navigate('/dashboard_page')
              }}
            >
              <FaChartBar className='w-[20px] h-[20px] mr-3' />
              <h1 className='text-[18px]'>Dashboard</h1>
            </button>
            <button className={`hover:bg-gradient-to-br from-red-400/60 via-yellow-500 to-orange-400/40 hover:text-white flex flex-row items-center p-2 rounded-md transition-colors duration-200 ${activePath === '/conta_page' ? 'bg-gray-200' : ''
              }`}
              onClick={() => {
                closeSidebar()
                navigate('/conta_page')
              }}
            >
              <FaCog className='w-[20px] h-[20px] mr-3' />
              <h1 className='text-[18px]'>Contas</h1>
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main>
        <div className='mt-20'>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 mt-auto">
        <p className="text-center text-gray-600">© 2025 Meu App Incrível</p>
      </footer>
    </div >
  );
};

export default Layout;