// src/routes.tsx
import { createBrowserRouter } from "react-router-dom";

// Importe seus componentes de página .tsx
import Layout from './Layout.tsx'
import EnvioPage from './pages/EnvioPage.tsx';


const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "envio",
                element: <EnvioPage />,
            },
        ],
    },
]);

export default router;