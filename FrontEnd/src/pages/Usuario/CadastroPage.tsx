import React, { useState } from 'react';
import { Mail, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function CadastroPage() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
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
        e.preventDefault();
        const UsuarioObj = {
            "Nome": formData.name,
            "Email": formData.email,
            "Senha": formData.password
        }
        if (validateForm()) {
            fetch(`${backendUrl}/api/create_usuario/`, {
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
                            break;
                        case 3:
                            // Erro no banco de dados
                            setSubmitError('Ocorreu um erro no banco de dados. Tente novamente!');
                            break;
                        case 4:
                            // Erro no servidor
                            setSubmitError('Erro no Servidor. Tente novamente mais tarde.');
                            break;
                        default:
                            // Valor inesperado
                            setSubmitError('Ocorreu um erro inesperado. Tente novamente!');
                            break;
                    }
                })
                .catch((error) => {
                    // Trata erros de requisição
                    console.error('Erro de requisição:', error);
                    setSubmitError('Não foi possível se conectar ao servidor. Tente novamente mais tarde!');
                });
        }
    };

    return (
        <div className="min-h-screen relative flex">
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 bg-[url('./assets/CadastroPage_background.jpg')] bg-cover bg-center bg-no-repeat" />

            {/* Gradient Overlay - More subtle */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/15 via-fuchsia-500/20 to-red-500/15" />

            {/* Left Side - Decorative Content */}
            <div className="hidden md:flex flex-1 items-center justify-center p-12 relative z-10">
                <div className="max-w-md text-center text-white">
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
                        <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <Mail className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Alcance Seus Clientes</h3>
                        <p className="text-white/80 leading-relaxed">
                            Crie campanhas de email marketing profissionais e aumente suas conversões com nossa plataforma completa.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Registration Form */}
            <div className="h-[100vh] relative z-10 w-full md:w-1/2 lg:w-2/5 xl:w-1/3 min-h-screen bg-white/10 backdrop-blur-xl border-l border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
                <div className="flex flex-col justify-center h-screen p-8 lg:p-12">
                    {/* Logo Section */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Email Sender</h1>
                        <p className="text-white/80">Sistema Profissional de Email Marketing</p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">

                        <div className="space-y-6">
                            {/* Nome */}
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Nome do Usuario
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-white/60" />
                                    </div>
                                    <input
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`block w-full pl-10 pr-3 py-3 bg-white/10 backdrop-blur-sm border rounded-xl shadow-sm placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all duration-200 ${errors.name ? 'border-red-400' : 'border-white/30'
                                            }`}
                                        placeholder="Seu nome completo"
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-sm text-red-300">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-white/60" />
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

                            {/* Senha */}
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

                            {/* Confirmar Senha */}
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Confirmar Senha
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-white/60" />
                                    </div>
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`block w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm border rounded-xl shadow-sm placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all duration-200 ${errors.confirmPassword ? 'border-red-400' : 'border-white/30'
                                            }`}
                                        placeholder="Confirme sua senha"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-white/5 rounded-r-xl transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-white/60 hover:text-white/80" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-white/60 hover:text-white/80" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-300">{errors.confirmPassword}</p>}
                            </div>

                            <div>
                                <h1 className={(submitError == "Cadastro realizado com sucesso, você será redirecionado para a página de login." ? "text-green-500" : "text-red-500")}>{submitError}</h1>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 transform hover:scale-105"
                            >
                                Criar Conta
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center pt-4">
                            <p className="text-white/70 text-sm">
                                Já tem uma conta?{' '}
                                <a
                                    onClick={() => { navigate('/login') }}
                                    className="hover:cursor-pointer text-white font-medium hover:text-white/80 transition-colors underline decoration-white/40 hover:decoration-white/60 underline-offset-4"
                                >
                                    Faça login
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