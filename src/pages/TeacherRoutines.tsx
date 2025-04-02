
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockService, Routine, Exercise } from '@/lib/mock-data';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TeacherRoutines = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!user || user.role !== 'teacher') {
      navigate('/login');
      return;
    }
    
    setRoutines(mockService.routines);
  }, [user, navigate]);
  
  if (!user) {
    return null;
  }
  
  const handleViewRoutine = (routine: Routine) => {
    setSelectedRoutine(routine);
    setIsDialogOpen(true);
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Rutinas de Entrenamiento</h1>
        <p className="text-gray-500">Gestiona las rutinas disponibles para tus alumnos</p>
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas las Rutinas</TabsTrigger>
          <TabsTrigger value="exercises">Ejercicios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routines.map(routine => (
              <Card 
                key={routine.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewRoutine(routine)}
              >
                <CardHeader>
                  <CardTitle>{routine.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-500">{routine.description}</p>
                  <div className="flex justify-between text-sm">
                    <span>{routine.exercises.length} ejercicios</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="exercises">
          <Card>
            <CardHeader>
              <CardTitle>Biblioteca de Ejercicios</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {mockService.exercises.map(exercise => (
                  <AccordionItem key={exercise.id} value={exercise.id}>
                    <AccordionTrigger>{exercise.name}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-4">
                        <p><strong>Series:</strong> {exercise.sets}</p>
                        <p><strong>Repeticiones:</strong> {exercise.reps}</p>
                        <p><strong>Peso recomendado:</strong> {exercise.weight} kg</p>
                        {exercise.notes && (
                          <p><strong>Notas:</strong> {exercise.notes}</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedRoutine && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRoutine.name}</DialogTitle>
              </DialogHeader>
              
              <div className="mt-4">
                {selectedRoutine.description && (
                  <p className="text-gray-500 mb-6">{selectedRoutine.description}</p>
                )}
                
                <h3 className="text-lg font-semibold mb-3">Ejercicios en esta rutina</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ejercicio</TableHead>
                      <TableHead>Series</TableHead>
                      <TableHead>Repeticiones</TableHead>
                      <TableHead>Peso (kg)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRoutine.exercises.map((exercise: Exercise) => (
                      <TableRow key={exercise.id}>
                        <TableCell className="font-medium">{exercise.name}</TableCell>
                        <TableCell>{exercise.sets}</TableCell>
                        <TableCell>{exercise.reps}</TableCell>
                        <TableCell>{exercise.weight}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="flex justify-end mt-6">
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
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TeacherRoutines;
