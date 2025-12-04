import React, { useState, useMemo, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



interface Tratamiento {
  id: string;
  pacienteId: number;
  descripcion: string;
  fechaInicio: string; 
  costo: number;
}

interface ReporteMetricas {
  ingresoTotal: number;
  numeroTratamientos: number;
  servicioMasComun: {
    descripcion: string;
    frecuencia: number;
  } | null;
}



const mockTratamientos: Tratamiento[] = [
  { id: 'T001', pacienteId: 1, descripcion: 'Consulta General', fechaInicio: '2025-11-01', costo: 35.00 },
  { id: 'T002', pacienteId: 2, descripcion: 'Vacunación Anual', fechaInicio: '2025-11-05', costo: 45.00 },
  { id: 'T003', pacienteId: 3, descripcion: 'Consulta General', fechaInicio: '2025-11-10', costo: 35.00 },
  { id: 'T004', pacienteId: 1, descripcion: 'Revisión Dental', fechaInicio: '2025-11-15', costo: 78.00 },
  { id: 'T005', pacienteId: 4, descripcion: 'Consulta General', fechaInicio: '2025-12-01', costo: 35.00 },
  { id: 'T006', pacienteId: 2, descripcion: 'Vacunación Anual', fechaInicio: '2025-12-05', costo: 45.00 },
  { id: 'T007', pacienteId: 5, descripcion: 'Cirugía Menor', fechaInicio: '2025-12-10', costo: 150.00 },
  { id: 'T008', pacienteId: 3, descripcion: 'Consulta General', fechaInicio: '2025-12-15', costo: 35.00 },
];



const generarReporte = (
  tratamientos: Tratamiento[],
  fechaInicio: string,
  fechaFin: string
): { tratamientosFiltrados: Tratamiento[], metricas: ReporteMetricas } => {
  
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  
  const tratamientosFiltrados = tratamientos.filter(t => {
    const fechaTratamiento = new Date(t.fechaInicio);
  
    const fechaFinIncluida = new Date(fin);
    fechaFinIncluida.setDate(fechaFinIncluida.getDate() + 1);

    return fechaTratamiento >= inicio && fechaTratamiento < fechaFinIncluida; 
  });


  const ingresoTotal = tratamientosFiltrados.reduce((acc, t) => acc + t.costo, 0);


  const frecuenciaMap = new Map<string, number>();
  tratamientosFiltrados.forEach(t => {
    const descripcion = t.descripcion;
    frecuenciaMap.set(descripcion, (frecuenciaMap.get(descripcion) || 0) + 1);
  });

  let servicioMasComun: ReporteMetricas['servicioMasComun'] = null;
  let maxFrecuencia = 0;

  frecuenciaMap.forEach((frecuencia, descripcion) => {
    if (frecuencia > maxFrecuencia) {
      maxFrecuencia = frecuencia;
      servicioMasComun = { descripcion, frecuencia };
    }
  });

  const metricas: ReporteMetricas = {
    ingresoTotal,
    numeroTratamientos: tratamientosFiltrados.length,
    servicioMasComun,
  };

  return { tratamientosFiltrados, metricas };
};




export const ReportesVeterinaria: React.FC = () => {
  
  const [fechaInicio, setFechaInicio] = useState<string>('2025-12-01');
  const [fechaFin, setFechaFin] = useState<string>('2025-12-31');
  
  
  const reporteRef = useRef<HTMLDivElement>(null);

  
  const { tratamientosFiltrados, metricas } = useMemo(() => {
    return generarReporte(mockTratamientos, fechaInicio, fechaFin);
  }, [fechaInicio, fechaFin]);


  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', { 
        style: 'currency', 
        currency: 'EUR', 
        minimumFractionDigits: 2 
    }).format(amount);
  };

 
  const handleGeneratePDF = async () => {
    const input = reporteRef.current;
    
    if (input) {
     
      const canvas = await html2canvas(input, {
        scale: 2, 
        logging: true,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); 
      const imgProps= pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

     
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
    
      pdf.save(`Reporte_Veterinaria_${fechaInicio}_a_${fechaFin}.pdf`);
    }
  };
  
  return (
    <div style={styles.container}>
      <h1> 🏥 Generador de Reportes Veterinarios</h1>

      {/* Controles y botón de PDF */}
      <div style={{ ...styles.filtroContainer, justifyContent: 'space-between' }}>
        <h3>Seleccionar Rango de Fechas</h3>
        <div>
          <label>
            Inicio:
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={styles.input}
            />
          </label>
          <label style={{ marginLeft: '15px' }}>
            Fin:
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={styles.input}
            />
          </label>
        </div>
        {/* Botón para generar el PDF */}
        <button onClick={handleGeneratePDF} style={styles.pdfButton}>
            ⬇️ Generar PDF
        </button>
      </div>

      <hr style={styles.hr} />

      {/* 3. El contenido del reporte se envuelve en el div referenciado */}
      <div ref={reporteRef} style={{ padding: '10px', backgroundColor: '#fff' }}>
        
        <h2 style={{ color: '#007BFF' }}>📊 Metricas del Período ({fechaInicio} al {fechaFin}) </h2>
        
        <div style={styles.metricasGrid}>
          <div style={styles.metricaCard}>
            <p style={styles.cardTitle}>💰 Ingreso Total</p>
            <p style={styles.cardValue}>{formatCurrency(metricas.ingresoTotal)}</p>
          </div>
          
          <div style={styles.metricaCard}>
            <p style={styles.cardTitle}># Tratamientos Registrados</p>
            <p style={styles.cardValue}>{metricas.numeroTratamientos}</p>
          </div>
          
          <div style={styles.metricaCard}>
            <p style={styles.cardTitle}>🏅 Servicio Más Común</p>
            <p style={styles.cardValue}>
              {metricas.servicioMasComun 
                ? `${metricas.servicioMasComun.descripcion} (${metricas.servicioMasComun.frecuencia} veces)` 
                : 'N/A'
              }
            </p>
          </div>
        </div>

        <hr style={styles.hr} />

        <h2 style={{ color: '#007BFF' }}>📋 Detalle de Tratamientos Filtrados</h2>
        
        {tratamientosFiltrados.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>No se encontraron tratamientos en el rango de fechas seleccionado.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Costo</th>
              </tr>
            </thead>
            <tbody>
              {tratamientosFiltrados.map((t) => (
                <tr key={t.id}>
                  <td style={styles.td}>{t.id}</td>
                  <td style={styles.td}>{t.fechaInicio}</td>
                  <td style={styles.td}>{t.descripcion}</td>
                  <td style={styles.tdRight}>{formatCurrency(t.costo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div> 
    </div>
  );
};



const styles: { [key: string]: React.CSSProperties } = {
    container: {
        fontFamily: 'Verdana, sans-serif',
        maxWidth: '900px',
        margin: '30px auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    filtroContainer: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #eee',
        marginBottom: '20px',
    },
    input: {
        padding: '8px',
        marginLeft: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    pdfButton: {
        padding: '10px 15px',
        backgroundColor: '#28a745', 
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px',
    },
    hr: {
        border: '0',
        borderTop: '1px solid #eee',
        margin: '25px 0',
    },
    metricasGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
    },
    metricaCard: {
        backgroundColor: '#E6F3FF', 
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        borderLeft: '5px solid #007BFF',
    },
    cardTitle: {
        margin: '0 0 10px 0',
        fontSize: '14px',
        color: '#333',
        fontWeight: 'bold',
    },
    cardValue: {
        margin: '0',
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#007BFF',
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
    td: {
        border: '1px solid #ddd',
        padding: '10px 8px',
    },
    tdRight: {
        border: '1px solid #ddd',
        padding: '10px 8px',
        textAlign: 'right',
        fontWeight: 'bold',
    },
};