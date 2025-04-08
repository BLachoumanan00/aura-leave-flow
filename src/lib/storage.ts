
import { Leave } from "@/types/leave";

const STORAGE_KEY = "aura-leave-data";

// Initial sample data
const INITIAL_DATA: Leave[] = [
  {
    id: "1",
    startDate: new Date(2025, 3, 5), // April 5, 2025
    endDate: new Date(2025, 3, 5),
    type: "sick",
    reason: "Feeling unwell, need to rest",
    attachmentName: null,
    createdAt: new Date(2025, 3, 4),
  },
  {
    id: "2",
    startDate: new Date(2025, 3, 24), // April 24, 2025
    endDate: new Date(2025, 3, 30), // April 30, 2025
    type: "vacation",
    reason: "Annual family vacation",
    attachmentName: "vacation_details.pdf",
    createdAt: new Date(2025, 3, 1),
  },
  {
    id: "3",
    startDate: new Date(2025, 3, 15), // April 15, 2025
    endDate: new Date(2025, 3, 15),
    type: "halfLocal",
    reason: "Afternoon appointment",
    attachmentName: null,
    createdAt: new Date(2025, 3, 14),
  },
];

// Helper functions to initialize, get and save leave data
export const initializeData = (): Leave[] => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  
  if (storedData) {
    try {
      // Parse the stored data
      const parsed = JSON.parse(storedData);
      
      // Convert date strings back to Date objects
      return parsed.map((leave: any) => ({
        ...leave,
        startDate: new Date(leave.startDate),
        endDate: new Date(leave.endDate),
        createdAt: new Date(leave.createdAt),
      }));
    } catch (error) {
      console.error("Error parsing stored leave data:", error);
      return INITIAL_DATA;
    }
  }
  
  // If no data exists, use the initial sample data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
  return INITIAL_DATA;
};

export const saveLeaves = (leaves: Leave[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leaves));
};

export const addLeave = (leave: Leave): Leave[] => {
  const leaves = getLeaves();
  const updatedLeaves = [...leaves, leave];
  saveLeaves(updatedLeaves);
  return updatedLeaves;
};

export const getLeaves = (): Leave[] => {
  return initializeData();
};

export const updateLeave = (updatedLeave: Leave): Leave[] => {
  const leaves = getLeaves();
  const updatedLeaves = leaves.map(leave => 
    leave.id === updatedLeave.id ? updatedLeave : leave
  );
  saveLeaves(updatedLeaves);
  return updatedLeaves;
};

export const deleteLeave = (id: string): Leave[] => {
  const leaves = getLeaves();
  const updatedLeaves = leaves.filter(leave => leave.id !== id);
  saveLeaves(updatedLeaves);
  return updatedLeaves;
};
