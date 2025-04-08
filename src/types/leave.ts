
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
}
