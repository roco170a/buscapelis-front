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
    // RCC Prevent scroll of the body when the modal is open
    if (isOpen) {
      document.body.classList.add('modal-open');
      
      // RCC Add backdrop if it does not exist
      if (!document.querySelector('.modal-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
      }
    } else {
      document.body.classList.remove('modal-open');
      
      // RCC Remove backdrop
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    }
    
    // RCC Cleanup when unmounting
    return () => {
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  // RCC Class for the modal size
  const sizeClass = size ? `modal-${size}` : '';
  
  // RCC Use createPortal to render the modal at the end of the DOM
  return ReactDOM.createPortal(
    <div 
      className="modal fade show" 
      style={{ display: 'block' }} 
      tabIndex={-1} 
      role="dialog" 
      aria-modal="true"
      onClick={(e) => {
        // RCC Close when clicking on the background
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