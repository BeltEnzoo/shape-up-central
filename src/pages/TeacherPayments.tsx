
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockService, Student, Teacher, Payment } from '@/lib/mock-data';
import Layout from '@/components/layout/Layout';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, CalendarCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const TeacherPayments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  
  useEffect(() => {
    if (!user || user.role !== 'teacher') {
      navigate('/login');
      return;
    }
    
    const teacher = user as Teacher;
    const teacherStudents = mockService.getStudentsByTeacherId(teacher.id);
    setStudents(teacherStudents);
    
    // Get all payments for this teacher's students
    const studentPayments: Payment[] = [];
    teacherStudents.forEach(student => {
      const studentPayments = mockService.getPaymentsByStudentId(student.id);
      studentPayments.push(...studentPayments);
    });
    
    setPayments(studentPayments);
  }, [user, navigate]);
  
  if (!user) {
    return null;
  }
  
  const handleMarkAsPaid = (student: Student) => {
    const updated = mockService.updateStudentPayment(student.id, 'paid');
    if (updated) {
      toast({
        title: "Pago actualizado",
        description: `El pago de ${student.name} ha sido marcado como recibido`,
      });
      
      // Update the students state
      setStudents(prevStudents => 
        prevStudents.map(s => 
          s.id === student.id 
            ? { ...s, paymentStatus: 'paid', lastPaymentDate: new Date().toISOString().split('T')[0] } 
            : s
        )
      );
      
      // Update the payments state
      const today = new Date().toISOString().split('T')[0];
      
      // Check if there's a pending payment to update
      const hasPendingPayment = payments.some(p => 
        p.studentId === student.id && p.status === 'pending'
      );
      
      if (hasPendingPayment) {
        setPayments(prevPayments =>
          prevPayments.map(p =>
            p.studentId === student.id && p.status === 'pending'
              ? { ...p, status: 'paid', date: today }
              : p
          )
        );
      } else {
        // Create a new payment
        const newPayment: Payment = {
          id: `pay${payments.length + 1}`,
          studentId: student.id,
          amount: 50,
          date: today,
          status: 'paid'
        };
        
        setPayments(prevPayments => [...prevPayments, newPayment]);
      }
    }
  };
  
  const pendingStudents = students.filter(student => student.paymentStatus === 'pending');
  const paidStudents = students.filter(student => student.paymentStatus === 'paid');
  
  // Sort payments by date, newest first
  const sortedPayments = [...payments].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestión de Pagos</h1>
        <p className="text-gray-500">Administra los pagos mensuales de tus alumnos</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alumnos</CardTitle>
            <User className="h-4 w-4 text-gym-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Recibidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-gym-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidStudents.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-gym-alert" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingStudents.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pagos Pendientes</TabsTrigger>
          <TabsTrigger value="history">Historial de Pagos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card>
            <CardContent className="p-0">
              {pendingStudents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alumno</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Último Pago</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingStudents.map((student) => (
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
                        <TableCell>
                          {student.lastPaymentDate || 'Sin pagos previos'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            <AlertCircle className="h-3 w-3 mr-1" /> Pendiente
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarkAsPaid(student)}
                          >
                            Marcar como pagado
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <CheckCircle className="h-12 w-12 text-gym-success mx-auto mb-2 opacity-50" />
                  <p className="text-lg text-gray-500">¡No hay pagos pendientes!</p>
                  <p className="text-sm text-gray-400">Todos tus alumnos están al día con sus pagos.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardContent className="p-0">
              {sortedPayments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alumno</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPayments.map((payment) => {
                      const student = students.find(s => s.id === payment.studentId);
                      if (!student) return null;
                      
                      return (
                        <TableRow key={payment.id}>
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
                          <TableCell>
                            {payment.date ? (
                              <div className="flex items-center">
                                <CalendarCheck className="h-4 w-4 mr-2 text-gray-400" />
                                {payment.date}
                              </div>
                            ) : (
                              'Pendiente'
                            )}
                          </TableCell>
                          <TableCell>${payment.amount}</TableCell>
                          <TableCell>
                            {payment.status === 'paid' ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" /> Pagado
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <AlertCircle className="h-3 w-3 mr-1" /> Pendiente
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-400">No hay historial de pagos disponible.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default TeacherPayments;
