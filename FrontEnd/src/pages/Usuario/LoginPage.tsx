import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
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

            fetch(`${backendUrl}/api/login_usuario/`, {
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
                .then((result: string) => {
                    // 'result' agora é explicitamente do tipo number
                    switch (result) {
                        case "1":
                            // Caso de sucesso
                            setSubmitError("Email não encontrado");
                            // Espera 2 segundos antes de navegar para a página de login
                            setTimeout(() => {
                                navigate("/login");
                            }, 2000);
                            break;
                        case "2":
                            // E-mail já cadastrado
                            setSubmitError('Senha ou E-mail incorreto');
                            break;
                        case "3":
                            // Erro no banco de dados
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
                    // Trata erros de requisição
                    setSubmitError('Não foi possível se conectar ao servidor. Tente novamente mais tarde!');
                    setIsLoading(false);
                });
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('./assets/LoginPage_background.jpg')] bg-cover bg-center bg-no-repeat" />

            {/* Gradient Overlay - More subtle */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-fuchsia-500/25 to-red-500/20" />

            {/* Glassmorphism Login Card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">

                    {/* Logo Section */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">EmailSender</h1>
                        <p className="text-white/80">Entre na sua conta</p>
                    </div>

                    {/* Login Form */}
                    <div className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-white/90 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-white/60" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border rounded-xl shadow-sm placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all duration-200 ${errors.email ? 'border-red-400' : 'border-white/30'
                                        }`}
                                    placeholder="seu@email.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-sm text-red-300">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-white/90 mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-white/60" />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm border rounded-xl shadow-sm placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all duration-200 ${errors.password ? 'border-red-400' : 'border-white/30'
                                        }`}
                                    placeholder="Sua senha"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-white/5 rounded-r-xl transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-white/60 hover:text-white/80" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-white/60 hover:text-white/80" />
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-300">{errors.password}</p>}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <a href="#" className="text-white/80 hover:text-white transition-colors">
                                Esqueceu a senha?
                            </a>
                        </div>

                        <div>
                            <h1 className='text-red-500'>{submitError}</h1>
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
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

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/20"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-transparent text-white/60"></span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center pt-4">
                            <p className="text-white/70 text-sm">
                                Não tem uma conta?{' '}
                                <a onClick={() => { navigate("/cadastro") }} className="text-white font-medium hover:cursor-pointer hover:text-white/80 transition-colors underline decoration-white/40 hover:decoration-white/60 underline-offset-4">
                                    Cadastre-se
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Floating Elements for Extra Visual Appeal */}
            </div>
        </div>
    );
}