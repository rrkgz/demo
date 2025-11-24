import React, { useState, useMemo, useCallback, type FormEvent, useEffect } from 'react';


interface Doctor {
    id: number;
    nombre: string;
    especialidad: string;
}


interface Cita {
    id: string;
    fecha: string;
    hora: string;
    nombreDoc: string;
    especialidadDoc: string;
    diaSemana: string;
    vetId: number;
    nombreMascota: string;
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




const obtenerFechaHoy = (): string => {
    return new Date().toISOString().split('T')[0];
};


const obtenerNombreDia = (fechaString: string): string => {
    const fecha = new Date(fechaString + 'T00:00:00'); 
    const indiceDia = fecha.getDay(); 
    return DIAS_SEMANA[(indiceDia + 6) % 7]; 
};




export default function TableroCitasVET() {
   
    

    const [citasReservadas, setCitasReservadas] = useState<Cita[]>([]);
    

    const [estadoMensaje, setEstadoMensaje] = useState<MensajeEstado | null>(null);


    const [nombreMascota, setNombreMascota] = useState<string>('');
    const [fechaCita, setFechaCita] = useState<string>(obtenerFechaHoy());
    const [horaCita, setHoraCita] = useState<string>(RAN_HORARIOS[0]);
    const [docId, setDocId] = useState<number>(DOCTORES[0].id);




    const mostrarMensaje = useCallback((texto: string, tipo: 'ok' | 'error') => {
        setEstadoMensaje({ texto, tipo });

        const timer = setTimeout(() => {
            setEstadoMensaje(null);
        }, 3500);

        return () => clearTimeout(timer); 
    }, []);



    const manejarAgendamiento = (e: FormEvent) => {
        e.preventDefault();

        const nombre = nombreMascota.trim();
        const vetIdSeleccionado = docId;

        if (!fechaCita || !horaCita || !vetIdSeleccionado || !nombre) {
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
                       cita.vetId === vetIdSeleccionado
        );

        if (tieneConflicto) {
            mostrarMensaje(`¡ATENCIÓN! El ${doctor.nombre} ya está reservado. Prueba otra hora.`, 'error');
            return;
        }

        const nuevaCita: Cita = {
            id: crypto.randomUUID(),
            fecha: fechaCita,
            hora: horaCita,
            nombreDoc: doctor.nombre,
            especialidadDoc: doctor.especialidad,
            diaSemana: obtenerNombreDia(fechaCita),
            vetId: vetIdSeleccionado,
            nombreMascota: nombre
        };

        const citasActualizadas = [...citasReservadas, nuevaCita];
        
 
        citasActualizadas.sort((a, b) => {
            const momentoA = new Date(`${a.fecha}T${a.hora}:00`).getTime();
            const momentoB = new Date(`${b.fecha}T${b.hora}:00`).getTime();
            return momentoA - momentoB;
        });

        setCitasReservadas(citasActualizadas);
        setNombreMascota(''); 

        mostrarMensaje(`¡Cita OK! ${nombre} con ${doctor.nombre.split(' ')[1]} agendado.`, 'ok');
    };


    const RenderizarSlotCita = ({ cita }: { cita: Cita }) => {
        const tituloCompleto = `${cita.nombreMascota} | ${cita.nombreDoc} (${cita.especialidadDoc}) el ${cita.fecha} a las ${cita.hora}`;
        
        return (
            <div className="cita-bloque-manual" title={tituloCompleto}>
                <p className="pet-info-name"><span className="icon-patita"></span> {cita.nombreMascota}</p>
                <p className="vet-data">Dr(a). {cita.nombreDoc.split(' ')[1]} ({cita.especialidadDoc.substring(0, 3)}.)</p>
            </div>
        );
    };


    const citasPorSlot = useMemo(() => {
        const cuadrilla: Record<string, Record<string, Cita[]>> = {};

        DIAS_SEMANA.forEach(d => {
            cuadrilla[d] = {};
            RAN_HORARIOS.forEach(h => {
                cuadrilla[d][h] = []; 
            });
        });

        citasReservadas.forEach(c => {
            const nombreDia = obtenerNombreDia(c.fecha);
            if (cuadrilla[nombreDia] && cuadrilla[nombreDia][c.hora]) {
                cuadrilla[nombreDia][c.hora].push(c);
            }
        });
        return cuadrilla;
    }, [citasReservadas]);


  
    const RenderizarCuadriculaHorario = () => {
        return (
            <div className="schedule-grid-manual">
                {/* Headers */}
                <div className="grid-cell header-cell">Tiempo</div>
                {DIAS_SEMANA.map(dia => (
                    <div key={dia} className="grid-cell header-cell">{dia}</div>
                ))}
                
                {/* Filas de Horas */}
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



    const styles = `
        :root {
            --color-primary: #15b79d;
            --color-secondary: #0e7490;
            --bg-page: #f9f9fb;
            --font-main: 'Inter', sans-serif;
        }
        
        /* Asegúrate de importar la fuente Inter globalmente si usas este estilo */

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

        .cita-bloque-manual {
            background-color: rgba(21, 183, 157, 0.15); /* Equivalente a color-mix al 15% */
            border-left: 4px solid var(--color-primary); 
            border-radius: 0.375rem;
            padding: 0.3rem 0.5rem;
            font-size: 0.75rem; 
            color: #065f46;
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

        .cita-bloque-manual:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(21, 183, 157, 0.4); 
        }
        
        .cita-bloque-manual .pet-info-name {
            font-size: 0.85rem;
            font-weight: 800;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            color: var(--color-secondary);
        }

        .cita-bloque-manual .vet-data {
            font-size: 0.68rem;
            color: #047857;
            font-weight: 500;
            opacity: 0.9;
        }

        .icon-patita {
            display: inline-block;
            margin-right: 4px;
            color: var(--color-primary);
        }
        .icon-patita::before {
            content: "\\2764"; 
        }
    `;

    return (
        <>
            {/* Este bloque de estilo debe moverse fuera del componente si se usa en producción con Vite/Webpack */}
            <style>{styles}</style>
            <div id="app-container" className="min-h-screen p-4 sm:p-8">
                <div className="max-w-6xl mx-auto"> 
                    <header className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-[var(--color-secondary)]">
                            <span style={{ color: 'var(--color-secondary)' }}>🐾</span> Tablero de Citas PetCare <span style={{ color: 'var(--color-secondary)' }}>🐾</span>
                        </h1>
                        <p className="text-lg text-gray-500 mt-2">Gestión Modular de Horarios Clínicos</p>
                    </header>

                    <RenderizarBloqueMensaje />

                    {/* Sección 1: Registrar Nueva Visita */}
                    <section className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl mb-10 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b-2 pb-2 border-[var(--color-primary)]/50">1. Registrar Nueva Visita</h2>
                        
                        <form onSubmit={manejarAgendamiento} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            
                            {/* Campo: Nombre del Paciente */}
                            <div>
                                <label htmlFor="nombre-mascota" className="block text-sm font-medium text-gray-600 mb-2 flex items-center">
                                    <span className="icon-patita text-xl mr-2"></span> Nombre del Paciente
                                </label>
                                <input
                                    id="nombre-mascota"
                                    type="text"
                                    placeholder="Ej: Fido, Pelusa (Requerido)"
                                    value={nombreMascota}
                                    onChange={(e) => setNombreMascota(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                    required
                                />
                            </div>

                            {/* Campo: Fecha */}
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

                            {/* Campo: Hora */}
                            <div>
                                <label htmlFor="hora-cita" className="block text-sm font-medium text-gray-600 mb-2">⏱️ Hora</label>
                                <select
                                    id="hora-cita"
                                    value={horaCita}
                                    onChange={(e) => setHoraCita(e.target.value)}
                                    className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] appearance-none"
                                    required
                                >
                                    {RAN_HORARIOS.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Campo: Veterinario Asignado */}
                            <div>
                                <label htmlFor="doc-id" className="block text-sm font-medium text-gray-600 mb-2">👨‍⚕️ Veterinario Asignado</label>
                                <select
                                    id="doc-id"
                                    value={docId}
                                    onChange={(e) => setDocId(parseInt(e.target.value))}
                                    className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] appearance-none"
                                    required
                                >
                                    <option value="" disabled>-- Selecciona --</option>
                                    {DOCTORES.map(vet => (
                                        <option key={vet.id} value={vet.id}>
                                            {vet.nombre} ({vet.especialidad})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Botón de Submit */}
                            <div className="md:col-span-4 pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-[var(--color-primary)] hover:bg-opacity-90 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 transform hover:translate-y-[-1px] focus:ring-4 focus:ring-[var(--color-primary)] focus:ring-opacity-50"
                                    style={{ backgroundColor: 'var(--color-primary)' }} // Tailwind no soporta var() directo en la clase, se usa style
                                >
                                    AGENDAR CITA
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Sección 2: Horario Clínico Semanal */}
                    <section className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b-2 pb-2 border-[var(--color-primary)]/50">2. Horario Clínico Semanal</h2>
                        
                        {citasReservadas.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 border border-dashed rounded-lg bg-gray-50">
                                <svg className="w-8 h-8 mx-auto mb-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2h-4M9 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p className="text-lg font-bold text-gray-700">¡Agenda vacía! </p>
                                <p className="text-sm">No hay citas registradas en el sistema. ¡Añade una ahora!</p>
                            </div>
                        ) : (
                            <div className="grid-agenda-wrapper">
                                <RenderizarCuadriculaHorario />
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}