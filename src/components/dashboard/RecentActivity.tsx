
import { format } from "date-fns";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ActivityItem = {
  action: string;
  date: Date;
  detail: string;
};

export default function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      action: "Submitted sick leave",
      date: new Date(2025, 3, 5),
      detail: "1 day leave on April 5, 2025",
    },
    {
      action: "Submitted vacation",
      date: new Date(2025, 3, 1),
      detail: "7 days from March 24 to March 30, 2025",
    },
    {
      action: "Modified leave request",
      date: new Date(2025, 2, 15),
      detail: "Changed end date for vacation",
    },
    {
      action: "Cancelled leave request",
      date: new Date(2025, 2, 10),
      detail: "Cancelled local leave for February 12, 2025",
    },
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <div className="text-sm font-medium">{activity.action}</div>
                <div className="text-xs text-muted-foreground">{activity.detail}</div>
              </div>
              <div className="text-xs text-muted-foreground">
                {format(activity.date, "MMM d")}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
