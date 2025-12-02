import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./layouts/Layouts";
import InicioSesion from "./views/Login/InicioSesion";
import CrearCuenta from "./views/Login/CrearCuenta";
import CambiarPassword from "./views/Login/CambiarPassword";
import PrivateRoute from "./components/PrivateRouter";
import AdminUsuarios from "./views/AdminUsuarios";
import AgendarCitas from "./views/Login/agendarcita";
import MenuPrincipal from "./views/MenuPrincipal";
import CuentaUsuario from "./views/CuentaUsuario";


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