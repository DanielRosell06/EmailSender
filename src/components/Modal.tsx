import { useState, type ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa'

// Crie uma interface para tipar os props do componente
interface ModalProps {
    buttonClassName?: string;
    buttonTitle?: string;
    modalTitle?: string;
    children: ReactNode;
}

function Modal({ buttonClassName, buttonTitle, modalTitle, children }: ModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <button
                onClick={openModal}
                className={`rounded-lg p-4 bg-black text-white cursor-pointer ${buttonClassName}`}
            >
                {buttonTitle}
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4">

                    <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm"></div>

                    <div className='relative w-auto min-w-96 z-10'>
                        <div
                            className='flex h-16 items-center justify-between rounded-t-xl p-4 bg-[linear-gradient(160deg,var(--tw-gradient-from),var(--tw-gradient-via),var(--tw-gradient-to))] from-indigo-600/60 via-fuchsia-500/60 to-red-500/60 text-white'
                        >
                            <div className='w-6'></div>

                            <h1 className='flex-grow text-center text-2xl font-bold text-white'>
                                {modalTitle}
                            </h1>

                            <FaTimes className='h-6 w-6 cursor-pointer text-white'
                                onClick={closeModal}
                            >
                            </FaTimes>
                        </div>
                        <div className="mx-auto rounded-b-xl bg-white shadow-lg">
                            <div className='p-4'>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Modal;