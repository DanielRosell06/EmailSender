import React, { useEffect, useState } from "react";
import { FaPlus, FaPaperPlane, FaCalendarAlt, FaArrowRight, FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Campanha {
    IdCampanha: number;
    Titulo: string;
    Cor: string;
    Documento: string;
    Ultimo_Uso: string;
    Favorita: boolean;
}

const CampanhasPage: React.FC = () => {
    const [campanhas, setCampanhas] = useState<Campanha[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampanha, setSelectedCampanha] = useState<Campanha | null>(null);
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

    useEffect(() => {
        setLoading(true);

        fetch(`${backendUrl}/all_campanha`)
            .then(res => res.json())
            .then(data => {
                setCampanhas(data);
            })
            .catch(() => {
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

    const handleCampanhaClick = (campanha: Campanha) => {
        setSelectedCampanha(campanha);
    };

    const renderSkeletons = () => (
        <div className="min-h-screen p-8 bg-white/70 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div className="h-8 w-64 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-8 w-24 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="h-40 rounded-xl bg-gray-300 animate-pulse"></div>
                <div className="flex gap-8">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-48 rounded-xl bg-gray-200 animate-pulse"></div>
                        ))}
                    </div>
                    <div className="w-1/3 h-[500px] rounded-xl bg-gray-200 animate-pulse"></div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return renderSkeletons();
    }

    return (
        <div className="min-h-screen p-8 bg-white/70 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                            <FaPaperPlane className="text-white text-lg" />
                        </span>
                        Minhas Campanhas
                    </h1>
                    <Button
                        variant="link"
                        className="text-gray-600 hover:text-blue-500"
                        onClick={() => console.log('Navegar para a página de campanhas completas')}
                    >
                        Ver Todas <FaArrowRight className="ml-2" />
                    </Button>
                </div>

                <div
                    onClick={() => navigate('/create_campanha')}
                    className="group relative overflow-hidden rounded-xl w-full h-40 cursor-pointer flex items-center justify-center p-4
                               border-2 border-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                               hover:bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-blue-600/60 via-indigo-500 to-cyan-500/60"
                >
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="p-4 rounded-full bg-blue-500/20 backdrop-blur-sm border border-white/50 mb-2 transition-all duration-300 group-hover:bg-blue-500/60">
                            <FaPlus className="text-blue-500 text-3xl group-hover:text-white transition-all duration-300" />
                        </div>
                        <span className="text-gray-700 font-semibold text-center transition-colors group-hover:text-white">Criar Nova Campanha</span>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Grid de Campanhas */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campanhas.length > 0 ? (
                            campanhas.map((campanha) => (
                                <div
                                    key={campanha.IdCampanha}
                                    onClick={() => handleCampanhaClick(campanha)}
                                    className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg h-48
                                        ${selectedCampanha?.IdCampanha === campanha.IdCampanha ? 'border-blue-400' : 'border-white/50 hover:border-blue-400'}`}
                                >
                                    {campanha.Documento && (
                                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                            <iframe
                                                srcDoc={campanha.Documento}
                                                className="w-[640px] h-[850px] border-none scale-[0.47] origin-top-left"
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
                                        <div className="flex items-start justify-between w-full">
                                            <div className="flex flex-row justify-between w-full">
                                                <h3 className="w-[90%] text-lg font-bold leading-tight mb-1 drop-shadow-lg">
                                                    {campanha.Titulo}
                                                </h3>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className=" transition-all ease-in-out flex items-center justify-center w-[16px] h-[16px] rounded-full hover:cursor-pointer hover:text-xl">
                                                        <FaEllipsisV />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-lg p-2 min-w-[120px]">
                                                        <DropdownMenuLabel>Opções</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="hover:bg-slate-200"
                                                            onClick={() => navigate(`/edit_campanha/${campanha.IdCampanha}`)}
                                                        >
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="hover:bg-slate-200">Enviar</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
                            ))
                        ) : (
                            <p className="text-center text-gray-500 mt-4">Nenhuma campanha encontrada.</p>
                        )}
                    </div>

                    {/* Painel de Visualização */}
                    <div className="w-1/3 h-[500px] p-4 rounded-xl border-2 border-gray-100 bg-white/70 backdrop-blur-sm shadow-lg overflow-hidden">
                        {selectedCampanha ? (
                            <iframe
                                srcDoc={selectedCampanha.Documento}
                                className="w-full h-full border-none"
                                frameBorder="0"
                                scrolling="auto"
                                title={`preview-full-${selectedCampanha.IdCampanha}`}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-center text-gray-500 p-4">
                                <p>Clique em uma campanha para ver o seu conteúdo aqui.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampanhasPage;