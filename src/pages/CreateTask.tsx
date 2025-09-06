import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Mock data for dropdowns
const availableTags = [
  "Frontend", "Backend", "Design", "Marketing", "Testing", "API", "Mobile", 
  "Database", "Security", "DevOps", "UI/UX", "Content", "Research"
];

const teamMembers = [
  "Sarah Johnson", "Alex Chen", "David Wilson", "Emily Rodriguez", 
  "Michael Brown", "Lisa Park", "John Smith", "Emma Davis"
];

const projects = [
  "Website Redesign", "Mobile App Development", "Database Migration",
  "Marketing Campaign", "Security Audit", "Customer Portal"
];

export default function CreateTask() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    assignee: "",
    project: "",
    tags: [] as string[],
    deadline: "",
    description: "",
    image: null as File | null,
  });

  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = () => {
    // Save task to localStorage
    const saveTask = (imageBase64: string | null) => {
      const existingTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      const { image, ...rest } = formData;
      const taskToSave = {
        ...rest,
        image: imageBase64,
        imageName: image ? image.name : null,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("tasks", JSON.stringify([...existingTasks, taskToSave]));
      navigate("/my-tasks");
    };
    if (formData.image) {
      const reader = new FileReader();
      reader.onload = (e) => {
        saveTask(e.target?.result as string);
      };
      reader.readAsDataURL(formData.image);
    } else {
      saveTask(null);
    }
  };

  const handleDiscard = () => {
    navigate("/my-tasks");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="p-0 h-auto">
          Projects
        </Button>
        <span>›</span>
        <span className="text-foreground">New Task</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/my-tasks")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Task</h1>
          <p className="text-muted-foreground mt-1">Create a new task and assign it to a team member</p>
        </div>
      </div>

      <Card className="p-8">
        <div className="space-y-6">
          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter task name"
              className="text-base"
            />
          </div>

          {/* Assignee - Single Selection Dropdown */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Assignee</Label>
            <div className="relative">
              <div
                className={cn(
                  "min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                )}
                onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
              >
                {formData.assignee || (
                  <span className="text-muted-foreground">Select assignee...</span>
                )}
              </div>
              
              {showAssigneeDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-elevated max-h-60 overflow-auto">
                  {teamMembers.map((member) => (
                    <div
                      key={member}
                      className={cn(
                        "px-3 py-2 cursor-pointer hover:bg-accent text-sm",
                        formData.assignee === member && "bg-primary/10 text-primary"
                      )}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, assignee: member }));
                        setShowAssigneeDropdown(false);
                      }}
                    >
                      {member}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Project - Dropdown (auto-populate when creating from project view) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Project</Label>
            <div className="relative">
              <div
                className={cn(
                  "min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                )}
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              >
                {formData.project || (
                  <span className="text-muted-foreground">Select project...</span>
                )}
              </div>
              
              {showProjectDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-elevated max-h-60 overflow-auto">
                  {projects.map((project) => (
                    <div
                      key={project}
                      className={cn(
                        "px-3 py-2 cursor-pointer hover:bg-accent text-sm",
                        formData.project === project && "bg-primary/10 text-primary"
                      )}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, project: project }));
                        setShowProjectDropdown(false);
                      }}
                    >
                      {project}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Project must be automatically set when creating a task from project view
            </p>
          </div>

          {/* Tags - Multi Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tags</Label>
            <div className="relative">
              <div
                className={cn(
                  "min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                )}
                onClick={() => setShowTagDropdown(!showTagDropdown)}
              >
                {formData.tags.length === 0 ? (
                  <span className="text-muted-foreground">Select tags...</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                      >
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-primary/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagToggle(tag);
                          }}
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {showTagDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-elevated max-h-60 overflow-auto">
                  {availableTags.map((tag) => (
                    <div
                      key={tag}
                      className={cn(
                        "px-3 py-2 cursor-pointer hover:bg-accent text-sm",
                        formData.tags.includes(tag) && "bg-primary/10 text-primary"
                      )}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Deadline - Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-sm font-medium">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              className="text-base"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Image</Label>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Upload Image
                </label>
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {formData.image && (
                <span className="text-sm text-muted-foreground">
                  {formData.image.name}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description"
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="outline" onClick={handleDiscard}>
              Discard
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}