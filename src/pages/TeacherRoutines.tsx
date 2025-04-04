import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockService } from '@/lib/mock-service';
import { Routine, Exercise, MuscleGroup } from '@/lib/mock-data';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Plus, MoreVertical, Trash2, Edit, Dumbbell } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

interface NewRoutine {
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  type: 'strength' | 'hypertrophy' | 'endurance' | 'custom';
  schedule: {
    daysPerWeek: number;
    restDays: number[];
  };
}

interface NewExercise {
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: number;
  weight: number;
  instructions: string;
}

const TeacherRoutines = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isNewRoutineDialogOpen, setIsNewRoutineDialogOpen] = useState(false);
  const [isNewExerciseDialogOpen, setIsNewExerciseDialogOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [newRoutine, setNewRoutine] = useState<NewRoutine>({
    name: '',
    description: '',
    level: 'beginner',
    type: 'strength',
    schedule: {
      daysPerWeek: 3,
      restDays: [0, 3, 6]
    }
  });
  const [newExercise, setNewExercise] = useState<NewExercise>({
    name: '',
    muscleGroup: 'legs',
    sets: 3,
    reps: 12,
    weight: 0,
    instructions: ''
  });

  const weekDays = [
    { value: 0, label: "Domingo" },
    { value: 1, label: "Lunes" },
    { value: 2, label: "Martes" },
    { value: 3, label: "Miércoles" },
    { value: 4, label: "Jueves" },
    { value: 5, label: "Viernes" },
    { value: 6, label: "Sábado" }
  ];
  
  useEffect(() => {
    if (!user || user.role !== 'teacher') {
      navigate('/login');
      return;
    }
    
    const teacherRoutines = mockService.getRoutinesByTeacherId(user.id);
    setRoutines(teacherRoutines);
  }, [user, navigate]);
  
  const handleCreateRoutine = () => {
    if (!user || user.role !== 'teacher') return;

    const routineData: Routine = {
      id: `r${Date.now()}`,
      ...newRoutine,
      createdBy: user.id,
      exercises: []
    };

    const success = mockService.addRoutine(routineData);
    if (success) {
      // Obtener las rutinas actualizadas del servicio
      const updatedRoutines = mockService.getRoutinesByTeacherId(user.id);
      setRoutines(updatedRoutines);
      
      toast({
        title: "Rutina creada",
        description: "La rutina ha sido creada exitosamente.",
      });
      setIsNewRoutineDialogOpen(false);
      
      // Limpiar el formulario
      setNewRoutine({
        name: '',
        description: '',
        level: 'beginner',
        type: 'strength',
        schedule: {
          daysPerWeek: 3,
          restDays: [0, 3, 6]
        }
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo crear la rutina.",
        variant: "destructive",
      });
    }
  };

  const handleAddExercise = () => {
    if (!selectedRoutine) return;

    const exerciseData: Exercise = {
      id: `ex${Date.now()}`,
      ...newExercise
    };

    const success = mockService.addExerciseToRoutine(selectedRoutine.id, exerciseData);
    if (success) {
      // Obtener las rutinas actualizadas del servicio
      const updatedRoutines = mockService.getRoutinesByTeacherId(user!.id);
      setRoutines(updatedRoutines);
      
      toast({
        title: "Ejercicio agregado",
        description: "El ejercicio ha sido agregado exitosamente a la rutina.",
      });
      setIsNewExerciseDialogOpen(false);
      
      // Limpiar el formulario
      setNewExercise({
        name: '',
        muscleGroup: 'legs',
        sets: 3,
        reps: 12,
        weight: 0,
        instructions: ''
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo agregar el ejercicio.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRoutine = (routineId: string) => {
    // TODO: Implementar deleteRoutine en mockService
    const success = mockService.deleteRoutine(routineId);
    if (success) {
      setRoutines(prev => prev.filter(r => r.id !== routineId));
      toast({
        title: "Rutina eliminada",
        description: "La rutina ha sido eliminada exitosamente.",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo eliminar la rutina.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExercise = (routineId: string, exerciseId: string) => {
    const success = mockService.deleteExerciseFromRoutine(routineId, exerciseId);
    if (success) {
      // Obtener las rutinas actualizadas del servicio
      const updatedRoutines = mockService.getRoutinesByTeacherId(user!.id);
      setRoutines(updatedRoutines);
      
      toast({
        title: "Ejercicio eliminado",
        description: "El ejercicio ha sido eliminado exitosamente de la rutina.",
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudo eliminar el ejercicio.",
        variant: "destructive",
      });
    }
  };

  const handleRestDayChange = (dayValue: number) => {
    setNewRoutine(prev => {
      const currentRestDays = prev.schedule.restDays;
      const updatedRestDays = currentRestDays.includes(dayValue)
        ? currentRestDays.filter(day => day !== dayValue)
        : [...currentRestDays, dayValue].sort((a, b) => a - b);

      return {
        ...prev,
        schedule: {
          ...prev.schedule,
          restDays: updatedRestDays
        }
      };
    });
  };

  const muscleGroups: { value: MuscleGroup; label: string }[] = [
    { value: 'chest', label: 'Pecho' },
    { value: 'back', label: 'Espalda' },
    { value: 'legs', label: 'Piernas' },
    { value: 'shoulders', label: 'Hombros' },
    { value: 'arms', label: 'Brazos' },
    { value: 'core', label: 'Core' },
    { value: 'fullBody', label: 'Cuerpo Completo' }
  ];
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestión de Rutinas</h1>
        <p className="text-gray-500">Crea y administra rutinas de ejercicios para tus alumnos</p>
      </div>
      
      <div className="flex justify-end mb-6">
        <Button onClick={() => setIsNewRoutineDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Rutina
        </Button>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routines.map(routine => (
          <Card key={routine.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">{routine.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedRoutine(routine);
                      setIsNewExerciseDialogOpen(true);
                    }}
                  >
                    <Dumbbell className="mr-2 h-4 w-4" />
                    Agregar ejercicio
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteRoutine(routine.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar rutina
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{routine.description}</p>
              <div className="flex gap-2 mb-4">
                <Badge variant="secondary">{routine.level}</Badge>
                <Badge variant="outline">{routine.type}</Badge>
                <Badge>{routine.exercises.length} ejercicios</Badge>
              </div>
              <div className="space-y-4">
                {routine.exercises.map(exercise => (
                  <div key={exercise.id} className="p-3 bg-secondary/20 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{exercise.name}</h4>
                        <p className="text-sm text-gray-500">
                          {exercise.sets} series × {exercise.reps} reps • {exercise.weight}kg
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{exercise.muscleGroup}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteExercise(routine.id, exercise.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Diálogo para nueva rutina */}
      <Dialog open={isNewRoutineDialogOpen} onOpenChange={setIsNewRoutineDialogOpen}>
        <DialogContent>
              <DialogHeader>
            <DialogTitle>Nueva Rutina</DialogTitle>
              </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la rutina</Label>
              <Input
                id="name"
                value={newRoutine.name}
                onChange={(e) => setNewRoutine(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Rutina de fuerza superior"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={newRoutine.description}
                onChange={(e) => setNewRoutine(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe el objetivo y características de la rutina"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Nivel</Label>
                <Select
                  value={newRoutine.level}
                  onValueChange={(value: any) => setNewRoutine(prev => ({ ...prev, level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Principiante</SelectItem>
                    <SelectItem value="intermediate">Intermedio</SelectItem>
                    <SelectItem value="advanced">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={newRoutine.type}
                  onValueChange={(value: any) => setNewRoutine(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">Fuerza</SelectItem>
                    <SelectItem value="hypertrophy">Hipertrofia</SelectItem>
                    <SelectItem value="endurance">Resistencia</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Programación semanal</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="daysPerWeek">Días por semana</Label>
                  <Input
                    id="daysPerWeek"
                    type="number"
                    min="1"
                    max="7"
                    value={newRoutine.schedule.daysPerWeek}
                    onChange={(e) => setNewRoutine(prev => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule,
                        daysPerWeek: parseInt(e.target.value)
                      }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Días de descanso</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {weekDays.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day.value}`}
                          checked={newRoutine.schedule.restDays.includes(day.value)}
                          onCheckedChange={() => handleRestDayChange(day.value)}
                        />
                        <Label
                          htmlFor={`day-${day.value}`}
                          className="text-sm font-normal"
                        >
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsNewRoutineDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateRoutine}>
              Crear Rutina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para nuevo ejercicio */}
      <Dialog open={isNewExerciseDialogOpen} onOpenChange={setIsNewExerciseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Ejercicio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="exerciseName">Nombre del ejercicio</Label>
              <Input
                id="exerciseName"
                value={newExercise.name}
                onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Press de banca"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="muscleGroup">Grupo muscular</Label>
              <Select
                value={newExercise.muscleGroup}
                onValueChange={(value: MuscleGroup) => setNewExercise(prev => ({ ...prev, muscleGroup: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el grupo muscular" />
                </SelectTrigger>
                <SelectContent>
                  {muscleGroups.map(group => (
                    <SelectItem key={group.value} value={group.value}>
                      {group.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sets">Series</Label>
                <Input
                  id="sets"
                  type="number"
                  min="1"
                  value={newExercise.sets}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, sets: parseInt(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reps">Repeticiones</Label>
                <Input
                  id="reps"
                  type="number"
                  min="1"
                  value={newExercise.reps}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, reps: parseInt(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  value={newExercise.weight}
                  onChange={(e) => setNewExercise(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instrucciones</Label>
              <Textarea
                id="instructions"
                value={newExercise.instructions}
                onChange={(e) => setNewExercise(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Describe cómo realizar el ejercicio correctamente"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsNewExerciseDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddExercise}>
              Agregar Ejercicio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TeacherRoutines;
