import React, { useState, useMemo, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Cliente {
  id_cliente?: number;
  nombre: string;
  rut: string;
  email: string;
}

interface Mascota {
  id_mascota: number;
  nombre: string;
  especie: string;
  raza: string;
  edad?: number;
  peso?: number;
}

interface Veterinario {
  nombre: string;
  especialidad: string;
}

interface Servicio {
  nombre: string;
  descripcion: string;
}

interface ReservaTratamiento {
  id_reserva: number;
  rut_cliente: string;
  fecha: string;
  hora: string;
  cliente?: Cliente;
  mascota?: Mascota;
  veterinario?: Veterinario;
  servicio?: Servicio;
}


const mockHistorial: ReservaTratamiento[] = [
    { 
        id_reserva: 101, 
        rut_cliente: '11.111.111-1', 
        fecha: '2025-11-01', 
        hora: '10:00:00',
        cliente: { nombre: 'Juan Perez', rut: '11.111.111-1', email: 'juan@mail.com' },
        mascota: { id_mascota: 1, nombre: 'Fido', especie: 'Perro', raza: 'Labrador', edad: 5, peso: 25 },
        servicio: { nombre: 'Consulta General', descripcion: 'Chequeo rutinario' },
        veterinario: { nombre: 'Dr. López', especialidad: 'General' },
    },
    { 
        id_reserva: 102, 
        rut_cliente: '22.222.222-2', 
        fecha: '2025-11-05', 
        hora: '15:30:00',
        cliente: { nombre: 'Ana Gómez', rut: '22.222.222-2', email: 'ana@mail.com' },
        mascota: { id_mascota: 2, nombre: 'Michi', especie: 'Gato', raza: 'Siamés', edad: 2, peso: 4 },
        servicio: { nombre: 'Vacunación Anual', descripcion: 'Vacuna triple felina' },
        veterinario: { nombre: 'Dra. Flores', especialidad: 'Felinos' },
    },
    { 
        id_reserva: 103, 
        rut_cliente: '11.111.111-1', 
        fecha: '2025-11-15', 
        hora: '11:00:00',
        cliente: { nombre: 'Juan Perez', rut: '11.111.111-1', email: 'juan@mail.com' },
        mascota: { id_mascota: 1, nombre: 'Fido', especie: 'Perro', raza: 'Labrador', edad: 5, peso: 25 },
        servicio: { nombre: 'Revisión Dental', descripcion: 'Limpieza y control' },
        veterinario: { nombre: 'Dr. López', especialidad: 'General' },
    },
    { 
        id_reserva: 104, 
        rut_cliente: '33.333.333-3', 
        fecha: '2025-12-01', 
        hora: '09:00:00',
        cliente: { nombre: 'Pedro Soto', rut: '33.333.333-3', email: 'pedro@mail.com' },
        mascota: { id_mascota: 3, nombre: 'Pipo', especie: 'Pájaro', raza: 'Canario', edad: 1, peso: 0.1 },
        servicio: { nombre: 'Consulta General', descripcion: 'Chequeo inicial' },
        veterinario: { nombre: 'Dra. Mora', especialidad: 'Exóticos' },
    },
    { 
        id_reserva: 105, 
        rut_cliente: '22.222.222-2', 
        fecha: '2025-12-05', 
        hora: '16:00:00',
        cliente: { nombre: 'Ana Gómez', rut: '22.222.222-2', email: 'ana@mail.com' },
        mascota: { id_mascota: 2, nombre: 'Michi', especie: 'Gato', raza: 'Siamés', edad: 2, peso: 4 },
        servicio: { nombre: 'Consulta General', descripcion: 'Control post vacuna' },
        veterinario: { nombre: 'Dra. Flores', especialidad: 'Felinos' },
    },
];


const generarReporte = (
    historial: ReservaTratamiento[],
    fechaInicio: string,
    fechaFin: string
): { tratamientosFiltrados: ReservaTratamiento[], numeroTratamientos: number, servicioMasComun: string | null } => {
    
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    const tratamientosFiltrados = historial.filter(t => {
        const fechaTratamiento = new Date(t.fecha);
        
        const fechaFinIncluida = new Date(fin);
        fechaFinIncluida.setDate(fechaFinIncluida.getDate() + 1);

        return fechaTratamiento >= inicio && fechaTratamiento < fechaFinIncluida; 
    });

    const frecuenciaMap = new Map<string, number>();
    tratamientosFiltrados.forEach(t => {
        const descripcion = t.servicio?.nombre || 'Servicio Desconocido';
        frecuenciaMap.set(descripcion, (frecuenciaMap.get(descripcion) || 0) + 1);
    });

    let servicioMasComun: string | null = null;
    let maxFrecuencia = 0;

    frecuenciaMap.forEach((frecuencia, descripcion) => {
        if (frecuencia > maxFrecuencia) {
            maxFrecuencia = frecuencia;
            servicioMasComun = `${descripcion} (${frecuencia} veces)`;
        }
    });

    return { 
        tratamientosFiltrados, 
        numeroTratamientos: tratamientosFiltrados.length,
        servicioMasComun,
    };
};


export const ReportesVeterinaria: React.FC = () => {
    
    const [fechaInicio, setFechaInicio] = useState<string>('2025-11-01');
    const [fechaFin, setFechaFin] = useState<string>('2025-12-31');
    
    const reporteRef = useRef<HTMLDivElement>(null);

    const { tratamientosFiltrados, numeroTratamientos, servicioMasComun } = useMemo(() => {
        return generarReporte(mockHistorial, fechaInicio, fechaFin);
    }, [fechaInicio, fechaFin]);

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
            
        
            pdf.save(`Reporte_Historial_${fechaInicio}_a_${fechaFin}.pdf`);
        }
    };
    
    return (
        <div style={styles.container}>
            <h1> 📋 Generador de Reportes de Historial</h1>

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
                <button onClick={handleGeneratePDF} style={styles.pdfButton}>
                    Generar PDF
                </button>
            </div>

            <hr style={styles.hr} />

            <div ref={reporteRef} style={{ padding: '10px', backgroundColor: '#fff' }}>
                
                <h2 style={{ color: '#007BFF' }}> Resumen de Visitas del Período ({fechaInicio} al {fechaFin}) </h2>
                
                <div style={styles.metricasGrid}>
                    <div style={styles.metricaCard}>
                        <p style={styles.cardTitle}> Total de Visitas Registradas</p>
                        <p style={styles.cardValue}>{numeroTratamientos}</p>
                    </div>
                    
                    <div style={styles.metricaCard}>
                        <p style={styles.cardTitle}>Servicio Más Común</p>
                        <p style={styles.cardValue}>
                            {servicioMasComun || 'N/A'}
                        </p>
                    </div>
                    
                    <div style={{...styles.metricaCard, borderLeft: '5px solid #ccc', backgroundColor: '#f9f9f9' }}>
                         <p style={styles.cardTitle}> Tipo de Reporte</p>
                         <p style={styles.cardValue}> Historial (Sin costos)</p>
                    </div>
                </div>

                <hr style={styles.hr} />

                <h2 style={{ color: '#007BFF' }}> Detalle de Visitas (Historial)</h2>
                
                {tratamientosFiltrados.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888' }}>No se encontraron visitas completadas en el rango de fechas seleccionado.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID Reserva</th>
                                <th style={styles.th}>Fecha</th>
                                <th style={styles.th}>Cliente (RUT)</th>
                                <th style={styles.th}>Mascota</th>
                                <th style={styles.th}>Veterinario</th>
                                <th style={styles.th}>Servicio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tratamientosFiltrados.map((t) => (
                                <tr key={t.id_reserva}>
                                    <td style={styles.td}>{t.id_reserva}</td>
                                    <td style={styles.td}>{t.fecha}</td>
                                    <td style={styles.td}>{t.cliente?.nombre} ({t.rut_cliente})</td>
                                    <td style={styles.td}>
                                        <strong>{t.mascota?.nombre}</strong>
                                        <br/>
                                        <small className="text-muted">{t.mascota?.especie} ({t.mascota?.raza})</small>
                                    </td>
                                    <td style={styles.td}>{t.veterinario?.nombre}</td>
                                    <td style={styles.td}>
                                        <strong>{t.servicio?.nombre}</strong>
                                        <br/>
                                        <small className="text-muted">{t.servicio?.descripcion}</small>
                                    </td>
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