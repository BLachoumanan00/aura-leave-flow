
import { LeaveType } from "@/components/leave/LeaveTypeBadge";

export interface Leave {
  id: string;
  startDate: Date;
  endDate: Date;
  type: LeaveType;
  reason: string;
  attachmentName: string | null;
  createdAt: Date;
  mood?: 'good' | 'neutral' | 'bad'; // Optional mood tracking
  location?: string; // Optional location data
  isSynced?: boolean; // For offline-first functionality
  lastModified?: Date; // For tracking changes
  reminderDate?: Date; // For setting reminders
  tags?: string[]; // For categorizing leaves
  notes?: string; // For additional private notes
  weather?: {  // Capture weather conditions when leave was created
    condition?: string;
    temperature?: number;
  };
}

// Helper functions for leave management
export const calculateLeaveDuration = (leave: Leave): number => {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const startDate = new Date(leave.startDate);
  const endDate = new Date(leave.endDate);
  
  // Add 1 to include both start and end dates
  return Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay)) + 1;
};

export const isLeaveActive = (leave: Leave): boolean => {
  const today = new Date();
  const startDate = new Date(leave.startDate);
  const endDate = new Date(leave.endDate);
  
  return today >= startDate && today <= endDate;
};

export const isLeavePast = (leave: Leave): boolean => {
  const today = new Date();
  const endDate = new Date(leave.endDate);
  
  return today > endDate;
};

export const isLeaveFuture = (leave: Leave): boolean => {
  const today = new Date();
  const startDate = new Date(leave.startDate);
  
  return today < startDate;
};

export const groupLeavesByMonth = (leaves: Leave[]): Record<string, Leave[]> => {
  return leaves.reduce((acc, leave) => {
    const monthKey = new Date(leave.startDate).toISOString().slice(0, 7); // YYYY-MM format
    
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    
    acc[monthKey].push(leave);
    return acc;
  }, {} as Record<string, Leave[]>);
};
