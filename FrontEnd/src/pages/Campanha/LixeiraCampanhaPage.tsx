import React, { useEffect, useState } from "react";
import { FaPlus, FaPaperPlane, FaCalendarAlt, FaArrowRight, FaEllipsisV, FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from '@/services/api.ts';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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


interface Campanha {
    IdCampanha: number;
    Titulo: string;
    Cor: string;
    Documento: string;
    Ultimo_Uso: string;
    Favorita: boolean;
    Lixeira: boolean;
}

const LixeiraCampanhasPage: React.FC = () => {
    const [campanhas, setCampanhas] = useState<Campanha[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampanha, setSelectedCampanha] = useState<Campanha | null>(null);
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

    useEffect(() => {
        const fetchCampanhas = async () => {
            setLoading(true);

            try {
                // Usa a sua função 'api' para fazer a requisição GET
                const res = await api('/all_campanha');

                // O tratamento para 401 já está na sua função 'api'
                const data = await res.json();

                setCampanhas(data);

            } catch (error) {
                console.error("Erro ao buscar campanhas:", error);
                setCampanhas([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCampanhas();
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

    const handleUndeleteCampanha = async (id_campanha: number) => {
        try {
            // Usa a sua função 'api' e passa o método DELETE
            const res = await api(`/undelete_campanha/?id_campanha=${id_campanha}`, { method: "DELETE" });
            const undeleted = await res.json(); // Mudado o nome da variável para 'undeleted'

            if (undeleted) {
                setCampanhas(campanhas.filter(c => c.IdCampanha !== id_campanha));
                if (selectedCampanha?.IdCampanha === id_campanha) {
                    setSelectedCampanha(null);
                }
            }
        } catch (error) {
            console.error("Erro ao restaurar campanha:", error);
        }
    };

    const renderSkeletons = () => (
        <div className="min-h-screen p-8 bg-white/70 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div className="h-8 w-64 bg-gray-300 rounded animate-pulse"></div>
                </div>
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
                <div className="flex">
                    <Button
                        onClick={() => {
                            navigate(-1);
                        }}
                        className="mr-12 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700
                                                       hover:bg-gray-200 transition-colors duration-200"
                    >
                        <FaChevronLeft className="w-4 h-4" />
                        Voltar
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                            <FaPaperPlane className="text-white text-lg" />
                        </span>
                        Campanhas na Lixeira
                    </h1>
                </div>
                <div className="flex gap-8">

                    {/* Grid de Campanhas */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campanhas.length > 0 ? (
                            campanhas.map((campanha) => (
                                campanha.Lixeira == true &&
                                (
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
                                                            <Dialog>
                                                                <DialogTrigger className="w-full focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-slate-200">Ver</DialogTrigger>
                                                                <DialogContent className="max-w-lg bg-white/90 rounded-xl shadow-xl p-6 border-none">
                                                                    <DialogHeader>
                                                                        <DialogTitle className="text-xl font-bold text-gray-800 mb-2">
                                                                            Visualizar Campanha
                                                                        </DialogTitle>
                                                                        <DialogDescription className="text-gray-600 mb-4">
                                                                            Veja uma prévia do conteúdo da campanha <span className="font-semibold">{campanha.Titulo}</span>.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50 p-4 mb-4">
                                                                        {campanha.Documento ? (
                                                                            <iframe
                                                                                srcDoc={campanha.Documento}
                                                                                className="w-full h-[400px] border-none rounded-lg"
                                                                                style={{ background: "white" }}
                                                                                frameBorder="0"
                                                                                scrolling="auto"
                                                                                title={`preview-dialog-${campanha.IdCampanha}`}
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
                                                            <Dialog>
                                                                <DialogTrigger className="text-red-600 w-full focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-slate-200">
                                                                    Remover da lixeira
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-lg bg-white/90 rounded-xl shadow-xl p-6 border-none">
                                                                    <DialogHeader>
                                                                        <DialogTitle className="text-xl font-bold text-gray-800 mb-2">
                                                                            Remover Campanha da lixeira
                                                                        </DialogTitle>
                                                                        <DialogDescription className="text-gray-600 mb-4">
                                                                            Você tem certeza que deseja remover a campanha <span className="font-semibold">{campanha.Titulo}</span> da lixeira?
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <DialogFooter className="flex gap-2">
                                                                        <DialogClose asChild>
                                                                            <Button
                                                                                className="bg-slate-200 hover:bg-slate-300 hover:cursor-pointer rounded-xl"
                                                                            >
                                                                                Cancelar
                                                                            </Button>
                                                                        </DialogClose>
                                                                        <DialogClose asChild>
                                                                            <Button
                                                                                className=" hover:cursor-pointer bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl shadow hover:from-blue-600 hover:to-green-600 transition-all"
                                                                                onClick={() => {
                                                                                    handleUndeleteCampanha(campanha.IdCampanha)
                                                                                }}
                                                                            >
                                                                                Confirmar
                                                                            </Button>
                                                                        </DialogClose>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
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
                                    </div>)
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

export default LixeiraCampanhasPage;