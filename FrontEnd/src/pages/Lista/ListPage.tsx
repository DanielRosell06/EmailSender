import React, { useEffect, useState } from "react";
import { FaUsers, FaCalendarAlt, FaEnvelopeOpenText, FaPaperPlane, FaArrowRight, FaEllipsisV } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import CreateListModal from "@/components/Lista/createListModal";
import { useNavigate } from "react-router-dom";
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
import EditListModal from "@/components/Lista/editListModal";

// Interface para as Listas e Envios
interface Lista {
    IdLista: number;
    Titulo: string;
    Ultimo_Uso: string;
    Lixeira: boolean;
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
    const [deletando, setDeletando] = useState(false)

    // Estados de carregamento individuais
    const [loadingListas, setLoadingListas] = useState(true);
    const [loadingEnvios, setLoadingEnvios] = useState(true);
    const [reload, setReload] = useState(-1)

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const navigate = useNavigate();

    function reloadListas() {
        setReload(reload * -1)
    }

    useEffect(() => {
        const fetchListas = async () => {
            setLoadingListas(true);
            try {
                const res = await api('/all_lista');
                const data = await res.json();
                const sortedListas = data.sort((a: Lista, b: Lista) => new Date(b.Ultimo_Uso).getTime() - new Date(a.Ultimo_Uso).getTime());
                setListas(sortedListas);
            } catch (error) {
                console.error("Erro ao buscar listas:", error);
                setListas([]);
            } finally {
                setLoadingListas(false);
            }
        };

        fetchListas();
    }, [backendUrl, reload]);

    // Efeito para buscar Envios
    useEffect(() => {
        const fetchEnviosData = async () => {
            setLoadingEnvios(true);
            try {
                const res = await api('/get_all_envio_com_lista_campanha_detalhe');
                const data = await res.json();

                const sortedEnvios = data.slice(0, 5);
                setEnviosRecentes(sortedEnvios);
            } catch (error) {
                console.error("Erro ao carregar envios recentes:", error);
                setEnviosRecentes([]);
            } finally {
                setLoadingEnvios(false);
            }
        };

        fetchEnviosData();
    }, [backendUrl]);

    const formatDate = (dateString: string) => {
        const localDateString = dateString + 'T12:00:00';        
        const date = new Date(localDateString);
        
        if (isNaN(date.getTime())) {
            return dateString; 
        }

        return date.toLocaleDateString('pt-BR');
    };


    const handleEnvioClick = (idEnvio: number) => {
        navigate(`/envio_detail/${idEnvio}`);
    };

    const handleDeleteLista = async (idLista: number) => {
        setDeletando(true)
        try {
            const res = await api(`/delete_lista?id_lista=${idLista}`, { method: "DELETE" });

            if (!res.ok) {
                throw new Error('Erro na requisição para deletar a lista.');
            }

            setListas(prev => prev.filter(lista => lista.IdLista !== idLista));
            setDeletando(false)

        } catch (error) {
            console.error("Erro ao deletar lista:", error);
            alert('Não foi possivel mover a lista para a lixeira, tente novamente mais tarde!');
            setDeletando(false)
        }
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [listToEditId, setListToEditId] = useState<number | null>(null);

    const handleOpenEditModal = (id: number | null) => {
        setListToEditId(id);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setListToEditId(null);
        reloadListas();
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
                        lista.Lixeira == false && (
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
                                    <div>
                                        <div className="flex items-center justify-center h-10 w-10">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className=" transition-all ease-in-out flex items-center justify-center w-[16px] h-[16px] rounded-full hover:cursor-pointer hover:text-xl">
                                                    <FaEllipsisV className="text-slate-600 transition-all duration-300 hover:text-slate-700 hover:text-xl" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-lg p-2 min-w-[120px]">
                                                    <DropdownMenuLabel>Opções</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onSelect={() => handleOpenEditModal(lista.IdLista)} className=" w-full focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-slate-200">
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <Dialog>
                                                        <DialogTrigger className="text-red-600 w-full focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-slate-200">
                                                            Mover para a lixeira
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-lg bg-white/90 rounded-xl shadow-xl p-6 border-none">
                                                            <DialogHeader>
                                                                <DialogTitle className="text-xl font-bold text-gray-800 mb-2">
                                                                    Mover Campanha para a lixeira
                                                                </DialogTitle>
                                                                <DialogDescription className="text-gray-600 mb-4">
                                                                    Você tem certeza que deseja mover a campanha <span className="font-semibold">{lista.Titulo}</span> para a lixeira?
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
                                                                        className=" hover:cursor-pointer bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl shadow hover:from-red-600 hover:to-pink-600 transition-all"
                                                                        onClick={() => {
                                                                            handleDeleteLista(lista.IdLista)
                                                                        }}
                                                                        disabled={deletando}
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
                                </div>
                            </div>
                        )
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
                            onClick={() => navigate('/lixeira_lista')}
                        >
                            Ver Lixeira <FaArrowRight className="ml-2" />
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
            <EditListModal
                isModalOpen={isEditModalOpen}
                openModal={() => handleOpenEditModal(listToEditId)} // Adicionado o openModal
                onClose={handleCloseEditModal}
                listaId={listToEditId}
            />
        </div>
    );
};

export default ListasPage;