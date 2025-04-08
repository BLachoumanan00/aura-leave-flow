
import { format } from "date-fns";
import { FileText, CalendarRange, Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LeaveTypeBadge from "./LeaveTypeBadge";
import { Leave } from "@/types/leave";

interface LeaveCardProps {
  leave: Leave;
  onView: (leave: Leave) => void;
}

export default function LeaveCard({ leave, onView }: LeaveCardProps) {
  // Calculate number of days
  const days = Math.ceil(
    (leave.endDate.getTime() - leave.startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  
  // Format dates
  const startDateFormatted = format(leave.startDate, "MMM d, yyyy");
  const endDateFormatted = format(leave.endDate, "MMM d, yyyy");
  const dateRangeText = startDateFormatted === endDateFormatted
    ? startDateFormatted
    : `${startDateFormatted} - ${endDateFormatted}`;
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className={`h-2 bg-leave-${leave.type}`} />
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <LeaveTypeBadge type={leave.type} />
          <span className="text-xs text-muted-foreground">
            {format(leave.createdAt, "MMM d")}
          </span>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{dateRangeText}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{days} day{days !== 1 ? "s" : ""}</span>
          </div>
          
          {leave.reason && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-1" />
              <p className="text-sm line-clamp-2">
                {leave.reason}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Button variant="outline" size="sm" className="w-full" onClick={() => onView(leave)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
