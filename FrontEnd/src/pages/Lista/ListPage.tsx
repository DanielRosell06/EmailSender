import React, { useEffect, useState } from "react";
import { FaUsers, FaCalendarAlt, FaEnvelopeOpenText, FaPaperPlane, FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import CreateListModal from "@/components/Lista/createModal";

// Interface para as Listas e Envios
interface Lista {
    IdLista: number;
    Titulo: string;
    Ultimo_Uso: string;
}

interface Envio {
    id: string;
    dataEnvio: string;
    detalhes: {
        aberturas: number;
        entregues: number;
    };
    campanha: string;
    lista: string;
}

const ListasPage: React.FC = () => {
    const [listas, setListas] = useState<Lista[]>([]);
    const [enviosRecentes, setEnviosRecentes] = useState<Envio[]>([]);
    const [loading, setLoading] = useState(true);

    // Dados mockados para simular a rota de envios
    const mockEnviosRecentes: Envio[] = [
        {
            id: 'envio-1',
            dataEnvio: '2025-08-18T10:00:00Z',
            detalhes: { aberturas: 120, entregues: 500 },
            campanha: 'Promoção de Verão',
            lista: 'Clientes VIP',
        },
        {
            id: 'envio-2',
            dataEnvio: '2025-08-17T15:30:00Z',
            detalhes: { aberturas: 35, entregues: 150 },
            campanha: 'Novidades de Agosto',
            lista: 'Assinantes Newsletter',
        },
        {
            id: 'envio-3',
            dataEnvio: '2025-08-16T09:00:00Z',
            detalhes: { aberturas: 80, entregues: 230 },
            campanha: 'Lançamento de Produto',
            lista: 'Leads Qualificados',
        },
        {
            id: 'envio-4',
            dataEnvio: '2025-08-15T11:00:00Z',
            detalhes: { aberturas: 250, entregues: 800 },
            campanha: 'Black Friday Antecipada',
            lista: 'Todos os Clientes',
        },
        {
            id: 'envio-5',
            dataEnvio: '2025-08-14T14:00:00Z',
            detalhes: { aberturas: 15, entregues: 60 },
            campanha: 'Boas Vindas',
            lista: 'Novos Cadastros',
        }
    ];

    useEffect(() => {
        setLoading(true);

        setEnviosRecentes(mockEnviosRecentes.slice(0, 5));

        fetch("http://127.0.0.1:8000/all_lista")
            .then(res => res.json())
            .then(data => {
                const sortedListas = data.sort((a: Lista, b: Lista) => new Date(b.Ultimo_Uso).getTime() - new Date(a.Ultimo_Uso).getTime()).slice(0, 5);
                setListas(sortedListas);
            })
            .catch(() => {
                setListas([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const renderSkeletons = () => (
        <div className="flex h-screen max-w-7xl mx-auto p-8 bg-white">
            <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-300 rounded w-48 animate-pulse mb-6"></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-28 rounded-xl bg-gray-200 animate-pulse"></div>
                ))}
            </div>
            <div className="w-1/3 ml-8 space-y-6">
                <div className="h-48 rounded-2xl bg-gray-300 animate-pulse"></div>
                <div className="h-8 bg-gray-300 rounded w-48 animate-pulse mb-6"></div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-28 rounded-xl bg-gray-200 animate-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return renderSkeletons();
    }

    return (
        <div className="min-h-screen p-8 bg-white">
            <div className="max-w-7xl mx-auto flex">
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
                    <div className="space-y-4">
                        {/* Botão de criar lista que abre o modal */}
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
                </div>

                <div className="w-1/3 flex flex-col space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                            <FaEnvelopeOpenText className="text-white text-lg" />
                        </div>
                        Últimas Listas Destinatárias
                    </h2>
                    <div className="space-y-4">
                        {enviosRecentes.length > 0 ? (
                            enviosRecentes.map((envio) => (
                                <div
                                    key={envio.id}
                                    className="p-4 rounded-xl border-2 border-gray-100 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm hover:border-green-400 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-white/50">
                                            <FaPaperPlane className="text-green-600 text-lg" />
                                        </div>
                                        <div>
                                            <p className="w-[320px] font-semibold text-gray-800 leading-tight">
                                                <span className="text-indigo-600 font-bold">{envio.lista}</span> foi destinatária da campanha <span className="text-green-600 font-bold">{envio.campanha}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between  mt-4 pl-12 text-gray-600">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span>Entregues: <span className="font-semibold text-blue-700">{envio.detalhes.entregues}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span>Aberturas: <span className="font-semibold text-green-700">{envio.detalhes.aberturas}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span> <span className="font-semibold text-slate-700">{formatDate(envio.dataEnvio)}</span></span>
                                        </div>
                                        
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Nenhum envio recente.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListasPage;