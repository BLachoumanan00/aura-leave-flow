
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { LeaveQuota } from "@/types/leaveQuota";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface EditableLeaveStatsProps {
  quotas: LeaveQuota[];
  onUpdateQuotas: (quotas: LeaveQuota[]) => void;
}

export default function EditableLeaveStats({ quotas, onUpdateQuotas }: EditableLeaveStatsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuotas, setEditedQuotas] = useState<LeaveQuota[]>([]);
  
  useEffect(() => {
    setEditedQuotas([...quotas]);
  }, [quotas]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setEditedQuotas([...quotas]);
    setIsEditing(false);
  };
  
  const handleSave = () => {
    // Validate that totals are not less than used
    const isValid = editedQuotas.every(quota => quota.total >= quota.used);
    
    if (!isValid) {
      toast.error("Total days cannot be less than used days");
      return;
    }
    
    onUpdateQuotas(editedQuotas);
    setIsEditing(false);
    toast.success("Leave quotas updated successfully");
  };
  
  const handleTotalChange = (index: number, value: string) => {
    const updated = [...editedQuotas];
    updated[index].total = Math.max(0, parseInt(value) || 0);
    setEditedQuotas(updated);
  };
  
  const getDisplayName = (type: string): string => {
    switch (type) {
      case "local": return "Local Leave";
      case "sick": return "Sick Leave";
      case "vacation": return "Vacation";
      case "halfLocal": return "½ Local Leave";
      case "halfSick": return "½ Sick Leave";
      default: return type;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Leave Balance</CardTitle>
        
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {editedQuotas.map((quota, index) => (
            <div key={quota.type} className="space-y-1">
              <div className="flex justify-between text-sm mb-1">
                <span>{getDisplayName(quota.type)}</span>
                <span className="font-medium">
                  {quota.used} / {quota.total} days
                </span>
              </div>
              
              <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn(`h-full rounded-full bg-leave-${quota.type}`)}
                  style={{ width: `${Math.min(100, (quota.used / quota.total) * 100)}%` }}
                />
              </div>
              
              {isEditing ? (
                <div className="flex items-center justify-end mt-2">
                  <Label htmlFor={`quota-${quota.type}`} className="mr-2 text-xs">
                    Total days:
                  </Label>
                  <Input
                    id={`quota-${quota.type}`}
                    type="number"
                    min="0"
                    value={quota.total}
                    onChange={(e) => handleTotalChange(index, e.target.value)}
                    className="w-20 h-7 text-xs"
                  />
                </div>
              ) : (
                <div className="text-xs text-muted-foreground text-right">
                  {quota.total - quota.used} days remaining
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
