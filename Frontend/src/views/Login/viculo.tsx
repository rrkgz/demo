import React from 'react';


interface WhatsappLinkProps {
  phoneNumber: string; 
  message?: string; 
  buttonText: string; 
}

/**
 * @param {WhatsappLinkProps} props 
 */
const WhatsappLink: React.FC<WhatsappLinkProps> = ({ phoneNumber, message, buttonText }) => {

  const encodedMessage = message ? encodeURIComponent(message) : '';

 
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

 
  const handleClick = () => {
    window.open(whatsappUrl, '_blank'); 
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '10px 20px',
        backgroundColor: '#25D366', 
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold'
      }}
    >
      {buttonText}
    </button>
  );
};

// --- Ejemplo de Uso ---

const App: React.FC = () => {
  const adminPhoneNumber = '56912345678'; // Reemplaza con el número deseado (Ejemplo: Código de país 56, sin el '+')
  const defaultMessage = 'Hola, me gustaría ser agregado como administrador del grupo. ¡Gracias!';

  return (
    <div>
      <h1>Generador de Enlace de WhatsApp</h1>
      <WhatsappLink
        phoneNumber={adminPhoneNumber}
        message={defaultMessage}
        buttonText="Enviar Mensaje por WhatsApp"
      />
      <p style={{ marginTop: '20px', color: 'red' }}>
        **Nota Importante:** Este enlace SÓLO envía un mensaje. La acción de nombrar
        administrador debe ser completada por el administrador actual DENTRO de la
        aplicación de WhatsApp.
      </p>
    </div>
  );
};

export default App;