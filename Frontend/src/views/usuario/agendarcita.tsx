import React, { useState, useMemo, useCallback, type FormEvent } from 'react';



interface Doctor {
    id: number;
    nombre: string;
    especialidad: string;
}

interface Servicio {
    id: number;
    nombre: string;
    costo: number;
}

interface Cliente {
    id: string;
    nombre: string;
    telefono: string;
}

interface Mascota {
    id: string;
    nombre: string;
    clienteId: string;
}

interface Cita {
    id: string;
    fecha: string;
    hora: string;
    nombreDoc: string;
    especialidadDoc: string;
    diaSemana: string;
    vetId: number;
   
    mascotaId: string;
    clienteId: string;
    serviciosAsociados: Servicio[];
    estado: 'Reservada' | 'Cancelada' | 'Completada'; 
}

interface MensajeEstado {
    texto: string;
    tipo: 'ok' | 'error';
}



const DOCTORES: Doctor[] = [
    { id: 1, nombre: "Dr. Elena Rojas", especialidad: "Medicina Preventiva" },
    { id: 2, nombre: "Dr. Camilo Soto", especialidad: "Cirugía Ortopédica" },
    { id: 3, nombre: "Dra. Sofía Mora", especialidad: "Dermatología" },
    { id: 4, nombre: "Dr. Marcos Díaz", especialidad: "Odontología" }
];

const RAN_HORARIOS: string[] = [
    "09:00", "10:00", "11:00", "12:00",
    "14:30", "15:30", "16:30", "17:30", "18:30"
];

const DIAS_SEMANA: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const SERVICIOS_MOCK: Servicio[] = [
    { id: 101, nombre: 'Consulta General (40€)', costo: 40 },
    { id: 102, nombre: 'Vacunación Anual (30€)', costo: 30 },
    { id: 103, nombre: 'Cirugía Menor (200€)', costo: 200 },
    { id: 104, nombre: 'Estudios de Imagen (60€)', costo: 60 },
];

const CLIENTES_MOCK_INICIAL: Cliente[] = [
    { id: 'c1', nombre: 'Juan Pérez', telefono: '555-1001' },
    { id: 'c2', nombre: 'María González', telefono: '555-1002' },
];

const MASCOTAS_MOCK_INICIAL: Mascota[] = [
    { id: 'm1', nombre: 'Fido (Perro)', clienteId: 'c1' },
    { id: 'm2', nombre: 'Pelusa (Gato)', clienteId: 'c1' },
    { id: 'm3', nombre: 'Rocky (Perro)', clienteId: 'c2' },
];



const obtenerFechaHoy = (): string => {
    return new Date().toISOString().split('T')[0];
};

const obtenerNombreDia = (fechaString: string): string => {
    const fecha = new Date(fechaString + 'T00:00:00');
    const indiceDia = fecha.getDay();
    return DIAS_SEMANA[(indiceDia + 6) % 7];
};



export default function TableroCitasVET() {

    
    const [clientes, setClientes] = useState<Cliente[]>(CLIENTES_MOCK_INICIAL);
    const [mascotas, setMascotas] = useState<Mascota[]>(MASCOTAS_MOCK_INICIAL);
    const [citasReservadas, setCitasReservadas] = useState<Cita[]>([]);
    const [estadoMensaje, setEstadoMensaje] = useState<MensajeEstado | null>(null);

    const [mascotaSeleccionadaId, setMascotaSeleccionadaId] = useState<string>(MASCOTAS_MOCK_INICIAL[0].id);
    const [fechaCita, setFechaCita] = useState<string>(obtenerFechaHoy());
    const [horaCita, setHoraCita] = useState<string>(RAN_HORARIOS[0]);
    const [docId, setDocId] = useState<number>(DOCTORES[0].id);
    const [serviciosSeleccionadosIds, setServiciosSeleccionadosIds] = useState<number[]>([]);

    const [editingCitaId, setEditingCitaId] = useState<string | null>(null);
    const [filtroTexto, setFiltroTexto] = useState<string>('');
    const [showManagementPanel, setShowManagementPanel] = useState<boolean>(false);


    const mostrarMensaje = useCallback((texto: string, tipo: 'ok' | 'error') => {
        setEstadoMensaje({ texto, tipo });
        const timer = setTimeout(() => {
            setEstadoMensaje(null);
        }, 3500);
        return () => clearTimeout(timer);
    }, []);


   
    const eliminarMascota = (id: string) => {
        const tieneCitas = citasReservadas.some(cita => cita.mascotaId === id && cita.estado !== 'Cancelada');
        if (tieneCitas) {
            mostrarMensaje("ERROR: No se puede eliminar esta Mascota. Tiene Citas 'Reservadas' o 'Completadas' asociadas.", 'error');
            return;
        }
        setMascotas(prev => prev.filter(m => m.id !== id));
        mostrarMensaje("Mascota eliminada correctamente.", 'ok');
    };

    const eliminarCliente = (id: string) => {
        const tieneMascotas = mascotas.some(mascota => mascota.clienteId === id);
        if (tieneMascotas) {
            mostrarMensaje("ERROR: No se puede eliminar este Cliente. Tiene Mascotas asociadas.", 'error');
            return;
        }
        setClientes(prev => prev.filter(c => c.id !== id));
        mostrarMensaje("Cliente eliminado correctamente.", 'ok');
    };


   
    const manejarAgendamiento = (e: FormEvent) => {
        e.preventDefault();

        const mascota = mascotas.find(m => m.id === mascotaSeleccionadaId);
        const vetIdSeleccionado = docId;

        if (!fechaCita || !horaCita || !vetIdSeleccionado || !mascota) {
            mostrarMensaje("Faltan datos clave: ¡Revisa la Mascota, Fecha, Hora y Veterinario!", 'error');
            return;
        }

        const doctor = DOCTORES.find(v => v.id === vetIdSeleccionado);
        if (!doctor) {
            mostrarMensaje("Error interno: Veterinario no encontrado.", 'error');
            return;
        }

       
        const tieneConflicto = citasReservadas.some(
            (cita) => cita.fecha === fechaCita &&
                       cita.hora === horaCita &&
                       cita.vetId === vetIdSeleccionado &&
                       cita.estado === 'Reservada'
        );

        if (tieneConflicto) {
            mostrarMensaje(`¡ATENCIÓN! El ${doctor.nombre} ya está reservado a esa hora. Prueba otra hora.`, 'error');
            return;
        }

        const serviciosDetalle = SERVICIOS_MOCK.filter(s => serviciosSeleccionadosIds.includes(s.id));

        const nuevaCita: Cita = {
            id: crypto.randomUUID(),
            fecha: fechaCita,
            hora: horaCita,
            nombreDoc: doctor.nombre,
            especialidadDoc: doctor.especialidad,
            diaSemana: obtenerNombreDia(fechaCita),
            vetId: vetIdSeleccionado,
            mascotaId: mascota.id,
            clienteId: mascota.clienteId,
            serviciosAsociados: serviciosDetalle,
            estado: 'Reservada'
        };

        const citasActualizadas = [...citasReservadas, nuevaCita];
        citasActualizadas.sort((a, b) => new Date(`${a.fecha}T${a.hora}:00`).getTime() - new Date(`${b.fecha}T${b.hora}:00`).getTime());

        setCitasReservadas(citasActualizadas);
       
        setServiciosSeleccionadosIds([]);

        mostrarMensaje(`¡Cita OK! ${mascota.nombre} con ${doctor.nombre.split(' ')[1]} agendado. Servicios: ${serviciosDetalle.map(s => s.nombre.split(' ')[0]).join(', ')}.`, 'ok');
    };


   
    const citaEnEdicion = useMemo(() => citasReservadas.find(c => c.id === editingCitaId), [editingCitaId, citasReservadas]);

    const abrirModalEdicion = (cita: Cita) => {
        setEditingCitaId(cita.id);
  
        setFechaCita(cita.fecha);
        setHoraCita(cita.hora);
        setDocId(cita.vetId);
        setMascotaSeleccionadaId(cita.mascotaId);
        setServiciosSeleccionadosIds(cita.serviciosAsociados.map(s => s.id));
    };

    const manejarActualizacion = (e: FormEvent) => {
        e.preventDefault();
        if (!editingCitaId || !citaEnEdicion) return;

        const doctor = DOCTORES.find(v => v.id === docId);
        const mascota = mascotas.find(m => m.id === mascotaSeleccionadaId);

        if (!doctor || !mascota) {
            mostrarMensaje("Error: Doctor o Mascota no encontrados durante la actualización.", 'error');
            return;
        }
        
        
        const tieneConflicto = citasReservadas.some(
            (cita) => cita.id !== editingCitaId &&
                       cita.fecha === fechaCita &&
                       cita.hora === horaCita &&
                       cita.vetId === docId &&
                       cita.estado === 'Reservada'
        );

        if (tieneConflicto) {
            mostrarMensaje(`¡ATENCIÓN! El ${doctor.nombre} ya está reservado en ese nuevo horario.`, 'error');
            return;
        }

        const serviciosDetalle = SERVICIOS_MOCK.filter(s => serviciosSeleccionadosIds.includes(s.id));

        const citaActualizada: Cita = {
            ...citaEnEdicion,
            fecha: fechaCita,
            hora: horaCita,
            vetId: docId,
            nombreDoc: doctor.nombre,
            especialidadDoc: doctor.especialidad,
            diaSemana: obtenerNombreDia(fechaCita),
            mascotaId: mascota.id,
            clienteId: mascota.clienteId,
            serviciosAsociados: serviciosDetalle,
        };

        setCitasReservadas(prev => prev.map(c => c.id === editingCitaId ? citaActualizada : c));
        setEditingCitaId(null);
        mostrarMensaje("Cita modificada con éxito.", 'ok');
    };

    const manejarCancelacion = () => {
        if (!editingCitaId || !citaEnEdicion) return;

        const citaCancelada: Cita = {
            ...citaEnEdicion,
            estado: 'Cancelada',
            serviciosAsociados: [], 
        };

        setCitasReservadas(prev => prev.map(c => c.id === editingCitaId ? citaCancelada : c));
        setEditingCitaId(null);
        mostrarMensaje("Cita cancelada con éxito.", 'ok');
    };

    const cerrarModalEdicion = () => {
        setEditingCitaId(null);
  
    };


    
    const citasFiltradas = useMemo(() => {
        if (!filtroTexto.trim()) {
            return citasReservadas;
        }
        const textoBusqueda = filtroTexto.toLowerCase().trim();

        return citasReservadas.filter(cita => {
       
            const mascota = mascotas.find(m => m.id === cita.mascotaId);
            if (mascota && mascota.nombre.toLowerCase().includes(textoBusqueda)) {
                return true;
            }
           
            const cliente = clientes.find(c => c.id === cita.clienteId);
            if (cliente && cliente.nombre.toLowerCase().includes(textoBusqueda)) {
                return true;
            }
            return false;
        });
    }, [citasReservadas, filtroTexto, mascotas, clientes]);


   
    const citasPorSlot = useMemo(() => {
        const cuadrilla: Record<string, Record<string, Cita[]>> = {};

        DIAS_SEMANA.forEach(d => {
            cuadrilla[d] = {};
            RAN_HORARIOS.forEach(h => {
                cuadrilla[d][h] = [];
            });
        });

        citasReservadas.forEach(c => {
            
            if (c.estado === 'Reservada') {
                const nombreDia = obtenerNombreDia(c.fecha);
                if (cuadrilla[nombreDia] && cuadrilla[nombreDia][c.hora]) {
                    cuadrilla[nombreDia][c.hora].push(c);
                }
            }
        });
        return cuadrilla;
    }, [citasReservadas]);




    const RenderizarBloqueMensaje = () => {
 
        if (!estadoMensaje) return null;

        const iconoSVG = estadoMensaje.tipo === 'ok' ? 
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> : 
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;

        const clasesTipo = estadoMensaje.tipo === 'ok' ? 
            'bg-green-50 text-green-800 border-green-500' : 
            'bg-red-50 text-red-800 border-red-500';

        return (
            <div role="alert" className={`p-4 rounded-lg flex items-center mb-6 shadow-md border-l-4 ${clasesTipo}`}>
                {iconoSVG}
                <p className="font-medium">{estadoMensaje.texto}</p>
            </div>
        );
    };

    const RenderizarSlotCita = ({ cita }: { cita: Cita }) => {
        const mascota = mascotas.find(m => m.id === cita.mascotaId);
        const servicios = cita.serviciosAsociados.map(s => s.nombre.split(' ')[0]).join(', ');
        const estadoClase = cita.estado === 'Cancelada' ? 'cita-cancelada' : 'cita-bloque-manual';
        const tituloCompleto = `[${cita.estado}] ${mascota?.nombre || 'N/A'} | Dr. ${cita.nombreDoc} | Servicios: ${servicios}`;

        return (
            <div 
                className={estadoClase} 
                title={tituloCompleto}
                onClick={() => abrirModalEdicion(cita)}
            >
                <p className="pet-info-name">
                    <span className="icon-patita">{cita.estado === 'Reservada' ? '❤️' : (cita.estado === 'Cancelada' ? '💔' : '✅')}</span> 
                    {mascota?.nombre.split('(')[0].trim() || 'N/A'}
                </p>
                <p className="vet-data">
                    Dr(a). {cita.nombreDoc.split(' ')[1]} ({cita.especialidadDoc.substring(0, 3)}.)
                </p>
            </div>
        );
    };

    const RenderizarCuadriculaHorario = () => {
        return (
            <div className="schedule-grid-manual">
         
                <div className="grid-cell header-cell">Tiempo</div>
                {DIAS_SEMANA.map(dia => (
                    <div key={dia} className="grid-cell header-cell">{dia}</div>
                ))}
                
              
                {RAN_HORARIOS.map(hora => (
                    <React.Fragment key={hora}>
                        <div className="grid-cell time-label-cell">{hora}</div> 
                        {DIAS_SEMANA.map(dia => {
                            const citasEnSlot = citasPorSlot[dia]?.[hora] || [];
                            return (
                                <div key={`${dia}-${hora}`} className="grid-cell">
                                    {citasEnSlot.map(cita => (
                                        <RenderizarSlotCita key={cita.id} cita={cita} />
                                    ))}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const RenderizarModalEdicion = () => {
        if (!editingCitaId || !citaEnEdicion) return null;
        const mascota = mascotas.find(m => m.id === citaEnEdicion.mascotaId);
        const cliente = clientes.find(c => c.id === citaEnEdicion.clienteId);
        const costoTotal = citaEnEdicion.serviciosAsociados.reduce((sum, s) => sum + s.costo, 0);

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-3xl w-full max-w-lg transform scale-100 transition-all">
                    <h3 className="text-2xl font-bold text-[var(--color-secondary)] mb-4 border-b pb-2 flex justify-between items-center">
                        Editar Cita ID: <span className="text-base text-gray-500 font-normal">{editingCitaId.substring(0, 8)}...</span>
                    </h3>
                    <p className="text-lg font-semibold mb-4 text-gray-700">
                        Paciente: {mascota?.nombre} (Dueño: {cliente?.nombre})
                        {citaEnEdicion.estado === 'Cancelada' && <span className="ml-4 text-red-500 font-bold">CANCELADA</span>}
                    </p>

                    <form onSubmit={manejarActualizacion} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Nueva Fecha</label>
                                <input
                                    type="date"
                                    value={fechaCita}
                                    onChange={(e) => setFechaCita(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Nueva Hora</label>
                                <select
                                    value={horaCita}
                                    onChange={(e) => setHoraCita(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg bg-white appearance-none"
                                >
                                    {RAN_HORARIOS.map(time => <option key={time} value={time}>{time}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Nuevo Veterinario</label>
                            <select
                                value={docId}
                                onChange={(e) => setDocId(parseInt(e.target.value))}
                                className="w-full p-2 border border-gray-300 bg-white rounded-lg appearance-none"
                            >
                                {DOCTORES.map(vet => (
                                    <option key={vet.id} value={vet.id}>
                                        {vet.nombre} ({vet.especialidad})
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Servicios (Costo Total: {costoTotal}€)</label>
                            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg bg-gray-50">
                                {SERVICIOS_MOCK.map(servicio => (
                                    <label key={servicio.id} className="flex items-center text-sm">
                                        <input
                                            type="checkbox"
                                            value={servicio.id}
                                            checked={serviciosSeleccionadosIds.includes(servicio.id)}
                                            onChange={(e) => {
                                                const id = parseInt(e.target.value);
                                                setServiciosSeleccionadosIds(prev => 
                                                    e.target.checked ? [...prev, id] : prev.filter(sId => sId !== id)
                                                );
                                            }}
                                            className="mr-2 text-[var(--color-primary)] rounded"
                                            disabled={citaEnEdicion.estado === 'Cancelada'}
                                        />
                                        {servicio.nombre}
                                    </label>
                                ))}
                            </div>
                        </div>
                        

                        <div className="flex justify-between space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={manejarCancelacion}
                                className="w-1/3 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition duration-150 font-semibold"
                                disabled={citaEnEdicion.estado === 'Cancelada'}
                            >
                                Anular Cita
                            </button>
                            <button
                                type="submit"
                                className="w-2/3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-150 disabled:bg-gray-400"
                                disabled={citaEnEdicion.estado === 'Cancelada'}
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>

                    <button
                        onClick={cerrarModalEdicion}
                        className="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-150"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        );
    };

    const RenderizarListaCitasFiltradas = () => {
        return (
            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                    Reservas Filtradas ({citasFiltradas.length})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto p-2 border rounded-xl bg-gray-50 shadow-inner">
                    {citasFiltradas.length > 0 ? (
                        citasFiltradas.map(cita => {
                            const mascota = mascotas.find(m => m.id === cita.mascotaId);
                            const cliente = clientes.find(c => c.id === cita.clienteId);
                            const estadoClase = cita.estado === 'Cancelada' ? 'text-red-500 border-red-300' : 'text-[var(--color-secondary)] border-green-300';
                            const serviciosLista = cita.serviciosAsociados.map(s => s.nombre.split(' ')[0]).join(', ') || 'Ninguno';
                            
                            return (
                                <div 
                                    key={cita.id} 
                                    className={`bg-white p-4 rounded-lg shadow border-l-4 ${estadoClase} cursor-pointer hover:bg-gray-100 transition`}
                                    onClick={() => abrirModalEdicion(cita)}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="text-base font-bold">{cita.fecha} a las {cita.hora} <span className="text-xs font-normal">({cita.estado})</span></p>
                                        <p className="text-sm font-semibold">{cita.nombreDoc}</p>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1">
                                        <span className="font-bold">Mascota:</span> {mascota?.nombre || 'N/A'} | 
                                        <span className="font-bold ml-2">Cliente:</span> {cliente?.nombre || 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-500">Servicios: {serviciosLista}</p>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center py-4 text-gray-500">No se encontraron citas que coincidan con el filtro.</p>
                    )}
                </div>
            </div>
        );
    }
    
    

    const styles = `
        :root {
            --color-primary: #15b79d;
            --color-secondary: #0e7490;
            --bg-page: #f9f9fb;
            --font-main: 'Inter', sans-serif;
        }
        
        body { 
            font-family: var(--font-main); 
            background-color: var(--bg-page);
        }
        
        .grid-agenda-wrapper {
            overflow-x: auto;
            width: 100%;
        }

        .schedule-grid-manual {
            display: grid;
            grid-template-columns: 80px repeat(7, minmax(120px, 1fr)); 
            border: 1px solid #d1d5db;
            border-radius: 0.75rem;
            overflow: hidden;
            min-width: 960px;
        }

        .grid-cell {
            padding: 0.5rem;
            border: 1px solid #e5e7eb;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
            text-align: center;
            font-size: 0.875rem;
            background-color: #fff;
            min-height: 55px;
        }
        
        .header-cell {
            background-color: #f0fdf4;
            font-weight: 700;
            color: var(--color-secondary); 
            text-transform: uppercase;
        }

        .time-label-cell {
            background-color: #f7f9fc;
            font-weight: 600;
            color: #4b5563;
        }

        .cita-bloque-manual, .cita-cancelada {
            border-radius: 0.375rem;
            padding: 0.3rem 0.5rem;
            font-size: 0.75rem; 
            font-weight: 600;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            overflow: hidden;
            line-height: 1.2;
            text-align: left;
            margin-bottom: 4px;
        }
        
        .cita-bloque-manual {
            background-color: rgba(21, 183, 157, 0.15);
            border-left: 4px solid var(--color-primary); 
            color: #065f46;
        }

        .cita-cancelada {
            background-color: #fef2f2; /* red-50 */
            border-left: 4px solid #f87171; /* red-400 */
            color: #b91c1c; /* red-700 */
            opacity: 0.6;
            text-decoration: line-through;
            cursor: default;
        }

        .cita-bloque-manual:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(21, 183, 157, 0.4); 
        }
        
        .cita-bloque-manual .pet-info-name, .cita-cancelada .pet-info-name {
            font-size: 0.85rem;
            font-weight: 800;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            color: var(--color-secondary);
        }
        
        .cita-cancelada .pet-info-name {
             color: #993333;
        }

        .cita-bloque-manual .vet-data, .cita-cancelada .vet-data {
            font-size: 0.68rem;
            color: #047857;
            font-weight: 500;
            opacity: 0.9;
        }
        
        .cita-cancelada .vet-data {
            color: #b91c1c;
        }

        .icon-patita {
            display: inline-block;
            margin-right: 4px;
        }

        /* Estilos del Panel de Gestión */
        .management-panel-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        .entity-list {
            max-height: 250px;
            overflow-y: auto;
        }
    `;
    return (
        <>
            
            <style>{styles}</style>
            <div id="app-container" className="min-h-screen p-4 sm:p-8">
                <div className="max-w-6xl mx-auto"> 
                    <header className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-[var(--color-secondary)]">
                            <span style={{ color: 'var(--color-secondary)' }}>🐾</span> Tablero de Citas PetCare <span style={{ color: 'var(--color-secondary)' }}>🐾</span>
                        </h1>
                        <p className="text-lg text-gray-500 mt-2">Gestión Modular de Horarios, Servicios y Referencias</p>
                    </header>

                    <RenderizarBloqueMensaje />

                    
             
                    <section className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl mb-10 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b-2 pb-2 border-[var(--color-primary)]/50">1. Registrar Nueva Visita y Servicios</h2>
                        
                        <form onSubmit={manejarAgendamiento} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                            
                       
                            <div className="md:col-span-1">
                                <label htmlFor="mascota-id" className="block text-sm font-medium text-gray-600 mb-2">🐶 Paciente / Dueño</label>
                                <select
                                    id="mascota-id"
                                    value={mascotaSeleccionadaId}
                                    onChange={(e) => setMascotaSeleccionadaId(e.target.value)}
                                    className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] appearance-none"
                                    required
                                >
                                    {mascotas.map(m => {
                                        const cliente = clientes.find(c => c.id === m.clienteId);
                                        return (
                                            <option key={m.id} value={m.id}>
                                                {m.nombre} (Dueño: {cliente?.nombre.split(' ')[0]})
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                           
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="fecha-cita" className="block text-sm font-medium text-gray-600 mb-2">🗓️ Fecha</label>
                                    <input
                                        id="fecha-cita"
                                        type="date"
                                        min={obtenerFechaHoy()}
                                        value={fechaCita}
                                        onChange={(e) => setFechaCita(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="hora-cita" className="block text-sm font-medium text-gray-600 mb-2">⏱️ Hora</label>
                                    <select
                                        id="hora-cita"
                                        value={horaCita}
                                        onChange={(e) => setHoraCita(e.target.value)}
                                        className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] appearance-none"
                                        required
                                    >
                                        {RAN_HORARIOS.map(time => <option key={time} value={time}>{time}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="md:col-span-1">
                                <label htmlFor="doc-id" className="block text-sm font-medium text-gray-600 mb-2">👨‍⚕️ Veterinario Asignado</label>
                                <select
                                    id="doc-id"
                                    value={docId}
                                    onChange={(e) => setDocId(parseInt(e.target.value))}
                                    className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] appearance-none"
                                    required
                                >
                                    {DOCTORES.map(vet => (
                                        <option key={vet.id} value={vet.id}>
                                            {vet.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                        
                            <div className="md:col-span-1 flex items-end">
                                <button
                                    type="submit"
                                    className="w-full bg-[var(--color-primary)] hover:bg-opacity-90 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 transform hover:translate-y-[-1px] focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                >
                                    AGENDAR
                                </button>
                            </div>
                            
                            
                            <div className="md:col-span-5">
                                <label className="block text-sm font-medium text-gray-600 mb-2">💉 Servicios Asociados (Selecciona uno o más)</label>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                                    {SERVICIOS_MOCK.map(servicio => (
                                        <label key={servicio.id} className="flex items-center text-sm font-medium text-gray-700">
                                            <input
                                                type="checkbox"
                                                value={servicio.id}
                                                checked={serviciosSeleccionadosIds.includes(servicio.id)}
                                                onChange={(e) => {
                                                    const id = parseInt(e.target.value);
                                                    setServiciosSeleccionadosIds(prev => 
                                                        e.target.checked ? [...prev, id] : prev.filter(sId => sId !== id)
                                                    );
                                                }}
                                                className="mr-2 text-[var(--color-primary)] rounded h-4 w-4"
                                            />
                                            {servicio.nombre}
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </form>
                    </section>


                   
                    <section className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl mb-10">
                        <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b-2 pb-2 border-[var(--color-primary)]/50">2. Horario Clínico (Clic para Editar/Anular)</h2>
                        
                        {citasReservadas.filter(c => c.estado === 'Reservada').length === 0 ? (
                            <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg bg-gray-50">
                                <svg className="w-8 h-8 mx-auto mb-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2h-4M9 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p className="text-lg font-bold text-gray-700">¡Agenda vacía! </p>
                                <p className="text-sm">No hay citas registradas en el sistema para esta semana.</p>
                            </div>
                        ) : (
                            <div className="grid-agenda-wrapper">
                                <RenderizarCuadriculaHorario />
                            </div>
                        )}
                    </section>
                    
                    
                    <section className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl mb-10">
                        <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b-2 pb-2 border-[var(--color-primary)]/50">3. Filtrado y Gestión de Datos</h2>
                        
                   
                        <div className="mb-6">
                            <label htmlFor="filtro-busqueda" className="block text-lg font-bold text-gray-700 mb-2">🔎 Buscar Reservas (por Mascota o Cliente)</label>
                            <input
                                id="filtro-busqueda"
                                type="text"
                                placeholder="Escribe un nombre para filtrar..."
                                value={filtroTexto}
                                onChange={(e) => setFiltroTexto(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)]"
                            />
                        </div>
                        
                        <RenderizarListaCitasFiltradas />

                        
                        <div className="mt-10 pt-6 border-t border-gray-200">
                            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                                 Gestión de Referencias (Integridad)
                                <button 
                                    onClick={() => setShowManagementPanel(!showManagementPanel)}
                                    className="ml-3 text-sm text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
                                >
                                    {showManagementPanel ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </h3>
                            {showManagementPanel && (
                                <div className="management-panel-grid">
                           
                                    <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                                        <h4 className="font-bold text-blue-800 mb-2">Clientes</h4>
                                        <div className="entity-list space-y-2">
                                            {clientes.map(cliente => (
                                                <div key={cliente.id} className="flex justify-between items-center text-sm bg-white p-2 rounded border border-blue-200">
                                                    <span>{cliente.nombre}</span>
                                                    <button 
                                                        onClick={() => eliminarCliente(cliente.id)}
                                                        className="text-red-500 hover:text-red-700 text-xs p-1 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-blue-700 mt-2 italic">No puedes eliminar un cliente con mascotas asociadas.</p>
                                    </div>

                              
                                    <div className="bg-green-50 p-4 rounded-lg shadow-inner">
                                        <h4 className="font-bold text-green-800 mb-2">Mascotas</h4>
                                        <div className="entity-list space-y-2">
                                            {mascotas.map(mascota => (
                                                <div key={mascota.id} className="flex justify-between items-center text-sm bg-white p-2 rounded border border-green-200">
                                                    <span>{mascota.nombre}</span>
                                                    <button 
                                                        onClick={() => eliminarMascota(mascota.id)}
                                                        className="text-red-500 hover:text-red-700 text-xs p-1 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-green-700 mt-2 italic">No puedes eliminar una mascota con citas no canceladas.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

        
            <RenderizarModalEdicion />
        </>
    );
}