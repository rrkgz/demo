import React, { useState, useMemo } from 'react';


interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  precio: number; 
}


interface ItemBoleta extends Producto {
  cantidad: number;
}


const productosVeterinaria: Producto[] = [
  {
    id: 1,
    nombre: 'Séxtuple',
    descripcion: 'Vacuna de protección contra seis enfermedades virales y bacterianas.',
    imagen: 'https://placehold.co/400x300/60A5FA/ffffff?text=Vacuna',
    categoria: 'Vacunas',
    precio: 25000,
  },
  {
    id: 2,
    nombre: 'Antirrabica',
    descripcion: 'Estimula el sistema inmunológico contra el virus de la rabia.',
    imagen: 'https://placehold.co/400x300/60A5FA/ffffff?text=Antirrabica',
    categoria: 'Vacunas',
    precio: 18000,
  },
  {
    id: 3,
    nombre: 'Triple felina',
    descripcion: 'Vacuna que protege a los gatos contra tres enfermedades comunes.',
    imagen: 'https://placehold.co/400x300/60A5FA/ffffff?text=Triple+Felina',
    categoria: 'Vacunas',
    precio: 22000,
  },
  {
    id: 4,
    nombre: 'Consulta General',
    descripcion: 'Revisión del estado general de salud de la mascota.',
    imagen: 'https://placehold.co/400x300/10B981/ffffff?text=Consulta',
    categoria: 'Servicios',
    precio: 15000,
  },
  {
    id: 5,
    nombre: 'Implantación MicroChip',
    descripcion: 'Ayuda a identificar a su mascota mediante un código único.',
    imagen: 'https://placehold.co/400x300/60A5FA/ffffff?text=Microchip',
    categoria: 'Vacunas',
    precio: 10000,
  },
  {
    id: 6,
    nombre: 'Corte de Uñas',
    descripcion: 'Servicio de bienestar y aseo para mantener limpias las patas.',
    imagen: 'https://placehold.co/400x300/F59E0B/ffffff?text=Aseo',
    categoria: 'Higiene',
    precio: 5000,
  },
  {
    id: 7,
    nombre: 'Baño Completo',
    descripcion: 'Baño, secado y cepillado profesional para la mascota.',
    imagen: 'https://placehold.co/400x300/F59E0B/ffffff?text=Baño',
    categoria: 'Higiene',
    precio: 8500,
  },
  {
    id: 8,
    nombre: 'Peluquería Canina',
    descripcion: 'Cortes de pelo especializados para el cuidado y estética.',
    imagen: 'https://placehold.co/400x300/F59E0B/ffffff?text=Peluqueria',
    categoria: 'Higiene',
    precio: 12000,
  }
];


const formatCLP = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(amount);
};


const App: React.FC = () => {
  const [boletaItems, setBoletaItems] = useState<ItemBoleta[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todos');

  
  const categoriasUnicas = useMemo(() => {
    const categories = productosVeterinaria.map(p => p.categoria);
    return ['Todos', ...new Set(categories)];
  }, []);

  
  const agregarABoleta = (producto: Producto) => {
    setBoletaItems(prevItems => {
      const itemExistente = prevItems.find(item => item.id === producto.id);
      if (itemExistente) {
        
        return prevItems.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        
        return [...prevItems, { ...producto, cantidad: 1 }];
      }
    });
  };

  
  const cambiarCantidad = (id: number, delta: number) => {
    setBoletaItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === id ? { ...item, cantidad: item.cantidad + delta } : item
      ).filter(item => item.cantidad > 0); 
      return updatedItems;
    });
  };

  
  const { subtotal, iva, total } = useMemo(() => {
    const sub = boletaItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    
    const impuesto = sub * 0.19;
    const finalTotal = sub + impuesto;
    return { subtotal: sub, iva: impuesto, total: finalTotal };
  }, [boletaItems]);

  
  const productosFiltrados = useMemo(() => {
    if (filtroCategoria === 'Todos') {
      return productosVeterinaria;
    }
    return productosVeterinaria.filter(p => p.categoria === filtroCategoria);
  }, [filtroCategoria]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-2">
            <i className="fas fa-paw mr-3 text-blue-500"></i>
            TPV Veterinaria | Catálogo y Boleta
          </h1>
          <p className="text-gray-500">Gestión de Productos y Servicios para tu Mascota</p>
        </header>

        {/* Contenido principal: Catálogo y Boleta */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Columna 1: Catálogo de Productos */}
          <div className="lg:w-3/5 bg-white p-6 rounded-xl shadow-2xl border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-box-open mr-2 text-green-500"></i>
              Catálogo de Servicios y Productos
            </h2>

            {/* Filtro de Categorías */}
            <div className="mb-6 flex flex-wrap gap-2">
              {categoriasUnicas.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFiltroCategoria(cat)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition duration-150 ease-in-out shadow-sm
                    ${filtroCategoria === cat
                      ? 'bg-blue-600 text-white shadow-blue-300/50'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid de Productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {productosFiltrados.map((producto) => (
                <div 
                  key={producto.id} 
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-200 flex flex-col"
                >
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre} 
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      
                      e.currentTarget.src = 'https://placehold.co/400x300/e5e7eb/374151?text=No+Image';
                    }}
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-xs font-semibold uppercase text-blue-600 mb-1">{producto.categoria}</span>
                    <h3 className="text-lg font-bold text-gray-900 truncate">{producto.nombre}</h3>
                    <p className="text-gray-500 text-sm mb-3 flex-grow">{producto.descripcion}</p>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-xl font-extrabold text-green-600">
                        {formatCLP(producto.precio)}
                      </span>
                      <button 
                        onClick={() => agregarABoleta(producto)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition duration-200 shadow-md shadow-green-300/50 flex items-center"
                      >
                        <i className="fas fa-cart-plus mr-2"></i>
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {productosFiltrados.length === 0 && (
                <p className="col-span-full text-center text-gray-500 p-8 bg-gray-100 rounded-lg">
                  No hay productos en la categoría "{filtroCategoria}".
                </p>
              )}
            </div>
          </div>

          {/* Columna 2: Boleta (Recibo) */}
          <div className="lg:w-2/5 bg-white p-6 rounded-xl shadow-2xl border border-gray-100 h-fit sticky top-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
              <span>
                <i className="fas fa-file-invoice-dollar mr-2 text-red-500"></i>
                Boleta Electrónica
              </span>
              <button 
                onClick={() => setBoletaItems([])}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
                disabled={boletaItems.length === 0}
              >
                <i className="fas fa-trash-alt mr-1"></i>
                Vaciar
              </button>
            </h2>

            {/* Lista de Ítems en la Boleta */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mb-4">
              {boletaItems.length === 0 ? (
                <div className="text-center p-8 bg-gray-100 rounded-lg text-gray-500 border border-dashed">
                  <i className="fas fa-cash-register text-3xl mb-2"></i>
                  <p>Aún no hay ítems en la boleta.</p>
                  <p className="text-sm">Selecciona productos del catálogo para comenzar.</p>
                </div>
              ) : (
                boletaItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800 truncate">{item.nombre}</p>
                      <p className="text-sm text-gray-500">{formatCLP(item.precio)} x {item.cantidad}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => cambiarCantidad(item.id, -1)}
                          className="px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 bg-white text-sm font-semibold">{item.cantidad}</span>
                        <button 
                          onClick={() => cambiarCantidad(item.id, 1)}
                          className="px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-extrabold text-md text-blue-600 w-24 text-right">
                        {formatCLP(item.precio * item.cantidad)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Resumen de Totales */}
            <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-200 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-medium">{formatCLP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>IVA (19%):</span>
                <span className="font-medium">{formatCLP(iva)}</span>
              </div>
              <div className="flex justify-between text-2xl font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                <span>TOTAL:</span>
                <span className="text-red-600">{formatCLP(total)}</span>
              </div>
            </div>

            {/* Botón de Pago */}
            <button 
              className={`w-full mt-6 py-3 rounded-xl text-lg font-bold transition duration-300 shadow-lg 
                ${boletaItems.length > 0
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-300/50'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              disabled={boletaItems.length === 0}
              onClick={() => {
               
                console.log('Procesando pago:', total);
                alert(`¡Boleta procesada!\nTotal a pagar: ${formatCLP(total)}`);
                setBoletaItems([]);
              }}
            >
              <i className="fas fa-credit-card mr-2"></i>
              Pagar y Emitir Boleta
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};


export default App;