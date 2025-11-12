import React from 'react';
import { Appointment } from '../types';
import { getDaysInMonth, toISODateString, getWeekdayStrings } from '../utils/dateUtils';
import PlusIcon from './icons/PlusIcon';
import AppointmentItem from './AppointmentItem';

interface CalendarProps {
  currentDate: Date;
  appointments: Appointment[];
  onSelectDate: (date: Date) => void;
  onEditAppointment: (appointment: Appointment) => void;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, appointments, onSelectDate, onEditAppointment }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const weekdays = getWeekdayStrings();

  const getAppointmentsForDay = (date: Date): Appointment[] => {
    const isoDate = toISODateString(date);
    return appointments
      .filter(apt => apt.date === isoDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  };
  
  const isToday = (date: Date): boolean => {
    return toISODateString(date) === toISODateString(new Date());
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 md:p-6">
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-500 mb-2">
        {weekdays.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="border rounded-md border-transparent"></div>
        ))}
        {daysInMonth.map(day => {
          const dailyAppointments = getAppointmentsForDay(day);
          return (
            <div key={day.toString()} className="border rounded-md p-2 flex flex-col min-h-[120px] bg-gray-50 relative group">
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${isToday(day) ? 'bg-primary text-white rounded-full flex items-center justify-center w-6 h-6' : 'text-gray-700'}`}>
                  {day.getDate()}
                </span>
                <button
                  onClick={() => onSelectDate(day)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-primary-light hover:bg-primary text-primary-dark hover:text-white"
                  aria-label={`Add new appointment for ${day.toLocaleDateString()}`}
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 space-y-1 overflow-y-auto">
                {dailyAppointments.map(apt => (
                  <AppointmentItem key={apt.id} appointment={apt} onEdit={() => onEditAppointment(apt)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
