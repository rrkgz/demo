import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./layouts/Layouts";
import InicioSesion from "./views/Login/InicioSesion";
import InicioSesionAdmin from "./views/Login/InicioSesionAdmin";
import CrearCuenta from "./views/Login/CrearCuenta";
import CambiarPassword from "./views/Login/CambiarPassword";
import PrivateRoute from "./components/PrivateRouter";
import PrivateRouteAdmin from "./components/PrivateRouteAdmin";
import AdminUsuarios from "./views/AdminUsuarios";
import AgendarCitas from "./views/Login/agendarcita";
import MenuPrincipal from "./views/MenuPrincipal";
import CuentaUsuario from "./views/CuentaUsuario";
import PanelAdmin from "./views/PanelAdmin";
import AdminVeterinarios from "./views/AdminVeterinarios";


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
                        path: '/crear-cuenta',
                        element: <CrearCuenta />,
                    },
                    {
                        path: '/iniciar-sesion-admin',
                        element: <InicioSesionAdmin />,
                    },
                    {
                        element: <PrivateRoute />,
                        children: [
                            {
                                path: '/menu-principal',
                                element: <MenuPrincipal />,
                            },
                            {
                                path: '/cuenta',
                                element: <CuentaUsuario />,
                            },
                            {
                                path: '/cambiar-pass',
                                element: <CambiarPassword />,
                            },
                        ],
                    },
                    {
                        element: <PrivateRouteAdmin />,
                        children: [
                            {
                                path: '/panel-admin',
                                element: <PanelAdmin />,
                            },
                            {
                                path: '/admin',
                                element: <AdminUsuarios />,
                            },
                            {
                                path: '/admin/veterinarios',
                                element: <AdminVeterinarios />,
                            },
                            {
                                path: '/agendar-citas',
                                element: <AgendarCitas />,
                            },
                        ],
                    },
        ],
    },
]);