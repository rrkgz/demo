
import React from 'react';


interface WhatsappLinkProps {
  phoneNumber: string; 
  message?: string; 
  buttonText: string; 
  className?: string; 
  style?: React.CSSProperties; 
}

/**
 * Componente de enlace de WhatsApp tipado.
 * @param {WhatsappLinkProps} props 
 */
const WhatsappLink: React.FC<WhatsappLinkProps> = ({ phoneNumber, message, buttonText, className, style }) => {

  const encodedMessage: string = message ? encodeURIComponent(message) : '';
  

  const whatsappUrl: string = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className || "btn btn-success"} 
      style={{
        ...style,
        backgroundColor: '#25D366', 
        borderColor: '#25D366',
      }}
    >
      {buttonText}
    </a>
  );
};

export default WhatsappLink;