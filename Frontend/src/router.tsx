import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./layouts/Layouts";
import InicioSesion from "./views/Login/InicioSesion";
import PrivateRoute from "./components/PrivateRouter";
import AdminUsuarios from "./views/AdminUsuarios";
import AgendarCitas from "./views/Login/agendarcita";


//aaaaaaaaa
//uyuyuyuyuy


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
                    {
                        index: true,
                        element: <Navigate to="/iniciar-sesion" replace />,
                    },
                    {
                        path: '/iniciar-sesion',
                        element: <InicioSesion />,
                    },
                    {
                        path: '/agendar-citas', 
                        element: <AgendarCitas />, 
                    },
                    {
                        element: <PrivateRoute />,
                        children: [
                            {
                                path: '/admin',
                                element: <AdminUsuarios />,
                            },
                        ],
                    },
        ],
    },
]);