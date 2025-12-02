import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function PrivateRouteAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/iniciar-sesion-admin');
    }
  }, [navigate]);

  const adminToken = localStorage.getItem('adminToken');
  
  if (!adminToken) {
    return null;
  }

  return <Outlet />;
}
