
import { useState } from "react";
import { format, getDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Leave } from "@/types/leave";

interface LeaveCalendarProps {
  leaves: Leave[];
  onAddLeave: () => void;
  onDayClick: (date: Date) => void;
}

export default function LeaveCalendar({ leaves, onAddLeave, onDayClick }: LeaveCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  
  // Helper to get leaves for a specific day
  const getLeavesForDay = (day: Date) => {
    return leaves.filter(leave => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      const currentDate = new Date(day);
      
      return currentDate >= leaveStart && currentDate <= leaveEnd;
    });
  };
  
  const getDayClass = (day: Date) => {
    const dayLeaves = getLeavesForDay(day);
    
    if (dayLeaves.length === 0) return "";
    
    // Return the class for the first leave type if multiple exist
    return `bg-leave-${dayLeaves[0].type}/20 border-leave-${dayLeaves[0].type}`;
  };
  
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Create day names header
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Calculate empty days before first day of month to align grid
  const firstDayOfWeek = getDay(firstDayOfMonth);
  const emptyDaysBefore = Array.from({ length: firstDayOfWeek }, (_, i) => i);
  
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button onClick={onAddLeave} className="ml-2">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Leave
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Day names header */}
        {dayNames.map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
        
        {/* Empty days from previous month */}
        {emptyDaysBefore.map((_, index) => (
          <div key={`empty-before-${index}`} className="h-24 p-1" />
        ))}
        
        {/* Days of current month */}
        {daysInMonth.map((day) => {
          const dayLeaves = getLeavesForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "h-24 p-1 border rounded-md transition-all",
                isToday ? "border-primary" : "border-transparent",
                getDayClass(day),
                "hover:bg-muted/50 cursor-pointer"
              )}
              onClick={() => onDayClick(day)}
            >
              <div className="flex flex-col h-full">
                <div className={cn(
                  "text-right text-sm mb-1",
                  isToday && "font-bold text-primary"
                )}>
                  {format(day, "d")}
                </div>
                
                <div className="overflow-hidden">
                  {dayLeaves.slice(0, 2).map((leave, i) => (
                    <div 
                      key={`${leave.id}-${i}`}
                      className={cn(
                        "text-xs px-1 py-0.5 mb-1 rounded-sm truncate",
                        `bg-leave-${leave.type} text-white`
                      )}
                    >
                      {leave.type === "halfLocal" || leave.type === "halfSick" ? "½ Day" : "Full Day"}
                    </div>
                  ))}
                  
                  {dayLeaves.length > 2 && (
                    <div className="text-xs text-muted-foreground px-1">
                      +{dayLeaves.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
