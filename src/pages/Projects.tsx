import { useState } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard, Project } from "@/components/project/project-card";
import { cn } from "@/lib/utils";

// Mock data
const mockProjects: Project[] = [
  {
    id: "1",
    title: "Website Redesign",
    description: "Complete overhaul of the company website with modern design and improved UX",
    priority: "high",
    deadline: "2024-12-15",
    manager: "Sarah Johnson",
    tags: ["Design", "Frontend", "UX"],
    progress: 75,
  },
  {
    id: "2", 
    title: "Mobile App Development",
    description: "Native mobile application for iOS and Android platforms",
    priority: "medium",
    deadline: "2024-11-30",
    manager: "Alex Chen",
    tags: ["Mobile", "React Native", "API"],
    progress: 45,
  },
  {
    id: "3",
    title: "Database Migration",
    description: "Migrate legacy database to modern cloud infrastructure",
    priority: "high",
    deadline: "2024-10-20",
    manager: "David Wilson",
    tags: ["Backend", "Database", "Cloud"],
    progress: 20,
  },
  {
    id: "4",
    title: "Marketing Campaign",
    description: "Q4 marketing campaign for new product launch",
    priority: "low",
    deadline: "2024-12-31",
    manager: "Emily Rodriguez",
    tags: ["Marketing", "Content", "Social Media"],
    progress: 60,
  },
  {
    id: "5",
    title: "Security Audit",
    description: "Comprehensive security assessment and vulnerability testing",
    priority: "medium",
    deadline: "2024-11-15",
    manager: "Michael Brown",
    tags: ["Security", "Testing", "Compliance"],
    progress: 30,
  },
  {
    id: "6",
    title: "Customer Portal",
    description: "Self-service portal for customer support and account management",
    priority: "medium",
    deadline: "2025-01-15",
    manager: "Lisa Park",
    tags: ["Frontend", "Backend", "Support"],
    progress: 15,
  },
];

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPriority = selectedPriority === "all" || project.priority === selectedPriority;
    
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your projects in one place
          </p>
        </div>
        
        <Button 
          variant="primary" 
          className="lg:w-auto w-full"
          onClick={() => window.location.href = "/create-project"}
        >
          Create New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <div className="flex border border-border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className={cn(
        "grid gap-6",
        viewMode === "grid" 
          ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
          : "grid-cols-1"
      )}>
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => {
              // TODO: Navigate to project detail
              console.log("Navigate to project:", project.id);
            }}
            className={viewMode === "list" ? "flex-row" : ""}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">No projects found</div>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filters, or create a new project.
          </p>
        </div>
      )}
    </div>
  );
}