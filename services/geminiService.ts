
import { GoogleGenAI } from "@google/genai";
import { Appointment } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateConfirmationMessage = async (appointment: Omit<Appointment, 'id'>): Promise<string> => {
  if (!API_KEY) {
    // Fallback message if API key is not available
    const { name, date, time } = appointment;
    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return `Your appointment is confirmed! Details: Name - ${name}, Date - ${formattedDate}, Time - ${time}.`;
  }
  
  try {
    const model = 'gemini-2.5-flash';
    const formattedDate = new Date(appointment.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const prompt = `
      You are an appointment scheduling assistant. 
      Write a friendly and professional confirmation message for the following appointment.
      Keep the message concise and start with a cheerful confirmation phrase.
      
      Appointment Details:
      - Name: ${appointment.name}
      - Date: ${formattedDate}
      - Time: ${appointment.time}
      - Reason: ${appointment.description}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating confirmation message:", error);
    // Return a fallback message on error
    return "Your appointment has been successfully scheduled. You'll receive details shortly.";
  }
};
   