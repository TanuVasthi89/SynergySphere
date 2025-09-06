import { Sidebar } from "./Sidebar";
import { Bell, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // Example notifications state (per user, could be global context or fetched from API)
  const [notifications, setNotifications] = useState([
    { id: 1, type: "task", message: "Task assigned to you: Design landing page", read: false },
    { id: 2, type: "due", message: "Task due soon: Develop API endpoints", read: false },
    { id: 3, type: "member", message: "New project member added: Alex Chen", read: false },
    { id: 4, type: "chat", message: "New message in Website Redesign chat", read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        {/* Notification Bell & Settings Icon */}
        <div className="flex justify-end items-center gap-4 px-6 pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-white rounded-full text-xs w-5 h-5 flex items-center justify-center border-2 border-background">{unreadCount}</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="font-semibold">Notifications</span>
                <Button size="sm" variant="ghost" onClick={handleMarkAllRead} disabled={unreadCount === 0}>Mark all as read</Button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">No notifications</div>
                )}
                {notifications.map(n => (
                  <DropdownMenuItem key={n.id} className={n.read ? "opacity-60" : "font-semibold bg-accent/30"}>
                    {n.message}
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" aria-label="Settings" onClick={() => window.location.href = "/settings"}>
            <Settings className="h-6 w-6" />
          </Button>
        </div>
        {children}
      </main>
    </div>
  );
}
