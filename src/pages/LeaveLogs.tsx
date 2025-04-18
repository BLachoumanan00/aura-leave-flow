import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import LeaveCard from "@/components/leave/LeaveCard";
import LeaveDetails from "@/components/leave/LeaveDetails";
import LeaveForm from "@/components/leave/LeaveForm";
import { LeaveType } from "@/components/leave/LeaveTypeBadge";
import { Leave } from "@/types/leave";
import { getLeaves, deleteLeave, updateLeave } from "@/lib/storage";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

export default function LeaveLogs() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [filteredLeaves, setFilteredLeaves] = useState<Leave[]>([]);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<LeaveType | "all">("all");
  const isMobile = useIsMobile();
  const [showEditSheet, setShowEditSheet] = useState(false);
  
  useEffect(() => {
    const fetchedLeaves = getLeaves();
    setLeaves(fetchedLeaves);
    setFilteredLeaves(fetchedLeaves);
  }, []);
  
  useEffect(() => {
    let result = leaves;
    
    // Filter by search term (reason)
    if (searchTerm) {
      result = result.filter(leave => 
        leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by leave type
    if (filterType !== "all") {
      result = result.filter(leave => leave.type === filterType);
    }
    
    // Sort by start date descending (most recent first)
    result = [...result].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    
    setFilteredLeaves(result);
  }, [leaves, searchTerm, filterType]);
  
  const handleViewLeave = (leave: Leave) => {
    setSelectedLeave(leave);
  };
  
  const handleEditLeave = (leave: Leave) => {
    setSelectedLeave(null);
    setEditingLeave(leave);
    
    if (isMobile) {
      setShowEditSheet(true);
    } else {
      // Keep dialog open but switch to edit mode
      setSelectedLeave(null);
      setTimeout(() => setEditingLeave(leave), 100);
    }
  };
  
  const handleDeleteLeave = (id: string) => {
    const updatedLeaves = deleteLeave(id);
    setLeaves(updatedLeaves);
    setSelectedLeave(null);
    toast.success("Leave deleted successfully");
  };
  
  const handleSubmitEdit = (leave: Leave) => {
    const updatedLeaves = updateLeave(leave);
    setLeaves(updatedLeaves);
    setEditingLeave(null);
    setShowEditSheet(false);
    toast.success("Leave updated successfully");
  };
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gradient">Leave Logs</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage your leave history
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by reason..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select
          value={filterType}
          onValueChange={(value) => setFilterType(value as LeaveType | "all")}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="local">Local Leave</SelectItem>
            <SelectItem value="sick">Sick Leave</SelectItem>
            <SelectItem value="halfLocal">½ Local Leave</SelectItem>
            <SelectItem value="halfSick">½ Sick Leave</SelectItem>
            <SelectItem value="vacation">Vacation</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredLeaves.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeaves.map((leave) => (
            <LeaveCard
              key={leave.id}
              leave={leave}
              onView={handleViewLeave}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-60 bg-card rounded-xl">
          <p className="text-xl font-medium mb-2">No leaves found</p>
          <p className="text-muted-foreground text-center max-w-md">
            {searchTerm || filterType !== "all"
              ? "Try adjusting your search or filters"
              : "You haven't recorded any leaves yet"}
          </p>
        </div>
      )}
      
      <Dialog 
        open={selectedLeave !== null} 
        onOpenChange={(open) => !open && setSelectedLeave(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <h2 className="text-xl font-semibold mb-4">Leave Details</h2>
          {selectedLeave && (
            <LeaveDetails 
              leave={selectedLeave} 
              onClose={() => setSelectedLeave(null)}
              onEdit={handleEditLeave}
              onDelete={handleDeleteLeave}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog 
        open={editingLeave !== null && !isMobile} 
        onOpenChange={(open) => !open && setEditingLeave(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <h2 className="text-xl font-semibold mb-4">Edit Leave</h2>
          {editingLeave && (
            <LeaveForm 
              initialValues={editingLeave}
              onSubmit={handleSubmitEdit}
              onCancel={() => setEditingLeave(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Sheet open={showEditSheet} onOpenChange={setShowEditSheet}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl pt-6">
          <h2 className="text-xl font-semibold mb-4">Edit Leave</h2>
          {editingLeave && (
            <LeaveForm 
              initialValues={editingLeave}
              onSubmit={handleSubmitEdit}
              onCancel={() => {
                setShowEditSheet(false);
                setEditingLeave(null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
