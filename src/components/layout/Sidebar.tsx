
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, Calendar, BarChart3, Settings, ClipboardList, Home } from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
};

export default function Sidebar({ isOpen, setIsOpen, isMobile }: SidebarProps) {
  const location = useLocation();

  const links = [
    { name: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/" },
    { name: "Calendar", icon: <Calendar className="h-5 w-5" />, path: "/calendar" },
    { name: "Leave Logs", icon: <ClipboardList className="h-5 w-5" />, path: "/leave-logs" },
    { name: "Analytics", icon: <BarChart3 className="h-5 w-5" />, path: "/analytics" },
    { name: "Settings", icon: <Settings className="h-5 w-5" />, path: "/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar flex flex-col fixed md:sticky top-0 z-40 h-screen",
          "w-[280px] transition-all duration-300 ease-in-out shrink-0",
          "border-r border-sidebar-border",
          isMobile ? (isOpen ? "left-0" : "-left-[280px]") : "left-0",
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
          <h1 className="font-bold text-xl text-gradient">Aura Leave</h1>
          
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground transition-all",
                "hover:bg-sidebar-accent",
                isActive(link.path) && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="p-6 border-t border-sidebar-border">
          <div className="glass-card p-4 rounded-lg">
            <div className="text-sm font-medium">Aura Leave</div>
            <div className="text-xs text-sidebar-foreground/70 mt-1">
              Version 1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
