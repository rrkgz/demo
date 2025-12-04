import React, { useState, useMemo, useRef } from 'react';



interface VentaReporte {
  id: string; 
  tipo: 'Tratamiento' | 'Boleta'; 
  descripcion: string; 
  fecha: string; 
  pacienteId?: number; 
  pacienteNombre?: string; 
  costo: number; 
}


interface ReporteMetricas {
  ingresoTotal: number;
  numeroTransacciones: number;
  servicioMasComun: {
    descripcion: string;
    frecuencia: number;
  } | null;
}


const mockVentas: VentaReporte[] = [
 
  { id: 'T001', tipo: 'Tratamiento', pacienteId: 1, descripcion: 'Consulta General', fecha: '2025-11-01', costo: 35.00, pacienteNombre: 'Max' },
  { id: 'T002', tipo: 'Tratamiento', pacienteId: 2, descripcion: 'Vacunación Anual', fecha: '2025-11-05', costo: 45.00, pacienteNombre: 'Bella' },
  { id: 'T003', tipo: 'Tratamiento', pacienteId: 3, descripcion: 'Consulta General', fecha: '2025-11-10', costo: 35.00, pacienteNombre: 'Rocky' },
  { id: 'T004', tipo: 'Tratamiento', pacienteId: 1, descripcion: 'Revisión Dental', fecha: '2025-11-15', costo: 78.00, pacienteNombre: 'Max' },
  { id: 'T005', tipo: 'Tratamiento', pacienteId: 4, descripcion: 'Consulta General', fecha: '2025-12-01', costo: 35.00, pacienteNombre: 'Luna' },
  { id: 'T006', tipo: 'Tratamiento', pacienteId: 2, descripcion: 'Vacunación Anual', fecha: '2025-12-05', costo: 45.00, pacienteNombre: 'Bella' },
  { id: 'T007', tipo: 'Tratamiento', pacienteId: 5, descripcion: 'Cirugía Menor', fecha: '2025-12-10', costo: 150.00, pacienteNombre: 'Duke' },
  { id: 'T008', tipo: 'Tratamiento', pacienteId: 3, descripcion: 'Consulta General', fecha: '2025-12-15', costo: 35.00, pacienteNombre: 'Rocky' },


  { id: 'B001', tipo: 'Boleta', descripcion: 'Vacuna Séxtuple', fecha: '2025-12-01', costo: 25.00 },
  { id: 'B002', tipo: 'Boleta', descripcion: 'Vacuna Antirrabica', fecha: '2025-12-03', costo: 18.00 },
  { id: 'B003', tipo: 'Boleta', descripcion: 'Baño Completo', fecha: '2025-12-03', costo: 8.50 },
  { id: 'B004', tipo: 'Boleta', descripcion: 'Vacuna Séxtuple', fecha: '2025-12-12', costo: 25.00 },
  { id: 'B005', tipo: 'Boleta', descripcion: 'Corte de Uñas', fecha: '2025-12-18', costo: 5.00 },
  { id: 'B006', tipo: 'Boleta', descripcion: 'Baño Completo', fecha: '2025-12-22', costo: 8.50 },
  { id: 'B007', tipo: 'Boleta', descripcion: 'Saco de Pienso Premium', fecha: '2025-12-24', costo: 45.00 },
];



const generarReporte = (
  ventas: VentaReporte[],
  fechaInicio: string,
  fechaFin: string
): { ventasFiltradas: VentaReporte[], metricas: ReporteMetricas } => {
  
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  
  const ventasFiltradas = ventas.filter(v => {
    const fechaVenta = new Date(v.fecha);
  
    
    const fechaFinIncluida = new Date(fin);
    fechaFinIncluida.setDate(fechaFinIncluida.getDate() + 1);

    return fechaVenta >= inicio && fechaVenta < fechaFinIncluida; 
  });

  const ingresoTotal = ventasFiltradas.reduce((acc, v) => acc + v.costo, 0);

  const frecuenciaMap = new Map<string, number>();
  ventasFiltradas.forEach(v => {
    const descripcion = v.descripcion;
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
    numeroTransacciones: ventasFiltradas.length,
    servicioMasComun,
  };

  return { ventasFiltradas, metricas };
};




export const App: React.FC = () => {
  
  const [fechaInicio, setFechaInicio] = useState<string>('2025-12-01');
  const [fechaFin, setFechaFin] = useState<string>('2025-12-31');
  
  const reporteRef = useRef<HTMLDivElement>(null);


  const { ventasFiltradas, metricas } = useMemo(() => {
    return generarReporte(mockVentas, fechaInicio, fechaFin);
  }, [fechaInicio, fechaFin]);

  
  const formatCurrency = (amount: number): string => {
  
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD', 
        minimumFractionDigits: 2 
    }).format(amount);
  };

  
  const handleGeneratePDF = async () => {
    const input = reporteRef.current;
    
    // @ts-ignore: Accedemos a html2canvas globalmente
    const html2canvasGlobal = window.html2canvas;
    // @ts-ignore: Accedemos a jsPDF globalmente
    const jsPDFGlobal = window.jsPDF;


    if (input && html2canvasGlobal && jsPDFGlobal) {
      try {
      
        const canvas = await html2canvasGlobal(input, {
          scale: 2, 
          logging: true,
          useCORS: true,
          allowTaint: true, 
          backgroundColor: '#f9fafb', 
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDFGlobal('p', 'mm', 'a4'); 
        const imgProps= pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

   
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
   
        pdf.save(`Reporte_Ingresos_Veterinaria_${fechaInicio}_a_${fechaFin}.pdf`);
      } catch (error) {
        console.error("Error al generar el PDF:", error);
     
        alert("Ocurrió un error al generar el PDF. Asegúrate de que las librerías jsPDF y html2canvas estén cargadas.");
      }
    } else {
        alert("Error: Las librerías para generar PDF no están disponibles o el contenido del reporte no se encontró.");
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
    
        <h1 className="sr-only">Reporte de Ingresos Veterinarios</h1>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-8">
        <header className="text-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            <i className="fas fa-chart-line mr-3"></i>
            Generador de Reportes de Ingresos
          </h1>
          <p className="text-gray-500">Métricas consolidadas de Tratamientos y Ventas TPV</p>
        </header>

        {/* Controles de Filtro y PDF */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h3 className="text-lg font-semibold text-indigo-800">Seleccionar Período</h3>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">
              Inicio:
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Fin:
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
              />
            </label>
          </div>
          <button 
            onClick={handleGeneratePDF} 
            className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition duration-200 flex items-center"
          >
            <i className="fas fa-file-pdf mr-2"></i>
            Generar PDF
          </button>
        </div>

        {/* 3. Contenido del Reporte (Envuelto para PDF) */}
        <div ref={reporteRef} className="p-4 md:p-6 bg-white">
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4 border-t border-gray-200">
            📊 Metricas del Período ({fechaInicio} al {fechaFin})
          </h2>
          
          {/* Grid de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 shadow-md">
              <p className="text-sm text-gray-600 font-semibold">💰 Ingreso Total</p>
              <p className="text-3xl font-extrabold text-blue-700 mt-1">{formatCurrency(metricas.ingresoTotal)}</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 shadow-md">
              <p className="text-sm text-gray-600 font-semibold"># Transacciones</p>
              <p className="text-3xl font-extrabold text-yellow-700 mt-1">{metricas.numeroTransacciones}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 shadow-md">
              <p className="text-sm text-gray-600 font-semibold">🏅 Servicio Más Común</p>
              <p className="text-xl font-bold text-green-700 mt-1 truncate">
                {metricas.servicioMasComun 
                  ? `${metricas.servicioMasComun.descripcion} (${metricas.servicioMasComun.frecuencia} veces)` 
                  : 'N/A'
                }
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4 border-t border-gray-200">
            📋 Detalle de Ingresos (Tratamientos y Boletas)
          </h2>
          
          {ventasFiltradas.length === 0 ? (
            <p className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg">
              No se encontraron ingresos en el rango de fechas seleccionado.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Paciente</th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Monto</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ventasFiltradas.map((venta) => (
                    <tr key={venta.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{venta.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${venta.tipo === 'Tratamiento' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                          {venta.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venta.fecha}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venta.descripcion}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {venta.pacienteNombre || 'Venta TPV'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-800">
                        {formatCurrency(venta.costo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div> 
      </div>
    </div>
  );
};

export default App;