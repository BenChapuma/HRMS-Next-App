// app/components/EmployeeForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // NEW: Import Input component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // NEW: Import Select components

// Define the props interface for EmployeeForm
interface EmployeeFormProps {
  onSubmitSuccess: (employeeData: {
    firstName: string;
    surname: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    hireDate: string;
    age: string;
    homeAddress: string;
    maritalStatus: string;
  }) => void;
  employeeToEdit: {
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
  } | null;
  onCancelEdit: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ onSubmitSuccess, employeeToEdit, onCancelEdit }) => {
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [age, setAge] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    if (employeeToEdit) {
      setFirstName(employeeToEdit.firstName);
      setSurname(employeeToEdit.surname);
      setEmail(employeeToEdit.email);
      setPhone(employeeToEdit.phone);
      setPosition(employeeToEdit.position);
      setDepartment(employeeToEdit.department);
      setHireDate(employeeToEdit.hireDate);
      setAge(employeeToEdit.age.toString());
      setHomeAddress(employeeToEdit.homeAddress);
      setMaritalStatus(employeeToEdit.maritalStatus);
      setCurrentStep(1);
    } else {
      setFirstName('');
      setSurname('');
      setEmail('');
      setPhone('');
      setPosition('');
      setDepartment('');
      setHireDate('');
      setAge('');
      setHomeAddress('');
      setMaritalStatus('');
      setCurrentStep(1);
    }
  }, [employeeToEdit]);

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (employeeToEdit) {
        return firstName && surname && phone && age;
      }
      return firstName && surname && email && phone && age;
    } else if (currentStep === 2) {
      return position && department && hireDate;
    } else if (currentStep === 3) {
      return homeAddress && maritalStatus;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      alert('Please fill in all required fields for the current step to proceed.');
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) {
        alert('Please fill in all required fields.');
        return;
    }

    const employeeData = {
      firstName,
      surname,
      email: employeeToEdit ? employeeToEdit.email : email,
      phone,
      age,
      position,
      department,
      hireDate,
      homeAddress,
      maritalStatus,
    };

    onSubmitSuccess(employeeData);
    setFirstName('');
    setSurname('');
    setEmail('');
    setPhone('');
    setPosition('');
    setDepartment('');
    setHireDate('');
    setAge('');
    setHomeAddress('');
    setMaritalStatus('');
    setCurrentStep(1);
  };

  return (
    <form onSubmit={handleFormSubmit} className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {employeeToEdit ? 'Edit Employee Details' : 'Employee Registration'}
      </h2>

      {/* Stepper Progress Indicator */}
      <div className="flex justify-between mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="text-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                ${currentStep === step ? 'bg-indigo-600' : 'bg-gray-300'}
                ${currentStep > step ? 'bg-green-500' : ''}`}
            >
              {step}
            </div>
            <p className="text-sm mt-1">
              {step === 1 && "Personal"}
              {step === 2 && "Employment"}
              {step === 3 && "Contact"}
            </p>
          </div>
        ))}
      </div>


      {/* Step 1: Personal Details */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">1. Personal Details</h3>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <Input // Changed to Input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Surname</label>
            <Input // Changed to Input
              type="text"
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <Input // Changed to Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!!employeeToEdit}
              title={employeeToEdit ? "Email cannot be changed when editing an employee" : ""}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <Input // Changed to Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
            <Input // Changed to Input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="18"
              max="100"
              required
            />
          </div>
        </div>
      )}

      {/* Step 2: Employment Details */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">2. Employment Details</h3>
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
            <Input // Changed to Input
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
            <Select // Changed to Select
              onValueChange={setDepartment} // Use onValueChange for shadcn Select
              value={department}
              required
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HR">Human Resources</SelectItem>
                <SelectItem value="IT">Information Technology</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700">Hire Date</label>
            <Input // Changed to Input
              type="date"
              id="hireDate"
              value={hireDate}
              onChange={(e) => setHireDate(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      {/* Step 3: Contact & Marital Status */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">3. Contact & Marital Status</h3>
          <div>
            <label htmlFor="homeAddress" className="block text-sm font-medium text-gray-700">Home Address</label>
            {/* Note: shadcn doesn't have a direct "Textarea" component out of the box,
                     but Input can be styled, or you can add a separate Textarea component later.
                     For now, we'll keep the standard textarea or use Input. */}
            <textarea // Keeping as textarea for now for simplicity, can be styled or replaced later
              id="homeAddress"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={homeAddress}
              onChange={(e) => setHomeAddress(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">Marital Status</label>
            <Select // Changed to Select
              onValueChange={setMaritalStatus}
              value={maritalStatus}
              required
            >
              <SelectTrigger id="maritalStatus">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        {currentStep > 1 && (
          <Button
            type="button"
            onClick={handlePrevious}
            variant="outline"
          >
            Previous
          </Button>
        )}

        {employeeToEdit && (
          <Button
            type="button"
            onClick={onCancelEdit}
            variant="ghost"
            className={`mr-auto ${currentStep === 1 ? '' : 'ml-4'}`}
          >
            Cancel Edit
          </Button>
        )}

        {currentStep < totalSteps && (
          <Button
            type="button"
            onClick={handleNext}
            className={`ml-auto`}
          >
            Next
          </Button>
        )}

        {currentStep === totalSteps && (
          <Button
            type="submit"
            className="ml-auto"
          >
            {employeeToEdit ? 'Update Employee' : 'Register Employee'}
          </Button>
        )}
      </div>
    </form>
  );
};

export default EmployeeForm;