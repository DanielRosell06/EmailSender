import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Mail, User, Lock, Eye, EyeOff, CheckCircle, Send, Users, Settings, Zap, Shield, Globe, ArrowRight, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';

// Tipos para o estado do formulário
interface FormDataState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Tipos para o carrossel
interface SlideContent {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface Slide {
    title: string;
    subtitle: string;
    content: SlideContent[];
}

export default function CadastroPage() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const navigate = useNavigate();
    const [criando, setCriando] = useState(false)

    const [formData, setFormData] = useState<FormDataState>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState<string>("");

    // Estado para o carrossel
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const slides: Slide[] = [
        {
            title: "Transforme suas ideias em campanhas de sucesso",
            subtitle: "Junte-se a milhares de profissionais que já descobriram a forma mais eficiente de fazer email marketing no Brasil.",
            content: [
                { icon: CheckCircle, title: "100% Gratuito para Sempre", description: "Sem taxas mensais, sem limites artificiais, sem pegadinhas." },
                { icon: Zap, title: "Setup em 5 Minutos", description: "Configure sua conta SMTP e comece a enviar imediatamente." },
            ]
        },
        {
            title: "Por que escolher o EmailSender?",
            subtitle: "Junte-se a milhares de profissionais que já descobriram a forma mais eficiente de fazer email marketing no Brasil.",
            content: [
                { icon: Settings, title: "Seu Próprio SMTP", description: "Use Gmail, Outlook ou qualquer servidor SMTP de sua escolha." },
                { icon: Shield, title: "Suporte Nacional", description: "Equipe brasileira pronta para ajudar no que precisar." },
            ]
        },
        {
            title: "O que você pode fazer:",
            subtitle: "Junte-se a milhares de profissionais que já descobriram a forma mais eficiente de fazer email marketing no Brasil.",
            content: [
                { icon: Users, title: "Gerenciar listas infinitas", description: "" },
                { icon: Mail, title: "Criar campanhas HTML", description: "" },
                { icon: Send, title: "Envios programados", description: "" },
                { icon: Globe, title: "Analytics detalhados", description: "" },
            ]
        }
    ];

    const totalSlides: number = slides.length;

    // Função para avançar o carrossel
    const nextSlide = (): void => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    // Função para voltar o carrossel
    const prevSlide = (): void => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    // Efeito para a navegação automática
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000); // Muda de slide a cada 5 segundos
        return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpa o erro quando o usuário começa a digitar
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Senhas não coincidem';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        setCriando(true)
        e.preventDefault();
        const UsuarioObj = {
            "Nome": formData.name,
            "Email": formData.email,
            "Senha": formData.password
        }
        if (validateForm()) {
            fetch(`${backendUrl}/api/create_usuario`, {
                headers: { 'Content-Type': 'application/json' },
                method: "POST",
                body: JSON.stringify(UsuarioObj)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro de rede ou do servidor');
                    }
                    // Retorna a promessa com o JSON
                    return response.json();
                })
                .then((result: number) => {
                    // 'result' agora é explicitamente do tipo number
                    switch (result) {
                        case 1:
                            // Caso de sucesso
                            setSubmitError("Cadastro realizado com sucesso, você será redirecionado para a página de login.");
                            // Espera 2 segundos antes de navegar para a página de login
                            setTimeout(() => {
                                navigate("/login");
                            }, 2000);
                            break;
                        case 2:
                            // E-mail já cadastrado
                            setSubmitError('O e-mail informado já está cadastrado.');
                            setCriando(false)
                            break;
                        case 3:
                            // Erro no banco de dados
                            setSubmitError('Ocorreu um erro no banco de dados. Tente novamente!');
                            setCriando(false)
                            break;
                        case 4:
                            // Erro no servidor
                            setSubmitError('Erro no Servidor. Tente novamente mais tarde.');
                            setCriando(false)
                            break;
                        default:
                            // Valor inesperado
                            setSubmitError('Ocorreu um erro inesperado. Tente novamente!');
                            setCriando(false)
                            break;
                    }
                })
                .catch((error) => {
                    // Trata erros de requisição
                    console.error('Erro de requisição:', error);
                    setSubmitError('Não foi possível se conectar ao servidor. Tente novamente mais tarde!');
                    setCriando(false)
                });
        }
    };

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Navbar - Igual da página Saiba Mais */}
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
                            <button onClick={() => { navigate("/cadastro") }} className="hover:cursor-pointer px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium border-b-2 border-purple-700">
                                Cadastre-se
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Conteúdo principal em grid */}
            <div className="relative z-10 pt-20 pb-12 px-4 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">

                        {/* Lado esquerdo - Carrossel de informações */}
                        <div className="relative h-96 lg:h-[600px] flex items-center justify-center">
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex flex-col items-center justify-center ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0'
                                        }`}
                                >
                                    <div className="text-center lg:text-left">
                                        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                {slide.title.includes("Transforme") ? "Transforme suas ideias" : slide.title}
                                            </span>
                                            {slide.title.includes("Transforme") && (
                                                <span className="block text-gray-900 mt-2">
                                                    em campanhas de sucesso
                                                </span>
                                            )}
                                        </h1>
                                        <p className="text-xl text-gray-600 leading-relaxed mb-8">
                                            {slide.subtitle}
                                        </p>
                                    </div>

                                    {/* Benefícios e Recursos */}
                                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg w-full max-w-md">
                                        <div className={`grid ${slide.content.length > 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                                            {slide.content.map((item, itemIndex) => {
                                                const IconComponent = item.icon;
                                                return (
                                                    <div key={itemIndex} className="flex items-start space-x-3">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <IconComponent className="w-5 h-5 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                                            {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Botões de navegação */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 z-20 p-2 rounded-full bg-white/50 backdrop-blur-sm border border-gray-200/50 text-gray-700 hover:bg-white transition-all duration-200 focus:outline-none"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 z-20 p-2 rounded-full bg-white/50 backdrop-blur-sm border border-gray-200/50 text-gray-700 hover:bg-white transition-all duration-200 focus:outline-none"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Indicadores de slide */}
                            <div className="absolute bottom-4 z-20 flex space-x-2">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-indigo-600 w-6' : 'bg-gray-400'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Lado direito - Formulário de cadastro */}
                        <div className="lg:pl-8">
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 hover:bg-white/90 transition-all duration-300 lg:sticky lg:top-24">

                                {/* Cabeçalho do formulário */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                                        <User className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                        Criar Conta Gratuita
                                    </h2>
                                    <p className="text-gray-600">Comece sua jornada no email marketing agora</p>
                                </div>

                                {/* Formulário */}
                                <div className="space-y-6">
                                    {/* Nome */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nome completo
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                name="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className={`block w-full pl-10 pr-3 py-3 bg-white/80 backdrop-blur-sm border rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${errors.name ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                placeholder="Seu nome completo"
                                            />
                                        </div>
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email profissional
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`block w-full pl-10 pr-3 py-3 bg-white/80 backdrop-blur-sm border rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${errors.email ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                placeholder="seu@email.com"
                                            />
                                        </div>
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>

                                    {/* Senha */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Senha
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className={`block w-full pl-10 pr-12 py-3 bg-white/80 backdrop-blur-sm border rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${errors.password ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                placeholder="Mínimo 6 caracteres"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50/50 rounded-r-xl transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                    </div>

                                    {/* Confirmar Senha */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirmar senha
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                name="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className={`block w-full pl-10 pr-12 py-3 bg-white/80 backdrop-blur-sm border rounded-xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${errors.confirmPassword ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                placeholder="Digite a senha novamente"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50/50 rounded-r-xl transition-colors"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                                    </div>

                                    {/* Termos */}
                                    <div className="flex items-start space-x-3 text-sm">
                                        <input type="checkbox" className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2" />
                                        <span className="text-gray-600">
                                            Aceito os <a href="#" className="text-indigo-600 hover:text-indigo-500 underline">termos de uso</a> e
                                            <a href="#" className="text-indigo-600 hover:text-indigo-500 underline"> política de privacidade</a>
                                        </span>
                                    </div>

                                    {/* Error/Success Message */}
                                    {submitError && (
                                        <div className={`p-3 rounded-lg border ${submitError.includes("sucesso")
                                            ? 'bg-green-50 border-green-200 text-green-700'
                                            : 'bg-red-50 border-red-200 text-red-700'
                                            }`}>
                                            <p className="text-sm">{submitError}</p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSubmit}
                                        disabled={criando}
                                        className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                                    >
                                        <div className="flex items-center">
                                            Criar Conta Gratuita
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </div>
                                    </button>
                                </div>

                                {/* Login Link */}
                                <div className="text-center pt-6 border-t border-gray-200/50 mt-8">
                                    <p className="text-gray-600 text-sm">
                                        Já tem uma conta?{' '}
                                        <button
                                            onClick={() => { navigate('/login') }}
                                            className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors underline decoration-indigo-300 hover:decoration-indigo-500 underline-offset-4"
                                        >
                                            Faça login aqui
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
