
import { useState } from "react";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Leave } from "@/types/leave";
import LeaveTypeBadge from "@/components/leave/LeaveTypeBadge";
import { Card } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

interface DayViewProps {
  leaves: Leave[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onLeaveClick: (leave: Leave) => void;
}

export default function DayView({ leaves, currentDate, onDateChange, onLeaveClick }: DayViewProps) {
  // Function to get leaves for the current day
  const getLeavesForDay = () => {
    return leaves.filter(leave => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      return currentDate >= leaveStart && currentDate <= leaveEnd;
    });
  };
  
  // Move to previous day
  const previousDay = () => {
    onDateChange(addDays(currentDate, -1));
  };
  
  // Move to next day
  const nextDay = () => {
    onDateChange(addDays(currentDate, 1));
  };
  
  const dayLeaves = getLeavesForDay();
  const isToday = isSameDay(currentDate, new Date());
  
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            {format(currentDate, "EEEE, MMMM d, yyyy")}
            {isToday && <span className="ml-2 text-sm bg-primary/20 px-2 py-0.5 rounded-full">Today</span>}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" onClick={nextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Day timeline */}
      <div className="my-4 py-4 border-y">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <CalendarDays className="h-4 w-4" />
          <span className="text-sm font-medium">Schedule</span>
        </div>
        
        {dayLeaves.length > 0 ? (
          <div className="space-y-3">
            {dayLeaves.map((leave) => (
              <Card 
                key={leave.id} 
                className={cn(
                  "p-3 cursor-pointer hover:bg-muted/30 transition-colors",
                  "border-l-4",
                  `border-l-leave-${leave.type}`
                )}
                onClick={() => onLeaveClick(leave)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <LeaveTypeBadge type={leave.type} />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(leave.startDate), "MMM d")}
                        {!isSameDay(new Date(leave.startDate), new Date(leave.endDate)) && 
                          ` - ${format(new Date(leave.endDate), "MMM d")}`}
                      </span>
                    </div>
                    
                    {leave.reason && (
                      <div>
                        <p className="text-sm mt-2 mb-1 font-medium">Reason:</p>
                        <p className="text-sm pl-2 border-l-2 border-muted">
                          {leave.reason}
                        </p>
                      </div>
                    )}
                    
                    {leave.attachmentName && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>Attachment: {leave.attachmentName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No leaves scheduled for today</p>
            <p className="text-sm mt-1">Select another day or add a new leave</p>
          </div>
        )}
      </div>
      
      {/* Future: Show timeline here */}
      <div className="text-center mt-6 text-sm text-muted-foreground">
        {isToday ? 'Today' : format(currentDate, "MMMM d, yyyy")}
      </div>
    </div>
  );
}
