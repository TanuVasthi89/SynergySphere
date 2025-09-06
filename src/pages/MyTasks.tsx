import { useState } from "react";
import { Calendar, CheckCircle2, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriorityBadge, Priority } from "@/components/ui/priority-badge";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: Priority;
  deadline: string;
  projectName: string;
  assignee: string;
  tags: string[];
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design homepage mockups",
    description: "Create high-fidelity mockups for the new homepage design",
    status: "in-progress",
    priority: "high",
    deadline: "2024-10-15",
    projectName: "Website Redesign",
    assignee: "You",
    tags: ["Design", "UI/UX"],
  },
  {
    id: "2",
    title: "API endpoint development",
    description: "Develop REST API endpoints for user authentication",
    status: "todo",
    priority: "medium",
    deadline: "2024-10-20",
    projectName: "Mobile App Development",
    assignee: "You",
    tags: ["Backend", "API"],
  },
  {
    id: "3",
    title: "Database schema design",
    description: "Design and implement new database schema",
    status: "done",
    priority: "high",
    deadline: "2024-10-10",
    projectName: "Database Migration",
    assignee: "You",
    tags: ["Database", "Backend"],
  },
  {
    id: "4",
    title: "Content creation",
    description: "Write blog posts for Q4 marketing campaign",
    status: "todo",
    priority: "low",
    deadline: "2024-11-01",
    projectName: "Marketing Campaign",
    assignee: "You",
    tags: ["Content", "Marketing"],
  },
];

const statusConfig = {
  todo: {
    label: "To Do",
    className: "bg-muted text-muted-foreground",
    icon: Clock,
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-primary/10 text-primary",
    icon: Clock,
  },
  done: {
    label: "Done",
    className: "bg-success/10 text-success",
    icon: CheckCircle2,
  },
};

export default function MyTasks() {
  const [filter, setFilter] = useState<"all" | "todo" | "in-progress" | "done">("all");

  const filteredTasks = filter === "all" ? mockTasks : mockTasks.filter(task => task.status === filter);

  const taskCounts = {
    all: mockTasks.length,
    todo: mockTasks.filter(t => t.status === "todo").length,
    "in-progress": mockTasks.filter(t => t.status === "in-progress").length,
    done: mockTasks.filter(t => t.status === "done").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Track your assigned tasks across all projects
          </p>
        </div>
        
        <Button 
          variant="primary" 
          className="lg:w-auto w-full"
          onClick={() => window.location.href = "/create-task"}
        >
          Create New Task
        </Button>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(taskCounts).map(([status, count]) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status as typeof filter)}
            className="gap-2"
          >
            {status === "all" ? "All Tasks" : statusConfig[status as keyof typeof statusConfig]?.label}
            <span className="bg-background/20 text-xs px-1.5 py-0.5 rounded-full">
              {count}
            </span>
          </Button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const deadlineDate = new Date(task.deadline);
          const isOverdue = deadlineDate < new Date() && task.status !== "done";
          const StatusIcon = statusConfig[task.status].icon;

          return (
            <Card key={task.id} className="p-6 bg-gradient-card hover:shadow-elevated transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground truncate">
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1",
                          statusConfig[task.status].className
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig[task.status].label}
                      </span>
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {task.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className={cn(isOverdue && "text-destructive font-medium")}>
                        {deadlineDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{task.projectName}</span>
                    </div>
                  </div>
                  
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {task.tags.map((tag) => (
                        <Tag key={tag} variant="secondary">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button variant="ghost" size="sm" className="ml-4">
                  Edit
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">No tasks found</div>
          <p className="text-muted-foreground mt-2">
            {filter === "all" 
              ? "You don't have any tasks assigned yet."
              : `No tasks with status "${statusConfig[filter as keyof typeof statusConfig]?.label}".`
            }
          </p>
        </div>
      )}
    </div>
  );
}