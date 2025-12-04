import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./layouts/Layouts";
import InicioSesion from "./views/auth/InicioSesion";
import InicioSesionAdmin from "./views/auth/InicioSesionAdmin";
import CrearCuenta from "./views/auth/CrearCuenta";
import CambiarPassword from "./views/auth/CambiarPassword";
import PrivateRoute from "./components/PrivateRouter";
import PrivateRouteAdmin from "./components/PrivateRouteAdmin";
import AdminUsuarios from "./views/admin/AdminUsuarios";
import AgendarCitaUsuario from "./views/usuario/AgendarCitaUsuario";
import AgendarCitasAdmin from "./views/admin/AgendarCitasAdmin";
import MenuPrincipal from "./views/usuario/MenuPrincipal";
import CuentaUsuario from "./views/usuario/CuentaUsuario";
import MisMascotas from "./views/usuario/MisMascotas";
import PanelAdmin from "./views/admin/PanelAdmin";
import AdminVeterinarios from "./views/admin/AdminVeterinarios";
import { GestionClientes } from "./views/admin/GestionCliente";
import { GestionMascotas } from "./views/admin/GestionMascota";
import { GestionTratamientos } from "./views/admin/Tratamientos";
import { CatalogoProductos } from "./views/usuario/catalogo";
import { BoletaVeterinaria } from "./views/admin/Boleta";
import { ReportesVeterinaria } from "./views/admin/Reporte";
import Historial from "./views/usuario/historial";
import HistorialAdmin from "./views/admin/HistorialAdmin";


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
                                path: '/mis-mascotas',
                                element: <MisMascotas />,
                            },
                            {
                                path: '/cambiar-pass',
                                element: <CambiarPassword />,
                            },
                            {
                                path: '/catalogo',
                                element: <CatalogoProductos />,
                            },
                            {
                                path: '/mis-citas',
                                element: <AgendarCitaUsuario />,
                            },
                            {
                                path: '/historial',
                                element: <Historial />,
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
                                path: '/admin/usuarios',
                                element: <AdminUsuarios />,
                            },
                            {
                                path: '/admin/veterinarios',
                                element: <AdminVeterinarios />,
                            },
                            {
                                path: '/admin/clientes',
                                element: <GestionClientes />,
                            },
                            {
                                path: '/admin/mascotas',
                                element: <GestionMascotas />,
                            },
                            {
                                path: '/admin/tratamientos',
                                element: <GestionTratamientos />,
                            },
                            {
                                path: '/admin/boletas',
                                element: <BoletaVeterinaria />,
                            },
                            {
                                path: '/admin/reportes',
                                element: <ReportesVeterinaria />,
                            },
                            {
                                path: '/admin/agendar-citas',
                                element: <AgendarCitasAdmin />,
                            },
                            {
                                path: '/admin/historial',
                                element: <HistorialAdmin />,
                            },
                        ],
                    },
        ],
    },
]);