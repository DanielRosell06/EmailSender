import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Mail, Users, Send, Settings, Eye, CheckCircle, ArrowRight, Star, Shield, Zap } from 'lucide-react';

const LandingInicio = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Users,
      title: "Listas de Email",
      description: "Organize seus contatos em listas personalizadas. Importe facilmente seus emails e gerencie segmentações avançadas.",
      gradient: "from-indigo-600/50 via-fuchsia-500 to-red-500/50",
      color: "fuchsia-500",
      link: "/saibamais#listas"
    },
    {
      icon: Mail,
      title: "Campanhas HTML",
      description: "Crie campanhas profissionais em HTML simples. Templates responsivos e editor intuitivo para máximo impacto.",
      gradient: "from-blue-600/60 via-indigo-500 to-cyan-500/60",
      color: "indigo-500",
      link: "/saibamais#campanhas"
    },
    {
      icon: Send,
      title: "Controle de Envios",
      description: "Monitore em tempo real quantas pessoas receberam e abriram seus emails. Analytics completos para otimizar suas campanhas.",
      gradient: "from-green-500 to-emerald-500",
      color: "green-500",
      link: "/saibamais#envios"
    },
    {
      icon: Settings,
      title: "Conta SMTP",
      description: "Configure gratuitamente com Gmail ou outros provedores. Setup rápido e seguro em poucos minutos.",
      gradient: "from-orange-600/50 via-yellow-500 to-red-500/50",
      color: "yellow-500",
      link: "/saibamais#contas-smtp"
    }
  ];

  const benefits = [
    { icon: Zap, title: "100% Gratuito", desc: "Sem taxas ocultas ou limites abusivos" },
    { icon: Shield, title: "Seguro", desc: "Seus dados protegidos com criptografia" },
    { icon: Eye, title: "Analytics", desc: "Relatórios detalhados de performance" },
    { icon: Star, title: "Fácil de Usar", desc: "Interface intuitiva e moderna" }
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
              <a onClick={() => {navigate("/saibamais")}} className="hover:cursor-pointer px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium hover:scale-110 transition-all duration-200">
                Saiba Mais
              </a>
              <button onClick={() => { navigate("/login") }} className="hover:cursor-pointer px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium hover:scale-110 transition-all duration-200">
                Entrar
              </button>
              <button onClick={() => {navigate("/cadastro")}} className="hover:cursor-pointer px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium">
                Cadastre-se
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Email Marketing
                  </span>
                  <br />
                  <span className="text-gray-900">
                    Profissional e Gratuito
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Envie campanhas incríveis, monitore resultados em tempo real e gerencie suas listas com a mais moderna plataforma de email marketing gratuita do Brasil.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => { navigate("/login") }} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold text-lg flex items-center justify-center space-x-2">
                  <span>Começar Agora</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => {navigate("/saibamais")}} className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors font-semibold text-lg">
                  Saiba Mais
                </button>
              </div>

              <div className="grid grid-cols-4 gap-8 pt-8">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto">
                      <benefit.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {/* Lado esquerdo: Listas */}
                  <div className="space-y-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-indigo-600/50 via-fuchsia-500 to-red-500/50 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded-full"></div>
                      <div className="h-3 bg-gray-200 rounded-full"></div>
                      <div className="h-3 bg-gray-200 rounded-full"></div>
                      <div className="h-3 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>

                  {/* Lado direito: Campanhas e Envio */}
                  <div className="space-y-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-600/60 via-indigo-500 to-cyan-500/60 rounded-lg flex items-center justify-center ml-auto">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Quadrados de campanha */}
                      <div className="h-12 bg-gray-200 rounded-lg"></div>
                      <div className="h-12 bg-gray-200 rounded-lg"></div>
                      <div className="h-12 bg-gray-200 rounded-lg"></div>
                      <div className="h-12 bg-gray-200 rounded-lg"></div>
                      <div className="h-12 bg-gray-200 rounded-lg"></div>
                      <div className="h-12 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                </div>

                {/* Botão de Envio (Send) na parte inferior */}
                <div className="mt-6">
                  <div className="h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent),radial-gradient(circle_at_70%_60%,rgba(251,113,133,0.1),transparent)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Como Funciona Nosso Sistema
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quatro conceitos simples que tornam o email marketing profissional e acessível para todos
            </p>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative"
                onMouseEnter={() => setActiveFeature(idx)}
              >
                <div className={`relative backdrop-blur-lg bg-white/70 rounded-3xl p-8 border border-white/40 hover:shadow-2xl transition-all duration-300 hover:scale-105 ${activeFeature === idx ? `` : ''}`}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>

                  <div className={`flex items-center text-slate-400 font-semibold group-hover:translate-x-2 transition-transform duration-200`}>
                    <span onClick={() => {navigate(feature.link)}}>Saiba mais</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SMTP Configuration Section */}
      <section className="py-20 bg-gradient-to-r from-orange-50 via-yellow-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Configure seu SMTP
                <span className="block bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                  Gratuitamente
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                Use Gmail, Outlook, ou qualquer provedor de email para enviar suas campanhas.
                Setup rápido e seguro em menos de 5 minutos.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">Gmail e G Suite suportados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">Outlook e Office 365 compatíveis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">Qualquer servidor SMTP personalizado</span>
                </div>
              </div>

              <button onClick={() => {navigate("/saibamais#contas-smtp")}} className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold text-lg">
                Ver Mais
              </button>
            </div>

            <div className="relative">
              {/* Espaço para imagem de configuração SMTP */}
              <div className="backdrop-blur-lg bg-gradient-to-br from-orange-100/50 to-red-100/50 rounded-3xl p-8 border border-orange-200/50">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl">
                    <Settings className="w-8 h-8 text-orange-600" />
                    <div className="flex-1">
                      <div className="h-3 bg-orange-200 rounded w-24 mb-2"></div>
                      <div className="h-2 bg-orange-100 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/60 rounded-xl text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-700">Gmail</div>
                    </div>
                    <div className="p-4 bg-white/60 rounded-xl text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-700">Outlook</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(99,102,241,0.2),transparent),radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.2),transparent)]"></div>

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-5xl font-bold text-white mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 leading-relaxed">
            Junte-se a milhares de empresas que confiam em nossa plataforma para
            suas campanhas de email marketing. 100% gratuito, sempre.
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
                <a href="#hero" className="hover:text-white transition-colors block">Início</a>
                <a href="#features" className="hover:text-white transition-colors block">Recursos</a>
                <a href="#smtp" className="hover:text-white transition-colors block">SMTP</a>
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

export default LandingInicio;