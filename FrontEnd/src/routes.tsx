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
import LoadingPage from "./pages/Envio/LoadingEnvio.tsx";
import EditCampanhaPage from "./pages/Campanha/EditCampanhaPage.tsx";
import LixeiraCampanhasPage from "./pages/Campanha/LixeiraCampanhaPage.tsx";
import LixeiraListasPage from "./pages/Lista/LixeiraListaPage.tsx";
import CreateEnvioExpPage from "./pages/Envio/CreateEnvioExpPage.tsx";


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
                path: "envio_progress",
                element: <LoadingPage />,

            },
            {
                path: "create_envio",
                element: <CreateEnvioPage />,
            },
            {
                path: "create_envio_exp/:id_campanha/:id_lista",
                element: <CreateEnvioExpPage />,
                loader: ({ params }) => ({
                    IdCampanha: params.id_campanha,
                    IdLista: params.id_lista
                }),
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
                path: "lixeira_campanha",
                element: <LixeiraCampanhasPage />,
            },
            {
                path: "edit_campanha/:id_campanha",
                element: <EditCampanhaPage />,
                loader: ({ params }) => ({ IdCampanha: params.id_campanha }),

            },
            {
                path: "lista",
                element: <ListPage />,
            },
            {
                path: "lixeira_lista",
                element: <LixeiraListasPage />,
            },
        ],
    },
]);

export default router;