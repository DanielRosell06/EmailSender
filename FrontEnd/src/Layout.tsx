// src/components/layout/Layout.tsx
import React, { useState } from 'react';
import { FaEnvelope, FaPaperPlane, FaUsers, FaChevronDown, FaChevronRight, FaHome, FaPersonBooth } from 'react-icons/fa';
import { Outlet, useNavigate } from 'react-router-dom';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listasExpanded, setListasExpanded] = useState(false);
  const [campanhasExpanded, setCampanhasExpanded] = useState(false);
  const [activePath, setActivePath] = useState('/create_envio'); // Exemplo de estado ativo

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleListas = (event: React.MouseEvent) => {
    event.stopPropagation();
    setListasExpanded(!listasExpanded);
  };

  const toggleCampanhas = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCampanhasExpanded(!campanhasExpanded);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setActivePath(path); // Atualiza o caminho ativo
    closeSidebar();
  }

  const listas = [
    'Lista de Clientes VIP',
    'Lista de Prospects',
    'Lista de Newsletter',
    'Lista de Eventos',
    'Lista de Parceiros'
  ];

  const campanhas = [
    'Campanha Black Friday',
    'Campanha Natal 2024',
    'Campanha Lançamento Produto',
    'Campanha Re-engajamento',
    'Campanha Boas-vindas'
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white/85 text-slate-700 p-4 shadow-lg fixed z-10 w-[100vw] top-0 backdrop-blur-sm">
        <div className="w-[90vw] ml-auto mr-auto flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-200 rounded-md transition-colors duration-200"
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
          <div className="flex items-center space-x-4">
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
            <button className={`hover:bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-green-600/60 via-emerald-500 to-teal-500/60 hover:text-white flex flex-row items-center p-2 rounded-md transition-colors duration-200 ${activePath === '/create_envio' ? 'bg-gray-200' : ''
              }`}
              onClick={() => {
                handleNavigate('/')
              }}
            >
              <FaHome className='w-[20px] h-[20px] mr-3' />
              <h1 className='text-[18px]'>Home</h1>
            </button>
            <div className='flex flex-col'>
              <div
                onClick={() => handleNavigate('/lista')}
                className={`flex flex-row items-center w-full p-2 rounded-md transition-colors duration-200 cursor-pointer justify-between ${activePath === '/lista' ? 'bg-gray-200' : 'hover:bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-indigo-600/50 via-fuchsia-500 to-red-500/50 hover:text-white'
                  }`}
              >
                <div className='flex flex-row items-center'>
                  <FaUsers className='w-[20px] h-[20px] mr-3' />
                  <h1 className='text-[18px]'>Listas</h1>
                </div>
                <button
                  onClick={toggleListas}
                  className="p-1 rounded-full hover:bg-gray-300/50"
                  aria-label="Expandir listas"
                >
                  {listasExpanded ?
                    <FaChevronDown className='w-[12px] h-[12px]' /> :
                    <FaChevronRight className='w-[12px] h-[12px]' />
                  }
                </button>
              </div>

              {/* Submenu de Listas */}
              <div className={`overflow-hidden transition-all duration-300 ${listasExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pl-8 pt-2">
                  {listas.map((lista, index) => (
                    <button
                      key={index}
                      className="block w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    >
                      {lista}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botão Campanhas */}
            <div className='flex flex-col'>
              <div
                onClick={() => handleNavigate('/campanha')}
                className={`flex flex-row items-center w-full p-2 rounded-md transition-colors duration-200 cursor-pointer justify-between ${activePath === '/create_campanha' ? 'bg-gray-200' : 'hover:bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-blue-600/60 via-indigo-500 to-cyan-500/60 hover:text-white'
                  }`}
              >
                <div className='flex flex-row items-center'>
                  <FaEnvelope className='w-[20px] h-[20px] mr-3' />
                  <h1 className='text-[18px]'>Campanhas</h1>
                </div>
                <button
                  onClick={toggleCampanhas}
                  className="p-1 rounded-full hover:bg-gray-300/50"
                  aria-label="Expandir campanhas"
                >
                  {campanhasExpanded ?
                    <FaChevronDown className='w-[12px] h-[12px]' /> :
                    <FaChevronRight className='w-[12px] h-[12px]' />
                  }
                </button>
              </div>

              {/* Submenu de Campanhas */}
              <div className={`overflow-hidden transition-all duration-300 ${campanhasExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pl-8 pt-2">
                  {campanhas.map((campanha, index) => (
                    <button
                      key={index}
                      className="block w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    >
                      {campanha}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botão Enviar (sem submenu) */}
            <button className={`hover:bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-green-600/60 via-emerald-500 to-teal-500/60 hover:text-white flex flex-row items-center p-2 rounded-md transition-colors duration-200 ${activePath === '/create_envio' ? 'bg-gray-200' : ''
              }`}
              onClick={() => {
                handleNavigate('/create_envio')
              }}
            >
              <FaPaperPlane className='w-[20px] h-[20px] mr-3' />
              <h1 className='text-[18px]'>Enviar</h1>
            </button>
            <button className={`hover:bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-red-400/60 via-yellow-500 to-orange-400/40 hover:text-white flex flex-row items-center p-2 rounded-md transition-colors duration-200 ${activePath === '/conta_page' ? 'bg-gray-200' : ''
              }`}
              onClick={() => {
                handleNavigate('/conta_page')
              }}
            >
              <FaPersonBooth className='w-[20px] h-[20px] mr-3' />
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
    </div>
  );
};

export default Layout;