import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Layout() {
    const location = useLocation();
    const hideNavBar =
        location.pathname === '/iniciar-sesion' ||
        location.pathname === '/crear-cuenta' ||
        location.pathname === '/cambiar-pass';
    return (
        <>
            {!hideNavBar && <NavBar />}
            <div className="container-fluid">
                <Outlet />
            </div>
        </>
    );



}