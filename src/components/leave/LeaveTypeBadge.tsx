
import React from "react";
import { cn } from "@/lib/utils";

export type LeaveType = "local" | "sick" | "halfLocal" | "halfSick" | "vacation";

interface LeaveTypeBadgeProps {
  type: LeaveType;
  className?: string;
}

const typeConfig = {
  local: {
    label: "Local Leave",
    bgColor: "bg-leave-local",
    textColor: "text-white",
  },
  sick: {
    label: "Sick Leave",
    bgColor: "bg-leave-sick",
    textColor: "text-white",
  },
  halfLocal: {
    label: "½ Local Leave",
    bgColor: "bg-leave-halfLocal",
    textColor: "text-white",
  },
  halfSick: {
    label: "½ Sick Leave",
    bgColor: "bg-leave-halfSick",
    textColor: "text-white",
  },
  vacation: {
    label: "Vacation",
    bgColor: "bg-leave-vacation",
    textColor: "text-white",
  },
};

export default function LeaveTypeBadge({ type, className }: LeaveTypeBadgeProps) {
  const config = typeConfig[type];
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      {config.label}
    </span>
  );
}
