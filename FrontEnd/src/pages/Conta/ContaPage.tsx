import React, { useEffect, useState } from 'react';
import { FaPlus, FaEye, FaRegEnvelope, FaWrench, FaEyeSlash } from 'react-icons/fa';
import { api } from '@/services/api.ts';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSenha {
    IdUserSmtp: number;
    Senha: string;
    Loading: boolean;
}

// Interface para a Conta SMTP
interface SmtpAccount {
    Usuario: string;
    Senha?: string;
    Dominio: string;
    Porta: string;
}

interface SmtpAccountWithId {
    IdUsuarioSmtp: number;
    Usuario: string;
    Senha?: string;
    Dominio: string;
    Porta: string;
}

const ContaPage: React.FC = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

    // Exemplo de estado com contas SMTP simuladas
    const [accounts, setAccounts] = useState<SmtpAccountWithId[]>([]);
    const [loadingAccounts, setLoadingAccounts] = useState<boolean>(true)
    const [reloadAccountsVar, setReloadAccountsVar] = useState<number>(-1)
    const [loadingSenha, setLoadingSenha] = useState<LoadingSenha>({
        IdUserSmtp: -1,
        Senha: "",
        Loading: true
    })

    const [newAccount, setNewAccount] = useState<Omit<SmtpAccount, 'id'>>({
        Usuario: '',
        Senha: '',
        Dominio: '',
        Porta: '587',
    });

    function reloadAccounts() {
        setReloadAccountsVar(reloadAccountsVar * -1)
    }


    const handleGetSenha = async (accountId: number) => {
        setLoadingSenha({
            IdUserSmtp: accountId,
            Senha: "",
            Loading: true
        });

        try {
            const res = await api(`/get_user_password?id_user_smtp=${accountId}`);
            const data = await res.json();

            setLoadingSenha({
                IdUserSmtp: accountId,
                Senha: data,
                Loading: false
            });

        } catch (error) {
            setLoadingSenha({
                IdUserSmtp: -1,
                Senha: "",
                Loading: true
            });
            console.error("Erro ao buscar senha:", error);
        } finally {
            setLoadingAccounts(false);
        }
    };

    useEffect(() => {
        const fetchAccounts = async () => {
            setLoadingAccounts(true);
            try {
                const res = await api('/get_all_user_smtp');
                const data = await res.json();

                console.log(data);
                setAccounts(data);
            } catch (error) {
                console.error('Erro ao buscar contas:', error);
                setAccounts([]);
            } finally {
                setLoadingAccounts(false);
            }
        };

        fetchAccounts();
    }, [backendUrl, reloadAccountsVar]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewAccount({ ...newAccount, [name]: value });
    };

    const handleAddAccount = async () => {
        if (!newAccount.Dominio || !newAccount.Usuario || !newAccount.Senha || !newAccount.Porta) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        console.log(newAccount);

        try {
            const res = await api('/create_user_smtp', {
                method: "POST",
                body: JSON.stringify(newAccount)
            });

            if (!res.ok) {
                throw new Error('Erro na requisição para criar usuario smtp.');
            }

            reloadAccounts();
            setNewAccount({ Dominio: '', Porta: '587', Usuario: '', Senha: '' });

        } catch (error) {
            console.error("Erro ao adicionar conta:", error);
            alert('Não foi possivel adicionar conta, tente novamente mais tarde!');
        }
    };

    const renderAddAccountSection = () => (
        <Card className="bg-white/50 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg transition-all duration-300 transform">
            <CardHeader className="flex flex-row items-center gap-4 p-6">
                <div className="p-2 rounded-lg bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-orange-600/50 via-yellow-500 to-red-500/50">
                    <FaPlus className="text-white text-lg" />
                </div>
                <div className='flex flex-col'>
                    <CardTitle className="text-2xl font-bold text-gray-800">Adicionar Conta SMTP</CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-1">Preencha os campos para adicionar uma nova conta.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
                <div className="grid w-full items-center gap-2">
                    <Label htmlFor="Dominio" className="text-sm text-gray-600">Servidor (Dominio)</Label>
                    <Input
                        id="Dominio"
                        name="Dominio"
                        value={newAccount.Dominio}
                        onChange={handleInputChange}
                        className="bg-gray-100/50 backdrop-blur-sm border-gray-200 focus:border-yellow-500"
                        placeholder="Ex: smtp.gmail.com"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid w-full items-center gap-2">
                        <Label htmlFor="Porta" className="text-sm text-gray-600">Porta</Label>
                        <Input
                            id="Porta"
                            name="Porta"
                            type="number"
                            value={newAccount.Porta}
                            onChange={handleInputChange}
                            className="bg-gray-100/50 backdrop-blur-sm border-gray-200 focus:border-yellow-500"
                        />
                    </div>
                    <div className="grid w-full items-center gap-2">
                        <Label htmlFor="Usuario" className="text-sm text-gray-600">Usuário (Email)</Label>
                        <Input
                            id="Usuario"
                            name="Usuario"
                            value={newAccount.Usuario}
                            onChange={handleInputChange}
                            className="bg-gray-100/50 backdrop-blur-sm border-gray-200 focus:border-yellow-500"
                            placeholder="Ex: seuemail@dominio.com"
                        />
                    </div>
                </div>
                <div className="grid w-full items-center gap-2">
                    <Label htmlFor="Senha" className="text-sm text-gray-600">Senha (App Password)</Label>
                    <div className="relative">
                        <Input
                            id="Senha"
                            name="Senha"
                            type="Senha"
                            value={newAccount.Senha}
                            onChange={handleInputChange}
                            className="bg-gray-100/50 backdrop-blur-sm border-gray-200 focus:border-yellow-500 pr-10"
                            placeholder="******************"
                        />
                    </div>
                </div>
                <Button
                    onClick={handleAddAccount}
                    className="w-full bg-gradient-to-r from-orange-500/80 via-yellow-500/80 to-red-500/80 text-white font-semibold rounded-xl shadow hover:from-orange-600 hover:via-yellow-600 hover:to-red-600 transition-all"
                >
                    <FaWrench className="mr-2" />
                    Adicionar Conta
                </Button>
            </CardContent>
        </Card>
    );

    const renderAccountsList = () => (
        <Card className="bg-white/50 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg mt-6">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-orange-600/50 via-yellow-500 to-red-500/50">
                        <FaRegEnvelope className="text-white text-lg" />
                    </div>
                    Contas SMTP
                </CardTitle>
                <CardDescription className="text-gray-600">Gerencie suas contas de e-mail aqui.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
                {!loadingAccounts ? (accounts.length > 0 ? (
                    accounts.map((account) => (
                        <div
                            key={account.IdUsuarioSmtp}
                            className="flex items-center justify-between h-20 pr-4 pl-4 rounded-xl border-2 border-slate-200 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-sm hover:border-yellow-500"
                        >
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-800">{account.Usuario}</span>
                                <span className="text-sm text-gray-500">{account.Dominio}:{account.Porta}</span>
                            </div>
                            <div className="flex flex-row">
                                {loadingSenha.IdUserSmtp == account.IdUsuarioSmtp ? (loadingSenha.Loading == true ? <>
                                    <Skeleton className='mt-auto mb-auto h-6 bg-slate-200 w-32'></Skeleton>
                                    <Button
                                        variant="ghost"
                                        className=" rounded-full text-gray-500 hover:text-yellow-600"
                                    >
                                        <FaEyeSlash />
                                    </Button>
                                </> : <>
                                    <span className=" font-mono text-slate-700 text-sm mt-auto mb-auto select-none">{loadingSenha.Senha}</span>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setLoadingSenha({
                                            IdUserSmtp: -1,
                                            Senha: "",
                                            Loading: true
                                        })}
                                        className=" rounded-full text-gray-500 hover:text-yellow-600"
                                    >
                                        <FaEyeSlash />
                                    </Button>
                                </>) : <>
                                    <span className=" mt-auto mb-auto text-2xl text-gray-400 select-none">••••••••••••••</span>
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleGetSenha(account.IdUsuarioSmtp)}
                                        className=" rounded-full text-gray-500 hover:text-yellow-600"
                                    >
                                        <FaEye />
                                    </Button>
                                </>
                                }
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Nenhuma conta encontrada.</p>
                )) :
                    <>
                        <Skeleton className='flex items-center justify-between h-20 pr-4 pl-4 rounded-xl bg-slate-200 transition-all duration-300 transform '></Skeleton>
                        <Skeleton className='flex items-center justify-between h-20 pr-4 pl-4 rounded-xl bg-slate-200 transition-all duration-300 transform '></Skeleton>
                        <Skeleton className='flex items-center justify-between h-20 pr-4 pl-4 rounded-xl bg-slate-200 transition-all duration-300 transform '></Skeleton>
                    </>
                }
            </CardContent>
        </Card>
    );

    const renderRightPanel = () => (
        <Card className="bg-white/50 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg p-6 flex flex-col justify-between h-140">
            <div>
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-800">O que é uma Conta SMTP?</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600 space-y-4">
                    <p>
                        SMTP (Simple Mail Transfer Protocol) é o protocolo padrão para enviar e-mails. Quando você envia uma mensagem, ela é encaminhada de um servidor para outro através do SMTP até chegar ao destino final.
                    </p>
                    <p>
                        A configuração de uma conta SMTP em um aplicativo como este é essencial para que o sistema possa enviar e-mails de forma confiável em seu nome, usando as credenciais do seu provedor de e-mail.
                    </p>
                    <p>
                        Isso garante a autenticidade e a entrega das mensagens, evitando que sejam marcadas como spam.
                    </p>
                </CardContent>
            </div>
            <div className="p-6 pt-0">
                <Button
                    onClick={() => window.open('https://www.hostinger.com.br/tutoriais/o-que-e-smtp', '_blank')}
                    className="w-full bg-gradient-to-r from-orange-600 via-yellow-500 to-red-500 text-white font-semibold rounded-xl shadow transition-all hover:from-orange-700 hover:via-yellow-600 hover:to-red-600"
                >
                    Veja um Tutorial para criar sua conta
                </Button>
            </div>
        </Card>
    );

    return (
        <div className="min-h-screen p-8 bg-white">
            <div className="max-w-7xl mx-auto flex gap-8">
                {/* Seção Esquerda (65%) */}
                <div className="flex-1 w-[65%] space-y-8">
                    {renderAddAccountSection()}
                    {renderAccountsList()}
                </div>

                {/* Seção Direita (35%) */}
                <div className="w-[35%]">
                    {renderRightPanel()}
                </div>
            </div>
        </div>
    );
};

export default ContaPage;