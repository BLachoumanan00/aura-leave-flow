
import { useState, useEffect } from "react";
import { PlusCircle, Calculator, BarChart, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import AppLayout from "@/components/layout/AppLayout";
import InsightsCard from "@/components/dashboard/InsightsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import LeaveForm from "@/components/leave/LeaveForm";
import { Leave } from "@/types/leave";
import { addLeave, getLeaves } from "@/lib/storage";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import EditableLeaveStats from "@/components/dashboard/EditableLeaveStats";
import { LeaveQuota, calculateUsedLeaves } from "@/types/leaveQuota";
import { getLeaveQuotas, updateLeaveQuotas } from "@/lib/quotaStorage";

export default function Index() {
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [showMobileSheet, setShowMobileSheet] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [leaveQuotas, setLeaveQuotas] = useState<LeaveQuota[]>([]);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  useEffect(() => {
    const allLeaves = getLeaves();
    setLeaves(allLeaves);
    
    // Get and update leave quotas
    const quotas = getLeaveQuotas();
    const updatedQuotas = calculateUsedLeaves(allLeaves, quotas);
    setLeaveQuotas(updatedQuotas);
  }, []);
  
  const handleSubmitLeave = (leave: Leave) => {
    const updatedLeaves = addLeave(leave);
    setLeaves(updatedLeaves);
    
    // Update quotas based on new leaves
    const updatedQuotas = calculateUsedLeaves(updatedLeaves, leaveQuotas);
    setLeaveQuotas(updatedQuotas);
    updateLeaveQuotas(updatedQuotas);
    
    setIsAddLeaveOpen(false);
    setShowMobileSheet(false);
  };
  
  const handleUpdateQuotas = (quotas: LeaveQuota[]) => {
    setLeaveQuotas(quotas);
    updateLeaveQuotas(quotas);
  };
  
  const handleAddLeave = () => {
    if (isMobile) {
      setShowMobileSheet(true);
    } else {
      setIsAddLeaveOpen(true);
    }
  };
  
  // Count leaves by type
  const countLeavesByType = (type: string) => {
    return leaves.filter(leave => leave.type === type).length;
  };
  
  // Calculate upcoming leaves
  const upcomingLeaves = leaves.filter(leave => 
    new Date(leave.startDate) >= new Date()
  ).length;
  
  // Function to render mobile dashboard
  const renderMobileDashboard = () => {
    return (
      <>
        <div className="glass-card p-5 rounded-xl mb-6">
          <EditableLeaveStats quotas={leaveQuotas} onUpdateQuotas={handleUpdateQuotas} />
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card 
            className="p-3 flex flex-col items-center justify-center aspect-square"
            onClick={() => navigate('/calendar')}
          >
            <CalendarIcon className="h-8 w-8 text-primary mb-2" />
            <span className="text-sm font-medium">Calendar</span>
            {upcomingLeaves > 0 && (
              <span className="mt-1 text-xs text-muted-foreground">
                {upcomingLeaves} upcoming
              </span>
            )}
          </Card>
          
          <Card 
            className="p-3 flex flex-col items-center justify-center aspect-square"
            onClick={() => navigate('/leave-logs')}
          >
            <Calculator className="h-8 w-8 text-primary mb-2" />
            <span className="text-sm font-medium">Leave Logs</span>
            <span className="mt-1 text-xs text-muted-foreground">
              {leaves.length} total
            </span>
          </Card>
          
          <Card 
            className="p-3 flex flex-col items-center justify-center aspect-square"
            onClick={() => navigate('/analytics')}
          >
            <BarChart className="h-8 w-8 text-primary mb-2" />
            <span className="text-sm font-medium">Analytics</span>
          </Card>
          
          <Card 
            className="p-3 flex flex-col items-center justify-center aspect-square bg-primary/10"
            onClick={handleAddLeave}
          >
            <PlusCircle className="h-8 w-8 text-primary mb-2" />
            <span className="text-sm font-medium">New Leave</span>
          </Card>
        </div>
        
        <h2 className="text-xl font-semibold mb-3">Insights</h2>
        <InsightsCard />
        
        <h2 className="text-xl font-semibold mt-6 mb-3">Recent Activity</h2>
        <RecentActivity />
        
        {/* Floating Action Button */}
        <Button 
          onClick={handleAddLeave} 
          className="fixed right-4 bottom-20 rounded-full h-14 w-14 shadow-lg"
          size="icon"
        >
          <PlusCircle className="h-6 w-6" />
        </Button>
      </>
    );
  };
  
  // Function to render desktop dashboard
  const renderDesktopDashboard = () => {
    return (
      <>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your leave management
            </p>
          </div>
          
          <Button onClick={() => setIsAddLeaveOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Leave
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Welcome Back!</h2>
              <p className="text-muted-foreground">
                Track your leaves, plan ahead, and maintain a healthy work-life balance with Aura Leave.
              </p>
            </div>
            
            <RecentActivity />
          </div>
          
          <div className="space-y-6">
            <EditableLeaveStats quotas={leaveQuotas} onUpdateQuotas={handleUpdateQuotas} />
            <InsightsCard />
          </div>
        </div>
      </>
    );
  };
  
  return (
    <AppLayout>
      {isMobile ? renderMobileDashboard() : renderDesktopDashboard()}
      
      {/* Add Leave Dialog (Desktop) */}
      <Dialog open={isAddLeaveOpen} onOpenChange={setIsAddLeaveOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <h2 className="text-xl font-semibold mb-4">Request New Leave</h2>
          <LeaveForm 
            onSubmit={handleSubmitLeave} 
            onCancel={() => setIsAddLeaveOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Add Leave Sheet (Mobile) */}
      <Sheet open={showMobileSheet} onOpenChange={setShowMobileSheet}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl pt-6">
          <h2 className="text-xl font-semibold mb-4">Request New Leave</h2>
          <LeaveForm 
            onSubmit={handleSubmitLeave} 
            onCancel={() => setShowMobileSheet(false)} 
          />
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
