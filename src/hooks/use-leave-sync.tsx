
import { useState, useEffect } from "react";
import { Leave } from "@/types/leave";
import { getLeaves, saveLeaves } from "@/lib/storage";
import { toast } from "sonner";

// Enhanced Leave interface with sync-related properties
interface SyncableLeave extends Leave {
  isSynced?: boolean;
  lastModified?: Date;
}

export function useLeaveSync() {
  const [leaves, setLeaves] = useState<SyncableLeave[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Track online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You're back online! Syncing data...");
      syncLeaves();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("You're offline. Changes will be saved locally.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load leaves on mount
  useEffect(() => {
    const storedLeaves = getLeaves();
    // Convert to SyncableLeave if they aren't already
    const syncableLeaves = storedLeaves.map(leave => ({
      ...leave,
      isSynced: true,
      lastModified: leave.lastModified || new Date(),
    }));
    setLeaves(syncableLeaves);
  }, []);

  // Synchronize leaves with "server" (simulated)
  const syncLeaves = async () => {
    if (!isOnline) {
      toast.error("Cannot sync while offline");
      return;
    }

    setIsSyncing(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mark all leaves as synced
      const syncedLeaves = leaves.map(leave => ({
        ...leave,
        isSynced: true,
      }));
      
      setLeaves(syncedLeaves);
      saveLeaves(syncedLeaves);
      setLastSyncTime(new Date());
      toast.success("All data synchronized successfully");
    } catch (error) {
      toast.error("Failed to synchronize data");
      console.error("Sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Add a leave with sync status
  const addLeave = (leave: Leave) => {
    const newLeave: SyncableLeave = {
      ...leave,
      isSynced: isOnline,
      lastModified: new Date(),
    };
    
    const updatedLeaves = [...leaves, newLeave];
    setLeaves(updatedLeaves);
    saveLeaves(updatedLeaves);
    
    if (isOnline) {
      // Simulate server sync
      setTimeout(() => {
        const synced = updatedLeaves.map(l => 
          l.id === newLeave.id ? { ...l, isSynced: true } : l
        );
        setLeaves(synced);
        saveLeaves(synced);
      }, 1000);
    }
    
    return updatedLeaves;
  };

  // Update a leave with sync status
  const updateLeave = (updatedLeave: Leave) => {
    const leave: SyncableLeave = {
      ...updatedLeave,
      isSynced: isOnline,
      lastModified: new Date(),
    };
    
    const updatedLeaves = leaves.map(l => 
      l.id === leave.id ? leave : l
    );
    
    setLeaves(updatedLeaves);
    saveLeaves(updatedLeaves);
    
    if (isOnline) {
      // Simulate server sync
      setTimeout(() => {
        const synced = updatedLeaves.map(l => 
          l.id === leave.id ? { ...l, isSynced: true } : l
        );
        setLeaves(synced);
        saveLeaves(synced);
      }, 1000);
    }
    
    return updatedLeaves;
  };

  // Delete a leave
  const deleteLeave = (id: string) => {
    const updatedLeaves = leaves.filter(leave => leave.id !== id);
    setLeaves(updatedLeaves);
    saveLeaves(updatedLeaves);
    return updatedLeaves;
  };

  // Export leaves to JSON
  const exportLeaves = () => {
    try {
      const dataStr = JSON.stringify(leaves, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `leave-data-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success("Leave data exported successfully");
    } catch (error) {
      toast.error("Failed to export data");
      console.error("Export error:", error);
    }
  };

  // Import leaves from JSON
  const importLeaves = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (typeof event.target?.result === 'string') {
          const importedLeaves = JSON.parse(event.target.result) as SyncableLeave[];
          // Update with current status
          const processedLeaves = importedLeaves.map(leave => ({
            ...leave,
            isSynced: false,
            lastModified: new Date(),
          }));
          
          setLeaves(processedLeaves);
          saveLeaves(processedLeaves);
          toast.success("Leave data imported successfully");
          
          if (isOnline) {
            // Trigger sync
            syncLeaves();
          }
        }
      } catch (error) {
        toast.error("Failed to import data: Invalid format");
        console.error("Import error:", error);
      }
    };
    
    reader.readAsText(file);
  };

  return {
    leaves,
    addLeave,
    updateLeave,
    deleteLeave,
    isOnline,
    isSyncing,
    lastSyncTime,
    syncLeaves,
    exportLeaves,
    importLeaves,
  };
}
