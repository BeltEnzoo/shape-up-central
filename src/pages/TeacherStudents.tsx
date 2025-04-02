
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockService, Student, Teacher, Routine } from '@/lib/mock-data';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  MoreHorizontal,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const TeacherStudents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'profile' | 'routine'>('profile');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (!user || user.role !== 'teacher') {
      navigate('/login');
      return;
    }
    
    const teacher = user as Teacher;
    const teacherStudents = mockService.getStudentsByTeacherId(teacher.id);
    setStudents(teacherStudents);
    setRoutines(mockService.routines);
  }, [user, navigate]);
  
  if (!user) {
    return null;
  }
  
  const handleOpenProfile = (student: Student) => {
    setSelectedStudent(student);
    setDialogType('profile');
    setIsDialogOpen(true);
  };
  
  const handleOpenRoutine = (student: Student) => {
    setSelectedStudent(student);
    setDialogType('routine');
    setIsDialogOpen(true);
  };
  
  const handleMarkAsPaid = (student: Student) => {
    const updated = mockService.updateStudentPayment(student.id, 'paid');
    if (updated) {
      toast({
        title: "Pago actualizado",
        description: `El pago de ${student.name} ha sido marcado como recibido`,
      });
      
      // Update the local state
      setStudents(prevStudents => 
        prevStudents.map(s => 
          s.id === student.id 
            ? { ...s, paymentStatus: 'paid', lastPaymentDate: new Date().toISOString().split('T')[0] } 
            : s
        )
      );
    }
  };
  
  const handleUpdateRoutine = (routineId: string) => {
    if (!selectedStudent) return;
    
    const updated = mockService.updateStudentRoutine(selectedStudent.id, routineId);
    if (updated) {
      toast({
        title: "Rutina actualizada",
        description: `La rutina de ${selectedStudent.name} ha sido actualizada`,
      });
      
      // Update the local state
      setStudents(prevStudents => 
        prevStudents.map(s => 
          s.id === selectedStudent.id 
            ? { ...s, routineId } 
            : s
        )
      );
      
      setIsDialogOpen(false);
    }
  };
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestión de Alumnos</h1>
        <p className="text-gray-500">Administra los perfiles y rutinas de tus alumnos</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumno</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rutina</TableHead>
                <TableHead>Estado de Pago</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const routine = mockService.getRoutineById(student.routineId);
                
                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {student.profileImage ? (
                          <img
                            src={student.profileImage}
                            alt={student.name}
                            className="w-8 h-8 rounded-full mr-2 object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gym-secondary flex items-center justify-center mr-2">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{routine ? routine.name : 'Sin rutina'}</TableCell>
                    <TableCell>
                      {student.paymentStatus === 'paid' ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" /> Pagado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <AlertCircle className="h-3 w-3 mr-1" /> Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOpenProfile(student)}>
                            Ver perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenRoutine(student)}>
                            Cambiar rutina
                          </DropdownMenuItem>
                          {student.paymentStatus === 'pending' && (
                            <DropdownMenuItem onClick={() => handleMarkAsPaid(student)}>
                              Marcar como pagado
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {dialogType === 'profile' && selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle>Perfil de Alumno</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="flex flex-col items-center mb-4">
                  {selectedStudent.profileImage ? (
                    <img
                      src={selectedStudent.profileImage}
                      alt={selectedStudent.name}
                      className="w-20 h-20 rounded-full object-cover mb-2"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gym-secondary flex items-center justify-center mb-2">
                      <User className="h-10 w-10 text-white" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                  <p className="text-gray-500">{selectedStudent.email}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Estado de Pago</p>
                    {selectedStudent.paymentStatus === 'paid' ? (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span>Pagado ({selectedStudent.lastPaymentDate})</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                        <span>Pendiente</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rutina Actual</p>
                    <p>{mockService.getRoutineById(selectedStudent.routineId)?.name || 'Sin rutina'}</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  {selectedStudent.paymentStatus === 'pending' && (
                    <Button 
                      onClick={() => {
                        handleMarkAsPaid(selectedStudent);
                        setIsDialogOpen(false);
                      }}
                    >
                      Marcar como pagado
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {dialogType === 'routine' && selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle>Cambiar Rutina - {selectedStudent.name}</DialogTitle>
              </DialogHeader>
              
              <div className="mt-4">
                <ScrollArea className="h-[280px] pr-4">
                  <div className="space-y-3">
                    {routines.map(routine => {
                      const isActive = routine.id === selectedStudent.routineId;
                      
                      return (
                        <Card 
                          key={routine.id} 
                          className={`cursor-pointer hover:shadow transition-shadow ${
                            isActive ? 'border-gym-secondary bg-gym-secondary/5' : ''
                          }`}
                          onClick={() => handleUpdateRoutine(routine.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold">{routine.name}</h3>
                                <p className="text-sm text-gray-500">{routine.description}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {routine.exercises.length} ejercicios
                                </p>
                              </div>
                              {isActive && (
                                <Badge>Actual</Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TeacherStudents;
