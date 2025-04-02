
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StudentRoutine from "./pages/StudentRoutine";
import StudentProgress from "./pages/StudentProgress";
import TeacherStudents from "./pages/TeacherStudents";
import TeacherPayments from "./pages/TeacherPayments";
import TeacherRoutines from "./pages/TeacherRoutines";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/routine" element={<StudentRoutine />} />
            <Route path="/progress" element={<StudentProgress />} />
            <Route path="/students" element={<TeacherStudents />} />
            <Route path="/payments" element={<TeacherPayments />} />
            <Route path="/routines" element={<TeacherRoutines />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
