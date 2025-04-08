
import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leave } from "@/types/leave";
import LeaveTypeBadge from "@/components/leave/LeaveTypeBadge";
import { useTouchDevice } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { isPublicHoliday } from "@/utils/holidays";

interface MobileCalendarProps {
  leaves: Leave[];
  onDayClick: (date: Date) => void;
}

export default function MobileCalendar({ leaves, onDayClick }: MobileCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  const isTouch = useTouchDevice();
  
  // Current date for highlighting today
  const today = new Date();
  
  // Function to get leaves for a specific day
  const getLeavesForDay = (day: Date) => {
    return leaves.filter(leave => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      return day >= leaveStart && day <= leaveEnd;
    });
  };
  
  // Navigation functions
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Get day of week headers
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  
  return (
    <div className="space-y-4">
      {/* Month header with navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={previousMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <h2 className="text-xl font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        
        <Button variant="ghost" size="sm" onClick={nextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Calendar grid */}
      <Card className="p-3 overflow-hidden">
        {/* Day names header */}
        <div className="grid grid-cols-7 mb-2">
          {dayNames.map((day, index) => (
            <div key={index} className="text-center text-sm font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Fill in blank spaces for days before the first of the month */}
          {Array.from({ length: firstDayOfMonth.getDay() }).map((_, index) => (
            <div key={`blank-start-${index}`} className="h-11" />
          ))}
          
          {/* Actual days */}
          {daysInMonth.map((day) => {
            const dayLeaves = getLeavesForDay(day);
            const isCurrentDay = isSameDay(day, today);
            const hasLeave = dayLeaves.length > 0;
            const holiday = isPublicHoliday(day);
            
            return (
              <div
                key={day.toString()}
                className={cn(
                  "h-11 rounded-full flex flex-col items-center justify-center relative",
                  isCurrentDay ? "font-bold" : "",
                  hasLeave ? `ring-2 ring-leave-${dayLeaves[0].type}/50` : "",
                  holiday.isHoliday ? "ring-2 ring-purple-400/50" : "",
                  "active:bg-accent/30 transition-colors cursor-pointer",
                  isTouch ? "hover:bg-transparent" : "hover:bg-accent/20"
                )}
                onClick={() => onDayClick(day)}
              >
                <span 
                  className={cn(
                    "size-7 flex items-center justify-center rounded-full",
                    isCurrentDay ? "bg-primary text-primary-foreground" : "",
                    holiday.isHoliday && !isCurrentDay ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200" : ""
                  )}
                >
                  {format(day, "d")}
                </span>
                
                {(hasLeave || holiday.isHoliday) && (
                  <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2">
                    <div 
                      className={cn(
                        "size-1.5 rounded-full",
                        holiday.isHoliday ? "bg-purple-500" : `bg-leave-${dayLeaves[0].type}`
                      )} 
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Upcoming leaves section */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Upcoming Leaves</h3>
        
        <div className="space-y-3">
          {leaves
            .filter(leave => new Date(leave.startDate) >= new Date())
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .slice(0, 3)
            .map((leave) => (
              <Card 
                key={leave.id} 
                className={cn(
                  "p-3 cursor-pointer border-l-4",
                  `border-l-leave-${leave.type}`
                )}
                onClick={() => onDayClick(leave.startDate)}
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
          
          {leaves.filter(leave => new Date(leave.startDate) >= new Date()).length === 0 && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No upcoming leaves scheduled.
            </div>
          )}
        </div>
      </div>
      
      {/* Public Holidays section */}
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-3">Upcoming Public Holidays</h3>
        
        <div className="space-y-3">
          {getMauritianHolidays()
            .filter(holiday => holiday.date >= new Date())
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 3)
            .map((holiday, index) => (
              <Card 
                key={`holiday-${index}`} 
                className="p-3 cursor-pointer border-l-4 border-l-purple-500"
                onClick={() => onDayClick(holiday.date)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-xs rounded-full px-2 py-0.5">
                        Holiday
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(holiday.date, "MMM d, yyyy")}
                      </span>
                    </div>
                    
                    <p className="text-sm mt-1.5 font-medium">{holiday.name}</p>
                  </div>
                </div>
              </Card>
            ))}
            
          {getMauritianHolidays().filter(holiday => holiday.date >= new Date()).length === 0 && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No upcoming public holidays.
            </div>
          )}
        </div>
      </div>
      
      {/* Leave history section */}
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-3">Recent Leave History</h3>
        
        <div className="space-y-3">
          {leaves
            .filter(leave => new Date(leave.endDate) < new Date())
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
            .slice(0, 3)
            .map((leave) => (
              <Card 
                key={leave.id} 
                className={cn(
                  "p-3 cursor-pointer",
                  "border-l-4",
                  `border-l-leave-${leave.type}/70`
                )}
                onClick={() => onDayClick(leave.startDate)}
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
            
          {leaves.filter(leave => new Date(leave.endDate) < new Date()).length === 0 && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No past leave records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Import the getMauritianHolidays function at the top
import { getMauritianHolidays } from "@/utils/holidays";
