import { useEffect, useState } from "react";
import { FaPaperPlane, FaEnvelope, FaEye, FaEyeSlash, FaSearch, FaChevronLeft, FaChartBar, FaUserShield } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoaderData, useNavigate } from "react-router-dom";
import { api } from '@/services/api.ts';
import { FiAlertTriangle } from "react-icons/fi";

// Interfaces para os dados
interface EmailStatus {
    IdEmail: string;
    Visto: boolean;
}

interface Campanha {
    Titulo: string;
    Documento: string;
}

interface EnvioData {
    Status: EmailStatus[];
    Campanha: Campanha;
}

interface DetalheComEmail {
    "IdDetalhe": number,
    "Conteudo": string | null,
    "Tipo": number,
    "Codigo": number | null,
    "Envio": number,
    "Email": number | null
    "ConteudoEmail": string | null,
}

const EnvioDetailsPage = () => {
    const { IdEnvio } = useLoaderData() as { IdEnvio: string };
    const [envioData, setEnvioData] = useState<EnvioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(true)
    const [detailsData, setDetailsData] = useState<DetalheComEmail[]>([])
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // ID do envio padrão, obtido dinamicamente da rota
    const idEnvio = parseInt(IdEnvio, 10);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                // Usa a sua função 'api' para fazer a requisição
                const response = await api(`/get_status_envio_by_envio?id_envio=${idEnvio}`);

                const data: EnvioData = await response.json();
                setEnvioData(data);

            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idEnvio]);

    useEffect(() => {
        const fetchData = async () => {
            setLoadingDetails(true);

            try {
                // Usa a sua função 'api' para fazer a requisição
                const response = await api(`/get_detalhe_by_envio_com_email?id_envio=${idEnvio}`);

                const data: DetalheComEmail[] = await response.json();
                console.log("Dados de detalhe:")
                console.log(data)
                setDetailsData(data);

            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoadingDetails(false);
            }
        };

        fetchData();
    }, [idEnvio]);

    // Filtragem dos emails e cálculo de aberturas
    const filteredEmails = envioData?.Status.filter(email =>
        email.IdEmail.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const viewedEmails = envioData?.Status.filter(email => email.Visto).length || 0;

    const renderSkeletons = () => (
        <div className="min-h-screen p-8 bg-white/70 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex gap-8">
                <div className="flex-1 space-y-4">
                    <div className="h-96 rounded-xl bg-gray-200 animate-pulse mb-6"></div>
                </div>
                <div className="flex-1 space-y-6">
                    <div className="h-8 bg-gray-300 rounded w-64 animate-pulse mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded w-full animate-pulse"></div>
                    <div className="space-y-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-12 rounded-xl bg-gray-200 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return renderSkeletons();
    }

    return (
        <div className="min-h-screen p-8 bg-white/70 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Button
                        onClick={() => {
                            navigate('/');
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700
                                   hover:bg-gray-200 transition-colors duration-200"
                    >
                        <FaChevronLeft className="w-4 h-4" />
                        Voltar
                    </Button>
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                            <FaPaperPlane className="text-white text-lg" />
                        </span>
                        Detalhes do Envio
                    </h1>
                    <div className="w-24"></div>
                </div>

                {detailsData.filter(detalhe => detalhe.Codigo == 452).length > 0 && (
                    <div className="w-full text-center">
                        <div className="bg-red-100 border-[2px] border-red-200 w-[500px] h-[70px] flex ml-auto mr-auto mb-10 pl-4 pr-4 text-left rounded-[16px]">
                            <FiAlertTriangle className="mt-auto mb-auto mr-4 text-5xl text-red-400"></FiAlertTriangle>
                            {detailsData.filter(detalhe => detalhe.Codigo == 452).map((detalhe, index) => (
                                <h1 key={index} className="mt-auto mb-auto text-red-500">
                                    O servidor SMTP que a sua conta utiliza bloqueou o envio de emails a partir do {detalhe.Conteudo?.replace(/nEnviado\s*(\d+).*/, '$1')}° email da lista.                                </h1>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Painel Esquerdo - Visualização da Campanha */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                                <FaPaperPlane className="text-white text-sm" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Campanha: {envioData?.Campanha?.Titulo || 'Não encontrada'}
                            </h2>
                        </div>
                        <div className="relative w-full h-[600px] border-2 border-gray-100 rounded-xl bg-white/70 backdrop-blur-sm shadow-lg overflow-hidden">
                            {envioData?.Campanha?.Documento ? (
                                <iframe
                                    srcDoc={envioData.Campanha.Documento}
                                    className="w-full h-full border-0"
                                    frameBorder="0"
                                    title="Preview da Campanha"
                                    sandbox=""
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-center text-gray-500">
                                    Conteúdo da campanha não disponível.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Painel Direito - Dados do Envio */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between gap-3 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                                    <FaEnvelope className="text-white text-sm" />
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    E-mails enviados
                                </h2>
                            </div>
                            <div className="w-1/2 relative">
                                <Input
                                    type="text"
                                    placeholder="Pesquisar e-mail..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border-gray-300 rounded-full focus:ring-0 focus:ring-offset-0 transition-colors bg-white/80"
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Estatísticas de Envio */}
                        <div className="flex gap-4 p-4 rounded-xl border-2 border-gray-100 bg-white/70 backdrop-blur-sm shadow-lg">
                            <div className="flex items-center gap-2 text-gray-600">
                                <FaChartBar className="text-green-500" />
                                <span className="font-semibold">Entregues:</span>
                                <span className="text-green-700 font-bold">{envioData?.Status.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <FaUserShield className="text-blue-500" />
                                <span className="font-semibold">Aberturas:</span>
                                <span className="text-blue-700 font-bold">{viewedEmails}</span>
                            </div>
                        </div>

                        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border-2 border-gray-100 shadow-lg h-[515px] overflow-y-auto space-y-2">
                            {filteredEmails.length > 0 ? (
                                filteredEmails.map((email, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <span className="text-sm font-medium text-gray-700">{email.IdEmail}</span>
                                        {email.Visto ? (
                                            <div className="flex items-center gap-1 text-green-500">
                                                <FaEye />
                                                <span className="text-xs">Visto</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-gray-400">
                                                <FaEyeSlash />
                                                <span className="text-xs">Não Visto</span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 mt-4">Nenhum e-mail encontrado.</p>
                            )}
                        </div>
                    </div>
                    {detailsData.filter(detalhe => detalhe.Codigo == 553).length > 0 && (
                        <div className=" gap-4 p-4 rounded-xl border-2 border-gray-100 bg-white/70 backdrop-blur-sm shadow-lg">
                            <div className="flex">
                                <span className="p-2 rounded-lg bg-gradient-to-r from-red-400 to-red-600">
                                    <FaSearch className="text-white text-lg" />
                                </span>
                                <h1 className="text-xl font-bold mt-auto mb-auto ml-2">Emails não encontrados</h1>
                            </div>
                            <h1 className="text-gray-500 mt-4">Esta é uma lista dos emails que estão na lista, mas não foram encontrados ao tentar realizar o envio e, portanto, o envio não foi feito.</h1>
                            <div className="bg-gray-100 rounded-xl mt-4 p-2">
                                {detailsData.filter(detalhe => detalhe.Codigo == 553).map((detalhe, index) => (
                                    <div key={index} className={index != 0 ? "mt-4" : ""}>
                                        {detalhe.ConteudoEmail}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default EnvioDetailsPage;