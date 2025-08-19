import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importe useNavigate
import { FaPlus, FaPaperPlane, FaCalendarAlt, FaStar, FaEnvelopeOpenText, FaUsers, FaArrowRight, FaChartBar, FaUserShield, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface Lista {
    IdLista: number;
    Titulo: string;
    Ultimo_Uso: string;
}

interface Campanha {
    IdCampanha: number;
    Titulo: string;
    Cor: string;
    Documento: string;
    Ultimo_Uso: string;
    Favorita: boolean;
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
    erros?: string[];
}

const HomePage: React.FC = () => {
    const navigate = useNavigate(); // Inicialize o hook de navegação
    const [listas, setListas] = useState<Lista[]>([]);
    const [campanhas, setCampanhas] = useState<Campanha[]>([]);
    const [enviosRecentes, setEnviosRecentes] = useState<Envio[]>([]);
    const [loading, setLoading] = useState(true);

    const mockEnviosRecentes: Envio[] = [
        {
            id: 'envio-1',
            dataEnvio: '2025-08-18T10:00:00Z',
            detalhes: { aberturas: 120, entregues: 500 },
            campanha: 'Promoção de Verão',
            lista: 'Clientes VIP',
            erros: ["Falha no envio para 'email_invalido@teste.com'. Motivo: endereço de e-mail inválido.", "Servidor de destino não respondeu para 12 e-mails."]
        },
        {
            id: 'envio-2',
            dataEnvio: '2025-08-17T15:30:00Z',
            detalhes: { aberturas: 35, entregues: 150 },
            campanha: 'Novidades de Agosto',
            lista: 'Assinantes Newsletter'
        },
        {
            id: 'envio-3',
            dataEnvio: '2025-08-16T09:00:00Z',
            detalhes: { aberturas: 80, entregues: 230 },
            campanha: 'Lançamento de Produto',
            lista: 'Leads Qualificados',
            erros: ["E-mail 'bounce@empresa.com' devolvido permanentemente.", "Servidor de destino 'mail.org' rejeitou a conexão."]
        },
        {
            id: 'envio-4',
            dataEnvio: '2025-08-15T11:00:00Z',
            detalhes: { aberturas: 250, entregues: 800 },
            campanha: 'Black Friday Antecipada',
            lista: 'Todos os Clientes'
        },
        {
            id: 'envio-5',
            dataEnvio: '2025-08-14T14:00:00Z',
            detalhes: { aberturas: 15, entregues: 60 },
            campanha: 'Boas Vindas',
            lista: 'Novos Cadastros'
        }
    ];

    useEffect(() => {
        setLoading(true);

        setEnviosRecentes(mockEnviosRecentes.slice(0, 5));

        Promise.all([
            fetch("http://127.0.0.1:8000/all_lista").then(res => res.json()),
            fetch("http://127.0.0.1:8000/all_campanha").then(res => res.json())
        ])
            .then(([listasData, campanhasData]) => {
                const sortedCampanhas = campanhasData
                    .sort((a: Campanha, b: Campanha) => new Date(b.Ultimo_Uso).getTime() - new Date(a.Ultimo_Uso).getTime())
                    .slice(0, 4);
                const sortedListas = listasData
                    .sort((a: Lista, b: Lista) => new Date(b.Ultimo_Uso).getTime() - new Date(a.Ultimo_Uso).getTime())
                    .slice(0, 6);

                setListas(sortedListas);
                setCampanhas(sortedCampanhas);
            })
            .catch(() => {
                setListas([]);
                setCampanhas([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const getGradientFromColor = (cor: string) => {
        const colorMap: { [key: string]: string } = {
            'Azul': 'from-blue-500/100 via-indigo-500/60 to-purple-600/60',
            'Verde': 'from-green-500/100 via-emerald-500/60 to-teal-600/60',
            'Roxo': 'from-purple-500/100 via-violet-500/60 to-indigo-600/60',
            'Rosa': 'from-pink-500/100 via-rose-500/60 to-red-600/60',
            'Vermelho': 'from-red-500/100 via-pink-500/60 to-rose-600/60',
            'Laranja': 'from-orange-500/100 via-amber-500/60 to-yellow-600/60',
            'Amarelo': 'from-yellow-500/100 via-amber-500/60 to-orange-600/60',
            'Ciano': 'from-cyan-500/100 via-sky-500/60 to-blue-600/60',
            'Indigo': 'from-indigo-500/100 via-purple-500/60 to-violet-600/60',
            'Cinza': 'from-gray-500/100 via-slate-500/60 to-zinc-600/60',
        };
        return colorMap[cor] || 'from-gray-600/60 via-slate-500/60 to-zinc-600/60';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const renderSkeletons = () => (
        <>
            <div className="pt-30 pb-8 bg-slate-200 -mt-24">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-8 bg-gray-300 rounded w-64 animate-pulse"></div>
                        <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-48 rounded-xl bg-gray-300 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-8 py-8 space-y-12">
                    <div className="py-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="h-8 bg-gray-300 rounded w-56 animate-pulse"></div>
                            <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-24 rounded-xl bg-gray-200 animate-pulse"></div>
                            ))}
                        </div>
                    </div>

                    <div className="py-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
                            <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
                        </div>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-28 rounded-xl bg-gray-200 animate-pulse"></div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-12 pb-8">
                        <div className="h-14 w-64 mx-auto rounded-2xl bg-gray-300 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </>
    );

    if (loading) {
        return renderSkeletons();
    }

    return (
        <div className="min-h-screen">

            {/* Seção Campanhas Recentes */}
            <div className="pt-30 pb-8 bg-slate-200 -mt-24">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                                <FaPaperPlane className="text-white text-lg" />
                            </span>
                            Campanhas Acessadas Recentemente
                        </h2>
                        <Button
                            variant="link"
                            className="text-gray-600 hover:text-blue-500"
                            onClick={() => navigate('/campanhas')} // Rota de campanhas
                        >
                            Ver Todas <FaArrowRight className="ml-2" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Botão para criar nova campanha */}
                        <div
                            className={`group relative overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg h-48 cursor-pointer flex items-center justify-center p-4
                                 bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-blue-600/60 via-indigo-500 to-cyan-500/60 text-white `}
                            onClick={() => navigate('/create_campanha')}
                        >
                            <div className="bg-gradient-to-br from-blue-600/50 via-indigo-500/50 to-cyan-500/50 absolute inset-0 opacity-10"></div>
                            <div className="relative flex flex-col items-center justify-center h-full">
                                <div className="p-4 rounded-full bg-blue-500/20 backdrop-blur-sm border border-white/50 mb-2 transition-all duration-300 group-hover:bg-blue-500/60">
                                    <FaPlus className="text-3xl text-white transition-all duration-300" />
                                </div>
                                <span className=" font-semibold text-center transition-colors">Criar Nova Campanha</span>
                            </div>
                        </div>

                        {/* Campanhas reais */}
                        {campanhas.map((campanha) => (
                            <div
                                key={campanha.IdCampanha}
                                className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg h-48
                                    border-white/50 hover:border-blue-400`}
                            >
                                {campanha.Documento && (
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                        <iframe
                                            srcDoc={campanha.Documento}
                                            className="w-[640px] h-[850px] border-none scale-[0.359] origin-top-left"
                                            style={{
                                                marginTop: '0px',
                                                filter: 'blur(0.5px)',
                                            }}
                                            frameBorder="0"
                                            scrolling="no"
                                            title={`preview-${campanha.IdCampanha}`}
                                        />
                                    </div>
                                )}
                                <div className={`absolute inset-0 bg-gradient-to-br ${getGradientFromColor(campanha.Cor)} opacity-85`}></div>

                                <div className="relative z-10 h-full flex flex-col justify-between p-4 text-white">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold leading-tight mb-1 drop-shadow-lg">
                                                {campanha.Titulo}
                                            </h3>
                                            {campanha.Favorita && (
                                                <FaStar className="text-yellow-300 drop-shadow-lg" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex items-center gap-2 text-sm text-white/90">
                                            <FaCalendarAlt className="text-white/70" />
                                            <span className="drop-shadow-lg">{formatDate(campanha.Ultimo_Uso)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-8 py-8 space-y-12">
                    {/* Seção Listas Recentes */}
                    <div className="py-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500">
                                    <FaUsers className="text-white text-lg" />
                                </span>
                                Listas Acessadas Recentemente
                            </h2>
                            <Button
                                variant="link"
                                className="text-gray-600 hover:text-purple-500"
                                onClick={() => navigate('/lista')} // Rota de listas
                            >
                                Ver Todas <FaArrowRight className="ml-2" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {listas.map((lista) => (
                                <div
                                    key={lista.IdLista}
                                    className={`p-4 rounded-xl border-2 border-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer hover:border-indigo-400`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center border border-white/50">
                                                <FaEnvelopeOpenText className="text-indigo-600 text-lg" />
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
                            ))}
                        </div>
                    </div>

                    {/* Seção Últimos Envios */}
                    <div className="py-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <span className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                                    <FaEnvelopeOpenText className="text-white text-lg" />
                                </span>
                                Últimos Envios
                            </h2>
                            <Button
                                variant="link"
                                className="text-gray-600 hover:text-green-500"
                                onClick={() => navigate('/envios')} // Rota de envios
                            >
                                Ver Todos <FaArrowRight className="ml-2" />
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {enviosRecentes.length > 0 ? (
                                enviosRecentes.map((envio) => (
                                    <div key={envio.id}>
                                        <div
                                            className="p-4 rounded-xl border-2 border-gray-100 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm hover:border-green-400 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-white/50">
                                                        <FaPaperPlane className="text-green-600 text-lg" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            Envio da campanha **{envio.campanha}**
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            para a lista **{envio.lista}**
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right text-gray-600">
                                                    <p className="text-sm font-medium">
                                                        {formatDate(envio.dataEnvio)}
                                                    </p>
                                                    {envio.erros && envio.erros.length > 0 && (
                                                        <div className="mt-1 flex items-center justify-end gap-1 text-red-500 text-sm font-semibold">
                                                            <FaExclamationTriangle className="text-red-400" />
                                                            <span>{envio.erros.length} Erros</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-start gap-8 mt-4 pl-12 text-gray-600">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FaChartBar className="text-gray-400" />
                                                    <span>Entregues: <span className="font-semibold text-green-700">{envio.detalhes.entregues}</span></span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FaUserShield className="text-gray-400" />
                                                    <span>Aberturas: <span className="font-semibold text-blue-700">{envio.detalhes.aberturas}</span></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">Nenhum envio recente.</p>
                            )}
                        </div>
                    </div>

                    {/* Botão Realizar Envio */}
                    <div className="text-center mt-12 pb-8">
                        <Button
                            onClick={() => navigate('/create_envio')} // Rota de envio
                            className={`inline-flex items-center justify-center
                                px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105
                                bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))]
                                from-green-600/60 via-emerald-500 to-teal-500/60 text-white shadow-xl hover:shadow-2xl hover:text-white/90`}
                        >
                            <FaPaperPlane className="mr-3 text-2xl" />
                            Realizar Envio
                            <FaArrowRight className="ml-3 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;