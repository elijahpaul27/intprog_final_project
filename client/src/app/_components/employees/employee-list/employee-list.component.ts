import { Component, OnInit } from '@angular/core';
import { Employee } from '../../../_models/employee.model';
import { EmployeeService } from '../../../_services/employee.service';
import { DepartmentService } from '../../../_services/department.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-employee-list',
    templateUrl: './employee-list.component.html',
    styleUrls: ['./employee-list.component.less']
})
export class EmployeeListComponent implements OnInit {
    employees: Employee[] = [];
    departments: Map<number, string> = new Map();
    loading = false;
    error = '';

    constructor(
        private employeeService: EmployeeService,
        private departmentService: DepartmentService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadEmployees();
        this.loadDepartments();
    }

    loadEmployees(): void {
        this.loading = true;
        this.employeeService.getAll().subscribe({
            next: (data) => {
                this.employees = data;
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Error loading employees';
                this.loading = false;
                console.error('Error loading employees:', error);
            }
        });
    }

    loadDepartments(): void {
        this.departmentService.getAll().subscribe({
            next: (departments) => {
                departments.forEach(dept => {
                    this.departments.set(dept.id, dept.name);
                });
            },
            error: (error) => {
                console.error('Error loading departments:', error);
            }
        });
    }

    getDepartmentName(departmentId: number): string {
        return this.departments.get(departmentId) || 'Unknown Department';
    }

    editEmployee(id: number): void {
        this.router.navigate(['/employees/edit', id]);
    }

    deleteEmployee(id: number): void {
        if (confirm('Are you sure you want to delete this employee?')) {
            this.employeeService.delete(id).subscribe({
                next: () => {
                    this.employees = this.employees.filter(e => e.id !== id);
                },
                error: (error) => {
                    this.error = 'Error deleting employee';
                    console.error('Error deleting employee:', error);
                }
            });
        }
    }
} 