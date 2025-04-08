
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getLeaveQuotas } from "@/lib/quotaStorage";
import { useEffect, useState } from "react";
import { LeaveQuota } from "@/types/leaveQuota";

type StatItem = {
  label: string;
  used: number;
  total: number;
  color: string;
};

export default function LeaveStats() {
  const [quotas, setQuotas] = useState<LeaveQuota[]>([]);
  
  useEffect(() => {
    setQuotas(getLeaveQuotas());
  }, []);
  
  // Map quotas to stat items
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
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Leave Balance</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {quotas.map((quota) => (
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
              
              <div className="text-xs text-muted-foreground text-right">
                {quota.total - quota.used} days remaining
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
