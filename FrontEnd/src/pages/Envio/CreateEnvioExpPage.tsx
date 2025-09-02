import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaEnvelope, FaUsers, FaPaperPlane, FaChevronLeft, FaSearch } from "react-icons/fa";
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Lista {
    IdLista: number;
    Titulo: string;
    Ultimo_Uso: string;
    Emails: { Conteudo: string }[];
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

const CreateEnvioExpPage: React.FC = () => {
    const { IdCampanha, IdLista } = useLoaderData() as { IdCampanha?: string; IdLista?: string };

    const [lista, setLista] = useState<Lista | null>(null);
    const [campanha, setCampanha] = useState<Campanha | null>(null)
    const [loadingLista, setLoadingLista] = useState(true);
    const [loadingCampanha, setLoadingCampanha] = useState(true);
    const navigate = useNavigate();

    // Novo estado para o termo de pesquisa e a lista filtrada
    const [searchTermLista, setSearchTermLista] = useState("");
    const [filteredEmails, setFilteredEmails] = useState<{ Conteudo: string }[]>([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

    useEffect(() => {
        if (backendUrl != "" && IdLista != "") {
            console.log(IdLista)
            fetch(`${backendUrl}/get_lista_by_id_com_email?id_lista=${IdLista}`)
                .then(res => res.json())
                .then(listaData => {
                    setLista(listaData);
                    // Inicializa a lista filtrada com todos os e-mails
                    if (listaData && listaData.Emails) {
                        setFilteredEmails(listaData.Emails);
                    }
                })
                .catch(() => setLista(null))
                .finally(() => {
                    setLoadingLista(false)
                });
        }
    }, [backendUrl, IdLista]);

    useEffect(() => {
        console.log(lista)
    }, [lista])

    useEffect(() => {
        setLoadingCampanha(true);
        if (backendUrl != "" && IdLista != "") {
            fetch(`${backendUrl}/campanha_by_id?id_campanha=${IdCampanha}`)
                .then(res => res.json())
                .then(campanhaData => {
                    setCampanha(campanhaData);
                })
                .catch(() => setCampanha(null))
                .finally(() => setLoadingCampanha(false));
        }
    }, [backendUrl, IdLista]);

    // Novo useEffect para filtrar a lista de e-mails sempre que o termo de pesquisa ou a lista original mudar
    useEffect(() => {
        if (lista && lista.Emails) {
            const filtered = lista.Emails.filter(email =>
                email.Conteudo.toLowerCase().includes(searchTermLista.toLowerCase())
            );
            setFilteredEmails(filtered);
        }
    }, [searchTermLista, lista]);

    const handleEnvio = () => {
        const envioData = {
            Lista: IdLista,
            Campanha: IdCampanha
        };
        navigate('/envio_progress', { state: { envioData } });
    };

    const renderLista = () => {
        if (!lista) {
            return (
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                                <FaUsers className="text-white text-sm" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">E-mails na lista</h2>
                        </div>
                    </div>
                    {loadingLista ? (
                        <Skeleton className="bg-slate-200 w-full h-128"></Skeleton>
                    ) : (
                        <p>Não foi possível carregar a lista. Verifique o ID da lista.</p>
                    )}
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                            <FaUsers className="text-white text-sm" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Lista: {lista.Titulo}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Último uso: {lista.Ultimo_Uso}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Pesquisar e-mail..."
                        value={searchTermLista}
                        onChange={(e) => setSearchTermLista(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-full focus:ring-0 focus:ring-offset-0 transition-colors"
                    />
                </div>
                <div className="w-full h-96 rounded-lg bg-white overflow-y-auto">
                    {filteredEmails.length > 0 ? (
                        <ul className="space-y-2 p-2">
                            {filteredEmails.slice(0, 100).map((email, index) => (
                                <li
                                    key={index}
                                    className="flex items-center p-2 rounded-lg bg-stone-100 bg-opacity-60 text-stone-800 shadow-sm transition-transform transform hover:scale-[1.01]"
                                >
                                    <FaEnvelope className="text-purple-500 mr-3" />
                                    <span className="text-sm font-medium">{email.Conteudo}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center p-4 text-gray-500">Nenhum e-mail encontrado.</p>
                    )}
                </div>
            </div>
        );
    };

    const renderCampanha = () => {
        if (!campanha) {
            return (
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <FaPaperPlane className="text-white text-sm" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Campanha</h2>
                        </div>
                    </div>
                    {loadingCampanha ? (
                        <Skeleton className="bg-slate-200 w-full h-128"></Skeleton>
                    ) : (
                        <p>Não foi possível carregar a campanha. Verifique o ID da campanha.</p>
                    )}
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <FaPaperPlane className="text-white text-sm" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Campanha: {campanha.Titulo}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Último uso: {campanha.Ultimo_Uso}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full overflow-hidden rounded-lg bg-gray-100 p-2 shadow-inner h-128">
                    <iframe
                        srcDoc={campanha.Documento}
                        className="w-[100%] h-full border-none"
                        style={{
                            transformOrigin: 'top left',
                        }}
                        frameBorder="0"
                        title={`preview-${campanha.IdCampanha}`}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto mt-30">
                <div className="flex items-center justify-between mb-12">
                    <Button
                        onClick={() => {
                            navigate(-1);
                            setTimeout(() => {
                                if (window.location.pathname === "/envio_progress") {
                                    navigate("/");
                                }
                            }, 100);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700
                                   hover:bg-gray-200 transition-colors duration-200"
                    >
                        <FaChevronLeft className="w-4 h-4" />
                        Voltar
                    </Button>
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                        Enviar Campanha
                    </h1>
                    <div className="w-24"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {renderLista()}
                    {renderCampanha()}
                </div>
                <div className="text-center mt-12">
                    <div className="inline-block">
                        <Button
                            onClick={handleEnvio}
                            className={`mb-4 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 
                                bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 hover:cursor-pointer"
                                }`}
                        >
                            <FaPaperPlane className="mr-2" />
                            Enviar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEnvioExpPage;