
import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leave } from "@/types/leave";
import { LeaveType } from "@/components/leave/LeaveTypeBadge";
import { getLeaves } from "@/lib/storage";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function Analytics() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  
  useEffect(() => {
    setLeaves(getLeaves());
  }, []);
  
  // Aggregate by leave type
  const leavesByType = leaves.reduce((acc, leave) => {
    const type = leave.type;
    const days = Math.ceil(
      (leave.endDate.getTime() - leave.startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
    
    // If half-day leave, count as 0.5
    const actualDays = type.includes('half') ? days * 0.5 : days;
    
    acc[type] = (acc[type] || 0) + actualDays;
    return acc;
  }, {} as Record<LeaveType, number>);
  
  // Format for pie chart
  const pieData = Object.entries(leavesByType).map(([type, days]) => ({
    name: type === "local" ? "Local Leave" :
          type === "sick" ? "Sick Leave" :
          type === "halfLocal" ? "½ Local Leave" :
          type === "halfSick" ? "½ Sick Leave" :
          "Vacation",
    value: days,
  }));
  
  // Aggregate by month
  const currentYear = new Date().getFullYear();
  const monthsData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(currentYear, i).toLocaleString('default', { month: 'short' });
    
    return {
      month,
      local: 0,
      sick: 0,
      vacation: 0,
    };
  });
  
  leaves.forEach(leave => {
    const startMonth = leave.startDate.getMonth();
    const days = Math.ceil(
      (leave.endDate.getTime() - leave.startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
    
    // Simplify by just adding to one of three categories
    let category: 'local' | 'sick' | 'vacation';
    if (leave.type.includes('sick')) {
      category = 'sick';
    } else if (leave.type.includes('local')) {
      category = 'local';
    } else {
      category = 'vacation';
    }
    
    // If half-day leave, count as 0.5
    const actualDays = leave.type.includes('half') ? days * 0.5 : days;
    
    monthsData[startMonth][category] += actualDays;
  });
  
  // Color mapping for pie chart
  const COLORS = {
    local: "#8B5CF6",
    sick: "#EF4444",
    halfLocal: "#A78BFA",
    halfSick: "#F87171",
    vacation: "#3B82F6",
  };
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gradient">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Understand your leave patterns
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="byMonth">By Month</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Leave Distribution</CardTitle>
                <CardDescription>
                  Breakdown of leave days by type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => {
                        const type = Object.keys(leavesByType)[index] as LeaveType;
                        return <Cell key={`cell-${index}`} fill={COLORS[type]} />;
                      })}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} days`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Leave Summary</CardTitle>
                <CardDescription>
                  Quick statistics for the current year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Days Taken</div>
                    <div className="text-2xl font-bold">
                      {Object.values(leavesByType).reduce((a, b) => a + b, 0).toFixed(1)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Most Used Type</div>
                    <div className="text-2xl font-bold">
                      {Object.entries(leavesByType).sort((a, b) => b[1] - a[1])[0]?.[0] === "local" ? "Local Leave" :
                      Object.entries(leavesByType).sort((a, b) => b[1] - a[1])[0]?.[0] === "sick" ? "Sick Leave" :
                      Object.entries(leavesByType).sort((a, b) => b[1] - a[1])[0]?.[0] === "halfLocal" ? "½ Local Leave" :
                      Object.entries(leavesByType).sort((a, b) => b[1] - a[1])[0]?.[0] === "halfSick" ? "½ Sick Leave" :
                      "Vacation"}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Leave Frequency</div>
                    <div className="text-2xl font-bold">
                      {(leaves.length / 12).toFixed(1)} per month
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="byMonth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Leave Patterns</CardTitle>
              <CardDescription>
                Visualize your leave usage throughout the year
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthsData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="local" stackId="a" name="Local Leave" fill="#8B5CF6" />
                  <Bar dataKey="sick" stackId="a" name="Sick Leave" fill="#EF4444" />
                  <Bar dataKey="vacation" stackId="a" name="Vacation" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>
                  Smart observations based on your leave patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-leave-local/10 rounded-lg border border-leave-local/20">
                    <h3 className="font-medium mb-1">Pattern Recognition</h3>
                    <p className="text-sm">You tend to take local leaves mostly at the beginning of the month. Consider spreading them out for better work balance.</p>
                  </div>
                  
                  <div className="p-4 bg-leave-sick/10 rounded-lg border border-leave-sick/20">
                    <h3 className="font-medium mb-1">Health Observation</h3>
                    <p className="text-sm">You've taken 3 sick leaves in the past 2 months, which is slightly above your historical average. Consider a health check-up.</p>
                  </div>
                  
                  <div className="p-4 bg-leave-vacation/10 rounded-lg border border-leave-vacation/20">
                    <h3 className="font-medium mb-1">Time Off Balance</h3>
                    <p className="text-sm">You haven't taken a vacation in the past 3 months. Research shows regular breaks improve productivity.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Goals & Suggestions</CardTitle>
                <CardDescription>
                  Personalized recommendations for better work-life balance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="glass-card p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-gradient">Mental Wellness Goal</h3>
                    <p className="text-sm">Plan at least one "mental health day" in the next month to recharge and maintain productivity.</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-gradient">Vacation Planning</h3>
                    <p className="text-sm">Consider scheduling your next vacation 6-8 weeks in advance to optimize work transitions and team coordination.</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-gradient">Leave Distribution</h3>
                    <p className="text-sm">Try to spread your local leaves throughout the quarter to maintain consistent workflow and avoid burnout.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
