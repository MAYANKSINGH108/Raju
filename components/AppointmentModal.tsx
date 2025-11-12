import React, { useState, useEffect } from 'react';
import { Appointment } from '../types';
import { toISODateString } from '../utils/dateUtils';
import TrashIcon from './icons/TrashIcon';
import XMarkIcon from './icons/XMarkIcon';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id'> | Appointment) => void;
  onDelete?: (appointmentId: string) => void;
  selectedDate: Date | null;
  editingAppointment: Appointment | null;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  selectedDate,
  editingAppointment,
}) => {
  const [name, setName] = useState('');
  const [time, setTime] = useState('09:00');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingAppointment) {
      setName(editingAppointment.name);
      setTime(editingAppointment.time);
      setDescription(editingAppointment.description);
    } else {
      setName('');
      setTime('09:00');
      setDescription('');
    }
  }, [editingAppointment, isOpen]);

  if (!isOpen || (!selectedDate && !editingAppointment)) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const date = editingAppointment ? editingAppointment.date : toISODateString(selectedDate!);
    const appointmentData = { name, time, date, description };

    if (editingAppointment) {
      onSave({ ...editingAppointment, ...appointmentData });
    } else {
      onSave(appointmentData);
    }
  };

  const handleDelete = () => {
    if (editingAppointment && onDelete) {
      onDelete(editingAppointment.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" aria-label="Close modal">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          On {new Date((editingAppointment?.date || toISODateString(selectedDate!)) + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Reason / Description</label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              required
            ></textarea>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {editingAppointment && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <TrashIcon className="w-5 h-5 mr-2" />
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
              >
                {editingAppointment ? 'Save Changes' : 'Schedule Appointment'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
