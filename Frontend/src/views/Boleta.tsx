import React from 'react';

interface ItemBoleta {
  id: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
}


interface Boleta {
  id: string;
  fechaEmision: string;
  cliente: string;
  paciente: string;
  items: ItemBoleta[];
  subtotal: number;
  impuestoTasa: number; 
  total: number;
}



const itemsEjemplo: ItemBoleta[] = [
  { id: 101, descripcion: 'Consulta General', cantidad: 1, precioUnitario: 35.00 },
  { id: 102, descripcion: 'Vacuna Séxtuple', cantidad: 1, precioUnitario: 45.00 },
  { id: 103, descripcion: 'Alimento Premium (Kg)', cantidad: 5, precioUnitario: 8.50 },
];



/**
 * Calcula el subtotal, impuesto y total de una lista de ítems.
 * @param items Lista de ItemsBoleta.
 * @param tasaImpuesto Tasa de impuesto (e.g., 0.19).
 * @returns Un objeto con subtotal, impuesto calculado y total.
 */
const calcularTotales = (items: ItemBoleta[], tasaImpuesto: number) => {
  const subtotal = items.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);
  const impuesto = subtotal * tasaImpuesto;
  const total = subtotal + impuesto;
  
  return { subtotal, impuesto, total };
};


const totalesCalculados = calcularTotales(itemsEjemplo, 0.19); 
const boletaEjemplo: Boleta = {
    id: 'VET-2025-0045',
    fechaEmision: new Date().toLocaleDateString('es-CL'),
    cliente: 'Sra. Andrea Rojas Pérez (RUT: 18.XXX.XXX-X)',
    paciente: 'Max (Perro, Labrador)',
    items: itemsEjemplo,
    subtotal: totalesCalculados.subtotal,
    impuestoTasa: 0.19,
    total: totalesCalculados.total,
};




export const BoletaVeterinaria: React.FC = () => {
  const boleta = boletaEjemplo; 

 
  const formatCurrency = (amount: number): string => {
    
    return new Intl.NumberFormat('es-CL', { 
        style: 'currency', 
        currency: 'CLP', 
        minimumFractionDigits: 2 
    }).format(amount);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>VETERINARIA "LA MASCOTA FELIZ"</h1>
        <p style={styles.address}>Av. Central #123, Ciudad, País | Tel: (555) 123-4567</p>
      </header>
      
      <hr style={{ border: '1px solid #ddd', margin: '15px 0' }}/>

      <section style={styles.infoSection}>
        <div style={styles.infoBlock}>
          <strong>NÚMERO DE BOLETA:</strong> {boleta.id}
        </div>
        <div style={styles.infoBlock}>
          <strong>FECHA DE EMISIÓN:</strong> {boleta.fechaEmision}
        </div>
        <div style={styles.infoBlock}>
          <strong>CLIENTE:</strong> {boleta.cliente}
        </div>
        <div style={styles.infoBlock}>
          <strong>PACIENTE:</strong> {boleta.paciente}
        </div>
      </section>

      <section style={styles.itemsSection}>
        <h2>Detalle de Servicios y Productos</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: '50%' }}>Descripción</th>
              <th style={styles.th}>Cantidad</th>
              <th style={styles.th}>Precio Unitario</th>
              <th style={styles.th}>Total</th>
            </tr>
          </thead>
          <tbody>
            {boleta.items.map(item => (
              <tr key={item.id}>
                <td style={styles.td}>{item.descripcion}</td>
                <td style={styles.tdCenter}>{item.cantidad}</td>
                <td style={styles.tdRight}>{formatCurrency(item.precioUnitario)}</td>
                <td style={styles.tdRight}>{formatCurrency(item.cantidad * item.precioUnitario)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={styles.summarySection}>
        <div style={styles.summaryRow}>
          <span>Subtotal Neto:</span>
          <span>{formatCurrency(boleta.subtotal)}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Impuesto ({(boleta.impuestoTasa * 100).toFixed(0)}%):</span>
          <span>{formatCurrency(boleta.total - boleta.subtotal)}</span>
        </div>
        <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
          <strong>TOTAL A PAGAR:</strong>
          <strong>{formatCurrency(boleta.total)}</strong>
        </div>
      </section>
      
      <footer style={styles.footer}>
        <p>Gracias por confiar en nuestros servicios. ¡Vuelve pronto!</p>
      </footer>
    </div>
  );
};



const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '30px auto',
    padding: '20px',
    border: '2px solid #333',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '10px',
  },
  title: {
    color: '#007BFF', 
    margin: '0',
    fontSize: '24px',
  },
  address: {
    fontSize: '12px',
    color: '#666',
  },
  infoSection: {
    fontSize: '14px',
    marginBottom: '20px',
    borderBottom: '1px dotted #ccc',
    paddingBottom: '10px',
  },
  infoBlock: {
    marginBottom: '5px',
  },
  itemsSection: {
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    backgroundColor: '#f2f2f2',
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #eee',
    padding: '8px',
  },
  tdCenter: {
    border: '1px solid #eee',
    padding: '8px',
    textAlign: 'center',
  },
  tdRight: {
    border: '1px solid #eee',
    padding: '8px',
    textAlign: 'right',
  },
  summarySection: {
    width: '50%',
    marginLeft: 'auto',
    marginTop: '15px',
    borderTop: '2px solid #333',
    paddingTop: '10px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
    fontSize: '15px',
  },
  totalRow: {
    fontSize: '18px',
    color: '#D9534F', 
    borderTop: '1px dashed #666',
    paddingTop: '5px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    paddingTop: '10px',
    borderTop: '1px solid #ccc',
    fontSize: '12px',
    color: '#666',
  }
};