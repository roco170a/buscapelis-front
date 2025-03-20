import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ 
  children, 
  isOpen, 
  onClose, 
  size 
}) => {
  useEffect(() => {
    // Prevenir scroll del body cuando el modal está abierto
    if (isOpen) {
      document.body.classList.add('modal-open');
      
      // Añadir backdrop si no existe
      if (!document.querySelector('.modal-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
      }
    } else {
      document.body.classList.remove('modal-open');
      
      // Remover backdrop
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    }
    
    // Cleanup al desmontar
    return () => {
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  // Clase para el tamaño del modal
  const sizeClass = size ? `modal-${size}` : '';
  
  // Usar createPortal para renderizar el modal al final del DOM
  return ReactDOM.createPortal(
    <div 
      className="modal fade show" 
      style={{ display: 'block' }} 
      tabIndex={-1} 
      role="dialog" 
      aria-modal="true"
      onClick={(e) => {
        // Cerrar al hacer clic en el fondo
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`modal-dialog ${sizeClass}`} role="document">
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal; 