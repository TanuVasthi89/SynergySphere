import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Projects from "./pages/Projects";
import MyTasks from "./pages/MyTasks";
import Settings from "./pages/Settings";
import CreateProject from "./pages/CreateProject";
import CreateTask from "./pages/CreateTask";
import NotFound from "./pages/NotFound";
import ProjectDetail from "./pages/ProjectDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <DashboardLayout>
              <Projects />
            </DashboardLayout>
          } />
          <Route path="/my-tasks" element={
            <DashboardLayout>
              <MyTasks />
            </DashboardLayout>
          } />
          <Route path="/settings" element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          } />
          <Route path="/create-project" element={
            <DashboardLayout>
              <CreateProject />
            </DashboardLayout>
          } />
          <Route path="/create-task" element={
            <DashboardLayout>
              <CreateTask />
            </DashboardLayout>
          } />
          <Route path="/project/:id" element={
            <DashboardLayout>
              <ProjectDetail />
            </DashboardLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
