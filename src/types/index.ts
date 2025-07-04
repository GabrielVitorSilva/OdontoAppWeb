export interface User {
  user: {
    User: {
      id: string;
      name: string;
      email: string;
      role: Profile;
    }
    profileData: {
      id: string,
      userId: string,
      createdAt: string,
      updatedAt: string
    }
  };
}


export enum Profile {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  PROFESSIONAL = 'PROFESSIONAL',
}

export interface fetchAllUsersResponse {
  id: string,
  name: string,
  email: string,
  cpf: string,
  role: Profile,
  createdAt: string,
  updatedAt: string
}

export interface fetchAllUsersByIdResponse {
  User: {
    id: string;
    name: string;
    email: string;
    cpf: string;
    role: Profile;
  }
  profileData: {
    id: string,
    userId: string,
    createdAt: string,
    updatedAt: string
  }
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
  clientName: string;
  professionalName: string;
  treatmentName: string;
  dateTime: string; 
  status: AppointmentStatus;
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
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


export interface fetchProfessionalAndClient {
  id: string;
  name: string;
  email: string;
  cpf: string;
  professionalId: string;
  clientId: string;
  role: Profile;
}

export interface fetchProfessionalAndClientResponse {
  total: number;
  data: fetchProfessionalAndClient[];
}
