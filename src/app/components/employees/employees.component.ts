import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
    selector: 'app-employees',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    template: `
        <div class="employees-container">
            <h2>Employee Management</h2>

            <!-- Formulario de creación -->
            <div class="form-section">
                <h3>Add New Employee</h3>
                <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()" class="employee-form">
                    <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input type="text" id="firstName" formControlName="firstName" class="form-control">
                        @if (employeeForm.get('firstName')?.errors?.['required'] && employeeForm.get('firstName')?.touched) {
                            <div class="error-message">First name is required</div>
                        }
                    </div>

                    <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input type="text" id="lastName" formControlName="lastName" class="form-control">
                        @if (employeeForm.get('lastName')?.errors?.['required'] && employeeForm.get('lastName')?.touched) {
                            <div class="error-message">Last name is required</div>
                        }
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" formControlName="email" class="form-control">
                        @if (employeeForm.get('email')?.errors?.['required'] && employeeForm.get('email')?.touched) {
                            <div class="error-message">Email is required</div>
                        }
                        @if (employeeForm.get('email')?.errors?.['email'] && employeeForm.get('email')?.touched) {
                            <div class="error-message">Please enter a valid email</div>
                        }
                    </div>

                    <div class="form-group">
                        <label for="position">Position</label>
                        <input type="text" id="position" formControlName="position" class="form-control">
                        @if (employeeForm.get('position')?.errors?.['required'] && employeeForm.get('position')?.touched) {
                            <div class="error-message">Position is required</div>
                        }
                    </div>

                    <div class="form-group">
                        <label for="department">Department</label>
                        <input type="text" id="department" formControlName="department" class="form-control">
                        @if (employeeForm.get('department')?.errors?.['required'] && employeeForm.get('department')?.touched) {
                            <div class="error-message">Department is required</div>
                        }
                    </div>

                    <div class="form-group">
                        <label for="hireDate">Hire Date</label>
                        <input type="date" id="hireDate" formControlName="hireDate" class="form-control">
                        @if (employeeForm.get('hireDate')?.errors?.['required'] && employeeForm.get('hireDate')?.touched) {
                            <div class="error-message">Hire date is required</div>
                        }
                    </div>

                    <div class="form-group">
                        <label for="salary">Salary</label>
                        <input type="number" id="salary" formControlName="salary" class="form-control">
                        @if (employeeForm.get('salary')?.errors?.['required'] && employeeForm.get('salary')?.touched) {
                            <div class="error-message">Salary is required</div>
                        }
                        @if (employeeForm.get('salary')?.errors?.['min'] && employeeForm.get('salary')?.touched) {
                            <div class="error-message">Salary must be greater than 0</div>
                        }
                    </div>

                    <div class="form-group">
                        <label>
                            <input type="checkbox" formControlName="isActive">
                            Active Employee
                        </label>
                    </div>

                    @if (errorMessage) {
                        <div class="error-message">{{ errorMessage }}</div>
                    }

                    <button type="submit" [disabled]="!employeeForm.valid" class="submit-button">
                        Add Employee
                    </button>
                </form>
            </div>

            <!-- Lista de empleados -->
            <div class="list-section">
                <h3>Employee List</h3>
                @if (employees.length === 0) {
                    <p>No employees found.</p>
                } @else {
                    <div class="employee-list">
                        @for (employee of employees; track employee.id) {
                            <div class="employee-card">
                                <h4>{{ employee.firstName }} {{ employee.lastName }}</h4>
                                <p><strong>Position:</strong> {{ employee.position }}</p>
                                <p><strong>Department:</strong> {{ employee.department }}</p>
                                <p><strong>Email:</strong> {{ employee.email }}</p>
                                <p><strong>Hire Date:</strong> {{ employee.hireDate | date }}</p>
                                <p><strong>Status:</strong> {{ employee.isActive ? 'Active' : 'Inactive' }}</p>
                                <div class="employee-actions">
                                    <button (click)="deleteEmployee(employee.id!)" class="delete-button">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    `,
    styles: [`
        .employees-container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
        }

        .form-section, .list-section {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }

        .employee-form {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        label {
            font-weight: 500;
            color: #333;
        }

        .form-control {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }

        .error-message {
            color: #dc3545;
            font-size: 0.875rem;
        }

        .submit-button {
            grid-column: 1 / -1;
            padding: 0.75rem;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .submit-button:hover {
            background-color: #0056b3;
        }

        .submit-button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        .employee-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }

        .employee-card {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 4px;
            border: 1px solid #dee2e6;
        }

        .employee-card h4 {
            margin: 0 0 1rem 0;
            color: #333;
        }

        .employee-card p {
            margin: 0.5rem 0;
            color: #666;
        }

        .employee-actions {
            margin-top: 1rem;
            display: flex;
            gap: 0.5rem;
        }

        .delete-button {
            padding: 0.5rem 1rem;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .delete-button:hover {
            background-color: #c82333;
        }
    `]
})
export class EmployeesComponent implements OnInit {
    employeeForm: FormGroup;
    employees: Employee[] = [];
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private employeeService: EmployeeService
    ) {
        // Obtener la fecha actual en formato YYYY-MM-DD para el input type="date"
        const today = new Date().toISOString().split('T')[0];

        this.employeeForm = this.fb.group({
            firstName: ['John', [Validators.required]],
            lastName: ['Doe', [Validators.required]],
            email: ['john.doe@company.com', [Validators.required, Validators.email]],
            position: ['Software Developer', [Validators.required]],
            department: ['IT', [Validators.required]],
            hireDate: [today, [Validators.required]],
            salary: [50000, [Validators.required, Validators.min(0)]],
            isActive: [true]
        });
    }

    ngOnInit() {
        this.loadEmployees();
    }

    loadEmployees() {
        this.employeeService.getEmployees().subscribe({
            next: (employees) => {
                this.employees = employees;
            },
            error: (error) => {
                console.error('Error loading employees:', error);
                this.errorMessage = 'Error loading employees. Please try again.';
            }
        });
    }

    async onSubmit() {
        if (this.employeeForm.valid) {
            try {
                const formValue = this.employeeForm.value;
                const employeeData = {
                    ...formValue,
                    hireDate: new Date(formValue.hireDate)
                };

                await this.employeeService.createEmployee(employeeData);
                this.employeeForm.reset({ isActive: true });
                this.loadEmployees();
                this.errorMessage = '';
            } catch (error: any) {
                console.error('Error creating employee:', error);
                this.errorMessage = error.message || 'Error creating employee. Please try again.';
            }
        }
    }

    async deleteEmployee(id: string) {
        if (confirm('Are you sure you want to delete this employee?')) {
            try {
                await this.employeeService.deleteEmployee(id);
                this.loadEmployees();
            } catch (error: any) {
                console.error('Error deleting employee:', error);
                this.errorMessage = error.message || 'Error deleting employee. Please try again.';
            }
        }
    }
} 