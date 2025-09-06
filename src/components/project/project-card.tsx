import { Calendar, User, MoreHorizontal, Pencil, Trash2, List } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PriorityBadge, Priority } from "@/components/ui/priority-badge";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";

export interface Project {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  deadline: string;
  manager: string;
  tags: string[];
  image?: string;
  progress?: number;
  // Optionally, you can add a tasks array if you want to show tasks inline
  // tasks?: { id: string; title: string; assignedToMe: boolean }[];
}


interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  className?: string;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onViewTasks?: (project: Project) => void;
}

export function ProjectCard({ project, onClick, className, onEdit, onDelete, onViewTasks }: ProjectCardProps) {
  const deadlineDate = new Date(project.deadline);
  const isOverdue = deadlineDate < new Date();

  return (
    <Card
      className={cn(
        "group cursor-pointer bg-gradient-card hover:shadow-elevated transition-all duration-300 border border-border/50 hover:border-primary/20",
        className
      )}
      onClick={onClick}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={e => { e.stopPropagation(); onEdit?.(project); }}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={e => { e.stopPropagation(); onDelete?.(project); }} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Image */}
        {project.image && (
          <div className="mb-4 rounded-lg overflow-hidden bg-accent">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-32 object-cover"
            />
          </div>
        )}

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} variant="secondary">
                {tag}
              </Tag>
            ))}
            {project.tags.length > 3 && (
              <Tag variant="outline">
                +{project.tags.length - 3} more
              </Tag>
            )}
          </div>
        )}

        {/* Progress bar */}
        {project.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-medium">{project.progress}%</span>
            </div>
            <div className="w-full bg-accent rounded-full h-2">
              <div
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              <span className={cn(isOverdue && "text-destructive font-medium")}> 
                {deadlineDate.toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="mr-1 h-4 w-4" />
              <span>{project.manager}</span>
            </div>
            {/* Removed task count UI */}
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={project.priority} />
          </div>
        </div>
      </div>
    </Card>
  );
}
