import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Student, Teacher, Routine } from '@/lib/mock-data';
import { mockService } from '@/lib/mock-service';
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
  DialogFooter,
  DialogDescription,
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
  AlertCircle,
  UserPlus,
  Trash2,
  Power,
  PowerOff,
  MoreVertical,
  KeyRound,
  RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewStudent {
  name: string;
  email: string;
  phone: string;
  routineId: string;
}

interface StudentFormData {
  name: string;
  email: string;
  routineId: string;
}

const TeacherStudents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'new' | 'profile' | 'routine'>('new');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStudent, setNewStudent] = useState<NewStudent>({
    name: '',
    email: '',
    phone: '',
    routineId: ''
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  
  useEffect(() => {
    if (!user || user.role !== 'teacher') {
      navigate('/login');
      return;
    }
    
    // Cargar estudiantes
    const teacherStudents = mockService.getStudentsByTeacherId(user.id);
    setStudents(teacherStudents);

    // Cargar rutinas del profesor
    const teacherRoutines = mockService.getRoutinesByTeacherId(user.id);
    setRoutines(teacherRoutines);
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
  
  const handleOpenNewStudent = () => {
    setDialogType('new');
    setIsDialogOpen(true);
    setNewStudent({
      name: '',
      email: '',
      phone: '',
      routineId: routines[0]?.id || ''
    });
  };

  const handleCreateStudent = () => {
    if (!user || user.role !== 'teacher') return;

    const studentData: Student = {
      id: `s${Date.now()}`,
      name: newStudent.name,
      email: newStudent.email,
      phone: newStudent.phone,
      role: 'student',
      teacherId: user.id,
      routineId: newStudent.routineId,
      paymentStatus: 'pending',
      isActive: true,
      lastPaymentDate: null,
      ...mockService.generateCredentials(newStudent.name)
    };

    const success = mockService.addStudent(studentData);
    if (success) {
      setStudents(prev => [...prev, studentData]);
      toast({
        title: "Alumno creado",
        description: "El alumno ha sido creado exitosamente.",
      });
      setIsDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "No se pudo crear el alumno.",
        variant: "destructive",
      });
    }
  };
  
  const handleRegenerateCredentials = (studentId: string) => {
    const credentials = mockService.regenerateStudentCredentials(studentId);
    if (credentials) {
      toast({
        title: "Credenciales actualizadas",
        description: `Usuario: ${credentials.username}\nContraseña: ${credentials.password}`,
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudieron regenerar las credenciales.",
        variant: "destructive",
      });
    }
  };

  const handleShowCredentials = (studentId: string) => {
    const credentials = mockService.getStudentCredentials(studentId);
    if (credentials) {
      toast({
        title: "Credenciales del alumno",
        description: `Usuario: ${credentials.username}\nContraseña: ${credentials.password}`,
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudieron obtener las credenciales.",
        variant: "destructive",
      });
    }
  };
  
  const handleOpenDeleteDialog = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteStudent = () => {
    if (!studentToDelete) return;

    const deleted = mockService.deleteStudent(studentToDelete.id);
    if (deleted) {
      toast({
        title: "Alumno eliminado",
        description: `${studentToDelete.name} ha sido eliminado exitosamente`,
      });

      // Actualizar la lista local de estudiantes
      setStudents(prevStudents => prevStudents.filter(s => s.id !== studentToDelete.id));
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null); // Limpiar el estudiante seleccionado
    } else {
      toast({
        title: "Error",
        description: "No se pudo eliminar el alumno",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleStatus = (student: Student) => {
    const updated = mockService.updateStudentStatus(student.id, !student.isActive);
    if (updated) {
      toast({
        title: student.isActive ? "Cuenta desactivada" : "Cuenta activada",
        description: `La cuenta de ${student.name} ha sido ${student.isActive ? 'desactivada' : 'activada'} exitosamente`,
      });
      
      // Actualizar la lista local de estudiantes
      setStudents(prevStudents => 
        prevStudents.map(s => 
          s.id === student.id 
            ? { ...s, isActive: !s.isActive } 
            : s
        )
      );
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
        <Button onClick={handleOpenNewStudent} className="ml-4">
          <UserPlus className="h-4 w-4 mr-2" />
          Agregar Alumno
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alumno</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Rutina</TableHead>
                <TableHead>Estado de Pago</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const routine = mockService.getRoutineById(student.routineId);
                
                return (
                  <TableRow 
                    key={student.id}
                    className={!student.isActive ? "opacity-60" : ""}
                  >
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
                    <TableCell>{student.phone}</TableCell>
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
                    <TableCell>
                      <Badge 
                        variant={student.isActive ? "outline" : "secondary"}
                        className={student.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-700"}
                      >
                        {student.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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
                          <DropdownMenuItem onClick={() => handleToggleStatus(student)}>
                            {student.isActive ? (
                              <>
                                <PowerOff className="mr-2 h-4 w-4" />
                                Desactivar cuenta
                              </>
                            ) : (
                              <>
                                <Power className="mr-2 h-4 w-4" />
                                Activar cuenta
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShowCredentials(student.id)}>
                            <KeyRound className="mr-2 h-4 w-4" />
                            Ver credenciales
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRegenerateCredentials(student.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Regenerar credenciales
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleOpenDeleteDialog(student)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar alumno
                          </DropdownMenuItem>
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
          {dialogType === 'new' ? (
            <>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Alumno</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Juan Pérez"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Número de celular</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+54 911 1234-5678"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="routine">Rutina inicial</Label>
                  <Select
                    value={newStudent.routineId}
                    onValueChange={(value) => setNewStudent(prev => ({ ...prev, routineId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una rutina" />
                    </SelectTrigger>
                    <SelectContent>
                      {routines.map(routine => (
                        <SelectItem key={routine.id} value={routine.id}>
                          {routine.name} ({routine.level})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateStudent}>
                  Agregar Alumno
                </Button>
              </DialogFooter>
            </>
          ) : dialogType === 'profile' && selectedStudent && (
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

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar a {studentToDelete?.name}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteStudent}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TeacherStudents;
