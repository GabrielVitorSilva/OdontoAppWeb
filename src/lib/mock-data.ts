import type { Treatment, Appointment, Client, Professional, User } from '@/types';

export const mockUsers: User[] = [
  { id: 'user-admin-01', name: 'Admin User', email: 'admin@odonto.app', role: 'admin' },
  { id: 'user-prof-01', name: 'Dr. Aline Silva', email: 'aline.silva@odonto.app', role: 'professional' },
  { id: 'user-client-01', name: 'Carlos Pereira', email: 'carlos.pereira@email.com', role: 'client' },
  { id: 'user-client-02', name: 'Beatriz Costa', email: 'beatriz.costa@email.com', role: 'client' },
];

export const mockTreatments: Treatment[] = [
  { id: 'treat-001', name: 'Limpeza Dental', description: 'Profilaxia e remoção de tártaro.', duration: 45, price: 150 },
  { id: 'treat-002', name: 'Clareamento Dental', description: 'Clareamento a laser.', duration: 60, price: 500 },
  { id: 'treat-003', name: 'Restauração (Resina)', description: 'Restauração de cárie com resina composta.', duration: 60, price: 250 },
  { id: 'treat-004', name: 'Extração Simples', description: 'Extração de dente sem complexidade.', duration: 30, price: 200 },
  { id: 'treat-005', name: 'Consulta de Avaliação', description: 'Avaliação inicial e plano de tratamento.', duration: 30, price: 100 },
];

export const mockProfessionals: Professional[] = [
  { 
    id: 'prof-001', 
    name: 'Dr. Aline Silva', 
    specialty: 'Odontologia Geral', 
    email: 'aline.silva@odonto.app', 
    phone: '(11) 98765-4321',
    availability: [
      { dayOfWeek: 'Monday', startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 'Friday', startTime: '09:00', endTime: '13:00' },
    ]
  },
  { 
    id: 'prof-002', 
    name: 'Dr. Bruno Marques', 
    specialty: 'Ortodontia', 
    email: 'bruno.marques@odonto.app', 
    phone: '(11) 91234-5678',
    availability: [
      { dayOfWeek: 'Tuesday', startTime: '10:00', endTime: '19:00' },
      { dayOfWeek: 'Thursday', startTime: '10:00', endTime: '19:00' },
    ]
  },
];

export const mockClients: Client[] = [
  { 
    id: 'client-001', 
    name: 'Carlos Pereira', 
    email: 'carlos.pereira@email.com', 
    phone: '(21) 99999-8888',
    dateOfBirth: '1985-07-20',
    address: 'Rua das Palmeiras, 123, Rio de Janeiro, RJ',
    medicalHistory: 'Hipertensão controlada. Nenhuma alergia conhecida.',
    treatmentHistory: [
      { treatmentId: 'treat-001', treatmentName: 'Limpeza Dental', date: '2023-01-15', notes: 'Procedimento padrão, sem intercorrências.' },
      { treatmentId: 'treat-005', treatmentName: 'Consulta de Avaliação', date: '2022-12-10', notes: 'Avaliação inicial.' },
    ]
  },
  { 
    id: 'client-002', 
    name: 'Beatriz Costa', 
    email: 'beatriz.costa@email.com', 
    phone: '(31) 97777-6666',
    dateOfBirth: '1992-03-10',
    address: 'Avenida Principal, 456, Belo Horizonte, MG',
    medicalHistory: 'Asma leve. Alergia a penicilina.',
    treatmentHistory: [
      { treatmentId: 'treat-002', treatmentName: 'Clareamento Dental', date: '2023-03-01', notes: 'Sessão única, resultado satisfatório.' },
    ]
  },
  { 
    id: 'client-003', 
    name: 'Fernanda Lima', 
    email: 'fernanda.lima@email.com', 
    phone: '(41) 96666-5555',
    medicalHistory: 'Cliente refere sensibilidade dentinária nos dentes inferiores anteriores. Última visita ao dentista há 2 anos para limpeza. Nega alergias medicamentosas. Faz uso de enxaguante bucal com flúor diariamente. Dieta balanceada, mas consome café diariamente.',
  }
];

export const mockAppointments: Appointment[] = [
  { 
    id: 'appt-001', 
    clientId: 'client-001', 
    clientName: 'Carlos Pereira',
    professionalId: 'prof-001',
    professionalName: 'Dr. Aline Silva',
    treatmentId: 'treat-001',
    treatmentName: 'Limpeza Dental',
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], 
    time: '10:00', 
    status: 'scheduled',
    notes: 'Confirmado.'
  },
  { 
    id: 'appt-002', 
    clientId: 'client-002', 
    clientName: 'Beatriz Costa',
    professionalId: 'prof-002',
    professionalName: 'Dr. Bruno Marques',
    treatmentId: 'treat-005',
    treatmentName: 'Consulta de Avaliação',
    date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], 
    time: '14:30', 
    status: 'scheduled' 
  },
  { 
    id: 'appt-003', 
    clientId: 'client-001', 
    clientName: 'Carlos Pereira',
    professionalId: 'prof-001',
    professionalName: 'Dr. Aline Silva',
    treatmentId: 'treat-003',
    treatmentName: 'Restauração (Resina)',
    date: '2023-05-20', 
    time: '11:00', 
    status: 'completed' 
  },
];
