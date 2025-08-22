// src/routes.tsx
import { createBrowserRouter } from "react-router-dom";

// Importe seus componentes de página .tsx
import Layout from './Layout.tsx'
import CreateEnvioPage from './pages/Envio/CreateEnvioPage.tsx';
import CreateCampanhaPage from "./pages/Campanha/CreateCampanhaPage.tsx";
import ListPage from "./pages/Lista/ListPage.tsx";
import HomePage from "./pages/Home/HomePage.tsx";
import CampanhaPage from "./pages/Campanha/CampanhaPage.tsx";
import EnvioDetailsPage from "./pages/Envio/EnvioDetails.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "",
                element: <HomePage />,
            },
            {
                path: "envio_detail/:id_envio",
                element: <EnvioDetailsPage />,
                loader: ({ params }) => ({ IdEnvio: params.id_envio }),
            },
            {
                path: "create_envio",
                element: <CreateEnvioPage />,
            },
            {
                path: "campanha",
                element: <CampanhaPage />,
            },
            {
                path: "create_campanha",
                element: <CreateCampanhaPage />,
            },
            {
                path: "lista",
                element: <ListPage />,
            },
        ],
    },
]);

export default router;