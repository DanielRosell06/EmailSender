import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { FaPaperPlane } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

interface ProgressData {
  sent: number;
  total: number;
  percentage: number;
  id_envio: number;
}

const LoadingPage: React.FC = () => {
  const token = localStorage.getItem('token');
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extrai os dados de envio passados via 'state'
    const { envioData } = location.state || {};

    // Cria a conexão WebSocket
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      console.log('Conectado ao WebSocket:', socketRef.current?.id);
      // Envia os dados de envio para o backend, incluindo o sid
      if (envioData) {
        socketRef.current?.emit('start_envio', { ...envioData, sid: socketRef.current?.id, token: `Bearer ${token}`});
      }
    });

    // Escuta por eventos de progresso
    socketRef.current.on('progress', (data: ProgressData) => {
      setProgress(data);
    });

    // Escuta por eventos de erro, se necessário
    socketRef.current.on('envio_error', (data: { message: string }) => {
      console.error('Erro no envio:', data.message);
      // Aqui você poderia exibir uma mensagem de erro para o usuário
    });

    // Limpeza: desconecta o socket ao desmontar o componente
    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('progress');
        socketRef.current.off('envio_error');
        socketRef.current.disconnect();
      }
    };
  }, [location.state]);

  // Efeito para monitorar o progresso e navegar ao finalizar
  useEffect(() => {
    if (progress && progress.percentage >= 100) {
      const mockEnvioId = progress.id_envio;
      navigate(`/envio_detail/${mockEnvioId}`);
    }
  }, [progress, navigate]);

  const percentage = progress ? progress.percentage : 0;

  return (
    <>
      <style>
        {`
          @keyframes glow-green {
            0%, 100% {
              box-shadow: 0 0 5px rgba(16, 185, 129, 0.4), 0 0 10px rgba(16, 185, 129, 0.2);
            }
            50% {
              box-shadow: 0 0 15px rgba(16, 185, 129, 0.8), 0 0 30px rgba(16, 185, 129, 0.5);
            }
          }
          .glow-animation-green {
            animation: glow-green 3s ease-in-out infinite;
          }

          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }
          .pulse-animation {
            animation: pulse 1.5s ease-in-out infinite;
          }
        `}
      </style>
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white/70 backdrop-blur-sm">
        <div className="flex flex-col items-center p-10 rounded-2xl bg-white/50 backdrop-blur-md shadow-2xl transition-all duration-300">
          <div className="w-24 h-24 mb-6 flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-md pulse-animation">
            <FaPaperPlane size={48} className="text-white glow-animation-green" />
          </div>

          <p className="text-3xl font-bold text-gray-800 mb-4">Enviando E-mails</p>

          <div className="w-96 h-4 rounded-full bg-gray-200 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 glow-animation-green transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {progress && (
            <p className="mt-4 text-sm text-gray-600">
              <span className="font-bold text-green-700">{progress.sent}</span> de <span className="font-bold">{progress.total}</span> e-mails enviados (<span className="font-bold">{percentage.toFixed(2)}%</span>)
            </p>
          )}

        </div>
      </div>
    </>
  );
};

export default LoadingPage;