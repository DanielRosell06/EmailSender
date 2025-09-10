// services/api.ts

const getToken = () => localStorage.getItem('token');

export const api = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const token = getToken();

    // Cria os headers da requisição, unindo os headers existentes com o de autorização
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${backendUrl}${url}`, {
        ...options,
        headers,
    });

    // Se a resposta for 401, o token é inválido e o usuário deve ser redirecionado
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login'; 
    }

    return response;
};