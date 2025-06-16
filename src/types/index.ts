
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'professional' | 'client';
}

export interface Treatment {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName?: string; 
  professionalId: string;
  professionalName?: string; 
  treatmentId: string;
  treatmentName?: string;
  date: string; // ISO string for date part
  time: string; // HH:MM for time part
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string; // ISO string
  address?: string;
  medicalHistory?: string; 
  treatmentHistory?: Array<{
    treatmentId: string;
    treatmentName: string;
    date: string;
    notes: string;
  }>;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  availability?: Array<{
    dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    startTime: string; // HH:MM
    endTime: string; // HH:MM
  }>;
}
