import React, { useState, useMemo, useCallback } from 'react';
import './VeterinaryReservations.css'; 



interface Service {
  id: number;
  name: string;
  price: number;
}

interface Pet {
  id: number;
  name: string;
  clientId: number;
}

interface Veterinarian {
  id: number;
  name: string;
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



const MOCK_VETS: Veterinarian[] = [
  { id: 1, name: 'Dr. López' },
  { id: 2, name: 'Dra. García' },
];

const MOCK_PETS: Pet[] = [
  { id: 101, name: 'Fido', clientId: 1 },
  { id: 102, name: 'Mishi', clientId: 2 },
];

const MOCK_SERVICES: Service[] = [
  { id: 1, name: 'Consulta General', price: 35000 },
  { id: 2, name: 'Vacuna Anual', price: 20000 },
  { id: 3, name: 'Corte de Uñas', price: 5000 },
];


const initialReservations: Reservation[] = [
  {
    id: 1,
    petId: 101,
    veterinarianId: 1,
    dateTime: '2025-12-10T10:00',
    status: 'Confirmada',
    services: [MOCK_SERVICES[0]],
    clientName: 'Juan Pérez',
    petName: 'Fido',
  },
];



export const VeterinaryReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [filterText, setFilterText] = useState('');

 
  const [newReservationData, setNewReservationData] = useState({
    petId: '',
    veterinarianId: '',
    dateTime: '',
    clientName: '',
    petName: '',
    selectedServices: [] as Service[],
  });

  
  const isTimeSlotTaken = useCallback((dateTime: string, veterinarianId: number, currentReservationId?: number) => {
    return reservations.some(res =>
      res.dateTime === dateTime &&
      res.veterinarianId === veterinarianId &&
      res.status !== 'Anulada' && 
      res.id !== currentReservationId 
    );
  }, [reservations]);

  
  const handleSaveReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const { petId, veterinarianId, dateTime, clientName, petName, selectedServices } = newReservationData;
    const vetIdNum = parseInt(veterinarianId);

    if (isTimeSlotTaken(dateTime, vetIdNum, editingReservation?.id)) {
      alert('Error: Ya existe una reserva para este veterinario a esta hora.');
      return;
    }

    if (editingReservation) {
      
      setReservations(prev => prev.map(res =>
        res.id === editingReservation.id
          ? {
              ...res,
              petId: parseInt(petId),
              veterinarianId: vetIdNum,
              dateTime,
              services: selectedServices,
              status: res.status !== 'Anulada' ? 'Modificada' : res.status,
              clientName,
              petName,
            }
          : res
      ));
      alert('Reserva modificada con éxito.');
    } else {

      const newRes: Reservation = {
        id: Date.now(), 
        petId: parseInt(petId),
        veterinarianId: vetIdNum,
        dateTime,
        status: 'Confirmada',
        services: selectedServices, 
        clientName,
        petName,
      };
      setReservations(prev => [...prev, newRes]);
      alert('Reserva registrada con éxito.');
    }

    setNewReservationData({ petId: '', veterinarianId: '', dateTime: '', clientName: '', petName: '', selectedServices: [] });
    setEditingReservation(null);
    setIsModalOpen(false);
  };

  
  const handleCancelReservation = (id: number) => {
    const confirmCancel = window.confirm('¿Está seguro de que desea anular esta reserva?');
    if (confirmCancel) {
      setReservations(prev =>
        prev.map(res => (res.id === id ? { ...res, status: 'Anulada' } : res))
      );
      alert('Reserva anulada.');
    }
  };


  const filteredReservations = useMemo(() => {
    const lowerCaseFilter = filterText.toLowerCase();
    return reservations.filter(res =>
      res.clientName.toLowerCase().includes(lowerCaseFilter) ||
      res.petName.toLowerCase().includes(lowerCaseFilter) ||
      MOCK_VETS.find(v => v.id === res.veterinarianId)?.name.toLowerCase().includes(lowerCaseFilter)
    );
  }, [reservations, filterText]);


  const handleDeletePet = (petId: number) => {
    const isPetReserved = reservations.some(res => res.petId === petId && res.status !== 'Anulada');
    

    if (isPetReserved) {
      alert('Error: No se puede eliminar esta mascota porque tiene reservas activas. Primero anule o elimine las reservas.');
    } else {
      
      alert('Mascota eliminada con éxito (si no tuviera reservas).');
    }
  };


  const startEditing = (res: Reservation) => {
    setEditingReservation(res);
    setNewReservationData({
        petId: String(res.petId),
        veterinarianId: String(res.veterinarianId),
        dateTime: res.dateTime,
        clientName: res.clientName,
        petName: res.petName,
        selectedServices: res.services,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="reservations-container">
      <h1>Gestión de Reservas Veterinarias 🐾</h1>
      
      <button onClick={() => {
        setEditingReservation(null);
        setNewReservationData({ petId: '', veterinarianId: '', dateTime: '', clientName: '', petName: '', selectedServices: [] });
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
                Cliente:
                <input
                  type="text"
                  value={newReservationData.clientName}
                  onChange={e => setNewReservationData({...newReservationData, clientName: e.target.value})}
                  required
                />
              </label>

              <label>
                Mascota:
                <input
                  type="text"
                  value={newReservationData.petName}
                  onChange={e => {
                    setNewReservationData({...newReservationData, petName: e.target.value});
           
                    if (!editingReservation) {
                        const petMatch = MOCK_PETS.find(p => p.name.toLowerCase() === e.target.value.toLowerCase());
                        if (petMatch) {
                             setNewReservationData(prev => ({...prev, petId: String(petMatch.id)}));
                        } else {
                             setNewReservationData(prev => ({...prev, petId: '999'})); // Usar un ID de mascota temporal
                        }
                    }
                  }}
                  required
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
                  {MOCK_VETS.map(vet => (
                    <option key={vet.id} value={vet.id}>{vet.name}</option>
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
                {MOCK_SERVICES.map(service => (
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
                    <label htmlFor={`service-${service.id}`}>{service.name} (${service.price})</label>
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

 
      <div className="filter-section">
        <h2>Listado de Reservas</h2>
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
                <td>{MOCK_VETS.find(v => v.id === res.veterinarianId)?.name}</td>
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
                 
                  <button onClick={() => handleDeletePet(res.petId)} title="Simula un intento de borrar la mascota">
                    Test Borrar Mascota
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