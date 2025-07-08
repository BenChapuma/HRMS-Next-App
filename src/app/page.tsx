// app/page.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getEmployeesFromLocalStorage, removeEmployeeFromLocalStorage, Employee } from "@/lib/employees";

export default function HomePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const numberOfEmployees = employees.length;

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const [employeeToDeleteId, setEmployeeToDeleteId] = useState<string | null>(null);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);


  useEffect(() => {
    setEmployees(getEmployeesFromLocalStorage());
  }, []);

  const refreshEmployeeList = () => {
    setEmployees(getEmployeesFromLocalStorage());
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsDialogOpen(true);
  };

  const handleRemoveClick = (employeeId: string) => {
    setEmployeeToDeleteId(employeeId);
    setIsRemoveConfirmOpen(true);
  };

  const confirmRemoveEmployee = () => {
    if (employeeToDeleteId) {
      removeEmployeeFromLocalStorage(employeeToDeleteId);
      refreshEmployeeList();
      setEmployeeToDeleteId(null);
      setIsRemoveConfirmOpen(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-background text-foreground">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mt-8 mb-12">
        Welcome to the HRMS Dashboard
      </h1>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 bg-card text-card-foreground shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{numberOfEmployees}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered in the system
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-card text-card-foreground shadow-lg flex flex-col justify-center items-center p-6">
          <CardTitle className="text-2xl font-semibold mb-4">
            Manage Employees
          </CardTitle>
          <Link href="/register-employee" passHref>
            <Button className="w-full sm:w-auto py-3 px-8 text-lg font-semibold">
              Register New Employee
            </Button>
          </Link>
        </Card>
      </div>

      <Card className="w-full max-w-6xl bg-card text-card-foreground shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Employee List</CardTitle>
          <p className="text-sm text-muted-foreground">
            A quick overview of all registered employees.
          </p>
        </CardHeader>
        <CardContent>
          {employees.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Surname</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    // This is the crucial part: Ensure no whitespace between <TableRow> and <TableCell>
                    // or between <TableCell> and the next <TableCell> on different lines.
                    // The best practice is to put the opening <TableCell> tag on the same line
                    // as the closing </TableRow> or directly follow the previous <TableCell>
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.id}</TableCell><TableCell>{employee.firstName}</TableCell><TableCell>{employee.surname}</TableCell><TableCell>{employee.department}</TableCell><TableCell>{employee.position}</TableCell><TableCell>{employee.email}</TableCell>
                      <TableCell className="text-right flex space-x-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(employee)}
                        >
                          View
                        </Button>
                        <Link href={`/register-employee?id=${employee.id}`} passHref>
                          <Button variant="secondary" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveClick(employee.id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center py-4">No employees registered yet. Register a new employee to see the list!</p>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>
              Full information for {selectedEmployee?.firstName} {selectedEmployee?.surname}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedEmployee && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium col-span-1">ID:</span>
                  <span className="col-span-3">{selectedEmployee.id}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium col-span-1">Full Name:</span>
                  <span className="col-span-3">{selectedEmployee.firstName} {selectedEmployee.surname}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium col-span-1">DoB:</span>
                  <span className="col-span-3">{selectedEmployee.dateOfBirth}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium col-span-1">Gender:</span>
                  <span className="col-span-3">{selectedEmployee.gender}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium col-span-1">Position:</span>
                  <span className="col-span-3">{selectedEmployee.position}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium col-span-1">Department:</span>
                  <span className="col-span-3">{selectedEmployee.department}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium col-span-1">Salary:</span>
                  <span className="col-span-3">${selectedEmployee.salary.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium col-span-1">Start Date:</span>
                  <span className="col-span-3">{selectedEmployee.startDate}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium col-span-1">Email:</span>
                  <span className="col-span-3">{selectedEmployee.email}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium col-span-1">Phone:</span>
                  <span className="col-span-3">{selectedEmployee.phoneNumber}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium col-span-1">Address:</span>
                  <span className="col-span-3">{selectedEmployee.address}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium col-span-1">Emergency Contact:</span>
                  <span className="col-span-3">{selectedEmployee.emergencyContactName} ({selectedEmployee.emergencyContactPhone})</span>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={isRemoveConfirmOpen} onOpenChange={setIsRemoveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the employee
              from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveEmployee}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="w-full max-w-6xl mt-8 p-6 bg-muted rounded-lg text-muted-foreground text-center shadow-inner">
        <h2 className="text-xl font-semibold mb-2">Upcoming Features</h2>
        <p>Payroll management, Leave requests, Performance reviews, etc.</p>
      </div>
    </main>
  );
}