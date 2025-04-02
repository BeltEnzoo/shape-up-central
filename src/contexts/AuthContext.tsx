
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockService, User, Student, Teacher, UserRole } from '@/lib/mock-data';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isStudent: () => boolean;
  isTeacher: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching user from local storage or token validation
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('gym_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you'd validate credentials with your backend
    // For this demo, we'll accept any email from our mock data and any password
    try {
      // Get all users from mockService
      const students = mockService.getStudentsByTeacherId('all');
      const teachers = mockService.getAllTeachers ? mockService.getAllTeachers() : [];
      
      const foundUser = [...teachers, ...students]
        .find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('gym_user', JSON.stringify(foundUser));
        
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido, ${foundUser.name}`,
        });
        
        return true;
      } else {
        toast({
          title: "Error de autenticación",
          description: "Email o contraseña incorrectos",
          variant: "destructive",
        });
        
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error de autenticación",
        description: "Ocurrió un error durante el inicio de sesión",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gym_user');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
  };

  const isStudent = () => {
    return user?.role === 'student';
  };

  const isTeacher = () => {
    return user?.role === 'teacher';
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        logout,
        isStudent,
        isTeacher
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
