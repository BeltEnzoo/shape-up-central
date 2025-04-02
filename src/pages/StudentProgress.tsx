
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockService, Student, Exercise, ProgressEntry } from '@/lib/mock-data';
import Layout from '@/components/layout/Layout';
import PaymentAlert from '@/components/PaymentAlert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const StudentProgress = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState<any>(null);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
      return;
    }
    
    const student = user as Student;
    const studentRoutine = mockService.getRoutineById(student.routineId);
    const studentProgress = mockService.getProgressByStudentId(student.id);
    
    setRoutine(studentRoutine);
    setProgress(studentProgress);
    
    if (studentRoutine) {
      setExercises(studentRoutine.exercises);
      if (studentRoutine.exercises.length > 0) {
        setSelectedExerciseId(studentRoutine.exercises[0].id);
      }
    }
  }, [user, navigate]);
  
  if (!user || !routine || !progress) {
    return null;
  }
  
  const groupProgressByDate = () => {
    const grouped: {[date: string]: ProgressEntry[]} = {};
    
    progress.forEach(entry => {
      if (!grouped[entry.date]) {
        grouped[entry.date] = [];
      }
      grouped[entry.date].push(entry);
    });
    
    return Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map(date => ({
        date,
        entries: grouped[date]
      }));
  };
  
  const getChartData = () => {
    if (!selectedExerciseId) return [];
    
    const exerciseProgress = progress.filter(p => p.exerciseId === selectedExerciseId);
    return exerciseProgress
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(entry => ({
        date: entry.date,
        peso: entry.weightUsed,
        repeticiones: entry.repsCompleted
      }));
  };
  
  const chartData = getChartData();
  const groupedProgress = groupProgressByDate();
  
  return (
    <Layout>
      {user.role === 'student' && <PaymentAlert student={user as Student} />}
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mi Progreso</h1>
        <p className="text-gray-500">Visualiza tu evolución a lo largo del tiempo</p>
      </div>
      
      <Tabs defaultValue="graph" className="space-y-4">
        <TabsList>
          <TabsTrigger value="graph">Gráficos</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="graph" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evolución por ejercicio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedExerciseId || ''}
                  onChange={(e) => setSelectedExerciseId(e.target.value)}
                >
                  {exercises.map(exercise => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {chartData.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="peso" 
                        name="Peso (kg)" 
                        stroke="#0D9488" 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="repeticiones" 
                        name="Repeticiones" 
                        stroke="#0F172A" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex justify-center items-center h-72 border rounded-md">
                  <p className="text-gray-400">No hay datos de progreso para este ejercicio</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historial de entrenamientos</CardTitle>
            </CardHeader>
            <CardContent>
              {groupedProgress.length > 0 ? (
                <div className="space-y-6">
                  {groupedProgress.map(group => (
                    <div key={group.date}>
                      <h3 className="font-medium mb-2">{new Date(group.date).toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</h3>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ejercicio</TableHead>
                            <TableHead>Series</TableHead>
                            <TableHead>Repeticiones</TableHead>
                            <TableHead>Peso (kg)</TableHead>
                            <TableHead>Observaciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {group.entries.map(entry => {
                            const exercise = exercises.find(ex => ex.id === entry.exerciseId);
                            return (
                              <TableRow key={entry.id}>
                                <TableCell className="font-medium">{exercise?.name || 'Ejercicio desconocido'}</TableCell>
                                <TableCell>{entry.setsCompleted}</TableCell>
                                <TableCell>{entry.repsCompleted}</TableCell>
                                <TableCell>{entry.weightUsed}</TableCell>
                                <TableCell>{entry.notes || '-'}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p>No has registrado ningún progreso todavía.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default StudentProgress;
