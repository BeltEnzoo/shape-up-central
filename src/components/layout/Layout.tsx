
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  LogOut,
  User,
  Dumbbell,
  CreditCard
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout, isStudent, isTeacher } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gym-accent">
      {/* Sidebar */}
      <aside className="bg-gym-primary text-white w-full md:w-64 flex-shrink-0">
        <div className="p-4 flex flex-col h-full">
          <div className="mb-8 mt-4">
            <h1 className="text-2xl font-bold mb-1">Shape Up Central</h1>
            <p className="text-sm opacity-75">Sistema de Gestión</p>
          </div>
          
          <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {isStudent() && (
              <>
                <Button 
                  variant="ghost" 
                  className="justify-start text-white" 
                  onClick={() => navigate('/dashboard')}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start text-white" 
                  onClick={() => navigate('/routine')}
                >
                  <Dumbbell className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Mi Rutina</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start text-white" 
                  onClick={() => navigate('/progress')}
                >
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Progreso</span>
                </Button>
              </>
            )}
            
            {isTeacher() && (
              <>
                <Button 
                  variant="ghost" 
                  className="justify-start text-white" 
                  onClick={() => navigate('/dashboard')}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start text-white" 
                  onClick={() => navigate('/students')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Alumnos</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start text-white" 
                  onClick={() => navigate('/routines')}
                >
                  <Dumbbell className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Rutinas</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start text-white" 
                  onClick={() => navigate('/payments')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Pagos</span>
                </Button>
              </>
            )}
          </div>
          
          <div className="mt-auto pt-6">
            <div className="flex items-center mb-4 p-2 rounded-md bg-opacity-20 bg-white">
              <div className="w-8 h-8 rounded-full bg-gym-secondary flex items-center justify-center mr-2">
                {user.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs opacity-75">{user.role === 'teacher' ? 'Profesor' : 'Alumno'}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start border-white/20 text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
