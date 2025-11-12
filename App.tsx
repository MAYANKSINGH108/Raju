import React, { useState } from 'react';
import { Appointment } from './types';
import { useAppointments } from './hooks/useAppointments';
import { generateConfirmationMessage } from './services/geminiService';
import { getMonthYearString } from './utils/dateUtils';
import Calendar from './components/Calendar';
import AppointmentModal from './components/AppointmentModal';
import ConfirmationModal from './components/ConfirmationModal';
import ChevronLeftIcon from './components/icons/ChevronLeftIcon';
import ChevronRightIcon from './components/icons/ChevronRightIcon';

const App: React.FC = () => {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointments();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  
  const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setEditingAppointment(null);
    setAppointmentModalOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setSelectedDate(null);
    setAppointmentModalOpen(true);
  };
  
  const closeModal = () => {
    setAppointmentModalOpen(false);
    setEditingAppointment(null);
    setSelectedDate(null);
  };

  const handleSaveAppointment = async (appointmentData: Omit<Appointment, 'id'> | Appointment) => {
    if ('id' in appointmentData) {
      updateAppointment(appointmentData);
    } else {
      addAppointment(appointmentData);
    }
    closeModal();
    
    // Generate and show confirmation
    setConfirmationModalOpen(true);
    setIsGenerating(true);
    const message = await generateConfirmationMessage(appointmentData);
    setConfirmationMessage(message);
    setIsGenerating(false);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    deleteAppointment(appointmentId);
    closeModal();
  };
  
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-primary-dark text-center">Appointment Scheduler</h1>
        <p className="text-center text-gray-600 mt-2">Schedule, modify, and cancel your appointments with ease.</p>
      </header>

      <main>
        <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center gap-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100" aria-label="Previous month">
                    <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
                </button>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-700 w-48 text-center">{getMonthYearString(currentDate)}</h2>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100" aria-label="Next month">
                    <ChevronRightIcon className="w-6 h-6 text-gray-600" />
                </button>
            </div>
            <button
                onClick={handleToday}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
                Today
            </button>
        </div>

        <Calendar 
          currentDate={currentDate}
          appointments={appointments}
          onSelectDate={handleSelectDate}
          onEditAppointment={handleEditAppointment}
        />
      </main>

      <AppointmentModal 
        isOpen={isAppointmentModalOpen}
        onClose={closeModal}
        onSave={handleSaveAppointment}
        onDelete={handleDeleteAppointment}
        selectedDate={selectedDate}
        editingAppointment={editingAppointment}
      />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        message={confirmationMessage}
        isLoading={isGenerating}
      />
    </div>
  );
};

export default App;
