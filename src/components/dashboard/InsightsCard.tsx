
import { LightbulbIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Insight = {
  message: string;
  type: "info" | "suggestion" | "warning";
};

export default function InsightsCard() {
  const insights: Insight[] = [
    {
      message: "You haven't taken a vacation in the last 3 months. Consider planning one for your well-being.",
      type: "suggestion",
    },
    {
      message: "You tend to take sick leave mostly on Mondays. Is there a pattern to explore?",
      type: "info",
    },
    {
      message: "Goal suggestion: Take at least one mental health day this month.",
      type: "suggestion",
    },
  ];
  
  const getInsightColor = (type: Insight["type"]) => {
    switch (type) {
      case "info":
        return "text-blue-500 bg-blue-500/10";
      case "suggestion":
        return "text-purple-500 bg-purple-500/10";
      case "warning":
        return "text-amber-500 bg-amber-500/10";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-yellow-400" />
          Insights & Suggestions
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${getInsightColor(insight.type)}`}
            >
              <p className="text-sm">{insight.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
