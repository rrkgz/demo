import React from 'react';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  categoria: string;
}

const productosVeterinaria: Producto[] = [
  {
    id: 1,
    nombre: 'Alimento Premium para Perros',
    descripcion: 'Croquetas de alta calidad con proteínas naturales, vitaminas y minerales esenciales para perros adultos.',
    imagen: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop',
    categoria: 'Alimentos'
  },
  {
    id: 2,
    nombre: 'Alimento para Gatos',
    descripcion: 'Alimento balanceado especialmente formulado para gatos, con taurina y omega 3 para una salud óptima.',
    imagen: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=400&h=300&fit=crop',
    categoria: 'Alimentos'
  },
  {
    id: 3,
    nombre: 'Collar Antiparasitario',
    descripcion: 'Protección efectiva contra pulgas y garrapatas por hasta 8 meses. Resistente al agua.',
    imagen: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop',
    categoria: 'Accesorios'
  },
  {
    id: 4,
    nombre: 'Shampoo Medicado',
    descripcion: 'Shampoo hipoalergénico para mascotas con piel sensible. Con aloe vera y avena coloidal.',
    imagen: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop',
    categoria: 'Higiene'
  },
  {
    id: 5,
    nombre: 'Cama Ortopédica',
    descripcion: 'Cama con espuma de memoria para mascotas senior o con problemas articulares. Funda lavable.',
    imagen: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
    categoria: 'Accesorios'
  },
  {
    id: 6,
    nombre: 'Kit de Cepillado Dental',
    descripcion: 'Set completo con cepillo, pasta dental y juguetes para mantener la higiene bucal de tu mascota.',
    imagen: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop',
    categoria: 'Higiene'
  },
  {
    id: 7,
    nombre: 'Juguetes Interactivos',
    descripcion: 'Set de juguetes diseñados para estimular la mente de tu mascota y mantenerla activa.',
    imagen: 'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=400&h=300&fit=crop',
    categoria: 'Juguetes'
  },
  {
    id: 8,
    nombre: 'Transportadora Premium',
    descripcion: 'Transportadora espaciosa y segura, ideal para viajes. Aprobada para aerolíneas.',
    imagen: 'https://images.unsplash.com/photo-1581888227599-779811939961?w=400&h=300&fit=crop',
    categoria: 'Accesorios'
  }
];

export const CatalogoProductos: React.FC = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">
          <i className="bi bi-bag-heart-fill me-3"></i>
          Catálogo de Productos
        </h1>
        <p className="lead text-muted">
          Descubre nuestra selección de productos de alta calidad para el cuidado de tu mascota
        </p>
      </div>

      <div className="row g-4">
        {productosVeterinaria.map((producto) => (
          <div key={producto.id} className="col-md-6 col-lg-4 col-xl-3">
            <div className="card h-100 shadow-sm hover-shadow transition-all" style={{ cursor: 'pointer' }}>
              <img 
                src={producto.imagen} 
                className="card-img-top" 
                alt={producto.nombre}
                style={{ height: '200px', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Producto+Veterinario';
                }}
              />
              <div className="card-body d-flex flex-column">
                <span className="badge bg-primary mb-2 align-self-start">{producto.categoria}</span>
                <h5 className="card-title fw-bold">{producto.nombre}</h5>
                <p className="card-text text-muted flex-grow-1" style={{ fontSize: '0.9rem' }}>
                  {producto.descripcion}
                </p>
                <button className="btn btn-outline-primary mt-2">
                  <i className="bi bi-info-circle me-2"></i>
                  Más información
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-5 p-4 bg-light rounded">
        <h4 className="text-primary mb-3">
          <i className="bi bi-telephone-fill me-2"></i>
          ¿Necesitas más información?
        </h4>
        <p className="mb-0">
          Contáctanos para consultar disponibilidad y precios de nuestros productos
        </p>
        <p className="text-muted mt-2">
          <i className="bi bi-whatsapp me-2"></i>
          WhatsApp: +56 9 1234 5678
        </p>
      </div>

      <style>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};
