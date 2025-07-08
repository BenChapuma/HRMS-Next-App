// app/register-employee/page.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  addEmployeeToLocalStorage,
  getEmployeesFromLocalStorage,
  getEmployeeByIdFromLocalStorage,
  updateEmployeeInLocalStorage,
  Employee
} from "@/lib/employees";
import { useRouter, useSearchParams } from "next/navigation";


// --- MOCK DATABASE FOR UNIQUENESS VALIDATION ---
// This function needs to be outside the component or memoized if inside,
// but for the purpose of the Zod refine, we need access to `form.getValues().id`.
// We will move the direct call to `isEmailUnique` into a `superRefine` within the component,
// so this version of `isEmailUnique` won't directly be used by Zod itself in the schema definition,
// but rather by the `superRefine` which wraps it.
const checkEmailUnique = (email: string, currentEmployeeId?: string) => {
  const existingEmployees = getEmployeesFromLocalStorage();
  const employeesToCheck = currentEmployeeId
    ? existingEmployees.filter(emp => emp.id !== currentEmployeeId)
    : existingEmployees;

  return !employeesToCheck.some(emp => emp.email.toLowerCase() === email.toLowerCase());
};
// --- END MOCK DATABASE ---


// Define your partial schemas for each step
const personalInfoSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  surname: z.string().min(2, {
    message: "Surname must be at least 2 characters.",
  }),
  dateOfBirth: z.string().min(1, {
    message: "Date of birth is required.",
  }),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Please select a gender.",
  }),
});

const jobDetailsSchema = z.object({
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  department: z.string().min(2, {
    message: "Department must be at least 2 characters.",
  }),
  salary: z.preprocess(
    (val) => Number(val),
    z.number().positive({ message: "Salary must be a positive number." })
  ),
  startDate: z.string().min(1, {
    message: "Start date is required.",
  }),
});

const contactInfoSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  emergencyContactName: z.string().min(2, {
    message: "Emergency contact name is required.",
  }),
  emergencyContactPhone: z.string().min(10, {
    message: "Emergency contact phone number must be at least 10 digits.",
  }),
});


export default function RegisterEmployeePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('id');

  // Define the full schema outside of useForm to ensure it's a stable object for Zod's resolver
  // and then use superRefine to add context-dependent validation like email uniqueness.
  const formSchema = z.object({})
    .merge(personalInfoSchema)
    .merge(jobDetailsSchema)
    .merge(contactInfoSchema) // Merge the base contact info schema
    .extend({
      id: z.string().optional(), // Add optional ID for edit mode
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(
      // Refine the schema to include the email uniqueness check dynamically
      formSchema.superRefine((data, ctx) => {
        if (!checkEmailUnique(data.email, data.id)) { // Use checkEmailUnique with `data.id`
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This email is already registered.",
            path: ['email'],
          });
        }
      })
    ),
    defaultValues: {
      firstName: "",
      surname: "",
      dateOfBirth: "",
      gender: undefined,
      position: "",
      department: "",
      salary: 0,
      startDate: "",
      email: "",
      phoneNumber: "",
      address: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      id: undefined,
    },
  });

  type FormData = z.infer<typeof formSchema>; // Infer type from the defined formSchema


  useEffect(() => {
    if (employeeId) {
      const employeeToEdit = getEmployeeByIdFromLocalStorage(employeeId);
      if (employeeToEdit) {
        form.reset({ ...employeeToEdit, salary: Number(employeeToEdit.salary) });
      } else {
        alert("Employee not found! Redirecting to registration.");
        router.push('/register-employee');
      }
    }
  }, [employeeId, form, router]);


  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 0) {
      isValid = await form.trigger(Object.keys(personalInfoSchema.shape) as (keyof FormData)[], { shouldFocus: true });
    } else if (currentStep === 1) {
      isValid = await form.trigger(Object.keys(jobDetailsSchema.shape) as (keyof FormData)[], { shouldFocus: true });
    }
    // For step 2, we don't need to trigger manually for next, as it's the final submit step
    // The email validation for step 2 will happen on final submit via form.handleSubmit

    if (isValid && currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  function onSubmit(values: FormData) {
    if (employeeId && values.id) {
      updateEmployeeInLocalStorage(values as Employee);
      alert("Employee Updated Successfully!");
    } else {
      addEmployeeToLocalStorage(values);
      alert("Employee Registered Successfully!");
    }
    form.reset();
    setCurrentStep(0);
    router.push('/');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground">
      <div className="z-10 w-full max-w-2xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center mb-8 w-full">
          {employeeId ? "Edit Employee Information" : "Register New Employee"}
        </h1>
      </div>

      <Card className="w-full max-w-2xl p-6 bg-card text-card-foreground shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Step {currentStep + 1} of 3
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {currentStep === 0 && "Personal Information"}
            {currentStep === 1 && "Job Details"}
            {currentStep === 2 && "Contact Information"}
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 0 && (
                <>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surname</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Step 2: Job Details */}
              {currentStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                            <SelectItem value="HR Manager">HR Manager</SelectItem>
                            <SelectItem value="Sales Representative">Sales Representative</SelectItem>
                            <SelectItem value="Marketing Specialist">Marketing Specialist</SelectItem>
                            <SelectItem value="Accountant">Accountant</SelectItem>
                            <SelectItem value="Intern">Intern</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 50000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., +1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 123 Main St, Anytown" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyContactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., +1987654321" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 0 && (
                  <Button type="button" onClick={handlePrevious} variant="outline">
                    Previous
                  </Button>
                )}
                {currentStep < 2 && (
                  <Button type="button" onClick={handleNext} className="ml-auto">
                    Next
                  </Button>
                )}
                {currentStep === 2 && (
                  <Button type="submit" className="ml-auto">
                    {employeeId ? "Update Employee" : "Submit Registration"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Link href="/" passHref>
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </main>
  );
}