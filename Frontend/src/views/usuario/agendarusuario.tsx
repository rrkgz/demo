import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VeterinaryReservations.css'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';



interface Service {
  id: number;
  name: string;
  price: number;
}

interface Veterinarian {
  id: number; 
  name: string;
  email: string; 
  especialidad: string;
}

interface Mascota { 
  id: number;
  nombre: string;
  propietarioId: number;
  propietarioNombre: string; 
}

interface Reservation {
  id: number;
  petId: number;
  veterinarianId: number;
  dateTime: string; 
  status: 'Confirmada' | 'Modificada' | 'Anulada';
  services: Service[];
  clientName: string; 
  petName: string; 
}


interface NewReservationData {
    petId: string;
    veterinarianId: string;
    dateTime: string;
    clientName: string; 
    petName: string;   
    selectedServices: Service[];
}

const initialNewReservationData: NewReservationData = { 
    petId: '', 
    veterinarianId: '', 
    dateTime: '', 
    clientName: '', 
    petName: '', 
    selectedServices: [] 
};


export const VeterinaryReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [pets, setPets] = useState<Mascota[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [filterText, setFilterText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  
  const [newReservationData, setNewReservationData] = useState<NewReservationData>(initialNewReservationData);

  

  const getToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) {
    
      navigate('/iniciar-sesion');
      alert('Sesión expirada o no iniciada. Por favor, inicie sesión.');
      return null;
    }
    return token;
  };

  const getHeaders = (token: string) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  const handleApiError = async (res: Response) => {
    const errorData = await res.json();
    throw new Error(errorData.error || `Fallo en la API: ${res.statusText}`);
  };


  
  const fetchData = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    setError('');

    try {

      const vetsRes = await fetch(`${API_URL}/veterinarios/activos`, { headers: getHeaders(token) });
      if (!vetsRes.ok) await handleApiError(vetsRes);
      const vetsData: Veterinarian[] = await vetsRes.json();
      setVets(vetsData.map(v => ({...v, id: Number(v.email.split('@')[0]) }))); 


      const petsRes = await fetch(`${API_URL}/mascotas/detalles`, { headers: getHeaders(token) }); 
      if (!petsRes.ok) await handleApiError(petsRes);
      const petsData: Mascota[] = await petsRes.json();
      setPets(petsData);

    
      const servicesRes = await fetch(`${API_URL}/servicios`, { headers: getHeaders(token) });
      if (!servicesRes.ok) await handleApiError(servicesRes);
      const servicesData: Service[] = await servicesRes.json();
      setServices(servicesData);

    
      const reservationsRes = await fetch(`${API_URL}/reservas`, { headers: getHeaders(token) });
      if (!reservationsRes.ok) await handleApiError(reservationsRes);
      const reservationsData: Reservation[] = await reservationsRes.json();
      setReservations(reservationsData);

     
      if (petsData.length > 0) {
        setNewReservationData(prev => ({ 
            ...prev, 
            petId: String(petsData[0].id),
            petName: petsData[0].nombre,
            clientName: petsData[0].propietarioNombre
        }));
      }
      
    } catch (err: any) {
      console.error("Error al cargar datos:", err);
      setError(err.message || 'Error de red o servidor al cargar datos.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);



  const isTimeSlotTaken = useCallback((dateTime: string, veterinarianId: number, currentReservationId?: number) => {
    return reservations.some(res =>
      res.dateTime === dateTime &&
      res.veterinarianId === veterinarianId &&
      res.status !== 'Anulada' && 
      res.id !== currentReservationId 
    );
  }, [reservations]);
  
  const updateReservationStatus = async (id: number, newStatus: 'Modificada' | 'Anulada') => {
    const token = getToken();
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/reservas/${id}/status`, {
            method: 'PUT',
            headers: getHeaders(token),
            body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) await handleApiError(res);
        
      
        setReservations(prev =>
            prev.map(res => (res.id === id ? { ...res, status: newStatus } : res))
        );
        alert(`Reserva ${id} ${newStatus === 'Anulada' ? 'anulada' : 'modificada'} con éxito.`);

    } catch (err: any) {
        setError(err.message || `Error al ${newStatus === 'Anulada' ? 'anular' : 'modificar'} la reserva.`);
    }
  }


  const handleSaveReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    const { petId, veterinarianId, dateTime, selectedServices } = newReservationData;
    const vetIdNum = parseInt(veterinarianId);
    const petIdNum = parseInt(petId);

    if (isTimeSlotTaken(dateTime, vetIdNum, editingReservation?.id)) {
      alert('Error: Ya existe una reserva para este veterinario a esta hora.');
      return;
    }
    

    const selectedPet = pets.find(p => p.id === petIdNum);
    if (!selectedPet) {
        alert('Error: Mascota no válida.');
        return;
    }
    
    
    const reservationPayload = {
        petId: petIdNum,
        veterinarianId: vetIdNum,
        dateTime,
        services: selectedServices.map(s => s.id), 
        clientName: selectedPet.propietarioNombre, 
        petName: selectedPet.nombre,              
    };

    try {
        let res: Response;
        let method: 'POST' | 'PUT';
        let url: string;
        
        if (editingReservation) {
            method = 'PUT';
            url = `${API_URL}/reservas/${editingReservation.id}`;
        } else {
            method = 'POST';
            url = `${API_URL}/reservas`;
        }

        res = await fetch(url, {
            method,
            headers: getHeaders(token),
            body: JSON.stringify(reservationPayload),
        });

        if (!res.ok) await handleApiError(res);
        
        const data: Reservation = await res.json();
        
        if (editingReservation) {
            setReservations(prev => prev.map(res =>
                res.id === editingReservation.id ? {...res, ...data, status: 'Modificada'} : res
            ));
            alert('Reserva modificada con éxito.');
        } else {
            setReservations(prev => [...prev, data]);
            alert('Reserva registrada con éxito.');
        }

        setNewReservationData(initialNewReservationData);
        setEditingReservation(null);
        setIsModalOpen(false);

    } catch (err: any) {
        setError(err.message || 'Error al guardar la reserva.');
    }
  };

  const handleCancelReservation = (id: number) => {
    const confirmCancel = window.confirm('¿Está seguro de que desea anular esta reserva?');
    if (confirmCancel) {
      updateReservationStatus(id, 'Anulada');
    }
  };


  const filteredReservations = useMemo(() => {
    const lowerCaseFilter = filterText.toLowerCase();
    return reservations.filter(res =>
      res.clientName.toLowerCase().includes(lowerCaseFilter) ||
      res.petName.toLowerCase().includes(lowerCaseFilter) ||
      vets.find(v => v.id === res.veterinarianId)?.name.toLowerCase().includes(lowerCaseFilter)
    );
  }, [reservations, filterText, vets]);


  const startEditing = (res: Reservation) => {
    const petData = pets.find(p => p.id === res.petId);

    setEditingReservation(res);
    setNewReservationData({
        petId: String(res.petId),
        veterinarianId: String(res.veterinarianId),
        dateTime: res.dateTime,
        clientName: petData?.propietarioNombre || res.clientName,
        petName: petData?.nombre || res.petName,
        selectedServices: res.services,
    });
    setIsModalOpen(true);
  };
  
  const handlePetChange = (petIdValue: string) => {
      const petIdNum = parseInt(petIdValue);
      const selectedPet = pets.find(p => p.id === petIdNum);

      setNewReservationData(prev => ({
          ...prev, 
          petId: petIdValue,
          petName: selectedPet?.nombre || '',
          clientName: selectedPet?.propietarioNombre || '',
      }));
  }
  
 
  const getVetName = (id: number) => vets.find(v => v.id === id)?.name || 'Desconocido';



  if (loading) {
    return <div className="reservations-container"><h2>Cargando datos...</h2></div>;
  }
  
  if (error) {
    return <div className="reservations-container"><h2 style={{color: 'red'}}>Error: {error}</h2><button onClick={fetchData}>Reintentar Carga</button></div>;
  }


  return (
    <div className="reservations-container">
      <h1>Gestión de Reservas Veterinarias 🐾</h1>
      
      <button onClick={() => {
        setEditingReservation(null);
        setNewReservationData(initialNewReservationData);
        if (pets.length > 0) {
           handlePetChange(String(pets[0].id)); // Establecer el primer paciente por defecto
        }
        setIsModalOpen(true);
      }}>
        Registrar Nueva Reserva
      </button>


      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>{editingReservation ? 'Modificar Reserva' : 'Registrar Reserva'}</h2>
            <form onSubmit={handleSaveReservation}>
              
              <label>
                Mascota:
                <select
                  value={newReservationData.petId}
                  onChange={e => handlePetChange(e.target.value)}
                  required
                >
                  <option value="">Seleccione una Mascota</option>
                  {pets.map(pet => (
                    <option key={pet.id} value={pet.id}>{pet.nombre} (Dueño: {pet.propietarioNombre})</option>
                  ))}
                </select>
              </label>
              
              {/* Campo Cliente y Mascota ahora son solo de lectura, obtenidos del select */}
              <label>
                Cliente:
                <input
                  type="text"
                  value={newReservationData.clientName}
                  readOnly
                  disabled
                />
              </label>

              <label>
                Nombre Mascota:
                <input
                  type="text"
                  value={newReservationData.petName}
                  readOnly
                  disabled
                />
              </label>
              
              <label>
                Veterinario:
                <select
                  value={newReservationData.veterinarianId}
                  onChange={e => setNewReservationData({...newReservationData, veterinarianId: e.target.value})}
                  required
                >
                  <option value="">Seleccione un Veterinario</option>
                  {vets.map(vet => (
                    <option key={vet.id} value={vet.id}>{vet.name} ({vet.especialidad})</option>
                  ))}
                </select>
              </label>
              
              <label>
                Fecha y Hora:
                <input
                  type="datetime-local"
                  value={newReservationData.dateTime}
                  onChange={e => setNewReservationData({...newReservationData, dateTime: e.target.value})}
                  required
                />
              </label>

              
              <fieldset>
                <legend>Servicios Asociados:</legend>
                {services.map(service => (
                  <div key={service.id}>
                    <input
                      type="checkbox"
                      id={`service-${service.id}`}
                      checked={newReservationData.selectedServices.some(s => s.id === service.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewReservationData(prev => ({
                            ...prev,
                            selectedServices: [...prev.selectedServices, service]
                          }));
                        } else {
                          setNewReservationData(prev => ({
                            ...prev,
                            selectedServices: prev.selectedServices.filter(s => s.id !== service.id)
                          }));
                        }
                      }}
                    />
                    <label htmlFor={`service-${service.id}`}>{service.name} (${service.price.toFixed(2)})</label>
                  </div>
                ))}
              </fieldset>

              <div className="modal-actions">
                <button type="submit">Guardar Reserva</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Listado de Reservas --- */}
      <div className="filter-section">
        <h2>Listado de Reservas ({filteredReservations.length})</h2>
        <input
          type="text"
          placeholder="Filtrar por Cliente, Mascota o Veterinario..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      
      <table className="reservations-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Mascota</th>
            <th>Veterinario</th>
            <th>Fecha y Hora</th>
            <th>Servicios</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.length > 0 ? (
            filteredReservations.map(res => (
              <tr key={res.id} className={`status-${res.status.toLowerCase()}`}>
                <td>{res.id}</td>
                <td>{res.clientName}</td>
                <td>{res.petName}</td>
                <td>{getVetName(res.veterinarianId)}</td>
                <td>{new Date(res.dateTime).toLocaleString()}</td>
                <td>
                  <ul>
                    {res.services.map(s => <li key={s.id}>{s.name}</li>)}
                  </ul>
                </td>
                <td>**{res.status}**</td>
                <td>
                  <button onClick={() => startEditing(res)} disabled={res.status === 'Anulada'}>
                    Modificar
                  </button>
                  <button onClick={() => handleCancelReservation(res.id)} disabled={res.status === 'Anulada'}>
                    Anular
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No se encontraron reservas.</td>
            </tr>
          )}
        </tbody>
      </table>
      
    </div>
  );
};