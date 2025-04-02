
export type UserRole = 'student' | 'teacher';

export type PaymentStatus = 'paid' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

export interface Student extends User {
  role: 'student';
  teacherId: string;
  routineId: string;
  paymentStatus: PaymentStatus;
  lastPaymentDate: string | null;
}

export interface Teacher extends User {
  role: 'teacher';
  studentIds: string[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
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
  { id: "ex1", name: "Sentadillas", sets: 3, reps: 12, weight: 30 },
  { id: "ex2", name: "Press de banca", sets: 4, reps: 8, weight: 60 },
  { id: "ex3", name: "Peso muerto", sets: 3, reps: 10, weight: 80 },
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
    exercises: [exercises[1], exercises[3], exercises[4], exercises[5], exercises[9]]
  },
  {
    id: "r2",
    name: "Fuerza Inferior",
    description: "Rutina enfocada en desarrollar la fuerza de la parte inferior del cuerpo",
    exercises: [exercises[0], exercises[2], exercises[6], exercises[7]]
  },
  {
    id: "r3",
    name: "Full Body",
    description: "Rutina completa para trabajar todo el cuerpo",
    exercises: [exercises[0], exercises[1], exercises[8], exercises[4], exercises[9]]
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
    role: "student",
    profileImage: "https://randomuser.me/api/portraits/men/11.jpg",
    teacherId: "t1",
    routineId: "r1",
    paymentStatus: "paid",
    lastPaymentDate: "2023-06-15"
  },
  {
    id: "s2",
    name: "Laura Sánchez",
    email: "laura@ejemplo.com",
    role: "student",
    profileImage: "https://randomuser.me/api/portraits/women/12.jpg",
    teacherId: "t1",
    routineId: "r2",
    paymentStatus: "pending",
    lastPaymentDate: "2023-05-15"
  },
  {
    id: "s3",
    name: "Javier Martínez",
    email: "javier@ejemplo.com",
    role: "student",
    teacherId: "t1",
    routineId: "r3",
    paymentStatus: "paid",
    lastPaymentDate: "2023-06-10"
  },
  {
    id: "s4",
    name: "Elena García",
    email: "elena@ejemplo.com",
    role: "student",
    profileImage: "https://randomuser.me/api/portraits/women/14.jpg",
    teacherId: "t2",
    routineId: "r2",
    paymentStatus: "pending",
    lastPaymentDate: null
  },
  {
    id: "s5",
    name: "Roberto Fernández",
    email: "roberto@ejemplo.com",
    role: "student",
    teacherId: "t2",
    routineId: "r1",
    paymentStatus: "paid",
    lastPaymentDate: "2023-06-20"
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
