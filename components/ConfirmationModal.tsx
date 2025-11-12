import React from 'react';
import XMarkIcon from './icons/XMarkIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string | null;
  isLoading: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, message, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" aria-label="Close modal">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Appointment Confirmation
        </h2>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Generating confirmation...</p>
          </div>
        ) : (
          <div className="text-gray-700 whitespace-pre-wrap">{message}</div>
        )}
        <div className="mt-6 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
