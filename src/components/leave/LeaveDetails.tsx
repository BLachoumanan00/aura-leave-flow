
import { format } from "date-fns";
import { CalendarRange, FileText, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LeaveTypeBadge from "./LeaveTypeBadge";
import { Leave } from "@/types/leave";

interface LeaveDetailsProps {
  leave: Leave;
  onClose: () => void;
}

export default function LeaveDetails({ leave, onClose }: LeaveDetailsProps) {
  // Calculate number of days
  const days = Math.ceil(
    (leave.endDate.getTime() - leave.startDate.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <LeaveTypeBadge type={leave.type} className="text-sm" />
        <span className="text-sm text-muted-foreground">
          Submitted on {format(leave.createdAt, "MMMM d, yyyy")}
        </span>
      </div>
      
      <div className="glass-card p-4 rounded-lg flex items-center gap-3">
        <CalendarRange className="h-5 w-5 text-primary" />
        <div>
          <div className="text-sm font-medium">
            {format(leave.startDate, "MMMM d, yyyy")} - {format(leave.endDate, "MMMM d, yyyy")}
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
              <span className="text-sm">{leave.attachmentName}</span>
              <Button variant="ghost" size="sm">
                Download
              </Button>
            </div>
          </div>
        </>
      )}
      
      <div className="flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
