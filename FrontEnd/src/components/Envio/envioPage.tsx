import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FaEnvelope, FaUsers, FaStar, FaCalendarAlt, FaPaperPlane } from "react-icons/fa";

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

const EnvioPage: React.FC = () => {
    const [listas, setListas] = useState<Lista[]>([]);
    const [campanhas, setCampanhas] = useState<Campanha[]>([]);
    const [selectedLista, setSelectedLista] = useState<number | null>(null);
    const [selectedCampanha, setSelectedCampanha] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        
        Promise.all([
            fetch("http://127.0.0.1:8000/all_lista").then(res => res.json()),
            fetch("http://127.0.0.1:8000/all_campanha").then(res => res.json())
        ])
        .then(([listasData, campanhasData]) => {
            setListas(listasData);
            setCampanhas(campanhasData);
        })
        .catch(() => {
            setListas([]);
            setCampanhas([]);
        })
        .finally(() => setLoading(false));
    }, []);

    const handleEnvio = () => {
        if (selectedLista && selectedCampanha) {
            alert(`Enviar campanha ${selectedCampanha} para lista ${selectedLista}`);
        }
    };

    const getGradientFromColor = (cor: string) => {
        const colorMap: { [key: string]: string } = {
            'Azul': 'from-blue-600/60 via-indigo-500/60 to-purple-600/60', // Azul → índigo → roxo
            'Verde': 'from-green-600/60 via-emerald-500/60 to-teal-600/60', // Verde → esmeralda → teal
            'Roxo': 'from-purple-600/60 via-violet-500/60 to-indigo-600/60', // Roxo → violeta → índigo
            'Rosa': 'from-pink-600/60 via-rose-500/60 to-red-600/60', // Rosa → rose → vermelho
            'Vermelho': 'from-red-600/60 via-pink-500/60 to-rose-600/60', // Vermelho → rosa → rose
            'Laranja': 'from-orange-600/60 via-amber-500/60 to-yellow-600/60', // Laranja → âmbar → amarelo
            'Amarelo': 'from-yellow-600/60 via-amber-500/60 to-orange-600/60', // Amarelo → âmbar → laranja
            'Ciano': 'from-cyan-600/60 via-sky-500/60 to-blue-600/60', // Ciano → sky → azul
            'Indigo': 'from-indigo-600/60 via-purple-500/60 to-violet-600/60', // Índigo → roxo → violeta
            'Cinza': 'from-gray-600/60 via-slate-500/60 to-zinc-600/60', // Cinza → slate → zinc
        };
        
        return colorMap[cor] || 'from-gray-600/60 via-slate-500/60 to-zinc-600/60';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8">
                        <Skeleton className="h-12 w-64 mx-auto mb-4" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Skeleton className="h-96 w-full" />
                        <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Envio de Campanhas
                    </h1>
                    <p className="text-lg text-gray-600">
                        Selecione uma lista e uma campanha para realizar o envio
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Seção de Listas */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                                <FaUsers className="text-white text-sm" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Listas de E-mails</h2>
                        </div>

                        <div className="grid gap-4">
                            {listas.map((lista) => (
                                <div
                                    key={lista.IdLista}
                                    className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg ${
                                        selectedLista === lista.IdLista
                                            ? "border-purple-500 bg-purple-50 shadow-lg"
                                            : "border-white/50 bg-white/80 backdrop-blur-sm hover:border-purple-200"
                                    }`}
                                    onClick={() => setSelectedLista(selectedLista === lista.IdLista ? null : lista.IdLista)}
                                >
                                    {/* Header com gradiente sutil */}
                                    <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 p-4 border-b border-purple-100">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                                <FaEnvelope className="text-purple-500" />
                                                {lista.Titulo}
                                            </h3>
                                            {selectedLista === lista.IdLista && (
                                                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Conteúdo */}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-gray-400" />
                                                <span>Último uso: {formatDate(lista.Ultimo_Uso)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seção de Campanhas */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <FaPaperPlane className="text-white text-sm" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Campanhas</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {campanhas.map((campanha) => (
                                <div
                                    key={campanha.IdCampanha}
                                    className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg h-48 ${
                                        selectedCampanha === campanha.IdCampanha
                                            ? "border-white/80 shadow-xl ring-2 ring-blue-400"
                                            : "border-white/50 hover:border-white/80"
                                    }`}
                                    onClick={() => {
                                        selectedCampanha == campanha.IdCampanha? 
                                        (setSelectedCampanha(null))
                                        :
                                        (setSelectedCampanha(campanha.IdCampanha))
                                        console.log(campanhas)
                                    }}
                                >
                                    {/* HTML Document Background - mais visível */}
                                    {campanha.Documento && (
                                        <div 
                                            className="absolute inset-0 overflow-hidden text-gray-800/60 bg-white/20"
                                            dangerouslySetInnerHTML={{ __html: campanha.Documento }}
                                            style={{
                                                fontSize: '8px',
                                                lineHeight: '1.2',
                                                transform: 'scale(0.85)',
                                                transformOrigin: 'top left',
                                                padding: '6px',
                                                filter: 'blur(0.5px)',
                                                backdropFilter: 'blur(1px)'
                                            }}
                                        />
                                    )}

                                    {/* Overlay gradiente baseado na cor da campanha - mais transparente */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${getGradientFromColor(campanha.Cor)} opacity-85`}></div>
                                    
                                    {/* Conteúdo do card */}
                                    <div className="relative z-10 h-full flex flex-col justify-between p-4 text-white">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold leading-tight mb-1 text-white drop-shadow-lg">
                                                    {campanha.Titulo}
                                                </h3>
                                                {campanha.Favorita && (
                                                    <FaStar className="text-yellow-300 drop-shadow-lg" />
                                                )}
                                            </div>
                                            {selectedCampanha === campanha.IdCampanha && (
                                                <div className="w-6 h-6 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                            )}
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

                {/* Botão de Envio */}
                <div className="text-center mt-12">
                    <div className="inline-block">
                        <Button
                            disabled={!selectedLista || !selectedCampanha}
                            onClick={handleEnvio}
                            className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                                !selectedLista || !selectedCampanha 
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700"
                            }`}
                        >
                            <FaPaperPlane className="mr-2" />
                            {!selectedLista || !selectedCampanha 
                                ? "Selecione uma lista e campanha" 
                                : "Enviar Campanha"}
                        </Button>
                    </div>
                    
                    {(selectedLista || selectedCampanha) && (
                        <div className="mt-4 text-sm text-gray-600">
                            {selectedLista && !selectedCampanha && "✓ Lista selecionada - Escolha uma campanha"}
                            {!selectedLista && selectedCampanha && "✓ Campanha selecionada - Escolha uma lista"}
                            {selectedLista && selectedCampanha && "✓ Pronto para envio!"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnvioPage;