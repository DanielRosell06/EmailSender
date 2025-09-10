"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, RefreshCw, Save } from "lucide-react"
import Modal from "../../components/Modal"
import { FaPaperPlane, FaChevronLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { api } from '@/services/api.ts';

const defaultHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sua Campanha</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Sua Campanha de E-mail</h1>
        <p>Escreva ou cole seu código HTML aqui...</p>
    </div>
</body>
</html>`

const tailwindColors = [
    { name: "Azul", value: "#3b82f6", class: "bg-blue-500" },
    { name: "Verde", value: "#10b981", class: "bg-emerald-500" },
    { name: "Roxo", value: "#8b5cf6", class: "bg-violet-500" },
    { name: "Rosa", value: "#ec4899", class: "bg-pink-500" },
    { name: "Vermelho", value: "#ef4444", class: "bg-red-500" },
    { name: "Laranja", value: "#f97316", class: "bg-orange-500" },
    { name: "Amarelo", value: "#eab308", class: "bg-yellow-500" },
    { name: "Ciano", value: "#06b6d4", class: "bg-cyan-500" },
    { name: "Índigo", value: "#6366f1", class: "bg-indigo-500" },
    { name: "Cinza", value: "#6b7280", class: "bg-gray-500" },
]

export default function CreateCampanhaPage() {
    const [htmlCode, setHtmlCode] = useState(defaultHtml)
    const [campaignTitle, setCampaignTitle] = useState("")
    const [campaignSubject, setCampaignSubject] = useState("")
    const [selectedColor, setSelectedColor] = useState(tailwindColors[0])
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
    const navigate = useNavigate();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(htmlCode)
    }

    const saveCampaign = async () => {
        try {
            const campanha_data = {
                Titulo: campaignTitle || "Campanha sem título",
                Cor: selectedColor.name,
                Assunto: campaignSubject,
                Documento: htmlCode
            };

            // Usa a sua função 'api' e passa o método e o corpo
            const response = await api('/create_campanha', {
                method: 'POST',
                body: JSON.stringify(campanha_data)
            });

            const savedCampaign = await response.json();
            console.log('Campanha salva com sucesso:', savedCampaign);

            // Limpar o formulário após salvar
            setCampaignTitle("");
            setHtmlCode(defaultHtml);
            setSelectedColor(tailwindColors[0]);
            navigate(-1);

        } catch (error) {
            console.error('Erro ao salvar campanha:', error);
            alert('Erro ao salvar campanha. Tente novamente.');
        }
    };

    const resetCode = () => {
        setHtmlCode(defaultHtml)
    }

    return (
        <div className="min-h-screen p-8 bg-white/70 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
                {/* Header da Página */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700
                                   hover:bg-gray-200 transition-colors duration-200"
                    >
                        <FaChevronLeft className="w-4 h-4" />
                        Voltar
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                            <FaPaperPlane className="text-white text-lg" />
                        </span>
                        Criar Nova Campanha
                    </h1>
                    <div className="w-24"></div> {/* Espaçador */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div className="space-y-2">
                        <Label htmlFor="campaign-title" className="font-bold text-xl text-gray-700">Título</Label>
                        <Input
                            id="campaign-title"
                            type="text"
                            placeholder="Digite o título da sua campanha"
                            value={campaignTitle}
                            onChange={(e) => setCampaignTitle(e.target.value)}
                            className="border-slate-300 placeholder:text-slate-400 
                                transition-all ease-in-out duration-300
                                focus:bg-slate-200 rounded-full
                                focus:ring-0 focus:ring-offset-0 focus:ring-transparent 
                                focus:border-none focus:outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="font-bold text-xl text-gray-700">Cor do Tema</Label>
                        <div className="flex flex-wrap gap-2">
                            {tailwindColors.map((color) => (
                                <button
                                    key={color.name}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${color.class} ${selectedColor.name === color.name
                                        ? "border-blue-700 scale-110 ring-2 ring-blue-300"
                                        : "border-slate-300 hover:scale-105 hover:ring-1 hover:ring-blue-200"
                                        }`}
                                    title={color.name}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-slate-500">
                            Cor selecionada: {selectedColor.name}
                        </p>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <Label htmlFor="campaign-assunto" className="font-bold text-xl text-gray-700">Assunto da campanha</Label>
                    <Input
                        id="campaign-assunto"
                        type="text"
                        placeholder="Digite o assunto da sua campanha"
                        value={campaignSubject}
                        onChange={(e) => setCampaignSubject(e.target.value)}
                        className="border-slate-300 placeholder:text-slate-400 
                                transition-all ease-in-out duration-300
                                focus:bg-slate-200 rounded-full
                                focus:ring-0 focus:ring-offset-0 focus:ring-transparent 
                                focus:border-none focus:outline-none"
                    />
                </div>

                <div className="flex gap-4 mb-4 justify-end">
                    <Button
                        onClick={copyToClipboard}
                        className="bg-slate-300 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-emerald-500 hover:text-white transition-all duration-300 rounded-full hover:cursor-pointer"
                        size="sm"
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar Código
                    </Button>
                    <Button
                        onClick={resetCode}
                        className="bg-slate-300 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-emerald-500 hover:text-white transition-all duration-300 rounded-full hover:cursor-pointer"
                        size="sm"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resetar
                    </Button>

                    <Modal
                        buttonClassName="bg-slate-300 text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-emerald-500 hover:text-white transition-all duration-300 rounded-full hover:cursor-pointer !p-2 !px-4 !text-sm !font-medium flex items-center gap-2"
                        buttonTitle="Ajuda"
                        width={700}
                        color="blue"
                        modalTitle="Como usar o Editor HTML"
                        isModalOpen={isHelpModalOpen}
                        openModal={() => setIsHelpModalOpen(true)}
                        onClose={() => setIsHelpModalOpen(false)}
                    >
                        <div className='space-y-4'>
                            <div className="space-y-3">
                                <h2 className="text-xl font-bold text-gray-700">📝 Instruções de Uso:</h2>
                                <div className="space-y-2">
                                    <p className="flex items-start gap-2">
                                        <span className="font-bold text-blue-600 min-w-[24px]">1.</span>
                                        <span className="text-gray-700">
                                            <strong>Escreva seu código HTML</strong> diretamente no editor à esquerda
                                        </span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="font-bold text-blue-600 min-w-[24px]">2.</span>
                                        <span className="text-gray-700">
                                            Ou <strong>cole seu código HTML existente</strong> substituindo o código padrão
                                        </span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="font-bold text-blue-600 min-w-[24px]">3.</span>
                                        <span className="text-gray-700">
                                            <strong>Visualize em tempo real</strong> no preview à direita
                                        </span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="font-bold text-blue-600 min-w-[24px]">4.</span>
                                        <span className="text-gray-700">
                                            <strong>Salve sua campanha</strong> quando estiver satisfeito
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                                <h3 className="font-bold text-amber-800 mb-2">🖼️ Sobre Imagens:</h3>
                                <p className="text-amber-700 text-sm leading-relaxed">
                                    Se você for utilizar imagens na sua campanha, certifique-se de usar <strong>URLs da internet</strong>
                                    (links que começam com https://). Não use imagens locais do seu computador,
                                    pois elas não funcionarão nos e-mails.
                                </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                <h3 className="font-bold text-blue-800 mb-2">✅ Dicas para E-mail:</h3>
                                <p className="text-blue-700 text-sm leading-relaxed">
                                    Este código será usado em campanhas de e-mail. Para melhor compatibilidade,
                                    evite JavaScript e prefira CSS inline quando possível.
                                </p>
                            </div>
                        </div>
                    </Modal>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: "500px" }}>
                    {/* Editor */}
                    <Card className="p-4 flex flex-col border-slate-200 shadow-lg bg-white/50 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-bold text-gray-700">Editor HTML</h2>
                            <span className="text-sm text-slate-500">{htmlCode.length} caracteres</span>
                        </div>
                        <textarea
                            value={htmlCode}
                            onChange={(e) => setHtmlCode(e.target.value)}
                            className="flex-1 w-full p-3 font-mono text-sm bg-slate-50 border border-slate-300 rounded-lg resize-none 
                                focus:outline-none focus:ring-0 focus:border-blue-400 focus:bg-slate-100 
                                transition-all duration-300 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
                            placeholder="Digite seu código HTML aqui..."
                            spellCheck={false}
                        />
                    </Card>

                    {/* Preview */}
                    <Card className="p-4 flex flex-col border-slate-200 shadow-lg bg-white/50 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-bold text-gray-700">Preview</h2>
                            <span className="text-sm text-slate-500">Atualização em tempo real</span>
                        </div>
                        <div className="flex-1 border border-slate-300 rounded-lg overflow-hidden shadow-inner bg-white">
                            <iframe
                                srcDoc={htmlCode}
                                className="w-full h-full border-0"
                                title="HTML Preview"
                                sandbox="allow-scripts allow-same-origin"
                            />
                        </div>
                    </Card>
                </div>

                <div className="mt-6 flex justify-center">
                    <Button
                        onClick={saveCampaign}
                        size="lg"
                        className="px-8 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white font-bold 
                            hover:from-blue-600 hover:via-cyan-600 hover:to-emerald-600 
                            transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 hover:cursor-pointer"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        Salvar Campanha
                    </Button>
                </div>
            </div>
        </div>
    )
}