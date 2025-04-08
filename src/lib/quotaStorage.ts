
import { LeaveQuota, DEFAULT_LEAVE_QUOTAS } from "@/types/leaveQuota";

const QUOTAS_KEY = "aura-leave-quotas";

// Get leave quotas from storage
export const getLeaveQuotas = (): LeaveQuota[] => {
  const storedQuotas = localStorage.getItem(QUOTAS_KEY);
  
  if (storedQuotas) {
    try {
      return JSON.parse(storedQuotas);
    } catch (error) {
      console.error("Error parsing stored leave quotas:", error);
      return DEFAULT_LEAVE_QUOTAS;
    }
  }
  
  // Initialize with default quotas if none exist
  localStorage.setItem(QUOTAS_KEY, JSON.stringify(DEFAULT_LEAVE_QUOTAS));
  return DEFAULT_LEAVE_QUOTAS;
};

// Update leave quotas
export const updateLeaveQuotas = (quotas: LeaveQuota[]): void => {
  localStorage.setItem(QUOTAS_KEY, JSON.stringify(quotas));
};

// Reset to default quotas
export const resetLeaveQuotas = (): LeaveQuota[] => {
  localStorage.setItem(QUOTAS_KEY, JSON.stringify(DEFAULT_LEAVE_QUOTAS));
  return DEFAULT_LEAVE_QUOTAS;
};
