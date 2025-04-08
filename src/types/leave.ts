
import { LeaveType } from "@/components/leave/LeaveTypeBadge";

export interface Leave {
  id: string;
  startDate: Date;
  endDate: Date;
  type: LeaveType;
  reason: string;
  attachmentName: string | null;
  createdAt: Date;
}
