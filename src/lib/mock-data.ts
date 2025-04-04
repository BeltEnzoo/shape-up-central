export type UserRole = 'student' | 'teacher';

export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student';
  teacherId: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  isActive: boolean;
  username: string;
  password: string;
  lastLogin?: string;
  routineId: string;
  profileImage?: string;
  lastPaymentDate?: string | null;
}

export interface Teacher extends User {
  role: 'teacher';
  studentIds: string[];
}

export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'legs' 
  | 'shoulders' 
  | 'arms' 
  | 'core' 
  | 'fullBody';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
  instructions?: string;
  image?: string;
  videoUrl?: string;
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  type: 'strength' | 'hypertrophy' | 'endurance' | 'custom';
  createdBy: string; // teacherId
  exercises: Exercise[];
  schedule?: {
    daysPerWeek: number;
    restDays: number[];
  };
}

export interface ProgressEntry {
  id: string;
  studentId: string;
  exerciseId: string;
  date: string;
  setsCompleted: number;
  repsCompleted: number;
  weightUsed: number;
  notes?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  status: PaymentStatus;
}

// Mock data
export const exercises: Exercise[] = [
  { 
    id: "ex1", 
    name: "Sentadillas",
    muscleGroup: "legs",
    sets: 3, 
    reps: 12, 
    weight: 30,
    instructions: "1. Párate con los pies al ancho de los hombros\n2. Baja flexionando las rodillas\n3. Mantén la espalda recta\n4. Sube empujando desde los talones"
  },
  { 
    id: "ex2", 
    name: "Press de banca",
    muscleGroup: "chest",
    sets: 4, 
    reps: 8, 
    weight: 60,
    instructions: "1. Acuéstate en el banco\n2. Agarra la barra con las manos más anchas que los hombros\n3. Baja la barra al pecho\n4. Empuja hacia arriba"
  },
  { 
    id: "ex3", 
    name: "Peso muerto",
    muscleGroup: "back",
    sets: 3, 
    reps: 10, 
    weight: 80,
    instructions: "1. Párate con los pies al ancho de las caderas\n2. Flexiona las caderas hacia atrás\n3. Agarra la barra\n4. Levanta manteniendo la espalda recta"
  },
  { id: "ex4", name: "Dominadas", sets: 3, reps: 8, weight: 0 },
  { id: "ex5", name: "Curl de bíceps", sets: 3, reps: 12, weight: 15 },
  { id: "ex6", name: "Extensiones de tríceps", sets: 3, reps: 12, weight: 20 },
  { id: "ex7", name: "Zancadas", sets: 3, reps: 10, weight: 20 },
  { id: "ex8", name: "Prensa de piernas", sets: 4, reps: 12, weight: 120 },
  { id: "ex9", name: "Remo", sets: 3, reps: 12, weight: 40 },
  { id: "ex10", name: "Press militar", sets: 3, reps: 10, weight: 30 }
];

export const routines: Routine[] = [
  {
    id: "r1",
    name: "Fuerza Superior",
    description: "Rutina enfocada en desarrollar la fuerza de la parte superior del cuerpo",
    level: "intermediate",
    type: "strength",
    createdBy: "t1",
    exercises: [exercises[1]],
    schedule: {
      daysPerWeek: 3,
      restDays: [0, 3, 6] // domingo, miércoles, sábado
    }
  },
  {
    id: "r2",
    name: "Fuerza Inferior",
    description: "Rutina enfocada en desarrollar la fuerza de la parte inferior del cuerpo",
    level: "beginner",
    type: "strength",
    createdBy: "t1",
    exercises: [exercises[0]],
    schedule: {
      daysPerWeek: 2,
      restDays: [0, 3, 5, 6]
    }
  },
  {
    id: "r3",
    name: "Full Body",
    description: "Rutina completa para trabajar todo el cuerpo",
    level: "advanced",
    type: "hypertrophy",
    createdBy: "t1",
    exercises: [exercises[0], exercises[1], exercises[2]],
    schedule: {
      daysPerWeek: 4,
      restDays: [0, 4]
    }
  }
];

export const teachers: Teacher[] = [
  {
    id: "t1",
    name: "Carlos Pérez",
    email: "carlos@gimnasio.com",
    role: "teacher",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
    studentIds: ["s1", "s2", "s3"]
  },
  {
    id: "t2",
    name: "Ana López",
    email: "ana@gimnasio.com",
    role: "teacher",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
    studentIds: ["s4", "s5"]
  }
];

export const students: Student[] = [
  {
    id: "s1",
    name: "Miguel Rodríguez",
    email: "miguel@ejemplo.com",
    phone: "+54 911 1234-5678",
    role: "student",
    profileImage: "https://randomuser.me/api/portraits/men/11.jpg",
    teacherId: "t1",
    routineId: "r1",
    paymentStatus: "paid",
    lastPaymentDate: "2023-06-15",
    isActive: true,
    username: "miguel.rodriguez",
    password: "password123",
    lastLogin: "2024-03-15T10:30:00Z"
  },
  {
    id: "s2",
    name: "Laura Sánchez",
    email: "laura@ejemplo.com",
    phone: "+54 911 2345-6789",
    role: "student",
    profileImage: "https://randomuser.me/api/portraits/women/12.jpg",
    teacherId: "t1",
    routineId: "r2",
    paymentStatus: "pending",
    lastPaymentDate: "2023-05-15",
    isActive: true,
    username: "laura.sanchez",
    password: "password123",
    lastLogin: "2024-03-14T15:45:00Z"
  },
  {
    id: "s3",
    name: "Javier Martínez",
    email: "javier@ejemplo.com",
    role: "student",
    teacherId: "t1",
    routineId: "r3",
    paymentStatus: "overdue",
    lastPaymentDate: "2023-06-10",
    isActive: true,
    username: "javier.martinez",
    password: "password123",
    lastLogin: "2024-03-13T09:15:00Z"
  },
  {
    id: "s4",
    name: "Elena García",
    email: "elena@ejemplo.com",
    role: "student",
    profileImage: "https://randomuser.me/api/portraits/women/14.jpg",
    teacherId: "t2",
    routineId: "r2",
    paymentStatus: "paid",
    lastPaymentDate: null,
    isActive: true,
    username: "elena.garcia",
    password: "password123",
    lastLogin: "2024-03-12T16:20:00Z"
  },
  {
    id: "s5",
    name: "Roberto Fernández",
    email: "roberto@ejemplo.com",
    role: "student",
    teacherId: "t2",
    routineId: "r1",
    paymentStatus: "pending",
    lastPaymentDate: "2023-06-20",
    isActive: true,
    username: "roberto.fernandez",
    password: "password123",
    lastLogin: "2024-03-11T11:30:00Z"
  }
];

export const progress: ProgressEntry[] = [
  {
    id: "p1",
    studentId: "s1",
    exerciseId: "ex2",
    date: "2023-06-01",
    setsCompleted: 4,
    repsCompleted: 8,
    weightUsed: 60,
    notes: "Buena forma"
  },
  {
    id: "p2",
    studentId: "s1",
    exerciseId: "ex2",
    date: "2023-06-08",
    setsCompleted: 4,
    repsCompleted: 8,
    weightUsed: 65,
    notes: "Aumenté peso"
  },
  {
    id: "p3",
    studentId: "s1",
    exerciseId: "ex2",
    date: "2023-06-15",
    setsCompleted: 4,
    repsCompleted: 8,
    weightUsed: 70,
    notes: "Difícil pero completado"
  },
  {
    id: "p4",
    studentId: "s2",
    exerciseId: "ex1",
    date: "2023-05-28",
    setsCompleted: 3,
    repsCompleted: 12,
    weightUsed: 30,
    notes: "Primera vez con este peso"
  },
  {
    id: "p5",
    studentId: "s2",
    exerciseId: "ex1",
    date: "2023-06-05",
    setsCompleted: 3,
    repsCompleted: 12,
    weightUsed: 35,
    notes: "Mejorando la técnica"
  }
];

export const payments: Payment[] = [
  {
    id: "pay1",
    studentId: "s1",
    amount: 50,
    date: "2023-06-15",
    status: "paid"
  },
  {
    id: "pay2",
    studentId: "s2",
    amount: 50,
    date: "2023-05-15",
    status: "paid"
  },
  {
    id: "pay3",
    studentId: "s3",
    amount: 50,
    date: "2023-06-10",
    status: "paid"
  },
  {
    id: "pay4",
    studentId: "s4",
    amount: 50,
    date: "",
    status: "pending"
  },
  {
    id: "pay5",
    studentId: "s5",
    amount: 50,
    date: "2023-06-20",
    status: "paid"
  }
];

let MOCK_DATA = {
  exercises,
  routines,
  teachers,
  students,
  progress,
  payments
};

// Mock service functions
export const mockService = {
  getCurrentUser: (): User | null => {
    // For demo purposes, we'll return a student
    return MOCK_DATA.students[0];
  },
  
  getUserById: (id: string): User | undefined => {
    return [...MOCK_DATA.students, ...MOCK_DATA.teachers].find(user => user.id === id);
  },
  
  getStudentsByTeacherId: (teacherId: string): Student[] => {
    return MOCK_DATA.students.filter(student => student.teacherId === teacherId);
  },
  
  getRoutineById: (id: string): Routine | undefined => {
    return MOCK_DATA.routines.find(routine => routine.id === id);
  },
  
  getProgressByStudentId: (studentId: string): ProgressEntry[] => {
    return MOCK_DATA.progress.filter(entry => entry.studentId === studentId);
  },
  
  getPaymentsByStudentId: (studentId: string): Payment[] => {
    return MOCK_DATA.payments.filter(payment => payment.studentId === studentId);
  },
  
  addProgressEntry: (entry: Omit<ProgressEntry, 'id'>): ProgressEntry => {
    const newEntry = { ...entry, id: `p${MOCK_DATA.progress.length + 1}` };
    MOCK_DATA.progress.push(newEntry);
    return newEntry;
  },
  
  updateStudentPayment: (studentId: string, status: PaymentStatus): boolean => {
    const student = MOCK_DATA.students.find(s => s.id === studentId);
    if (student) {
      student.paymentStatus = status;
      if (status === 'paid') {
        student.lastPaymentDate = new Date().toISOString().split('T')[0];
        
        // Update or create payment record
        const payment = MOCK_DATA.payments.find(p => p.studentId === studentId && p.status === 'pending');
        if (payment) {
          payment.status = 'paid';
          payment.date = student.lastPaymentDate;
        } else {
          MOCK_DATA.payments.push({
            id: `pay${MOCK_DATA.payments.length + 1}`,
            studentId,
            amount: 50,
            date: student.lastPaymentDate,
            status: 'paid'
          });
        }
      }
      return true;
    }
    return false;
  },
  
  updateStudentRoutine: (studentId: string, routineId: string): boolean => {
    const student = MOCK_DATA.students.find(s => s.id === studentId);
    if (student && MOCK_DATA.routines.some(r => r.id === routineId)) {
      student.routineId = routineId;
      return true;
    }
    return false;
  }
};
