import { useState, useEffect, useCallback } from 'react';
import { Appointment } from '../types';

const STORAGE_KEY = 'appointments';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    try {
      const storedAppointments = localStorage.getItem(STORAGE_KEY);
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      }
    } catch (error) {
      console.error("Failed to load appointments from localStorage", error);
    }
  }, []);

  const saveAppointments = useCallback((newAppointments: Appointment[]) => {
    try {
      setAppointments(newAppointments);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAppointments));
    } catch (error) {
      console.error("Failed to save appointments to localStorage", error);
    }
  }, []);

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: new Date().toISOString() + Math.random(), // Simple unique ID
    };
    saveAppointments([...appointments, newAppointment]);
  };

  const updateAppointment = (updatedAppointment: Appointment) => {
    const updatedAppointments = appointments.map((apt) =>
      apt.id === updatedAppointment.id ? updatedAppointment : apt
    );
    saveAppointments(updatedAppointments);
  };

  const deleteAppointment = (appointmentId: string) => {
    const filteredAppointments = appointments.filter(
      (apt) => apt.id !== appointmentId
    );
    saveAppointments(filteredAppointments);
  };

  return {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  };
};
