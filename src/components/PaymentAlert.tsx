
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Student } from '@/lib/mock-data';

interface PaymentAlertProps {
  student: Student;
}

const PaymentAlert = ({ student }: PaymentAlertProps) => {
  if (student.paymentStatus !== 'pending') {
    return null;
  }
  
  return (
    <Alert variant="destructive" className="mb-6 animate-fade-in">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Pago pendiente</AlertTitle>
      <AlertDescription>
        Tu cuota mensual está pendiente de pago. Por favor, contacta con recepción para regularizar tu situación.
      </AlertDescription>
    </Alert>
  );
};

export default PaymentAlert;
