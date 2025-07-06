// app/components/EmployeeList.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // NEW: Import Table components

// Define the shape of an Employee object
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

// Define the props for EmployeeList
interface EmployeeListProps {
  employees: Employee[];
  onRemoveEmployee: (email: string) => void;
  onEditEmployee: (employee: Employee) => void;
  onViewDetails: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onRemoveEmployee, onEditEmployee, onViewDetails }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Registered Employees</h2>
      {employees.length === 0 ? (
        <p className="text-gray-600 text-center">No employees registered yet. Use the form above to add one!</p>
      ) : (
        <div className="overflow-x-auto">
          <Table> {/* Changed from <table> */}
            <TableHeader> {/* Changed from <thead> */}
              <TableRow> {/* Changed from <tr> */}
                <TableHead className="w-[150px]">Name</TableHead> {/* Changed from <th> */}
                <TableHead>Email</TableHead> {/* Changed from <th> */}
                <TableHead>Department</TableHead> {/* Changed from <th> */}
                <TableHead>Position</TableHead> {/* Changed from <th> */}
                <TableHead>Hire Date</TableHead> {/* Changed from <th> */}
                <TableHead className="text-right">Actions</TableHead> {/* Changed from <th> */}
              </TableRow>
            </TableHeader>
            <TableBody> {/* Changed from <tbody> */}
              {employees.map((employee) => (
                <TableRow key={employee.email}> {/* Changed from <tr> */}
                  <TableCell className="font-medium"> {/* Changed from <td> */}
                    {employee.firstName} {employee.surname}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell> {/* Changed from <td> */}
                  <TableCell>{employee.department}</TableCell> {/* Changed from <td> */}
                  <TableCell>{employee.position}</TableCell> {/* Changed from <td> */}
                  <TableCell>{employee.hireDate}</TableCell> {/* Changed from <td> */}
                  <TableCell className="text-right"> {/* Changed from <td> */}
                    <Button
                      onClick={() => onViewDetails(employee)}
                      variant="outline"
                      size="sm"
                      className="mr-2"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => onEditEmployee(employee)}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => onRemoveEmployee(employee.email)}
                      variant="destructive"
                      size="sm"
                      className="ml-4"
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
export default EmployeeList;