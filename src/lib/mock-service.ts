import { teachers, students, routines, exercises, progress, payments, Student, Teacher } from './mock-data';

// Mantener una copia local de los estudiantes para poder modificarla
let localStudents = [...students];

// Mantener una copia local de las rutinas para poder modificarlas
let localRoutines = [...routines];

class MockService {
  getAllTeachers(): Teacher[] {
    return teachers;
  }

  getStudentsByTeacherId(teacherId: string): Student[] {
    if (teacherId === 'all') return localStudents;
    return localStudents.filter(student => student.teacherId === teacherId);
  }

  getStudentById(studentId: string): Student | undefined {
    return localStudents.find(student => student.id === studentId);
  }

  getTeacherById(teacherId: string): Teacher | undefined {
    return teachers.find(teacher => teacher.id === teacherId);
  }

  getAllRoutines() {
    return localRoutines;
  }

  getRoutinesByTeacherId(teacherId: string): Routine[] {
    return localRoutines.filter(routine => routine.createdBy === teacherId);
  }

  getRoutineById(routineId: string) {
    return localRoutines.find(routine => routine.id === routineId);
  }

  getExerciseById(exerciseId: string) {
    return exercises.find(exercise => exercise.id === exerciseId);
  }

  getAllExercises() {
    return exercises;
  }

  getProgressByStudentId(studentId: string) {
    return progress.filter(entry => entry.studentId === studentId);
  }

  getProgressByExerciseId(exerciseId: string) {
    return progress.filter(entry => entry.exerciseId === exerciseId);
  }

  getPaymentsByStudentId(studentId: string) {
    return payments.filter(payment => payment.studentId === studentId);
  }

  getAllPayments() {
    return payments;
  }

  addStudent(student: Student): boolean {
    try {
      // Validar datos requeridos
      if (!student.name || !student.email || !student.teacherId || !student.routineId || !student.phone) {
        console.error('Faltan datos requeridos');
        return false;
      }

      // Verificar que el email no esté en uso
      const existingStudent = localStudents.find(s => s.email.toLowerCase() === student.email.toLowerCase());
      if (existingStudent) {
        console.error('El email ya está en uso');
        return false;
      }

      // Agregar el estudiante a la lista local
      localStudents.push(student);

      // Actualizar la lista de estudiantes del profesor
      const teacher = teachers.find(t => t.id === student.teacherId);
      if (teacher) {
        teacher.studentIds.push(student.id);
      }

      return true;
    } catch (error) {
      console.error('Error al agregar estudiante:', error);
      return false;
    }
  }

  updateStudentPayment(studentId: string, status: 'paid' | 'pending'): boolean {
    try {
      const student = localStudents.find(s => s.id === studentId);
      if (student) {
        student.paymentStatus = status;
        student.lastPaymentDate = status === 'paid' ? new Date().toISOString().split('T')[0] : null;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al actualizar pago:', error);
      return false;
    }
  }

  updateStudentRoutine(studentId: string, routineId: string): boolean {
    try {
      const student = localStudents.find(s => s.id === studentId);
      if (student) {
        student.routineId = routineId;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al actualizar rutina:', error);
      return false;
    }
  }

  deleteStudent(studentId: string): boolean {
    try {
      // Encontrar el índice del estudiante
      const studentIndex = localStudents.findIndex(s => s.id === studentId);
      if (studentIndex === -1) return false;

      // Obtener el estudiante antes de eliminarlo
      const student = localStudents[studentIndex];

      // Eliminar el estudiante de la lista local
      localStudents.splice(studentIndex, 1);

      // Eliminar el ID del estudiante de la lista del profesor
      const teacher = teachers.find(t => t.id === student.teacherId);
      if (teacher) {
        teacher.studentIds = teacher.studentIds.filter(id => id !== studentId);
      }

      return true;
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      return false;
    }
  }

  updateStudentStatus(studentId: string, isActive: boolean): boolean {
    try {
      const student = localStudents.find(s => s.id === studentId);
      if (student) {
        student.isActive = isActive;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al actualizar estado del estudiante:', error);
      return false;
    }
  }

  generateCredentials(name: string): { username: string, password: string } {
    // Generar username a partir del nombre
    const username = name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '.')
      .replace(/[^a-z0-9.]/g, '');
    
    // Generar contraseña aleatoria de 6 caracteres
    const password = Math.random().toString(36).slice(-6);
    
    return { username, password };
  }

  regenerateStudentCredentials(studentId: string): { username: string, password: string } | null {
    try {
      const student = localStudents.find(s => s.id === studentId);
      if (student) {
        const credentials = this.generateCredentials(student.name);
        student.username = credentials.username;
        student.password = credentials.password;
        return credentials;
      }
      return null;
    } catch (error) {
      console.error('Error al regenerar credenciales:', error);
      return null;
    }
  }

  getStudentCredentials(studentId: string): { username: string, password: string } | null {
    try {
      const student = localStudents.find(s => s.id === studentId);
      if (student) {
        return {
          username: student.username,
          password: student.password
        };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener credenciales:', error);
      return null;
    }
  }

  addRoutine(routine: Routine): boolean {
    try {
      // Validar datos requeridos
      if (!routine.name || !routine.level || !routine.type || !routine.createdBy) {
        console.error('Faltan datos requeridos');
        return false;
      }

      // Agregar la rutina a la lista local
      localRoutines.push(routine);
      return true;
    } catch (error) {
      console.error('Error al agregar rutina:', error);
      return false;
    }
  }

  deleteRoutine(routineId: string): boolean {
    try {
      // Encontrar el índice de la rutina
      const routineIndex = localRoutines.findIndex(r => r.id === routineId);
      if (routineIndex === -1) return false;

      // Eliminar la rutina de la lista local
      localRoutines.splice(routineIndex, 1);

      // Actualizar los estudiantes que tenían esta rutina asignada
      localStudents.forEach(student => {
        if (student.routineId === routineId) {
          student.routineId = '';
        }
      });

      return true;
    } catch (error) {
      console.error('Error al eliminar rutina:', error);
      return false;
    }
  }

  addExerciseToRoutine(routineId: string, exercise: Exercise): boolean {
    try {
      const routine = localRoutines.find(r => r.id === routineId);
      if (!routine) return false;

      // Validar datos requeridos del ejercicio
      if (!exercise.name || !exercise.muscleGroup) {
        console.error('Faltan datos requeridos del ejercicio');
        return false;
      }

      // Agregar el ejercicio a la rutina
      routine.exercises.push(exercise);
      return true;
    } catch (error) {
      console.error('Error al agregar ejercicio:', error);
      return false;
    }
  }

  deleteExerciseFromRoutine(routineId: string, exerciseId: string): boolean {
    try {
      const routine = localRoutines.find(r => r.id === routineId);
      if (!routine) return false;

      // Eliminar el ejercicio de la rutina
      routine.exercises = routine.exercises.filter(e => e.id !== exerciseId);
      return true;
    } catch (error) {
      console.error('Error al eliminar ejercicio:', error);
      return false;
    }
  }
}

export const mockService = new MockService(); 