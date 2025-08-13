import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { FiUpload } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';

interface CSVLoaderProps {
    onLoadEmails: Function,
    value?: Array<String>,
}

// function Modal({ buttonClassName, buttonTitle, modalTitle, children }: ModalProps) {
function CSVLoader({ onLoadEmails, value }: CSVLoaderProps) {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [emails, setEmails] = useState<string[]>([]);
    const [fileName, setFileName] = useState<string>('Nenhum arquivo selecionado');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setFileName(file.name);
            setEmails([]);
            setLoading(true);
            setProgress(0);

            const reader = new FileReader();
            reader.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percent = (e.loaded / e.total) * 50; // 50% para a leitura do arquivo
                    setProgress(percent);
                }
            };

            reader.onload = (e) => {
                if (e.target?.result) {
                    const csvText = e.target.result as string;

                    // Use uma pequena pausa para simular o tempo de processamento
                    setTimeout(() => {
                        Papa.parse(csvText, {
                            header: false, // Alterado para false para ler todas as células
                            skipEmptyLines: true,
                            complete: (results) => {
                                const extractedEmails: string[] = [];
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                const totalCells = results.data.flat().length;
                                let processedCells = 0;

                                results.data.forEach((row: any) => {
                                    row.forEach((cell: string) => {
                                        if (emailRegex.test(cell)) {
                                            extractedEmails.push(cell);
                                        }
                                        processedCells++;
                                        const percent = 50 + (processedCells / totalCells) * 50; // 50% para o processamento
                                        setProgress(percent);
                                    });
                                });

                                setEmails(extractedEmails);
                                value = emails
                                setLoading(false);
                                setProgress(100);
                            },
                            error: (err: any) => {
                                console.error("Erro ao fazer o parse do arquivo:", err);
                                setLoading(false);
                            }
                        });
                    }, 100); // Pequena pausa para garantir que a barra de progresso de 50% seja mostrada
                }
            };
            reader.readAsText(file);
        }
    };

    const handleAddToList = () => {
        onLoadEmails({ value: emails });
        setEmails([])
        setLoading(false)
        setFileName("Nenhum arquivo selecionado")
    };

    return (
        <div className='w-[350px]'>
            <h1 className='font-bold text-xl'>Inserir Arquivo .csv</h1>
            <h3 className='text-slate-500'>Insira um arquivo .csv, todas as células da planilha que possuem a formatação XXXX@XXXX.XXX serão adicionadas à lista.</h3>
            <div className="flex flex-col gap-2 w-full max-w-md mt-2">
                {emails.length > 0 ? (
                    <div className='flex flex-row items-center'>
                        <button
                            type="button"
                            onClick={handleAddToList}
                            className="px-4 py-2 rounded-md hover:cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <span>{emails.length} e-mails reconhecidos. Clique para adicionar à lista.</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setEmails([])
                                setLoading(false)
                                setFileName("Nenhum arquivo selecionado")
                            }}
                            className="bg-slate-300 ml-2 w-[50px] h-[50px] rounded-full px-4 py-2 hover:cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <FaTimes className='font-bold text-xl mt-auto mb-auto'></FaTimes>
                        </button>
                    </div>
                ) :
                    <>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-slate-400 transition-colors duration-200">
                            <div className="flex items-center gap-4">
                                {loading ? (
                                    <div className="w-full h-2 bg-slate-300 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleButtonClick}
                                        className="bg-slate-300 px-4 py-2 rounded-md hover:cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
                                    >
                                        <FiUpload className="text-lg" />
                                        <span>Selecionar</span>
                                    </button>
                                )}
                                <span className="text-slate-600 truncate flex-1">
                                    {fileName}
                                </span>
                            </div>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".csv"
                        />
                    </>
                }
            </div>
        </div>
    );
};

export default CSVLoader;