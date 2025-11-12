import React from 'react';
import { Appointment } from '../types';
import PencilIcon from './icons/PencilIcon';

interface AppointmentItemProps {
  appointment: Appointment;
  onEdit: () => void;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment, onEdit }) => {
  return (
    <button
      onClick={onEdit}
      className="w-full text-left p-2 mb-1 rounded-lg bg-primary-light hover:bg-teal-200 transition-colors duration-200 flex justify-between items-center"
      aria-label={`Edit appointment for ${appointment.name} at ${appointment.time}`}
    >
      <div>
        <p className="text-sm font-semibold text-primary-dark truncate">{appointment.name}</p>
        <p className="text-xs text-teal-700">{appointment.time}</p>
      </div>
      <PencilIcon className="w-4 h-4 text-primary-dark opacity-50 group-hover:opacity-100" />
    </button>
  );
};

export default AppointmentItem;
