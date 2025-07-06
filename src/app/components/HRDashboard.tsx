// app/components/HRDashboard.tsx
'use client';

import React, { useState } from 'react';
import EmployeeForm from './EmployeeForm';
import EmployeeList from './EmployeeList';
import EmployeeDetailsModal from './EmployeeDetailsModal'; // NEW: Import the modal component

// Define a type for our Employee object for better type safety
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

const HRDashboard = () => {
  // State to hold all registered employees
  const [employees, setEmployees] = useState<Employee[]>([]);
  // State: to hold the employee object currently being edited, or null if adding new
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  // State: Control visibility of the employee list section
  const [showEmployeeList, setShowEmployeeList] = useState(true);
  // NEW STATE: To hold the employee whose details are being viewed in the modal
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // This function will now handle both adding and updating employees
  const handleFormSubmission = (formData: Omit<Employee, 'age'> & { age: string }) => {
    const employeeDataWithNumberAge: Employee = {
      ...formData,
      age: Number(formData.age),
    };

    if (employeeToEdit) {
      // Logic for UPDATING an existing employee
      setEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp.email === employeeToEdit.email ? employeeDataWithNumberAge : emp
        )
      );
      alert('Employee details updated successfully!');
      setEmployeeToEdit(null); // Exit edit mode after update
    } else {
      // Logic for ADDING a new employee
      if (employees.some(emp => emp.email === employeeDataWithNumberAge.email)) {
        alert('An employee with this email already exists!');
        return;
      }
      setEmployees(prevEmployees => [...prevEmployees, employeeDataWithNumberAge]);
      alert('New employee added to HR system!');
    }
    // After any submission (add or update), ensure the list is visible so they see the result
    setShowEmployeeList(true);
  };

  // Function to remove an employee from the list
  const removeEmployee = (emailToRemove: string) => {
    if (window.confirm(`Are you sure you want to remove the employee with email: ${emailToRemove}?`)) {
      setEmployees(prevEmployees => prevEmployees.filter(employee => employee.email !== emailToRemove));
      alert('Employee removed!');
      // If the removed employee was the one being edited, clear edit mode
      if (employeeToEdit && employeeToEdit.email === emailToRemove) {
        setEmployeeToEdit(null);
      }
      // If the removed employee was the one being viewed, close the modal
      if (selectedEmployee && selectedEmployee.email === emailToRemove) {
        setSelectedEmployee(null);
      }
    }
  };

  // Function called when the "Edit" button is clicked in EmployeeList
  const handleEditClick = (employee: Employee) => {
    setEmployeeToEdit(employee); // Set the employee to be edited
    setShowEmployeeList(false); // When editing, hide the list to focus on the form
    setSelectedEmployee(null); // Close details modal if open
  };

  // Function to cancel the edit mode (e.g., if user decides not to edit)
  const handleCancelEdit = () => {
    setEmployeeToEdit(null); // Clear the employeeToEdit state
  };

  // NEW: Function to handle viewing an employee's full details
  const handleViewDetailsClick = (employee: Employee) => {
    setSelectedEmployee(employee); // Set the employee to be displayed in the modal
    setShowEmployeeList(true); // Ensure list is visible to give context, if it was hidden
    // We could also set showEmployeeList to false if we want the modal to be the only thing visible
    // For now, let's keep the list visible behind it.
  };

  // NEW: Function to close the employee details modal
  const handleCloseDetailsModal = () => {
    setSelectedEmployee(null); // Clear the selected employee to close the modal
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
        Human Resource Management System
      </h1>

      {/* Toggle Buttons for views */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setShowEmployeeList(false)}
          className={`py-2 px-6 rounded-md text-sm font-medium transition-colors
            ${!showEmployeeList ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-700 hover:bg-gray-50 border border-indigo-600'}`}
        >
          Employee Registration Only
        </button>
        <button
          onClick={() => setShowEmployeeList(true)}
          className={`py-2 px-6 rounded-md text-sm font-medium transition-colors
            ${showEmployeeList ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-700 hover:bg-gray-50 border border-indigo-600'}`}
        >
          Full HR Dashboard
        </button>
      </div>

      {/* Employee Registration/Edit Form - Always displayed */}
      <div className="mb-10">
        <EmployeeForm
          onSubmitSuccess={handleFormSubmission}
          employeeToEdit={employeeToEdit}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      {/* Employee List Component - Conditionally rendered */}
      {showEmployeeList && (
        <div>
          <EmployeeList
            employees={employees}
            onRemoveEmployee={removeEmployee}
            onEditEmployee={handleEditClick}
            onViewDetails={handleViewDetailsClick} // NEW: Pass the view details handler to the list
          />
        </div>
      )}

      {/* NEW: Employee Details Modal - Conditionally rendered */}
      {selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          onClose={handleCloseDetailsModal}
        />
      )}
    </div>
  );
};

export default HRDashboard;