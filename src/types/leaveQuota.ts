
import { LeaveType } from "@/components/leave/LeaveTypeBadge";

export interface LeaveQuota {
  type: LeaveType;
  total: number;
  used: number;
}

// Initial default quotas
export const DEFAULT_LEAVE_QUOTAS: LeaveQuota[] = [
  { type: "local", total: 12, used: 0 },
  { type: "sick", total: 15, used: 0 },
  { type: "vacation", total: 20, used: 0 },
  { type: "halfLocal", total: 6, used: 0 },  // Half-day counts
  { type: "halfSick", total: 6, used: 0 },   // Half-day counts
];

// Calculate used leave days based on leave records
export const calculateUsedLeaves = (leaves: any[], quotas: LeaveQuota[]): LeaveQuota[] => {
  // Create a copy to avoid modifying the original
  const updatedQuotas = [...quotas];
  
  // Reset used counts
  updatedQuotas.forEach(quota => {
    quota.used = 0;
  });
  
  // Calculate used days for each leave type
  leaves.forEach(leave => {
    const quotaIndex = updatedQuotas.findIndex(q => q.type === leave.type);
    if (quotaIndex !== -1) {
      // Calculate the duration based on leave type and dates
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const days = Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))) + 1;
      
      // For half-day leaves, count as 0.5 days
      const multiplier = leave.type.startsWith('half') ? 0.5 : 1;
      updatedQuotas[quotaIndex].used += days * multiplier;
    }
  });
  
  return updatedQuotas;
};
