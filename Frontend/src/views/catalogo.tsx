import React, { useState } from 'react';


type Categoria = 'Alimento' | 'Medicamento' | 'Accesorios' | 'Higiene' | 'Otro';

interface Producto {
  sku: string; 
  nombre: string;
  categoria: Categoria;
  precioVenta: number;
  stockActual: number;
}


interface NuevoProducto {
  sku: string;
  nombre: string;
  categoria: Categoria;
  precioVenta: number;
  stockActual: number;
}

const CATEGORIAS_DISPONIBLES: Categoria[] = ['Alimento', 'Medicamento', 'Accesorios', 'Higiene', 'Otro'];



export const CatalogoProductos: React.FC = () => {
  
  const [productos, setProductos] = useState<Producto[]>([
    { sku: 'ALM001', nombre: 'Croquetas Adulto Premium 3kg', categoria: 'Alimento', precioVenta: 25.99, stockActual: 50 },
    { sku: 'MED005', nombre: 'Pipeta Antiparasitaria Peq.', categoria: 'Medicamento', precioVenta: 12.50, stockActual: 150 },
    { sku: 'ACC010', nombre: 'Juguete Pelota Látex', categoria: 'Accesorios', precioVenta: 4.99, stockActual: 200 },
    { sku: 'HIG002', nombre: 'Shampoo Antialérgico', categoria: 'Higiene', precioVenta: 18.75, stockActual: 40 },
  ]);


  const [nuevoProducto, setNuevoProducto] = useState<NuevoProducto>({
    sku: '',
    nombre: '',
    categoria: CATEGORIAS_DISPONIBLES[0],
    precioVenta: 0.00,
    stockActual: 0,
  });

 
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR', 
        minimumFractionDigits: 2
    }).format(amount);
  };

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevoProducto(prev => ({
      ...prev,
     
      [name]: (name === 'precioVenta' || name === 'stockActual') ? Number(value) : value,
    }));
  };

 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

 
    if (productos.some(p => p.sku === nuevoProducto.sku)) {
        alert('Error: El SKU ya existe. Ingrese un código único.');
        return;
    }
    if (!nuevoProducto.sku || !nuevoProducto.nombre || nuevoProducto.precioVenta <= 0) {
        alert('Por favor, complete todos los campos requeridos y verifique el precio.');
        return;
    }
    
  
    const productoNuevo: Producto = {
        ...nuevoProducto
    };

    setProductos([...productos, productoNuevo]);

   
    setNuevoProducto({
        sku: '',
        nombre: '',
        categoria: CATEGORIAS_DISPONIBLES[0],
        precioVenta: 0.00,
        stockActual: 0,
    });
  };

  return (
    <div style={styles.container}>
      <header>
        <h1>📦 Catálogo de Productos e Inventario</h1>
      </header>

      <hr style={styles.hr} />

      <section style={styles.section}>
        <h2>➕ Agregar Nuevo Producto</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
      
            <div style={styles.formRow}>
                <label>SKU (Código):
                    <input type="text" name="sku" value={nuevoProducto.sku} onChange={handleChange} required style={styles.input} />
                </label>
                <label>Nombre del Producto:
                    <input type="text" name="nombre" value={nuevoProducto.nombre} onChange={handleChange} required style={styles.input} />
                </label>
            </div>
            
     
            <div style={styles.formRow}>
                <label>Categoría:
                    <select name="categoria" value={nuevoProducto.categoria} onChange={handleChange} required style={styles.input}>
                        {CATEGORIAS_DISPONIBLES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </label>
                <label>Precio de Venta:
                    <input type="number" name="precioVenta" value={nuevoProducto.precioVenta > 0 ? nuevoProducto.precioVenta : ''} onChange={handleChange} min="0.01" step="0.01" required style={styles.input} />
                </label>
                <label>Stock Inicial:
                    <input type="number" name="stockActual" value={nuevoProducto.stockActual} onChange={handleChange} min="0" step="1" required style={styles.input} />
                </label>
            </div>

            <button type="submit" style={styles.button}>
                Guardar Producto en Catálogo
            </button>
        </form>
      </section>

      <hr style={styles.hr} />

     
      <section style={styles.section}>
        <h2>🛒 Inventario Actual 

[Image of warehouse shelves with products]
</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>SKU</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Categoría</th>
              <th style={styles.thRight}>Precio</th>
              <th style={styles.thCenter}>Stock</th>
              <th style={styles.thCenter}>Alerta</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.sku}>
                <td style={styles.td}>{p.sku}</td>
                <td style={styles.td}>{p.nombre}</td>
                <td style={styles.td}>{p.categoria}</td>
                <td style={styles.tdRight}>{formatCurrency(p.precioVenta)}</td>
                <td style={{ ...styles.tdCenter, fontWeight: 'bold' }}>{p.stockActual}</td>
                <td style={{ ...styles.tdCenter, backgroundColor: p.stockActual <= 10 ? '#FFDCDC' : 'inherit' }}>
                    {p.stockActual <= 10 ? <span style={{ color: 'red' }}>BAJO</span> : 'OK'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {productos.length === 0 && <p style={{ textAlign: 'center', marginTop: '15px' }}>No hay productos en el catálogo.</p>}
      </section>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '1000px',
        margin: '30px auto',
        padding: '25px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
    },
    hr: {
        border: '0',
        borderTop: '1px dashed #ccc',
        margin: '25px 0',
    },
    section: {
        marginBottom: '30px',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '1px solid #eee',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '15px',
    },
    formRow: {
        display: 'flex',
        gap: '20px',
        justifyContent: 'space-between',
    },
    input: {
        display: 'block',
        width: '100%',
        padding: '10px',
        marginTop: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '12px 20px',
        backgroundColor: '#28a745', 
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '10px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
    },
    th: {
        backgroundColor: '#007BFF',
        color: 'white',
        padding: '12px 8px',
        textAlign: 'left',
        border: '1px solid #0056b3',
    },
    thRight: {
        
        backgroundColor: '#007BFF',
        color: 'white',
        padding: '12px 8px',
        textAlign: 'right',
        border: '1px solid #0056b3',
    },
    thCenter: {
      
        backgroundColor: '#007BFF',
        color: 'white',
        padding: '12px 8px',
        textAlign: 'center',
        border: '1px solid #0056b3',
    },
    td: {
        border: '1px solid #eee',
        padding: '10px 8px',
    },
    tdRight: {
        border: '1px solid #eee',
        padding: '10px 8px',
        textAlign: 'right',
    },
    tdCenter: {
        border: '1px solid #eee',
        padding: '10px 8px',
        textAlign: 'center',
    },
};