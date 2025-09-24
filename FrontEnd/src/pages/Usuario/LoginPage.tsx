import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string>("")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);

            const UsuarioObj = {
                "Email": formData.email,
                "Senha": formData.password
            }

            fetch(`${backendUrl}/api/login_usuario`, {
                headers: { 'Content-Type': 'application/json' },
                method: "POST",
                body: JSON.stringify(UsuarioObj)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro de rede ou do servidor');
                    }
                    return response.json();
                })
                .then((result: string) => {
                    switch (result) {
                        case "1":
                            setSubmitError("Email não encontrado");
                            setTimeout(() => {
                                navigate("/login");
                            }, 2000);
                            break;
                        case "2":
                            setSubmitError('Senha ou E-mail incorreto');
                            break;
                        case "3":
                            setSubmitError('Ocorreu um erro no servidor. Tente novamente!');
                            break;
                        default:
                            localStorage.setItem('token', result);
                            setSubmitError('');
                            navigate("/");
                            break;
                    }
                    setIsLoading(false);
                })
                .catch(() => {
                    console.log(backendUrl)
                    setSubmitError('Não foi possível se conectar ao servidor. Tente novamente mais tarde!');
                    setIsLoading(false);
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
                            <button onClick={() => { navigate("/cadastro") }} className="hover:cursor-pointer px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium">
                                Cadastre-se
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Elementos decorativos de fundo */}
            

            {/* Conteúdo principal */}
            <div className="relative z-10 flex items-center justify-center min-h-screen pt-20 pb-12 px-4">
                <div className="w-full max-w-md">
                    {/* Card de Login com glassmorphism sutil */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-200/50 hover:bg-white/95 transition-all duration-300">
                        
                        {/* Logo Section */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                Bem-vindo de volta!
                            </h1>
                            <p className="text-gray-600">Entre na sua conta para continuar</p>
                        </div>

                        {/* Login Form */}
                        <div className="space-y-6">{/* form element removed for demo */}
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
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

                            {/* Password */}
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
                                        placeholder="Sua senha"
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


                            {/* Error Message */}
                            {submitError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">{submitError}</p>
                                </div>
                            )}

                            {/* Login Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                        Entrando...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        Entrar
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative mt-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">ou</span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center pt-6">
                            <p className="text-gray-600 text-sm">
                                Não tem uma conta?{' '}
                                <button 
                                    onClick={() => { navigate("/cadastro") }} 
                                    className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors underline decoration-indigo-300 hover:decoration-indigo-500 underline-offset-4"
                                >
                                    Cadastre-se gratuitamente
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Elementos flutuantes para decoração adicional */}
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-sm animate-pulse"></div>
                    <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-tl from-pink-400/20 to-indigo-400/20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
            </div>
        </div>
    );
}