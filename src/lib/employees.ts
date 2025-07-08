// lib/employees.ts

export interface Employee {
  id: string; // We'll generate a simple ID
  firstName: string;
  surname: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  position: string;
  department: string;
  salary: number;
  startDate: string;
  email: string;
  phoneNumber: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

const STORAGE_KEY = "hrms_employees";

/**
 * Retrieves all employees from local storage.
 * @returns An array of Employee objects, or an empty array if none exist.
 */
export const getEmployeesFromLocalStorage = (): Employee[] => {
  if (typeof window === "undefined") {
    return []; // Avoid localStorage errors on server-side rendering
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error retrieving employees from local storage:", error);
    return [];
  }
};

/**
 * Saves an array of employees to local storage.
 * @param employees The array of Employee objects to save.
 */
export const saveEmployeesToLocalStorage = (employees: Employee[]): void => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  } catch (error) {
    console.error("Error saving employees to local storage:", error);
  }
};

/**
 * Adds a new employee to local storage.
 * @param newEmployee The new Employee object to add.
 * @returns The updated array of employees.
 */
export const addEmployeeToLocalStorage = (newEmployee: Omit<Employee, 'id'>): Employee[] => {
  const employees = getEmployeesFromLocalStorage();
  const employeeWithId: Employee = {
    ...newEmployee,
    id: `EMP-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
  };
  const updatedEmployees = [...employees, employeeWithId];
  saveEmployeesToLocalStorage(updatedEmployees);
  return updatedEmployees;
};

/**
 * Updates an existing employee in local storage.
 * @param updatedEmployee The Employee object with updated data.
 * @returns The updated array of employees, or null if employee not found.
 */
export const updateEmployeeInLocalStorage = (updatedEmployee: Employee): Employee[] | null => {
  const employees = getEmployeesFromLocalStorage();
  const index = employees.findIndex(emp => emp.id === updatedEmployee.id);

  if (index !== -1) {
    const newEmployees = [...employees];
    newEmployees[index] = updatedEmployee;
    saveEmployeesToLocalStorage(newEmployees);
    return newEmployees;
  }
  return null; // Employee not found
};

/**
 * Removes an employee from local storage by ID.
 * @param id The ID of the employee to remove.
 * @returns The updated array of employees.
 */
export const removeEmployeeFromLocalStorage = (id: string): Employee[] => {
  const employees = getEmployeesFromLocalStorage();
  const updatedEmployees = employees.filter(emp => emp.id !== id);
  saveEmployeesToLocalStorage(updatedEmployees);
  return updatedEmployees;
};

/**
 * Finds an employee by ID in local storage.
 * @param id The ID of the employee to find.
 * @returns The Employee object if found, otherwise undefined.
 */
export const getEmployeeByIdFromLocalStorage = (id: string): Employee | undefined => {
  const employees = getEmployeesFromLocalStorage();
  return employees.find(emp => emp.id === id);
};