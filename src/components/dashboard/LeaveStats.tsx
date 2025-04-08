
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type StatItem = {
  label: string;
  used: number;
  total: number;
  color: string;
};

export default function LeaveStats() {
  const stats: StatItem[] = [
    { label: "Local Leave", used: 5, total: 12, color: "bg-leave-local" },
    { label: "Sick Leave", used: 2, total: 10, color: "bg-leave-sick" },
    { label: "Vacation", used: 8, total: 15, color: "bg-leave-vacation" },
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Leave Balance</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="flex justify-between text-sm mb-1">
                <span>{stat.label}</span>
                <span className="font-medium">
                  {stat.used} / {stat.total} days
                </span>
              </div>
              
              <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn("h-full rounded-full", stat.color)}
                  style={{ width: `${Math.min(100, (stat.used / stat.total) * 100)}%` }}
                />
              </div>
              
              <div className="text-xs text-muted-foreground text-right">
                {stat.total - stat.used} days remaining
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
