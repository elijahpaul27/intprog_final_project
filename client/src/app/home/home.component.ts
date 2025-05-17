import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../admin/services/employee.service';
import { RequestService } from '../admin/services/request.service';
import { DepartmentService } from '../admin/services/department.service';
import { Employee } from '../admin/models/employee.model';
import { Request, RequestStatus } from '../admin/models/request.model';
import { Department } from '../admin/models/department.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
    employees: Employee[] = [];
    requests: Request[] = [];
    pendingRequests: Request[] = [];
    departments: Department[] = [];
    loading = false;
    error = '';
    isSidebarCollapsed = false;

    constructor(
        private employeeService: EmployeeService,
        private requestService: RequestService,
        private departmentService: DepartmentService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadEmployees();
        this.loadRequests();
        this.loadDepartments();
    }

    refreshData(): void {
        this.loadEmployees();
        this.loadRequests();
        this.loadDepartments();
    }

    loadEmployees(): void {
        this.loading = true;
        this.employeeService.getAll().subscribe({
            next: (employees) => {
                this.employees = employees;
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Error loading employees';
                this.loading = false;
                console.error('Error loading employees:', error);
            }
        });
    }

    loadRequests(): void {
        this.loading = true;
        this.requestService.getAll().subscribe({
            next: (requests) => {
                this.requests = requests;
                this.pendingRequests = requests.filter(r => r.status === RequestStatus.Pending);
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Error loading requests';
                this.loading = false;
                console.error('Error loading requests:', error);
            }
        });
    }

    loadDepartments(): void {
        this.loading = true;
        this.departmentService.getAll().subscribe({
            next: (departments) => {
                this.departments = departments;
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Error loading departments';
                this.loading = false;
                console.error('Error loading departments:', error);
            }
        });
    }

    getStatusClass(status: RequestStatus): string {
        switch (status) {
            case RequestStatus.Pending:
                return 'bg-warning';
            case RequestStatus.InProgress:
                return 'bg-info';
            case RequestStatus.Completed:
                return 'bg-success';
            case RequestStatus.Rejected:
                return 'bg-danger';
            default:
                return 'bg-light';
        }
    }

    getStatusText(status: RequestStatus): string {
        switch (status) {
            case RequestStatus.Pending:
                return 'Pending';
            case RequestStatus.InProgress:
                return 'In Progress';
            case RequestStatus.Completed:
                return 'Completed';
            case RequestStatus.Rejected:
                return 'Rejected';
            default:
                return 'Unknown';
        }
    }

    getEmployeeCount(departmentId: number): number {
        return this.employees.filter(emp => emp.departmentId === departmentId).length;
    }

    getDepartmentEmployeePercentage(departmentId: number): number {
        if (this.employees.length === 0) return 0;
        const count = this.getEmployeeCount(departmentId);
        return Math.round((count / this.employees.length) * 100);
    }

    viewRequest(id: number): void {
        this.router.navigate(['/requests/view', id]);
    }
}
