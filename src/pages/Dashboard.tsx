
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import PaymentAlert from '@/components/PaymentAlert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockService, Student } from '@/lib/mock-data';
import { Dumbbell, Calendar, CheckCircle, AlertCircle, User, Users } from 'lucide-react';

const Dashboard = () => {
  const { user, isStudent, isTeacher } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) {
    return null;
  }
  
  const renderStudentDashboard = () => {
    const student = user as Student;
    const routine = mockService.getRoutineById(student.routineId);
    const progress = mockService.getProgressByStudentId(student.id);
    
    return (
      <>
        <PaymentAlert student={student} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rutina Actual</CardTitle>
              <Dumbbell className="h-4 w-4 text-gym-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{routine?.name || 'Sin asignar'}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {routine?.exercises.length || 0} ejercicios
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado de Pago</CardTitle>
              {student.paymentStatus === 'paid' ? (
                <CheckCircle className="h-4 w-4 text-gym-success" />
              ) : (
                <AlertCircle className="h-4 w-4 text-gym-alert" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {student.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {student.lastPaymentDate 
                  ? `Último pago: ${student.lastPaymentDate}` 
                  : 'Sin pagos registrados'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registros de Progreso</CardTitle>
              <Calendar className="h-4 w-4 text-gym-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total de entrenamientos registrados
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Próximos pasos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/routine')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ver mi rutina</CardTitle>
                  <CardDescription>Consulta los ejercicios de tu rutina actual</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/progress')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Registrar progreso</CardTitle>
                  <CardDescription>Anota tus avances en cada ejercicio</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  const renderTeacherDashboard = () => {
    const teacher = user;
    const students = mockService.getStudentsByTeacherId(teacher.id);
    const pendingPayments = students.filter(s => s.paymentStatus === 'pending');
    
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Alumnos</CardTitle>
              <Users className="h-4 w-4 text-gym-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Alumnos a tu cargo
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
              <AlertCircle className="h-4 w-4 text-gym-alert" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPayments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Alumnos con pagos pendientes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rutinas Activas</CardTitle>
              <Dumbbell className="h-4 w-4 text-gym-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockService.routines.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Rutinas disponibles
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Accesos rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/students')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Gestionar alumnos</CardTitle>
                <CardDescription>Administra perfiles y rutinas de tus alumnos</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/payments')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Gestionar pagos</CardTitle>
                <CardDescription>Revisa y actualiza el estado de los pagos</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
        
        {pendingPayments.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Pagos pendientes</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {pendingPayments.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        {student.profileImage ? (
                          <img 
                            src={student.profileImage} 
                            alt={student.name} 
                            className="w-10 h-10 rounded-full mr-3 object-cover" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gym-secondary flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div 
                        className="text-sm bg-gym-alert/10 text-gym-alert px-3 py-1 rounded-full"
                      >
                        Pendiente
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Bienvenido, {user.name}
        </h1>
        <p className="text-gray-500">
          {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      {isStudent() && renderStudentDashboard()}
      {isTeacher() && renderTeacherDashboard()}
    </Layout>
  );
};

export default Dashboard;
