import { useState } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Plus,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Projects", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Tasks", href: "/my-tasks", icon: CheckSquare },
];

// Accept isCollapsed and setIsCollapsed as props
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = useLocation();
  const { name, email, initial } = useAuthUser();
  return (
    <>


      {/* Sidebar */}
      {/* Floating open button when sidebar is closed */}
      {isCollapsed && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 left-4 z-50 bg-card shadow-card"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border shadow-elevated transform transition-transform duration-300 ease-in-out inset-0",
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex h-16 items-center px-6 border-b border-border gap-2">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SynergyHub
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="ml-2"
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User Info Section */}
          <div className="p-4 border-t border-border flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                U
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{name}</span>
                <span className="text-xs text-muted-foreground">{email || "—"}</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={() => {
                localStorage.removeItem('authToken');
                window.location.href = '/';
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>


    </>
  );
}