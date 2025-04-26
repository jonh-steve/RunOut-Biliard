import React, { useEffect, useRef } from 'react';

/**
 * Modal component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether modal is open
 * @param {function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer
 * @param {string} props.size - Modal size (small, medium, large, fullWidth)
 * @param {boolean} props.disableBackdropClick - Whether to disable backdrop click
 * @param {boolean} props.disableEscapeKeyDown - Whether to disable escape key
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.rest - Additional props
 * @returns {React.ReactElement} Modal component
 */
const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  className = '',
  ...rest
}) => {
  const modalRef = useRef(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (open && !disableEscapeKeyDown && event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // Restore scrolling when modal is closed
      document.body.style.overflow = '';
    };
  }, [open, onClose, disableEscapeKeyDown]);

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (disableBackdropClick) return;
    
    // Only close if clicking directly on the backdrop, not on the modal content
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    fullWidth: 'max-w-[90%] w-full',
  };

  // Don't render anything if modal is not open
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 transition-opacity"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      {...rest}
    >
      {/* Modal animation */}
      <div 
        className={`
          transform transition-all duration-300 ease-in-out
          ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          ${sizeClasses[size] || sizeClasses.medium}
          ${className}
        `}
        ref={modalRef}
      >
        {/* Modal content */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Modal header */}
          {title && (
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={onClose}
                aria-label="Close"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Modal body */}
          <div className="px-6 py-4">
            {children}
          </div>

          {/* Modal footer */}
          {footer && (
            <div className="px-6 py-3 border-t border-gray-200 flex justify-end space-x-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;