import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
    selector: 'app-employee-list',
    template: `
        <div class="container">
            <div class="header">
                <h2>Employees Management</h2>
                <button class="btn btn-primary" (click)="addEmployee()">
                    <i class="fas fa-plus"></i> Add Employee
                </button>
            </div>

            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Position</th>
                            <th>Department</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let employee of employees">
                            <td>{{employee.firstName}} {{employee.lastName}}</td>
                            <td>{{employee.email}}</td>
                            <td>{{employee.position}}</td>
                            <td>{{employee.department?.name}}</td>
                            <td>
                                <button class="btn btn-sm btn-info me-2" (click)="editEmployee(employee.id)">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger" (click)="deleteEmployee(employee.id)">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    styles: [`
        .container {
            padding: 20px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        h2 {
            margin: 0;
            color: #333;
        }
        .table {
            margin-top: 20px;
        }
        .btn {
            margin-right: 5px;
        }
    `]
})
export class EmployeeListComponent implements OnInit {
    employees: Employee[] = [];

    constructor(
        private employeeService: EmployeeService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadEmployees();
    }

    loadEmployees() {
        this.employeeService.getAll()
            .subscribe({
                next: (employees) => {
                    this.employees = employees;
                },
                error: (error) => {
                    console.error('Error loading employees:', error);
                }
            });
    }

    addEmployee() {
        this.router.navigate(['/admin/employees/add']);
    }

    editEmployee(id: number) {
        this.router.navigate(['/admin/employees/edit', id]);
    }

    deleteEmployee(id: number) {
        if (confirm('Are you sure you want to delete this employee?')) {
            this.employeeService.delete(id)
                .subscribe({
                    next: () => {
                        this.employees = this.employees.filter(x => x.id !== id);
                    },
                    error: (error) => {
                        console.error('Error deleting employee:', error);
                    }
                });
        }
    }
} 