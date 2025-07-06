// app/components/EmployeeDetailsModal.tsx
'use client'; // This component uses client-side interactivity

import React from 'react';
// No need to import Button here if we're only using the Dialog components
// If you use Button elsewhere in the modal (e.g., in a footer), keep the import.
// For now, removing it if the only use was the conflicting close button.
// import { Button } from '@/components/ui/button'; // <--- Can be removed if not used elsewhere in this file
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  // DialogClose, // Not explicitly needed here, as DialogContent manages it
} from '@/components/ui/dialog';

interface Employee {
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  age: number;
  homeAddress: string;
  maritalStatus: string;
}

interface EmployeeDetailsModalProps {
  employee: Employee; // The employee object to display
  onClose: () => void; // Function to call when the modal should close
}

const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({ employee, onClose }) => {
  if (!employee) {
    return null; // Don't render if no employee is provided
  }

  return (
    // Use the shadcn Dialog component.
    // `open` prop controls visibility, `onOpenChange` handles closing.
    <Dialog open={!!employee} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]"> {/* DialogContent now handles modal styling */}
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogDescription>
            Full information for {employee.firstName} {employee.surname}.
          </DialogDescription>
        </DialogHeader>

        {/* REMOVED: Your custom close Button has been removed.
            shadcn's DialogContent automatically includes an 'x' close button.
            If you needed a custom button, you would typically wrap it with <DialogClose>.
            But for the standard 'x', it's already provided by DialogContent.
        */}

        <div className="grid gap-4 py-4"> {/* Grid for details within the dialog */}
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="col-span-1 text-sm font-semibold text-gray-700">Full Name:</p>
            <p className="col-span-3 text-sm text-gray-900">{employee.firstName} {employee.surname}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="col-span-1 text-sm font-semibold text-gray-700">Email:</p>
            <p className="col-span-3 text-sm text-gray-900">{employee.email}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="col-span-1 text-sm font-semibold text-gray-700">Phone:</p>
            <p className="col-span-3 text-sm text-gray-900">{employee.phone}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="col-span-1 text-sm font-semibold text-gray-700">Age:</p>
            <p className="col-span-3 text-sm text-gray-900">{employee.age}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="col-span-1 text-sm font-semibold text-gray-700">Position:</p>
            <p className="col-span-3 text-sm text-gray-900">{employee.position}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="col-span-1 text-sm font-semibold text-gray-700">Department:</p>
            <p className="col-span-3 text-sm text-gray-900">{employee.department}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="col-span-1 text-sm font-semibold text-gray-700">Hire Date:</p>
            <p className="col-span-3 text-sm text-gray-900">{employee.hireDate}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="col-span-1 text-sm font-semibold text-gray-700">Address:</p>
            <p className="col-span-3 text-sm text-gray-900">{employee.homeAddress}</p>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="col-span-1 text-sm font-semibold text-gray-700">Marital Status:</p>
            <p className="col-span-3 text-sm text-gray-900">{employee.maritalStatus}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetailsModal;