
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockService, Student, Exercise, ProgressEntry } from '@/lib/mock-data';
import Layout from '@/components/layout/Layout';
import PaymentAlert from '@/components/PaymentAlert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const StudentRoutine = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [routine, setRoutine] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [progressForm, setProgressForm] = useState({
    sets: 0,
    reps: 0,
    weight: 0,
    notes: ''
  });
  
  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
      return;
    }
    
    const student = user as Student;
    const studentRoutine = mockService.getRoutineById(student.routineId);
    setRoutine(studentRoutine);
  }, [user, navigate]);
  
  if (!user || !routine) {
    return null;
  }
  
  const handleAddProgress = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setProgressForm({
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      notes: ''
    });
    setIsDialogOpen(true);
  };
  
  const handleProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedExercise) return;
    
    const newProgress: Omit<ProgressEntry, 'id'> = {
      studentId: user.id,
      exerciseId: selectedExercise.id,
      date: new Date().toISOString().split('T')[0],
      setsCompleted: progressForm.sets,
      repsCompleted: progressForm.reps,
      weightUsed: progressForm.weight,
      notes: progressForm.notes
    };
    
    mockService.addProgressEntry(newProgress);
    
    toast({
      title: "Progreso registrado",
      description: "Tu progreso ha sido guardado con éxito",
    });
    
    setIsDialogOpen(false);
  };
  
  return (
    <Layout>
      {user.role === 'student' && <PaymentAlert student={user as Student} />}
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mi Rutina</h1>
        <p className="text-gray-500">Consulta y registra progreso en tu rutina actual</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{routine.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {routine.description && <p className="mb-4">{routine.description}</p>}
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ejercicio</TableHead>
                <TableHead>Series</TableHead>
                <TableHead>Repeticiones</TableHead>
                <TableHead>Peso (kg)</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routine.exercises.map((exercise: Exercise) => (
                <TableRow key={exercise.id}>
                  <TableCell className="font-medium">{exercise.name}</TableCell>
                  <TableCell>{exercise.sets}</TableCell>
                  <TableCell>{exercise.reps}</TableCell>
                  <TableCell>{exercise.weight}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddProgress(exercise)}
                    >
                      Registrar progreso
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Registrar progreso - {selectedExercise?.name}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleProgressSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sets">Series completadas</Label>
                <Input
                  id="sets"
                  type="number"
                  value={progressForm.sets}
                  onChange={(e) => setProgressForm({
                    ...progressForm,
                    sets: parseInt(e.target.value)
                  })}
                  required
                  min={1}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reps">Repeticiones por serie</Label>
                <Input
                  id="reps"
                  type="number"
                  value={progressForm.reps}
                  onChange={(e) => setProgressForm({
                    ...progressForm,
                    reps: parseInt(e.target.value)
                  })}
                  required
                  min={1}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Peso utilizado (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={progressForm.weight}
                onChange={(e) => setProgressForm({
                  ...progressForm,
                  weight: parseInt(e.target.value)
                })}
                required
                min={0}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observaciones (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Anota cualquier observación sobre el ejercicio..."
                value={progressForm.notes}
                onChange={(e) => setProgressForm({
                  ...progressForm,
                  notes: e.target.value
                })}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default StudentRoutine;
