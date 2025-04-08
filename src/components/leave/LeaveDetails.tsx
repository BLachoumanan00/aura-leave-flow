
import { format } from "date-fns";
import { CalendarRange, FileText, Paperclip, Trash, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LeaveTypeBadge from "./LeaveTypeBadge";
import { Leave } from "@/types/leave";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface LeaveDetailsProps {
  leave: Leave;
  onClose: () => void;
}

export default function LeaveDetails({ leave, onClose }: LeaveDetailsProps) {
  // Calculate number of days
  const days = Math.ceil(
    (leave.endDate.getTime() - leave.startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-5">
      <div className={cn(
        "flex items-center",
        isMobile ? "flex-col gap-3 items-start" : "justify-between"
      )}>
        <LeaveTypeBadge type={leave.type} className="text-sm" />
        <span className="text-sm text-muted-foreground">
          Submitted on {format(leave.createdAt, "MMMM d, yyyy")}
        </span>
      </div>
      
      <div className="glass-card p-4 rounded-lg flex items-center gap-3">
        <CalendarRange className="h-5 w-5 text-primary shrink-0" />
        <div>
          <div className="text-sm font-medium">
            {format(leave.startDate, "MMMM d, yyyy")} 
            {leave.startDate.getTime() !== leave.endDate.getTime() && 
              ` - ${format(leave.endDate, "MMMM d, yyyy")}`}
          </div>
          <div className="text-xs text-muted-foreground">
            {days} day{days !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
      
      {leave.reason && (
        <>
          <Separator />
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Reason</h3>
            </div>
            <p className="text-sm ml-6">{leave.reason}</p>
          </div>
        </>
      )}
      
      {leave.attachmentName && (
        <>
          <Separator />
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Paperclip className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Attachment</h3>
            </div>
            <div className="ml-6 p-2 bg-muted/50 rounded flex items-center justify-between">
              <span className="text-sm truncate max-w-[200px]">{leave.attachmentName}</span>
              <Button variant="ghost" size="sm">
                Download
              </Button>
            </div>
          </div>
        </>
      )}
      
      {isMobile ? (
        <div className="flex flex-col gap-2 pt-2">
          <Button variant="outline" className="w-full" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Leave
          </Button>
          <Button variant="destructive" className="w-full" size="sm">
            <Trash className="h-4 w-4 mr-2" />
            Delete Leave
          </Button>
          <Button className="w-full mt-2" onClick={onClose}>Close</Button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="destructive" size="sm">
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
          <Button onClick={onClose}>Close</Button>
        </div>
      )}
    </div>
  );
}
