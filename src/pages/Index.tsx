
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AppLayout from "@/components/layout/AppLayout";
import LeaveStats from "@/components/dashboard/LeaveStats";
import InsightsCard from "@/components/dashboard/InsightsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import LeaveForm from "@/components/leave/LeaveForm";
import { Leave } from "@/types/leave";
import { addLeave } from "@/lib/storage";

export default function Index() {
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  
  const handleSubmitLeave = (leave: Leave) => {
    addLeave(leave);
    setIsAddLeaveOpen(false);
  };
  
  return (
    <AppLayout>
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
          <LeaveStats />
          <InsightsCard />
        </div>
      </div>
      
      <Dialog open={isAddLeaveOpen} onOpenChange={setIsAddLeaveOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <h2 className="text-xl font-semibold mb-4">Request New Leave</h2>
          <LeaveForm 
            onSubmit={handleSubmitLeave} 
            onCancel={() => setIsAddLeaveOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
