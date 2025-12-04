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
    nombre: 'Séxtuple',
    descripcion: 'proporciona protección contra seis de las enfermedades virales y bacterianas más comunes y peligrosas para los perros.',
    imagen: 'https://cdn0.expertoanimal.com/es/posts/0/7/5/las_reacciones_postvacunales_en_perros_mas_frecuentes_22570_orig.jpg',
    categoria: 'Vacunas'
  },
  {
    id: 2,
    nombre: 'Antirrabica',
    descripcion: 'estimular el sistema inmunológico del cuerpo para producir anticuerpos contra el virus de la rabia.',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWbGsntuS6iQ5ed0SZ7XoXuCn1IEAlnrw7kg&s',
    categoria: 'Vacunas'
  },
  {
    id: 3,
    nombre: 'Triple felina',
    descripcion: 'vacuna que protege a los gatos contra tres enfermedades.',
    imagen: 'https://www.universodelasaludanimal.com/wp-content/uploads/sites/61/2022/02/Vacina-para-leucemia-felina-sendo-aplicada-em-gato-filhote.jpg',
    categoria: 'Vacunas'
  },
  {
    id: 4,
    nombre: 'Consulta',
    descripcion: 'se revisará el estado general de salud de la mascota.',
    imagen: 'https://i0.wp.com/puppis.blog/wp-content/uploads/2021/08/Cardiopatia-en-Perros-y-Gatos.jpg?resize=900%2C600&ssl=1',
    categoria: 'informe'
  },
  {
    id: 5,
    nombre: 'MicroChip',
    descripcion: 'ayuda a identificar a su mascota mediante un código de identificación única.',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD8v9nA90P8xcFLkctLTONX_EtCj-bmKpDHQ&s',
    categoria: 'Vacunas'
  },
  {
    id: 6,
    nombre: 'Corte de uñas',
    descripcion: 'ayuda al bienestar de tu mascota para que este mas limpio.',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiWZkl1pvWfTa5-YF9DPAYab2dUDPiTzAG7A&s',
    categoria: 'Higiene'
  },
  {
    id: 7,
    nombre: 'Baño',
    descripcion: 'baño completo a mascota.',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXyyY2OnxhliHOCAq-IHZNdZojyzXgUGpGyw&s',
    categoria: 'Juguetes'
  },
  {
    id: 8,
    nombre: 'peluqueria',
    descripcion: 'cortes de pelo para cuidar el bienestar de su mascota.',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXmoYyV5rWANRklPeDaiWtyiZwYke17fFwBA&s',
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
