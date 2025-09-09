import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';


interface RotaPrivadaProps {
    children: React.ReactNode;
}

const RotaPrivada: React.FC<RotaPrivadaProps> = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

    const [carregando, setCarregando] = useState<boolean>(true);
    const [tokenValido, setTokenValido] = useState<boolean>(false);

    useEffect(() => {
        const verificarAutenticacao = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setTokenValido(false);
                setCarregando(false);
                return;
            }

            try {
                const response = await fetch(`${backendUrl}/verifica_token`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (response.ok) {
                    setTokenValido(true);
                } else {
                    localStorage.removeItem('token');
                    setTokenValido(false);
                }
            } catch (error) {
                console.error("Erro ao verificar token:", error);
                localStorage.removeItem('token');
                setTokenValido(false);
            } finally {
                setCarregando(false);
            }
        };

        verificarAutenticacao();
    }, []);

    if (carregando) {
        return (
            <div className="fixed inset-0 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

if (!tokenValido) {
    return <Navigate to="/login" />;
}

return children;
};

export default RotaPrivada;