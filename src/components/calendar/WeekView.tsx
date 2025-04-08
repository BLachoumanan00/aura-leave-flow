
import { useState, useMemo } from "react";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Leave } from "@/types/leave";
import LeaveTypeBadge from "@/components/leave/LeaveTypeBadge";
import { Card } from "@/components/ui/card";

interface WeekViewProps {
  leaves: Leave[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onDayClick: (date: Date) => void;
}

export default function WeekView({ leaves, currentDate, onDateChange, onDayClick }: WeekViewProps) {
  // Get the days of the current week
  const weekDays = useMemo(() => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  }, [currentDate]);
  
  // Move to previous week
  const previousWeek = () => {
    onDateChange(addDays(currentDate, -7));
  };
  
  // Move to next week
  const nextWeek = () => {
    onDateChange(addDays(currentDate, 7));
  };
  
  // Function to get leaves for a specific day
  const getLeavesForDay = (day: Date) => {
    return leaves.filter(leave => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      return day >= leaveStart && day <= leaveEnd;
    });
  };

  // Get day of week headers
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            Week of {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day, index) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Week dates */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day) => {
          const isToday = isSameDay(day, new Date());
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "h-12 flex flex-col items-center justify-center cursor-pointer rounded-md hover:bg-muted/50 transition-colors",
                isToday ? "bg-primary/10 font-medium" : ""
              )}
              onClick={() => onDayClick(day)}
            >
              <div className="text-sm">{format(day, "d")}</div>
              <div className="text-xs text-muted-foreground">{format(day, "MMM")}</div>
            </div>
          );
        })}
      </div>
      
      {/* Leave events for the week */}
      <div className="space-y-2">
        {weekDays.map((day) => {
          const dayLeaves = getLeavesForDay(day);
          
          if (dayLeaves.length === 0) return null;
          
          return (
            <div key={day.toString()} className="mb-4">
              <h3 className="text-sm font-medium mb-2">{format(day, "EEEE, MMMM d")}</h3>
              
              <div className="space-y-2">
                {dayLeaves.map((leave) => (
                  <Card 
                    key={leave.id} 
                    className={cn(
                      "p-3 cursor-pointer",
                      "border-l-4",
                      `border-l-leave-${leave.type}`
                    )}
                    onClick={() => onDayClick(day)}
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
                          <p className="text-sm mt-1.5 line-clamp-1">{leave.reason}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
        
        {weekDays.every(day => getLeavesForDay(day).length === 0) && (
          <div className="text-center py-10 text-muted-foreground">
            No leaves scheduled for this week
          </div>
        )}
      </div>
    </div>
  );
}
