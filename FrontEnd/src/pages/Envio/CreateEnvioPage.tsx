import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FaEnvelope, FaUsers, FaStar, FaCalendarAlt, FaPaperPlane, FaSearch, FaExpand } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { api } from "@/services/api";


interface Lista {
    IdLista: number;
    Titulo: string;
    Ultimo_Uso: string;
    Lixeira: boolean;
}

interface Campanha {
    IdCampanha: number;
    Titulo: string;
    Cor: string;
    Assunto: string;
    Documento: string;
    Ultimo_Uso: string;
    Favorita: boolean;
    Lixeira: boolean;
}

const CreateEnvioPage: React.FC = () => {
    const [listas, setListas] = useState<Lista[]>([]);
    const [campanhas, setCampanhas] = useState<Campanha[]>([]);
    const [filteredListas, setFilteredListas] = useState<Lista[]>([]);
    const [filteredCampanhas, setFilteredCampanhas] = useState<Campanha[]>([]);
    const [searchTermLista, setSearchTermLista] = useState("");
    const [searchTermCampanha, setSearchTermCampanha] = useState("");
    const [selectedLista, setSelectedLista] = useState<number | null>(null);
    const [selectedCampanha, setSelectedCampanha] = useState<number | null>(null);
    const [loadingListas, setLoadingListas] = useState(true);
    const [loadingCampanhas, setLoadingCampanhas] = useState(true);
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

    useEffect(() => {
        const fetchListas = async () => {
            setLoadingListas(true);

            try {
                const res = await api('/all_lista');
                const listasData = await res.json();

                const sortedListas = listasData.sort((a: Lista, b: Lista) => new Date(b.Ultimo_Uso).getTime() - new Date(a.Ultimo_Uso).getTime());
                setListas(sortedListas);
                setFilteredListas(sortedListas);

            } catch (error) {
                console.error("Erro ao buscar listas:", error);
                setListas([]);
            } finally {
                setLoadingListas(false);
            }
        };

        fetchListas();
    }, [backendUrl]);

    useEffect(() => {
        const fetchCampanhas = async () => {
            setLoadingCampanhas(true);

            try {
                const res = await api('/all_campanha');
                const campanhasData = await res.json();
                const sortedCampanhas = campanhasData.sort((a: Campanha, b: Campanha) => new Date(b.Ultimo_Uso).getTime() - new Date(a.Ultimo_Uso).getTime());
                setCampanhas(sortedCampanhas);
                setFilteredCampanhas(sortedCampanhas);

            } catch (error) {
                console.error("Erro ao buscar campanhas:", error);
                setCampanhas([]);
            } finally {
                setLoadingCampanhas(false);
            }
        };

        fetchCampanhas();
    }, [backendUrl]);

    useEffect(() => {
        setFilteredListas(
            listas.filter(lista =>
                lista.Titulo.toLowerCase().includes(searchTermLista.toLowerCase())
            )
        );
    }, [searchTermLista, listas]);

    useEffect(() => {
        setFilteredCampanhas(
            campanhas.filter(campanha =>
                campanha.Titulo.toLowerCase().includes(searchTermCampanha.toLowerCase())
            )
        );
    }, [searchTermCampanha, campanhas]);

    const handleEnvio = () => {
        if (selectedLista && selectedCampanha) {
            navigate(`/create_envio_exp/${selectedCampanha}/${selectedLista}`);
        } else {
            alert('Por favor, selecione uma lista e uma campanha antes de enviar.');
        }
    };

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

    const renderListas = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-indigo-600/50 via-fuchsia-500 to-red-500/50 rounded-lg flex items-center justify-center">
                        <FaUsers className="text-white text-sm" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">Listas de E-mails</h2>
                </div>
                <div className="w-1/2 relative">
                    <Input
                        type="text"
                        placeholder="Pesquisar lista..."
                        value={searchTermLista}
                        onChange={(e) => setSearchTermLista(e.target.value)}
                        className="pl-10 pr-4 py-2 border-gray-300 rounded-full focus:ring-0 focus:ring-offset-0 transition-colors"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>
            <div className="grid gap-4">
                {loadingListas ? (
                    [...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-28 w-full bg-gray-200" />
                    ))
                ) : filteredListas.length > 0 ? (
                    filteredListas.filter(a => a.Lixeira === false).slice(0, 5).map((lista) => (
                        <div
                            key={lista.IdLista}
                            className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg ${selectedLista === lista.IdLista
                                ? "border-white/50 bg-white/80 backdrop-blur-sm shadow-xl ring-2 ring-fuchsia-500"
                                : "border-white/50 bg-white/80 backdrop-blur-sm hover:border-indigo-200"
                                }`}
                            onClick={() => setSelectedLista(selectedLista === lista.IdLista ? null : lista.IdLista)}
                        >
                            <div className="bg-fuchsia-500/20 p-4 border-b border-indigo-100">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-black drop-shadow-lg flex items-center gap-2">
                                        <FaUsers className="text-fuchsia-600" />
                                        {lista.Titulo}
                                    </h3>
                                    {selectedLista === lista.IdLista && (
                                        <div className="w-6 h-6 bg-fuchsia-500 rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-gray-400" />
                                        <span>Último uso: {formatDate(lista.Ultimo_Uso)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Nenhuma lista encontrada.</p>
                )}
            </div>
        </div>
    );

    const renderCampanhas = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <FaEnvelope className="text-white text-sm" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">Campanhas</h2>
                </div>
                <div className="w-1/2 relative">
                    <Input
                        type="text"
                        placeholder="Pesquisar campanha..."
                        value={searchTermCampanha}
                        onChange={(e) => setSearchTermCampanha(e.target.value)}
                        className="pl-10 pr-4 py-2 border-gray-300 rounded-full focus:ring-0 focus:ring-offset-0 transition-colors"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {loadingCampanhas ? (
                    [...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-48 w-full bg-gray-200" />
                    ))
                ) : filteredCampanhas.length > 0 ? (
                    filteredCampanhas.
                        filter(campanha => campanha.Lixeira === false)
                        .slice(0, 8)
                        .map((campanha) => (
                            <div
                                key={campanha.IdCampanha}
                                className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg h-48 ${selectedCampanha === campanha.IdCampanha
                                    ? "border-white/80 shadow-xl ring-2 ring-blue-400"
                                    : "border-white/50 hover:border-white/80"
                                    }`}
                                onClick={() => setSelectedCampanha(prev => prev === campanha.IdCampanha ? null : campanha.IdCampanha)}
                            >
                                {campanha.Documento && (
                                    <div className="absolute inset-0 overflow-hidden bg-white/20 pointer-events-none">
                                        <iframe
                                            srcDoc={campanha.Documento}
                                            className="w-[640px] h-[850px] border-none"
                                            style={{
                                                marginTop: '50px',
                                                transformOrigin: 'top left',
                                                transform: 'scale(0.47)',
                                                filter: 'blur(0.5px)',
                                            }}
                                            frameBorder="0"
                                            scrolling="no"
                                            title={`preview-${campanha.IdCampanha}`}
                                            sandbox=""
                                        />
                                    </div>
                                )}
                                <div className={`absolute inset-0 bg-gradient-to-br ${getGradientFromColor(campanha.Cor)} opacity-85`}></div>
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
                                    <div className="mt-auto justify-between flex">
                                        <div className="flex items-center gap-2 text-sm text-white/90">
                                            <FaCalendarAlt className="text-white/70" />
                                            <span className="drop-shadow-lg">{formatDate(campanha.Ultimo_Uso)}</span>
                                        </div>
                                        <Dialog>
                                            <DialogTrigger className=" transition-all ease-in-out flex items-center justify-center w-[16px] h-[16px] rounded-full hover:cursor-pointer hover:text-xl">
                                                <FaExpand></FaExpand>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-lg bg-white/90 rounded-xl shadow-xl p-6 border-none">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl font-bold text-gray-800 mb-2">
                                                        Visualizar Campanha
                                                    </DialogTitle>
                                                    <DialogDescription className="text-gray-600 mb-4">
                                                        Veja uma prévia do conteúdo da campanha <span className="font-semibold">{campanha.Titulo}</span>.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <h1 className="font-bold">Assunto: <span className="font-normal">{campanha.Assunto}</span></h1>
                                                <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50 p-4 mb-4">
                                                    {campanha.Documento ? (
                                                        <iframe
                                                            srcDoc={campanha.Documento}
                                                            className="w-full h-[400px] border-none rounded-lg"
                                                            style={{ background: "white" }}
                                                            frameBorder="0"
                                                            scrolling="auto"
                                                            title={`preview-dialog-${campanha.IdCampanha}`}
                                                            sandbox=""
                                                        />
                                                    ) : (
                                                        <div className="text-center text-gray-400 py-16">
                                                            Nenhum conteúdo disponível para esta campanha.
                                                        </div>
                                                    )}
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button
                                                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow hover:from-blue-600 hover:to-cyan-600 transition-all"
                                                        >
                                                            Fechar
                                                        </Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </div>
                        ))
                ) : (
                    <p className="text-center text-gray-500">Nenhuma campanha encontrada.</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Envio de Campanhas
                    </h1>
                    <p className="text-lg text-gray-600">
                        Selecione uma lista e uma campanha para realizar o envio
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {renderListas()}
                    {renderCampanhas()}
                </div>
                <div className="text-center mt-12">
                    <div className="inline-block">
                        <Button
                            disabled={!selectedLista || !selectedCampanha}
                            onClick={handleEnvio}
                            className={`mb-4 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${!selectedLista || !selectedCampanha
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
                        <div className="mb-12 mt-4 text-sm text-gray-600">
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

export default CreateEnvioPage;