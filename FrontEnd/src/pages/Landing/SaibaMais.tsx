import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Mail, Users, Send, Settings, ArrowRight, CheckCircle, Upload, Eye, Code, List, Rocket } from 'lucide-react';

const LandingSaibaMais: React.FC = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({
                            ...prev,
                            [entry.target.id]: true,
                        }));
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
            }
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            if (sectionRefs.current) {
                sectionRefs.current.forEach((ref) => {
                    if (ref) observer.unobserve(ref);
                });
            }
        };
    }, []);

    const addToRefs = (el: HTMLElement | null) => {
        if (el && !sectionRefs.current.includes(el)) {
            sectionRefs.current.push(el);
        }
    };

    const sections = [
        {
            id: 'como-usar',
            title: "Como Usar o EmailSender?",
            description: "A simplicidade é o nosso foco. Em três passos rápidos e intuitivos, você estará pronto para enviar sua primeira campanha de email marketing e acompanhar os resultados em tempo real. Faça seu primeiro envio em menos de 10 minutos!",
            points: [
                "Configure sua conta SMTP em poucos minutos.",
                "Crie suas listas de email importando arquivos CSV.",
                "Envie campanhas e monitore estatísticas de forma simples.",
            ],
            image: (
                <div className="relative p-8">
                    <div className="relative backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 p-4 bg-white/60 rounded-xl">
                                <Settings className="w-8 h-8 text-indigo-500" />
                                <div className="flex-1">
                                    <div className="h-4 bg-indigo-200 rounded w-full mb-2"></div>
                                    <div className="h-3 bg-indigo-100 rounded w-2/3"></div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 p-4 bg-white/60 rounded-xl">
                                <Users className="w-8 h-8 text-fuchsia-500" />
                                <div className="flex-1">
                                    <div className="h-4 bg-fuchsia-200 rounded w-full mb-2"></div>
                                    <div className="h-3 bg-fuchsia-100 rounded w-3/4"></div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 p-4 bg-white/60 rounded-xl">
                                <Send className="w-8 h-8 text-green-500" />
                                <div className="flex-1">
                                    <div className="h-4 bg-green-200 rounded w-full mb-2"></div>
                                    <div className="h-3 bg-green-100 rounded w-4/5"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'listas',
            title: "Gerencie suas Listas de Emails com Facilidade",
            description: "Organize e segmente seus contatos de forma eficiente. Nosso sistema facilita a gestão das suas listas de email, permitindo que você foque no que realmente importa: criar campanhas incríveis.",
            points: [
                "Importe arquivos CSV: nosso sistema lê os emails do seu arquivo e os adiciona automaticamente a uma nova lista.",
                "Edição flexível: adicione, remova ou edite emails de qualquer lista a qualquer momento.",
            ],
            image: (
                <div className="relative p-8">
                    <div className="relative backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <div className="space-y-4">
                            <div className="h-10 w-10 bg-gradient-to-br from-indigo-600/50 via-fuchsia-500 to-red-500/50 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex items-center space-x-4 p-4 bg-gray-100/60 rounded-xl">
                                <List className="w-6 h-6 text-gray-500" />
                                <div className="flex-1">
                                    <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                                </div>
                                <div className="text-sm font-semibold text-gray-500">250 emails</div>
                            </div>
                            <div className="flex items-center space-x-4 p-4 bg-gray-100/60 rounded-xl">
                                <List className="w-6 h-6 text-gray-500" />
                                <div className="flex-1">
                                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                                </div>
                                <div className="text-sm font-semibold text-gray-500">1000 emails</div>
                            </div>
                            <button className="flex items-center justify-center w-full py-3 space-x-2 text-white bg-gradient-to-br from-indigo-600/80 to-purple-600/80 rounded-xl">
                                <Upload className="w-5 h-5" />
                                <span>Importar CSV</span>
                            </button>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'campanhas',
            title: "Crie Campanhas HTML Profissionais",
            description: "Dê vida às suas ideias com campanhas de email visualmente impressionantes. Nosso editor intuitivo permite que você crie e personalize emails em HTML de forma simples e eficiente.",
            points: [
                "Visualização em tempo real: veja exatamente como sua campanha vai ficar enquanto você a constrói.",
                "Liberdade criativa: escreva seu próprio código HTML ou use nossos templates para começar rápido.",
            ],
            image: (
                <div className="relative p-8">
                    <div className="relative backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <div className="space-y-4">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-600/60 via-indigo-500 to-cyan-500/60 rounded-lg flex items-center justify-center">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <div className="p-4 bg-gray-100/60 rounded-xl space-y-2">
                                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                <div className="h-24 bg-gray-200 rounded"></div>
                            </div>
                            <div className="p-4 bg-gray-100/60 rounded-xl flex items-center space-x-2">
                                <Code className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-500">
                                    Visualização HTML
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'envios',
            title: "Envios Simples e Analytics Detalhados",
            description: "Envie suas campanhas com um único clique e monitore o desempenho de cada email. Tenha acesso a estatísticas detalhadas para otimizar suas próximas ações de marketing.",
            points: [
                "Envio com um botão: selecione uma lista e uma campanha e deixe o sistema fazer o resto.",
                "Estatísticas de visualização: veja quantos emails foram abertos, recebidos e mais.",
            ],
            image: (
                <div className="relative p-8">
                    <div className="relative backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <div className="space-y-4">
                            <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                <Rocket className="w-6 h-6 text-white" />
                            </div>
                            <div className="p-4 bg-gray-100/60 rounded-xl space-y-2">
                                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="h-16 bg-gray-200 rounded flex items-center justify-center space-x-2">
                                        <Eye className="w-6 h-6 text-gray-500" />
                                        <span className="text-sm font-semibold text-gray-500">Visualizados</span>
                                    </div>
                                    <div className="h-16 bg-gray-200 rounded flex items-center justify-center space-x-2">
                                        <CheckCircle className="w-6 h-6 text-gray-500" />
                                        <span className="text-sm font-semibold text-gray-500">Recebidos</span>
                                    </div>
                                </div>
                            </div>
                            <button className="flex items-center justify-center w-full py-3 space-x-2 text-white bg-gradient-to-br from-green-500/80 to-emerald-500/80 rounded-xl">
                                <Send className="w-5 h-5" />
                                <span>Enviar Campanha</span>
                            </button>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'contas-smtp',
            title: "Utilize seu Próprio Servidor SMTP",
            description: "Diferente de outras plataformas que limitam sua conta, nós permitimos que você use seu próprio servidor SMTP para enviar emails. Isso significa total liberdade e controle sobre suas campanhas.",
            points: [
                "Liberdade total: use seu Gmail, Outlook, ou qualquer outro servidor SMTP de sua escolha.",
                "Custo-benefício: aproveite os limites de envio diário do seu próprio provedor, muitas vezes de forma gratuita.",
                "Pesquise os limites: lembre-se de verificar os limites de envio do seu servidor SMTP para garantir o sucesso das suas campanhas.",
            ],
            image: (
                <div className="relative p-8">
                    <div className="relative backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
                        <div className="space-y-4">
                            <div className="h-10 w-10 bg-gradient-to-br from-orange-600/50 via-yellow-500 to-red-500/50 rounded-lg flex items-center justify-center">
                                <Settings className="w-6 h-6 text-white" />
                            </div>
                            <div className="p-4 bg-gray-100/60 rounded-xl flex items-center space-x-3">
                                <Mail className="w-6 h-6 text-gray-500" />
                                <div className="flex-1">
                                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                                    <div className="h-2 bg-gray-200 rounded w-2/3 mt-1"></div>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-100/60 rounded-xl flex items-center space-x-3">
                                <Mail className="w-6 h-6 text-gray-500" />
                                <div className="flex-1">
                                    <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                                    <div className="h-2 bg-gray-200 rounded w-1/2 mt-1"></div>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-100/60 rounded-xl flex items-center space-x-3">
                                <Mail className="w-6 h-6 text-gray-500" />
                                <div className="flex-1">
                                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-2 bg-gray-200 rounded w-3/5 mt-1"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-white relative overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Mail className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                EmailSender
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a onClick={() => { navigate("/inicio") }} className="hover:cursor-pointer px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium hover:scale-110 transition-all duration-200">
                                Início
                            </a>
                            <a onClick={() => { navigate("/saibamais") }} className="hover:cursor-pointer px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium hover:scale-110 transition-all duration-200">
                                Saiba Mais
                            </a>
                            <button onClick={() => { navigate("/login") }} className="hover:cursor-pointer px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium hover:scale-110 transition-all duration-200">
                                Entrar
                            </button>
                            <button onClick={() => { navigate("/cadastro") }} className="hover:cursor-pointer px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium">
                                Cadastre-se
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Por que usar? */}
            <section className="pt-24 pb-20 relative bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <div className="space-y-4 max-w-4xl mx-auto">
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Por que escolher
                            </span>
                            <span className="block text-gray-900 mt-2">
                                EmailSender?
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            A plataforma que combina **poder, flexibilidade e custo zero**.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8 pt-12 max-w-5xl mx-auto">
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto">
                                <CheckCircle className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">100% Gratuito</h3>
                            <p className="text-sm text-gray-600">Sem limites de uso ou taxas escondidas.</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto">
                                <CheckCircle className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Suporte Nacional</h3>
                            <p className="text-sm text-gray-600">Equipe brasileira para ajudar no que precisar.</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto">
                                <CheckCircle className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Envio Flexível</h3>
                            <p className="text-sm text-gray-600">Use qualquer servidor SMTP para enviar seus emails.</p>
                        </div>
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto">
                                <CheckCircle className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Sem Limites</h3>
                            <p className="text-sm text-gray-600">Envie emails para quantas listas quiser, sem restrições.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seções de conteúdo dinâmico */}
            {sections.map((section, index) => (
                <section
                    key={section.id}
                    id={section.id}
                    ref={addToRefs}
                    className={`py-20 relative transition-all duration-1000 ${isVisible[section.id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                    {/* Conteúdo */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                            <div className="space-y-6">
                                <h2 className="text-4xl font-bold text-gray-900 leading-snug">
                                    {section.title}
                                </h2>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    {section.description}
                                </p>
                                <ul className="space-y-4 text-gray-700">
                                    {section.points.map((point, pointIndex) => (
                                        <li key={pointIndex} className="flex items-start space-x-3">
                                            <CheckCircle className="w-6 h-6 text-indigo-500 mt-1 flex-shrink-0" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className={`relative ${index % 2 !== 0 ? 'order-first' : ''}`}>
                                {section.image}
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        Pronto para revolucionar seu email marketing?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-10 leading-relaxed">
                        Crie sua conta agora e comece a enviar campanhas profissionais em minutos.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button onClick={() => { navigate("/cadastro") }} className="px-10 py-5 bg-white text-indigo-900 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 font-bold text-lg">
                            Criar Conta Gratuita
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">EmailSender</span>
                            </div>
                            <p className="text-gray-400">
                                A plataforma de email marketing mais moderna e gratuita do Brasil.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold mb-4">Índice</h3>
                            <div className="space-y-2 text-gray-400">
                                <a href="#como-usar" className="hover:text-white transition-colors block">Como usar?</a>
                                <a href="#listas" className="hover:text-white transition-colors block">Listas</a>
                                <a href="#campanhas" className="hover:text-white transition-colors block">Campanhas</a>
                                <a href="#envios" className="hover:text-white transition-colors block">Envios</a>
                                <a href="#contas-smtp" className="hover:text-white transition-colors block">Contas SMTP</a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 NextStep. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingSaibaMais;