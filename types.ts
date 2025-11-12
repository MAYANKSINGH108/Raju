
export interface Appointment {
  id: string;
  name: string;
  date: string; // Stored as ISO string YYYY-MM-DD
  time: string; // Stored as HH:MM
  description: string;
}
   