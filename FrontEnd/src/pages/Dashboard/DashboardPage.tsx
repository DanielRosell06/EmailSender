import React, { useEffect, useState, useMemo } from "react";
import { FaPaperPlane, FaCheckCircle, FaChartBar, FaEnvelopeOpenText, FaChartLine, FaSearch } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { api } from "@/services/api";
import { Input } from "@/components/ui/input"; // Importado o Input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Importado o Select

// Renomeando o Tooltip do Recharts para evitar conflito com o Tooltip do shadcn/ui
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    Legend, LineChart, Line
} from 'recharts';

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// Importações Padrão do shadcn/ui
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


// --- Interfaces de Dados ---
interface Lista {
    IdLista: number;
    Titulo: string;
}

interface Campanha {
    IdCampanha: number;
    Titulo: string;
    Cor: string;
    Assunto: string;
}

interface Envio {
    IdEnvio: number;
    IdCampanha: number;
    IdLista: number;
    Dt_Envio: string; // Nome do campo de data
    Lista: Lista;
    Campanha: Campanha;
}

interface StatusEnvio {
    IdStatus: number;
    Visto: boolean;
}

interface EnvioComMetricas extends Envio {
    entregas: number;
    aberturas: number;
}

// Tipo para o Select de pesquisa
type SearchType = 'Dt_Envio' | 'Campanha' | 'Lista';

// --- Funções Auxiliares ---

const formatDate = (dateString: string) => {
    const localDateString = dateString + 'T12:00:00';
    const date = new Date(localDateString);

    if (isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString('pt-BR');
};

const formatFullDate = (dateString: string) => {
    const localDateString = dateString + 'T12:00:00';
    const date = new Date(localDateString);

    if (isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};


// Cores para os elementos da Dashboard (Vermelho para Laranja)
const DASHBOARD_COLORS = {
    PRIMARY: "from-red-500 to-orange-500",
    ENTREGAS: "#ef4444",
    ABERTURAS: "#f97316",
    TAXA_ABERTURA: "#f59e0b",
    CARD_ICON_BG: "bg-gradient-to-r from-red-600 to-orange-700",
    BADGE_BG: "bg-red-500/100 hover:bg-red-600",
};


// --- Componente DashboardPage ---

const DashboardPage: React.FC = () => {
    const [enviosRecentes, setEnviosRecentes] = useState<EnvioComMetricas[]>([]);
    const [loadingEnvios, setLoadingEnvios] = useState(true);

    // NOVOS ESTADOS PARA PESQUISA
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState<SearchType>('Dt_Envio');
    const [filteredEnvios, setFilteredEnvios] = useState<EnvioComMetricas[]>([]);

    useEffect(() => {
        const fetchEnviosData = async () => {
            setLoadingEnvios(true);
            try {
                const res = await api('/get_all_envios_with_stats');
                const enviosComContagem = await res.json();

                setEnviosRecentes(enviosComContagem);
                setFilteredEnvios(enviosComContagem);
            } catch (error) {
                console.error("Erro ao carregar envios recentes:", error);
                setEnviosRecentes([]);
                setFilteredEnvios([]);
            } finally {
                setLoadingEnvios(false);
            }
        };

        fetchEnviosData();
    }, []);

    // EFEITO PARA FILTRAR OS ENVIOS
    useEffect(() => {
        if (!searchTerm) {
            setFilteredEnvios(enviosRecentes);
            return;
        }

        const term = searchTerm.toLowerCase();

        const results = enviosRecentes.filter(envio => {
            if (searchType === 'Dt_Envio') {
                const dataFormatada = formatDate(envio.Dt_Envio);
                return dataFormatada.toLowerCase().includes(term);
            }
            if (searchType === 'Campanha') {
                return envio.Campanha.Titulo.toLowerCase().includes(term);
            }
            if (searchType === 'Lista') {
                return envio.Lista.Titulo.toLowerCase().includes(term);
            }
            return false;
        });

        setFilteredEnvios(results);
    }, [searchTerm, searchType, enviosRecentes]);


    const {
        totalEnvios,
        totalEntregas,
        totalAberturas,
        taxaMediaAbertura,
        dadosParaGraficoBarra,
        dadosParaGraficoLinha
    } = useMemo(() => {
        const totalEnvios = enviosRecentes.length;
        const totalEntregas = enviosRecentes.reduce((acc, envio) => acc + envio.entregas, 0);
        const totalAberturas = enviosRecentes.reduce((acc, envio) => acc + envio.aberturas, 0);

        const taxaMediaAbertura = totalEntregas > 0 ? (totalAberturas / totalEntregas) * 100 : 0;

        const metricasPorCampanha = enviosRecentes.reduce((acc, envio) => {
            const titulo = envio.Campanha.Titulo;
            acc[titulo] = acc[titulo] || { name: titulo, entregues: 0, aberturas: 0 };
            acc[titulo].entregues += envio.entregas;
            acc[titulo].aberturas += envio.aberturas;
            return acc;
        }, {} as { [key: string]: { name: string, entregues: number, aberturas: number } });


        const uniqueCampaigns = Array.from(new Set(enviosRecentes.map(e => e.Campanha.Titulo)));
        const recentFiveCampaignNames = uniqueCampaigns.slice(0, 5);

        const dadosParaGraficoBarra = Object.values(metricasPorCampanha)
            .filter(item => recentFiveCampaignNames.includes(item.name))
            .slice(0, 5);

        const dadosParaGraficoLinha = enviosRecentes
            .slice(0, 15)
            .map((envio, index) => ({
                name: `Envio #${enviosRecentes.length - index}`,
                idEnvio: envio.IdEnvio,
                data: formatDate(envio.Dt_Envio),
                entregas: envio.entregas,
                aberturas: envio.aberturas,
            }))
            .reverse();

        return {
            totalEnvios,
            totalEntregas,
            totalAberturas,
            taxaMediaAbertura,
            dadosParaGraficoBarra,
            dadosParaGraficoLinha
        };
    }, [enviosRecentes]);


    // --- Componentes da Dashboard ---

    const renderMetricCard = (title: string, value: string | number, icon: React.ReactNode, description: string, colorClass: string) => (
        <Card className={`overflow-hidden transition-shadow duration-300 hover:shadow-xl bg-white/90 backdrop-blur-sm shadow-md`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
                <div className={`w-8 h-8 ${DASHBOARD_COLORS.CARD_ICON_BG} rounded-full flex items-center justify-center shadow-lg`}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            </CardContent>
        </Card>
    );

    const renderRecentEnvios = () => (
        <Card className="col-span-1 lg:col-span-2 overflow-hidden bg-white/90 backdrop-blur-sm hover:shadow-xl shadow-md">
            <CardHeader>
                <div className="flex justify-between items-center mb-4">
                    <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                        <FaPaperPlane className="text-red-500" /> Todos os Envios
                    </CardTitle>
                    {/* NOVO BLOCO DE PESQUISA */}
                    <div className="flex items-center gap-2">
                        <div className="relative w-64">
                            <Input
                                type="text"
                                placeholder={`Pesquisar por ${searchType === 'Dt_Envio' ? 'Data (DD/MM/AAAA)' : searchType}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border-gray-300 rounded-lg focus:ring-0 focus:ring-offset-0 transition-colors"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                        </div>
                        <Select
                            value={searchType}
                            onValueChange={(value: string) => setSearchType(value as SearchType)}
                        >
                            <SelectTrigger className="w-[140px] border-gray-300 rounded-lg">
                                <SelectValue placeholder="Data" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Dt_Envio">Data</SelectItem>
                                <SelectItem value="Campanha">Campanha</SelectItem>
                                <SelectItem value="Lista">Lista</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {loadingEnvios ? (
                    <div className="p-6 space-y-4">
                        {[...Array(7)].map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full bg-gray-200" />
                        ))}
                    </div>
                ) : filteredEnvios.length > 0 ? ( // Renderiza os envios filtrados
                    <TooltipProvider>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-red-50 text-red-700 hover:bg-red-100/50">
                                    <TableHead className="w-[40%]">Campanha / Lista</TableHead>
                                    <TableHead className="text-center">Entregas</TableHead>
                                    <TableHead className="text-center">Aberturas</TableHead>
                                    <TableHead className="text-center">Taxa Abertura</TableHead>
                                    <TableHead className="w-[15%] text-right">Data de Envio</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEnvios.map((envio) => { // Mapeia os envios filtrados
                                    const taxaAbertura = envio.entregas > 0 ? ((envio.aberturas / envio.entregas) * 100).toFixed(1) : 0;
                                    return (
                                        <TableRow key={envio.IdEnvio} className="hover:bg-red-50/30 transition-colors">
                                            <TableCell className="font-medium">
                                                <div className="text-gray-800 truncate" title={envio.Campanha.Titulo}>{envio.Campanha.Titulo}</div>
                                                <div className="text-xs text-gray-500 truncate" title={envio.Lista.Titulo}>{envio.Lista.Titulo}</div>
                                            </TableCell>
                                            <TableCell className="text-center text-red-500 font-semibold">{envio.entregas}</TableCell>
                                            <TableCell className="text-center text-orange-600 font-semibold">{envio.aberturas}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={`px-2 py-0.5 ${DASHBOARD_COLORS.BADGE_BG} text-white font-mono`}>
                                                    {taxaAbertura}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-sm text-gray-600">
                                                <Tooltip delayDuration={300}>
                                                    <TooltipTrigger asChild>
                                                        <span className="cursor-default border-b border-dashed border-gray-400">
                                                            {formatDate(envio.Dt_Envio)}
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-red-600 text-white rounded-md p-2 shadow-xl border-none">
                                                        <p className="text-xs">{formatFullDate(envio.Dt_Envio)}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TooltipProvider>
                ) : (
                    <p className="text-center text-gray-500 py-10">Nenhum envio encontrado.</p>
                )}
            </CardContent>
        </Card>
    );

    const renderBarChart = () => (
        <Card className="col-span-1 bg-white/90 backdrop-blur-sm hover:shadow-xl shadow-md">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaChartBar className="text-orange-500" /> Desempenho por Campanha (5 Mais Recentes)
                </CardTitle>
                <p className="text-xs text-gray-500">Métricas das campanhas usadas nos envios mais recentes.</p>
            </CardHeader>
            <CardContent className="h-[300px] p-2">
                {loadingEnvios ? (
                    <Skeleton className="h-full w-full bg-gray-200" />
                ) : dadosParaGraficoBarra.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={dadosParaGraficoBarra}
                            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#fef2f2" />
                            <XAxis dataKey="name" stroke="#71717a" tick={{ fontSize: 10 }} height={30} />
                            <YAxis stroke="#71717a" tick={{ fontSize: 10 }} />
                            <RechartsTooltip
                                contentStyle={{ backgroundColor: 'white', border: '1px solid #fecaca', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                itemStyle={{ color: '#1f2937' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                            <Bar dataKey="entregues" fill={DASHBOARD_COLORS.ENTREGAS} name="Entregues" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="aberturas" fill={DASHBOARD_COLORS.ABERTURAS} name="Aberturas" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-gray-500 py-10">Dados insuficientes para o gráfico de barra.</p>
                )}
            </CardContent>
        </Card>
    );

    const renderLineChart = () => (
        <Card className="col-span-1 bg-white/90 backdrop-blur-sm hover:shadow-xl shadow-md">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaChartLine className="text-red-500" /> Evolução dos Últimos 15 Envios
                </CardTitle>
                <p className="text-xs text-gray-500">Comparativo entre entregas e aberturas por envio recente.</p>
            </CardHeader>
            <CardContent className="h-[300px] p-2">
                {loadingEnvios ? (
                    <Skeleton className="h-full w-full bg-gray-200" />
                ) : dadosParaGraficoLinha.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={dadosParaGraficoLinha}
                            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#fef2f2" />
                            <XAxis dataKey="data" stroke="#71717a" tick={{ fontSize: 10 }} height={30} />
                            <YAxis stroke="#71717a" tick={{ fontSize: 10 }} />
                            <RechartsTooltip
                                contentStyle={{ backgroundColor: 'white', border: '1px solid #fecaca', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                itemStyle={{ color: '#1f2937' }}
                                labelFormatter={(label) => `Data: ${label}`}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                            <Line
                                type="monotone"
                                dataKey="entregas"
                                stroke={DASHBOARD_COLORS.ENTREGAS}
                                strokeWidth={2}
                                name="Entregues"
                                dot={{ r: 4 }}
                                activeDot={{ r: 8 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="aberturas"
                                stroke={DASHBOARD_COLORS.ABERTURAS}
                                strokeWidth={2}
                                name="Aberturas"
                                dot={{ r: 4 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-gray-500 py-10">Dados insuficientes para o gráfico de linha.</p>
                )}
            </CardContent>
        </Card>
    );


    // --- Renderização Principal ---

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-12">
            <div className="max-w-[95vw] mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <span className={`p-2 rounded-lg bg-gradient-to-r ${DASHBOARD_COLORS.PRIMARY} shadow-lg`}>
                            <FaChartBar className="text-white text-lg" />
                        </span>
                        Dashboard de Envios
                    </h1>
                    <p className="text-lg text-gray-600 mt-2 ml-[50px]">
                        Visão geral e métricas de desempenho dos seus envios de e-mail.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {loadingEnvios ? (
                        [...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-28 w-full bg-gray-200" />
                        ))
                    ) : (
                        <>
                            {renderMetricCard(
                                "Total de Envios",
                                totalEnvios,
                                <FaPaperPlane className="text-white text-lg" />,
                                "Envios realizados até o momento.",
                                "text-red-600"
                            )}
                            {renderMetricCard(
                                "Total de Entregas",
                                totalEntregas,
                                <FaCheckCircle className="text-white text-lg" />,
                                "E-mails entregues com sucesso.",
                                "text-red-500"
                            )}
                            {renderMetricCard(
                                "Total de Aberturas",
                                totalAberturas,
                                <FaEnvelopeOpenText className="text-white text-lg" />,
                                "E-mails abertos pelos destinatários.",
                                "text-orange-600"
                            )}
                            {renderMetricCard(
                                "Taxa Média de Abertura",
                                `${taxaMediaAbertura.toFixed(1)}%`,
                                <FaChartBar className="text-white text-lg" />,
                                "Aberturas / Entregas * 100.",
                                "text-orange-500"
                            )}
                        </>
                    )}
                </div>

                <Separator className="my-8 bg-red-100" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {renderBarChart()}
                    {renderLineChart()}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {renderRecentEnvios()}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;