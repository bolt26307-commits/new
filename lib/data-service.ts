// Firebase-ready data access layer.
//
// Today this reads from local dummy data (lib/data.ts). When Firebase is wired
// up, only the bodies of these functions change — every component already
// imports from here, so the swap is localized to this file.

import {
  patients,
  appointments,
  aiSummaries,
  chatMessages,
  conversations,
  doctorNotes,
  notifications,
  weeklyAppointmentTrend,
  monthlyConsultationTrend,
  departmentDistribution,
  patientDemographics,
  doctorPerformance,
  satisfactionTrend,
} from './data';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '@/firebase/auth';
import { db } from '@/firebase/firestore';
import type {
  Patient,
  Appointment,
  AiSummary,
  ChatMessage,
  Conversation,
  DoctorNote,
  AppNotification,
  DoctorProfile,
} from './types';

// Simulate async fetch so the UI can show skeleton states.
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const dataService = {
  // --- Doctor ---
  async getDoctorProfile(): Promise<DoctorProfile> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const snap = await getDoc(doc(db, 'users', currentUser.uid));
    if (!snap.exists()) {
      throw new Error('User profile not found');
    }

    const data = snap.data();
    return {
      id: currentUser.uid,
      name: data.name ?? 'Unknown',
      title: data.title ?? '',
      specialty: data.specialty ?? 'General Medicine',
      avatarUrl: data.avatarUrl,
      email: data.email ?? currentUser.email ?? '',
      phone: data.phone ?? '',
      license: data.license ?? '',
      hospital: data.hospital ?? '',
      yearsExperience: data.yearsExperience ?? 0,
    };
  },

  // --- Patients ---
  async getPatients(): Promise<Patient[]> {
    await delay();
    return patients;
  },
  async getPatient(id: string): Promise<Patient | undefined> {
    await delay();
    return patients.find((p) => p.id === id);
  },

  // --- Appointments ---
  async getAppointments(): Promise<Appointment[]> {
    await delay();
    return appointments;
  },
  async getAppointmentsForDate(date: string): Promise<Appointment[]> {
    await delay();
    return appointments.filter((a) => a.date === date);
  },
  async getTodaysAppointments(): Promise<Appointment[]> {
    await delay();
    const todayStr = new Date().toISOString().slice(0, 10);
    return appointments.filter((a) => a.date === todayStr);
  },

  // --- AI Summaries ---
  async getAiSummaries(): Promise<AiSummary[]> {
    await delay();
    return aiSummaries;
  },
  async getAiSummaryForPatient(patientId: string): Promise<AiSummary | undefined> {
    await delay();
    return aiSummaries.find((s) => s.patientId === patientId);
  },
  async getAiSummary(id: string): Promise<AiSummary | undefined> {
    await delay();
    return aiSummaries.find((s) => s.id === id);
  },

  // --- Conversations ---
  async getConversations(): Promise<Conversation[]> {
    await delay();
    return conversations;
  },
  async getConversation(id: string): Promise<Conversation | undefined> {
    await delay();
    return conversations.find((c) => c.id === id);
  },
  async getChatMessages(conversationId: string): Promise<ChatMessage[]> {
    await delay();
    return chatMessages.filter((m) => m.conversationId === conversationId);
  },

  // --- Doctor Notes ---
  async getDoctorNotes(): Promise<DoctorNote[]> {
    await delay();
    return doctorNotes;
  },
  async getDoctorNoteForPatient(patientId: string): Promise<DoctorNote | undefined> {
    await delay();
    return doctorNotes.find((n) => n.patientId === patientId);
  },

  // --- Notifications ---
  async getNotifications(): Promise<AppNotification[]> {
    await delay();
    return notifications;
  },

  // --- Analytics ---
  async getWeeklyAppointmentTrend() {
    await delay();
    return weeklyAppointmentTrend;
  },
  async getMonthlyConsultationTrend() {
    await delay();
    return monthlyConsultationTrend;
  },
  async getDepartmentDistribution() {
    await delay();
    return departmentDistribution;
  },
  async getPatientDemographics() {
    await delay();
    return patientDemographics;
  },
  async getDoctorPerformance() {
    await delay();
    return doctorPerformance;
  },
  async getSatisfactionTrend() {
    await delay();
    return satisfactionTrend;
  },
};
