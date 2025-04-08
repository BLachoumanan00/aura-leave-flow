
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, PaperclipIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LeaveType } from "./LeaveTypeBadge";
import { Leave } from "@/types/leave";
import { toast } from "sonner";

interface LeaveFormProps {
  onSubmit: (leave: Leave) => void;
  onCancel: () => void;
}

export default function LeaveForm({ onSubmit, onCancel }: LeaveFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [leaveType, setLeaveType] = useState<LeaveType>("local");
  const [reason, setReason] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    
    if (startDate > endDate) {
      toast.error("Start date cannot be after end date");
      return;
    }
    
    const newLeave: Leave = {
      id: Date.now().toString(),
      startDate,
      endDate,
      type: leaveType,
      reason,
      attachmentName: attachment ? attachment.name : null,
      createdAt: new Date(),
    };
    
    onSubmit(newLeave);
    toast.success("Leave request submitted");
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="leaveType">Leave Type</Label>
        <Select 
          value={leaveType} 
          onValueChange={(value) => setLeaveType(value as LeaveType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select leave type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="local">Local Leave</SelectItem>
            <SelectItem value="sick">Sick Leave</SelectItem>
            <SelectItem value="halfLocal">½ Local Leave</SelectItem>
            <SelectItem value="halfSick">½ Sick Leave</SelectItem>
            <SelectItem value="vacation">Vacation</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reason">Reason (Optional)</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for leave..."
          className="min-h-[120px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="attachment">Attachment (Optional)</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("attachment")?.click()}
            className="flex items-center gap-2"
          >
            <PaperclipIcon className="h-4 w-4" />
            {attachment ? attachment.name : "Upload file"}
          </Button>
          {attachment && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAttachment(null)}
            >
              Remove
            </Button>
          )}
          <Input
            id="attachment"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Submit Leave Request</Button>
      </div>
    </form>
  );
}
