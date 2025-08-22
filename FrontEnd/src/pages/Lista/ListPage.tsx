import React, { useEffect, useState } from "react";
import { FaUsers, FaCalendarAlt, FaEnvelopeOpenText, FaPaperPlane, FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import CreateListModal from "@/components/Lista/createModal";
import { useNavigate } from "react-router-dom";

// Interface para as Listas e Envios
interface Lista {
    IdLista: number;
    Titulo: string;
    Ultimo_Uso: string;
}

interface DetalheEnvio {
  IdDetalhe: number;
  Conteudo: string;
}

interface CampanhaEnvio {
  IdCampanha: number;
  Titulo: string;
  Cor: string;
}

interface ListaEnvio {
  IdLista: number;
  Titulo: string;
}

interface Envio {
  IdEnvio: number;
  Dt_Envio: string;
  Detalhes: DetalheEnvio[];
  Campanha: CampanhaEnvio;
  Lista: ListaEnvio;
}

const ListasPage: React.FC = () => {
    const [listas, setListas] = useState<Lista[]>([]);
    const [enviosRecentes, setEnviosRecentes] = useState<Envio[]>([]);

    // Estados de carregamento individuais
    const [loadingListas, setLoadingListas] = useState(true);
    const [loadingEnvios, setLoadingEnvios] = useState(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const navigate = useNavigate();

    // Efeito para buscar Listas
    useEffect(() => {
        setLoadingListas(true);
        fetch(`${backendUrl}/all_lista`)
            .then(res => res.json())
            .then(data => {
                const sortedListas = data.sort((a: Lista, b: Lista) => new Date(b.Ultimo_Uso).getTime() - new Date(a.Ultimo_Uso).getTime()).slice(0, 5);
                setListas(sortedListas);
            })
            .catch(() => {
                setListas([]);
            })
            .finally(() => setLoadingListas(false));
    }, [backendUrl]);

    // Efeito para buscar Envios
    useEffect(() => {
        setLoadingEnvios(true);
        fetch(`${backendUrl}/get_all_envio_com_lista_campanha_detalhe`)
            .then(res => res.json())
            .then(data => {
                const sortedEnvios = data.slice(0, 5);
                setEnviosRecentes(sortedEnvios);
            })
            .catch(() => setEnviosRecentes([]))
            .finally(() => setLoadingEnvios(false));
    }, [backendUrl]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const handleEnvioClick = (idEnvio: number) => {
        navigate(`/envio_detail/${idEnvio}`);
    };

    // Função de renderização para a seção de Listas
    const renderListasSection = () => {
        if (loadingListas) {
            return (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-28 rounded-xl bg-gray-200 animate-pulse"></div>
                    ))}
                </div>
            );
        }
        
        return (
            <div className="space-y-4">
                <CreateListModal />
                {listas.length > 0 ? (
                    listas.map((lista) => (
                        <div
                            key={lista.IdLista}
                            className={`p-4 rounded-xl border-2 border-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer hover:border-fuchsia-500`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-indigo-600/50 via-fuchsia-500 to-red-500/50 rounded-lg flex items-center justify-center border border-white/50">
                                        <FaEnvelopeOpenText className="text-white text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{lista.Titulo}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <FaCalendarAlt className="text-xs" /> Último uso: {formatDate(lista.Ultimo_Uso)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 mt-4">Nenhuma lista encontrada.</p>
                )}
            </div>
        );
    };

    // Função de renderização para a seção de Envios
    const renderEnviosSection = () => {
        if (loadingEnvios) {
            return (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-28 rounded-xl bg-gray-200 animate-pulse"></div>
                    ))}
                </div>
            );
        }
        
        return (
            <div className="space-y-4">
                {enviosRecentes.length > 0 ? (
                    enviosRecentes.map((envio) => (
                        <div
                            key={envio.IdEnvio}
                            onClick={() => handleEnvioClick(envio.IdEnvio)} // Adicionado onClick para navegação
                            className="p-4 rounded-xl border-2 border-gray-100 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm hover:border-green-400 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-white/50">
                                    <FaPaperPlane className="text-green-600 text-lg" />
                                </div>
                                <div>
                                    <p className="w-[320px] font-semibold text-gray-800 leading-tight">
                                        <span className="text-indigo-600 font-bold">{envio.Lista.Titulo}</span> foi destinatária da campanha <span className="text-green-600 font-bold">{envio.Campanha.Titulo}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between mt-4 pl-12 text-gray-600">
                                <div className="flex items-center gap-2 text-sm">
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span> <span className="font-semibold text-slate-700">{formatDate(envio.Dt_Envio)}</span></span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Nenhum envio recente.</p>
                )}
            </div>
        );
    };

    // O componente principal renderiza as seções individualmente
    return (
        <div className="min-h-screen p-8 bg-white">
            <div className="max-w-7xl mx-auto flex">
                {/* Seção de Listas */}
                <div className="flex-1 mr-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-gradient-to-r bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-indigo-600/50 via-fuchsia-500 to-red-500/50">
                                <FaUsers className="text-white text-lg" />
                            </div>
                            Minhas Listas
                        </h2>
                        <Button
                            variant="link"
                            className="text-gray-600 hover:text-purple-500"
                            onClick={() => console.log('Navegar para a página de listas completas')}
                        >
                            Ver Todas <FaArrowRight className="ml-2" />
                        </Button>
                    </div>
                    {renderListasSection()}
                </div>

                {/* Seção de Envios */}
                <div className="w-1/3 flex flex-col space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                            <FaEnvelopeOpenText className="text-white text-lg" />
                        </div>
                        Últimas Listas Destinatárias
                    </h2>
                    {renderEnviosSection()}
                </div>
            </div>
        </div>
    );
};

export default ListasPage;