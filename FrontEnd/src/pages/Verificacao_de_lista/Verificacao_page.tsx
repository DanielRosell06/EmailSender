import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FaEnvelope, FaUsers, FaExclamationTriangle, FaPlay, FaSpinner } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";

interface ListaVerificacao {
    IdLista: number;
    Titulo: string;
    TotalEmails: number;
    EmailsVerificados: number;
    EmailsNaoVerificados: number;
    EmailsInvalidos: number;
    Ultimo_Uso: string;
}

const VerificarEmailsPage: React.FC = () => {
    const [listas, setListas] = useState<ListaVerificacao[]>([]);
    const [filteredListas, setFilteredListas] = useState<ListaVerificacao[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [verificandoLista, setVerificandoLista] = useState<number | null>(null);
    const [mostrarAviso, setMostrarAviso] = useState(false);

    useEffect(() => {
        const fetchListas = async () => {
            setLoading(true);
            try {
                const res = await api('/lista_com_contagem_de_verificacoes');
                if (res.ok) {
                    const listasData = await res.json();
                    setListas(listasData);
                    setFilteredListas(listasData);
                } else {
                    console.error("Erro ao buscar listas:", res.status);
                    // Fallback para dados mock em caso de erro
                    const mockListas: ListaVerificacao[] = [
                        {
                            IdLista: 1,
                            Titulo: "Clientes VIP",
                            TotalEmails: 1250,
                            EmailsVerificados: 850,
                            EmailsNaoVerificados: 355,
                            EmailsInvalidos: 45,
                            Ultimo_Uso: "2024-01-15"
                        },
                        {
                            IdLista: 2,
                            Titulo: "Leads Quentes",
                            TotalEmails: 800,
                            EmailsVerificados: 320,
                            EmailsNaoVerificados: 468,
                            EmailsInvalidos: 12,
                            Ultimo_Uso: "2024-01-10"
                        }
                    ];
                    setListas(mockListas);
                    setFilteredListas(mockListas);
                }
            } catch (error) {
                console.error("Erro ao buscar listas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchListas();
    }, []);

    useEffect(() => {
        setFilteredListas(
            listas.filter(lista =>
                lista.Titulo.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, listas]);

    const handleIniciarVerificacao = async (idLista: number) => {
        setVerificandoLista(idLista);
        setMostrarAviso(true);
        
        try {
            const res = await api(`/verifify_list?list_id=${idLista}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                const result = await res.json();
                if (result) {
                    alert("Verificação concluída com sucesso!");
                    // Recarrega a lista para mostrar os novos status
                    fetchListas();
                } else {
                    alert("Erro na verificação");
                }
            } else {
                const error = await res.json();
                alert(`Erro: ${error.detail || 'Erro ao iniciar verificação'}`);
            }
        } catch (error) {
            console.error("Erro ao iniciar verificação:", error);
            alert("Erro ao iniciar verificação");
        } finally {
            setVerificandoLista(null);
            setMostrarAviso(false);
        }
    };

    const fetchListas = async () => {
        try {
            const res = await api('/lista_com_contagem_de_verificacoes');
            if (res.ok) {
                const listasData = await res.json();
                setListas(listasData);
                setFilteredListas(listasData);
            }
        } catch (error) {
            console.error("Erro ao buscar listas:", error);
        }
    };

    const calcularProgresso = (lista: ListaVerificacao) => {
        if (lista.TotalEmails === 0) return 0;
        return ((lista.EmailsVerificados + lista.EmailsInvalidos) / lista.TotalEmails) * 100;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const getVerificationStatus = (lista: ListaVerificacao) => {
        if (lista.EmailsVerificados === 0) return "Não verificada";
        if (lista.EmailsVerificados === lista.TotalEmails) return "Completamente verificada";
        return "Verificação em andamento";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Modal de Aviso */}
                {mostrarAviso && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaSpinner className="text-cyan-600 text-2xl animate-spin" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Verificando E-mails
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Isso pode demorar alguns minutos...
                                </p>
                                <p className="text-sm text-gray-500">
                                    Estamos validando o formato e verificando os servidores de e-mail de cada endereço.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Verificar Lista de E-mails
                    </h1>
                    <p className="text-lg text-gray-600">
                        Mantenha sua reputação SMTP verificando suas listas de e-mail
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Card de Informações - Lado Esquerdo */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-6 sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <FaExclamationTriangle className="text-white text-lg" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Por que verificar?
                                </h2>
                            </div>
                            
                            <div className="space-y-4 text-gray-600">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-cyan-600 text-sm font-bold">1</span>
                                    </div>
                                    <p>
                                        <strong className="text-gray-800">Proteção da Reputação SMTP:</strong> E-mails inválidos aumentam a taxa de bounce e prejudicam sua reputação.
                                    </p>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-cyan-600 text-sm font-bold">2</span>
                                    </div>
                                    <p>
                                        <strong className="text-gray-800">Melhor Deliverability:</strong> Entregue apenas em caixas de entrada válidas, aumentando suas taxas de abertura.
                                    </p>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-cyan-600 text-sm font-bold">3</span>
                                    </div>
                                    <p>
                                        <strong className="text-gray-800">Economia de Recursos:</strong> Evite desperdício de créditos e recursos enviando para e-mails inválidos.
                                    </p>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-cyan-600 text-sm font-bold">4</span>
                                    </div>
                                    <p>
                                        <strong className="text-gray-800">Dados Atualizados:</strong> Mantenha sua base de contatos sempre limpa e atualizada.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                                <p className="text-sm text-cyan-800 font-medium">
                                    <FaExclamationTriangle className="inline mr-2" />
                                    Verifique suas listas regularmente para manter a saúde da sua base de e-mails.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Verificações - Lado Direito */}
                    <div className="lg:col-span-2">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between gap-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-indigo-600/50 via-fuchsia-500 to-red-500/50 rounded-lg flex items-center justify-center">
                                        <FaEnvelope className="text-white text-sm" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-800">Listas para Verificação</h2>
                                </div>
                                <div className="w-64 relative">
                                    <Input
                                        type="text"
                                        placeholder="Pesquisar lista..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border-gray-300 rounded-full focus:ring-0 focus:ring-offset-0 transition-colors"
                                    />
                                    <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    [...Array(4)].map((_, i) => (
                                        <Skeleton key={i} className="h-32 w-full bg-gray-200 rounded-xl" />
                                    ))
                                ) : filteredListas.length > 0 ? (
                                    filteredListas.map((lista) => (
                                        <div
                                            key={lista.IdLista}
                                            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-indigo-600/50 via-fuchsia-500 to-red-500/50 rounded-xl flex items-center justify-center">
                                                        <FaUsers className="text-white text-lg" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-800">
                                                            {lista.Titulo}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            Última atualização: {formatDate(lista.Ultimo_Uso)}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            Status: {getVerificationStatus(lista)}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <Button
                                                    onClick={() => handleIniciarVerificacao(lista.IdLista)}
                                                    disabled={lista.TotalEmails === 0 || verificandoLista === lista.IdLista}
                                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {verificandoLista === lista.IdLista ? (
                                                        <>
                                                            <FaSpinner className="mr-2 text-sm animate-spin" />
                                                            Verificando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaPlay className="mr-2 text-sm" />
                                                            Iniciar Verificação
                                                        </>
                                                    )}
                                                </Button>
                                            </div>

                                            <div className="space-y-3">
                                                {/* Barra de Progresso */}
                                                <div className="flex items-center justify-between text-sm text-gray-600">
                                                    <span>Progresso da Verificação</span>
                                                    <span>
                                                        {lista.EmailsVerificados + lista.EmailsInvalidos}/{lista.TotalEmails} 
                                                        ({Math.round(calcularProgresso(lista))}%)
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${calcularProgresso(lista)}%` }}
                                                    ></div>
                                                </div>

                                                {/* Estatísticas */}
                                                <div className="flex items-center gap-6 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                        <span className="text-gray-600">
                                                            <strong className="text-gray-800">{lista.EmailsVerificados}</strong> verificados
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                        <span className="text-gray-600">
                                                            <strong className="text-gray-800">{lista.EmailsNaoVerificados}</strong> não verificados
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                        <span className="text-gray-600">
                                                            <strong className="text-gray-800">{lista.EmailsInvalidos}</strong> inválidos
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                                        <span className="text-gray-600">
                                                            <strong className="text-gray-800">{lista.TotalEmails}</strong> total
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <FaUsers className="text-gray-300 text-4xl mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">
                                            Nenhuma lista encontrada
                                        </p>
                                        <p className="text-gray-400 text-sm mt-2">
                                            {searchTerm ? "Tente ajustar os termos da pesquisa" : "Crie sua primeira lista de e-mails"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificarEmailsPage;