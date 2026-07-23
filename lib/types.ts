// Domain types for ClinicOS
// Designed to map cleanly onto a Firestore/Firebase schema later.

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Department =
  | 'Cardiology'
  | 'Neurology'
  | 'Orthopedics'
  | 'Pediatrics'
  | 'Dermatology'
  | 'General Medicine'
  | 'Oncology'
  | 'Psychiatry';

export type PatientStatus = 'active' | 'follow-up' | 'critical' | 'new';

export type Gender = 'Male' | 'Female' | 'Other';

export type SenderRole = 'patient' | 'ai' | 'doctor';

export type NotificationType =
  | 'appointment_request'
  | 'cancellation'
  | 'emergency'
  | 'system'
  | 'summary_ready';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  email: string;
  avatarUrl?: string;
  bloodType: string;
  status: PatientStatus;
  lastVisit: string; // ISO date
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory: MedicalRecord[];
  medications: Medication[];
  allergies: string[];
  conditions: string[];
}

export interface MedicalRecord {
  id: string;
  date: string; // ISO date
  title: string;
  description: string;
  doctor: string;
  department: Department;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  status: 'active' | 'discontinued';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatarUrl?: string;
  time: string; // e.g. "09:00"
  endTime: string; // e.g. "09:30"
  date: string; // ISO date
  status: AppointmentStatus;
  priority: Priority;
  department: Department;
  reason: string;
  durationMinutes: number;
}

export interface AiSummary {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId: string;
  generatedAt: string; // ISO datetime
  chiefComplaint: string;
  symptomsSummary: string[];
  medicalHistorySummary: string;
  riskFlags: string[];
  missingInformation: string[];
  suggestedFollowUpQuestions: string[];
  conversationId: string;
  confidence: number; // 0-100
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: SenderRole;
  content: string;
  timestamp: string; // ISO datetime
}

export interface Conversation {
  id: string;
  patientId: string;
  patientName: string;
  startedAt: string;
  messageCount: number;
  summaryId?: string;
}

export interface DoctorNote {
  id: string;
  patientId: string;
  appointmentId: string;
  diagnosis: string;
  clinicalNotes: string;
  treatmentPlan: string;
  prescription: string;
  followUpDate: string; // ISO date
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string; // ISO datetime
  read: boolean;
  patientId?: string;
}

export interface DoctorProfile {
  id: string;
  name: string;
  title: string;
  specialty: Department;
  avatarUrl?: string;
  email: string;
  phone: string;
  license: string;
  hospital: string;
  yearsExperience: number;
}
