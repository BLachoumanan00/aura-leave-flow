import { Leave } from "@/types/leave";

const STORAGE_KEY = "aura-leave-data";
const SETTINGS_KEY = "aura-leave-settings";
const THEME_KEY = "aura-theme";
const VERSION_KEY = "aura-data-version";

// Current data version for migrations
const CURRENT_VERSION = "1.0.0";

// Settings interface for app configuration
interface AppSettings {
  notificationsEnabled: boolean;
  backupInterval: 'daily' | 'weekly' | 'monthly' | 'never';
  lastBackupDate: Date | null;
  biometricAuthEnabled: boolean;
  exportFormat: 'json' | 'csv' | 'pdf';
  dataRetention: number; // in months
  offlineMode: 'always' | 'auto' | 'never';
  weekStartsOn: 0 | 1 | 6; // 0 = Sunday, 1 = Monday, 6 = Saturday
}

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  notificationsEnabled: true,
  backupInterval: 'weekly',
  lastBackupDate: null,
  biometricAuthEnabled: false,
  exportFormat: 'json',
  dataRetention: 36, // 3 years
  offlineMode: 'auto',
  weekStartsOn: 0,
};

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

// Check current version and run migrations if needed
const checkVersionAndMigrate = (): void => {
  const savedVersion = localStorage.getItem(VERSION_KEY);
  
  if (!savedVersion) {
    // First-time setup
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    return;
  }
  
  if (savedVersion !== CURRENT_VERSION) {
    // Handle migrations between versions here
    console.log(`Migrating data from version ${savedVersion} to ${CURRENT_VERSION}`);
    
    // Run specific migrations based on version
    // Example: if (savedVersion === '0.9.0') { migrateFrom09To10(); }
    
    // Update to current version
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  }
};

// Initialize data store and run migrations
export const initializeData = (): Leave[] => {
  // Check version and migrate if needed
  checkVersionAndMigrate();
  
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
        lastModified: leave.lastModified ? new Date(leave.lastModified) : undefined,
        reminderDate: leave.reminderDate ? new Date(leave.reminderDate) : undefined,
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

// Get app settings
export const getSettings = (): AppSettings => {
  const storedSettings = localStorage.getItem(SETTINGS_KEY);
  
  if (storedSettings) {
    try {
      const parsed = JSON.parse(storedSettings);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        lastBackupDate: parsed.lastBackupDate ? new Date(parsed.lastBackupDate) : null,
      };
    } catch (error) {
      console.error("Error parsing stored settings:", error);
      return DEFAULT_SETTINGS;
    }
  }
  
  // If no settings exist, use defaults
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  return DEFAULT_SETTINGS;
};

// Save app settings
export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// Save leaves data with error handling and backup
export const saveLeaves = (leaves: Leave[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leaves));
    
    // Create backup in session storage as fallback
    sessionStorage.setItem(`${STORAGE_KEY}-backup`, JSON.stringify(leaves));
  } catch (error) {
    console.error("Error saving leave data:", error);
    
    // If localStorage is full, try to clean up
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      // Handle storage full error
      console.warn("Storage quota exceeded, attempting cleanup");
      
      // Remove oldest leaves if too many
      if (leaves.length > 100) {
        const sortedLeaves = [...leaves].sort((a, b) => 
          a.createdAt.getTime() - b.createdAt.getTime()
        );
        
        // Keep only the most recent 100 leaves
        const trimmedLeaves = sortedLeaves.slice(-100);
        
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedLeaves));
        } catch (innerError) {
          console.error("Failed to save even after cleanup:", innerError);
        }
      }
    }
  }
};

// Add new leave
export const addLeave = (leave: Leave): Leave[] => {
  const leaves = getLeaves();
  const updatedLeaves = [...leaves, leave];
  saveLeaves(updatedLeaves);
  return updatedLeaves;
};

// Get all leaves
export const getLeaves = (): Leave[] => {
  return initializeData();
};

// Update existing leave
export const updateLeave = (updatedLeave: Leave): Leave[] => {
  const leaves = getLeaves();
  const updatedLeaves = leaves.map(leave => 
    leave.id === updatedLeave.id ? updatedLeave : leave
  );
  saveLeaves(updatedLeaves);
  return updatedLeaves;
};

// Delete leave by ID
export const deleteLeave = (id: string): Leave[] => {
  const leaves = getLeaves();
  const updatedLeaves = leaves.filter(leave => leave.id !== id);
  saveLeaves(updatedLeaves);
  return updatedLeaves;
};

// Backup data to JSON file
export const backupData = (): string => {
  const leaves = getLeaves();
  const settings = getSettings();
  
  const backupData = {
    version: CURRENT_VERSION,
    timestamp: new Date().toISOString(),
    leaves,
    settings,
  };
  
  const dataStr = JSON.stringify(backupData, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  // Update last backup date
  const updatedSettings = {...settings, lastBackupDate: new Date()};
  saveSettings(updatedSettings);
  
  return dataUri;
};

// Restore from backup
export const restoreFromBackup = (backupStr: string): boolean => {
  try {
    const backup = JSON.parse(backupStr);
    
    // Validate backup data
    if (!backup.version || !backup.leaves || !Array.isArray(backup.leaves)) {
      throw new Error("Invalid backup format");
    }
    
    // Convert date strings back to Date objects
    const leaves = backup.leaves.map((leave: any) => ({
      ...leave,
      startDate: new Date(leave.startDate),
      endDate: new Date(leave.endDate),
      createdAt: new Date(leave.createdAt),
      lastModified: leave.lastModified ? new Date(leave.lastModified) : undefined,
      reminderDate: leave.reminderDate ? new Date(leave.reminderDate) : undefined,
    }));
    
    // Restore leaves
    saveLeaves(leaves);
    
    // Restore settings if available
    if (backup.settings) {
      const settings = {
        ...backup.settings,
        lastBackupDate: backup.settings.lastBackupDate ? new Date(backup.settings.lastBackupDate) : null,
      };
      saveSettings(settings);
    }
    
    return true;
  } catch (error) {
    console.error("Error restoring from backup:", error);
    return false;
  }
};

// Clear all data (for testing or user request)
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  // Don't remove version key to maintain migration history
};

// Set theme preference
export const setThemePreference = (theme: 'light' | 'dark' | 'system'): void => {
  localStorage.setItem(THEME_KEY, theme);
};

// Get theme preference
export const getThemePreference = (): 'light' | 'dark' | 'system' => {
  const theme = localStorage.getItem(THEME_KEY);
  return (theme as 'light' | 'dark' | 'system') || 'system';
};
