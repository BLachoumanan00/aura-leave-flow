
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AppLayout from "@/components/layout/AppLayout";
import LeaveCalendar from "@/components/calendar/LeaveCalendar";
import WeekView from "@/components/calendar/WeekView";
import DayView from "@/components/calendar/DayView";
import LeaveForm from "@/components/leave/LeaveForm";
import LeaveDetails from "@/components/leave/LeaveDetails";
import MobileCalendar from "@/components/calendar/MobileCalendar";
import { Leave } from "@/types/leave";
import { getLeaves, addLeave, updateLeave, deleteLeave } from "@/lib/storage";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Calendar() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  
  // For mobile-specific sheet display
  const [showMobileSheet, setShowMobileSheet] = useState(false);
  
  useEffect(() => {
    setLeaves(getLeaves());
    
    // Check if there's an editLeave in the location state
    if (location.state?.editLeave) {
      setEditingLeave(location.state.editLeave);
      if (isMobile) {
        setShowMobileSheet(true);
      } else {
        setIsAddLeaveOpen(true);
      }
      // Clear the location state
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, isMobile]);
  
  const handleAddLeave = () => {
    setEditingLeave(null); // Ensure we're not in edit mode
    if (isMobile) {
      setShowMobileSheet(true);
    } else {
      setIsAddLeaveOpen(true);
    }
  };
  
  const handleSubmitLeave = (leave: Leave) => {
    let updatedLeaves;
    
    if (editingLeave) {
      // We're editing an existing leave
      updatedLeaves = updateLeave(leave);
      toast.success("Leave updated successfully");
    } else {
      // We're adding a new leave
      updatedLeaves = addLeave(leave);
      toast.success("Leave request submitted");
    }
    
    setLeaves(updatedLeaves);
    setIsAddLeaveOpen(false);
    setShowMobileSheet(false);
    setEditingLeave(null);
  };
  
  const handleEditLeave = (leave: Leave) => {
    setSelectedLeave(null); // Close details dialog
    setEditingLeave(leave);
    
    if (isMobile) {
      setShowMobileSheet(true);
    } else {
      setIsAddLeaveOpen(true);
    }
  };
  
  const handleDeleteLeave = (id: string) => {
    const updatedLeaves = deleteLeave(id);
    setLeaves(updatedLeaves);
    setSelectedLeave(null);
    toast.success("Leave deleted successfully");
  };
  
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    
    // Find leaves for this day
    const leavesForDay = leaves.filter(leave => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      return date >= leaveStart && date <= leaveEnd;
    });
    
    // If there's only one leave, open its details directly
    if (leavesForDay.length === 1) {
      setSelectedLeave(leavesForDay[0]);
    } else if (leavesForDay.length > 1) {
      // Show date details with multiple leaves
      setSelectedDate(date);
    }
  };
  
  const handleLeaveClick = (leave: Leave) => {
    setSelectedLeave(leave);
  };
  
  return (
    <AppLayout>
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gradient">Calendar</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          View and manage your leave schedule
        </p>
      </div>
      
      {isMobile ? (
        <>
          <MobileCalendar 
            leaves={leaves} 
            onDayClick={handleDayClick}
          />
          
          {/* Floating Action Button for mobile */}
          <Button 
            onClick={handleAddLeave} 
            className="fixed right-4 bottom-20 rounded-full h-14 w-14 shadow-lg"
            size="icon"
          >
            <PlusCircle className="h-6 w-6" />
          </Button>
        </>
      ) : (
        <Tabs defaultValue="month" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
            </TabsList>
            
            <Button onClick={handleAddLeave}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Leave
            </Button>
          </div>
          
          <TabsContent value="month" className="mt-0">
            <LeaveCalendar 
              leaves={leaves} 
              onAddLeave={handleAddLeave}
              onDayClick={handleDayClick}
            />
          </TabsContent>
          
          <TabsContent value="week" className="mt-0">
            <WeekView 
              leaves={leaves}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onDayClick={handleDayClick}
            />
          </TabsContent>
          
          <TabsContent value="day" className="mt-0">
            <DayView 
              leaves={leaves}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onLeaveClick={handleLeaveClick}
            />
          </TabsContent>
        </Tabs>
      )}
      
      {/* Add/Edit Leave Dialog (Desktop) */}
      <Dialog open={isAddLeaveOpen} onOpenChange={setIsAddLeaveOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <h2 className="text-xl font-semibold mb-4">
            {editingLeave ? "Edit Leave" : "Request New Leave"}
          </h2>
          <LeaveForm 
            onSubmit={handleSubmitLeave} 
            onCancel={() => {
              setIsAddLeaveOpen(false);
              setEditingLeave(null);
            }} 
            initialValues={editingLeave}
          />
        </DialogContent>
      </Dialog>
      
      {/* Add/Edit Leave Sheet (Mobile) */}
      <Sheet open={showMobileSheet} onOpenChange={setShowMobileSheet}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl pt-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingLeave ? "Edit Leave" : "Request New Leave"}
          </h2>
          <LeaveForm 
            onSubmit={handleSubmitLeave} 
            onCancel={() => {
              setShowMobileSheet(false);
              setEditingLeave(null);
            }}
            initialValues={editingLeave}
          />
        </SheetContent>
      </Sheet>
      
      {/* Leave Details Dialog */}
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
      
      {/* Date Details Dialog */}
      <Dialog 
        open={selectedDate !== null && selectedLeave === null} 
        onOpenChange={(open) => !open && setSelectedDate(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <h2 className="text-xl font-semibold mb-4">
            {selectedDate && format(selectedDate, "MMMM d, yyyy")}
          </h2>
          
          <div className="space-y-4">
            {selectedDate && 
              leaves
                .filter(leave => {
                  const date = selectedDate;
                  return date >= leave.startDate && date <= leave.endDate;
                })
                .map(leave => (
                  <div 
                    key={leave.id}
                    className={`p-4 rounded-lg bg-leave-${leave.type}/10 border border-leave-${leave.type}/30 cursor-pointer hover:bg-leave-${leave.type}/20`}
                    onClick={() => {
                      setSelectedDate(null);
                      setSelectedLeave(leave);
                    }}
                  >
                    <div className="font-medium">
                      {leave.type === "local" ? "Local Leave" :
                       leave.type === "sick" ? "Sick Leave" :
                       leave.type === "halfLocal" ? "½ Local Leave" :
                       leave.type === "halfSick" ? "½ Sick Leave" :
                       "Vacation"}
                    </div>
                    {leave.reason && (
                      <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {leave.reason}
                      </div>
                    )}
                  </div>
                ))
            }
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
