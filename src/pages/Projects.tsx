import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { Comments, Comment } from "@/components/ui/comments";
import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard, Project } from "@/components/project/project-card";
import type { Priority } from "@/components/ui/priority-badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useRef } from "react";
import { cn } from "@/lib/utils";

// Mock data
const initialProjects: Project[] = [
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

// Removed global comments for all projects

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  useEffect(() => {
    const localProjects = JSON.parse(localStorage.getItem("projects") || "null");
    if (Array.isArray(localProjects) && localProjects.length > 0) {
      // Map localStorage format to ProjectCard format if needed
      setProjects(localProjects.map((p, idx) => ({
        id: p.id || (p.name ? p.name + idx : idx + 1 + ""),
        title: p.name || p.title || "Untitled",
        description: p.description || "",
        priority: p.priority || "medium",
        deadline: p.deadline || "",
        manager: p.projectManager || p.manager || "",
        tags: p.tags || [],
        progress: p.progress || 0,
        image: p.image || null,
        imageName: p.imageName || null,
      })));
    }
  }, []);
  const navigate = useNavigate();
  // Removed global comments state and handlers
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "", deadline: "", priority: "medium", progress: 0, image: null as string | null });
  const formRef = useRef<HTMLFormElement>(null);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = selectedPriority === "all" || project.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  const handleEdit = (project: Project) => {
    setEditProject(project);
    setEditForm({
      title: project.title,
      description: project.description,
      deadline: project.deadline,
      priority: project.priority || "medium",
      progress: project.progress || 0,
      image: project.image || null,
    });
    setIsEditOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === "progress") {
      let val = Math.max(0, Math.min(100, Number(value)));
      setEditForm({ ...editForm, progress: val });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEditForm((prev) => ({ ...prev, image: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editProject) {
      setProjects((prev) => {
        const updated = prev.map((p) =>
          p.id === editProject.id
            ? { ...p, ...editForm, priority: editForm.priority as Priority, progress: Number(editForm.progress), image: editForm.image }
            : p
        );
        // Save to localStorage
        localStorage.setItem("projects", JSON.stringify(updated));
        return updated;
      });
    }
    setIsEditOpen(false);
    setEditProject(null);
  };

  const handleDelete = (project: Project) => {
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== project.id);
      localStorage.setItem("projects", JSON.stringify(updated));
      return updated;
    });
  };

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
            onClick={() => navigate(`/project/${project.id}`, { state: { project } })}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
      {/* Edit Project Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Edit the details of your project below.</DialogDescription>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleEditSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                name="priority"
                value={editForm.priority}
                onChange={handleEditChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={editForm.deadline}
                onChange={handleEditChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Progress (%)</label>
              <input
                type="number"
                name="progress"
                value={editForm.progress}
                min={0}
                max={100}
                onChange={handleEditChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded px-3 py-2"
              />
              {editForm.image && (
                <img src={editForm.image} alt="Project" className="mt-2 w-full h-32 object-cover rounded" />
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  {/* Removed global project discussion/comments section */}
    </div>
  );
}
