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

export default function CreateProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    tags: [] as string[],
    projectManager: "",
    deadline: "",
    priority: "medium" as "low" | "medium" | "high",
    description: "",
    image: null as File | null,
  });

  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);

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
    // Save project to localStorage
    const saveProject = (imageBase64: string | null) => {
      const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]");
      const { image, ...rest } = formData;
      const projectToSave = {
        ...rest,
        image: imageBase64,
        imageName: image ? image.name : null,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("projects", JSON.stringify([...existingProjects, projectToSave]));
      navigate("/dashboard");
    };
    if (formData.image) {
      const reader = new FileReader();
      reader.onload = (e) => {
        saveProject(e.target?.result as string);
      };
      reader.readAsDataURL(formData.image);
    } else {
      saveProject(null);
    }
  };

  const handleDiscard = () => {
    navigate("/");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="p-0 h-auto">
          Projects
        </Button>
        <span>›</span>
        <span className="text-foreground">New Project</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Project</h1>
          <p className="text-muted-foreground mt-1">Create a new project for your team</p>
        </div>
      </div>

      <Card className="p-8">
        <div className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter project name"
              className="text-base"
            />
          </div>

          {/* Tags - Multi Selection Dropdown */}
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

          {/* Project Manager - Single Selection Dropdown */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Project Manager</Label>
            <div className="relative">
              <div
                className={cn(
                  "min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                )}
                onClick={() => setShowManagerDropdown(!showManagerDropdown)}
              >
                {formData.projectManager || (
                  <span className="text-muted-foreground">Select project manager...</span>
                )}
              </div>
              
              {showManagerDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-elevated max-h-60 overflow-auto">
                  {teamMembers.map((member) => (
                    <div
                      key={member}
                      className={cn(
                        "px-3 py-2 cursor-pointer hover:bg-accent text-sm",
                        formData.projectManager === member && "bg-primary/10 text-primary"
                      )}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, projectManager: member }));
                        setShowManagerDropdown(false);
                      }}
                    >
                      {member}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Deadline - Date Selection Field */}
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

          {/* Priority - Single Radio Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Priority</Label>
            <div className="flex gap-6">
              {["low", "medium", "high"].map((priority) => (
                <label key={priority} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={formData.priority === priority}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      priority: e.target.value as "low" | "medium" | "high" 
                    }))}
                    className="w-4 h-4 text-primary focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm capitalize">{priority}</span>
                </label>
              ))}
            </div>
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
              placeholder="Enter project description"
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