import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Account } from '../admin/models/account.model';
import { AccountService } from '../admin/services/account.service';
import { DepartmentService } from '../admin/services/department.service';
import { EmployeeService } from '../admin/services/employee.service';
import { WorkflowService } from '../admin/services/workflow.service';
import { RequestService } from '../admin/services/request.service';
import { Department } from '../admin/models/department.model';
import { Employee } from '../admin/models/employee.model';
import { Workflow } from '../admin/models/workflow.model';
import { Request, RequestStatus } from '../admin/models/request.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
    account: Account;
    departments: Department[] = [];
    employees: Employee[] = [];
    workflows: Workflow[] = [];
    requests: Request[] = [];
    recentRequests: Request[] = [];
    pendingRequests: Request[] = [];
    isSidebarCollapsed = false;
    isSidebarVisible = false;

    constructor(
        private accountService: AccountService,
        private departmentService: DepartmentService,
        private employeeService: EmployeeService,
        private workflowService: WorkflowService,
        private requestService: RequestService
    ) {
        this.account = this.accountService.accountValue || {
            id: '0',
            email: '',
            firstName: '',
            lastName: '',
            role: '',
            title: '',
            isVerified: false,
            isBlocked: false,
            created: new Date(),
            updated: new Date()
        };
    }

    ngOnInit() {
        this.loadData();
        this.checkScreenSize();
        window.addEventListener('resize', () => this.checkScreenSize());
    }

    loadData() {
        // Load departments
        this.departmentService.getAll().subscribe(departments => {
            this.departments = departments;
            console.log('Loaded departments:', departments);
        });

        // Load employees
        this.employeeService.getAll().subscribe(employees => {
            this.employees = employees;
            console.log('Loaded employees:', employees);
        });

        // Load workflows
        this.workflowService.getAll().subscribe(workflows => {
            this.workflows = workflows;
            console.log('Loaded workflows:', workflows);
        });

        // Load requests
        this.requestService.getAll().subscribe(requests => {
            this.requests = requests;
            this.pendingRequests = requests.filter(r => r.status === RequestStatus.PENDING);
            this.recentRequests = requests
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5);
            console.log('Loaded requests:', requests);
        });
    }

    refreshData() {
        this.loadData();
    }

    getEmployeeName(employeeId: number): string {
        const employee = this.employees.find(e => e.id === employeeId);
        return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
    }

    getDepartmentName(departmentId: number): string {
        const department = this.departments.find(d => d.id === departmentId);
        return department ? department.name : 'Unknown Department';
    }

    getEmployeeCount(departmentId: number): number {
        return this.employees.filter(e => e.departmentId === departmentId).length;
    }

    getDepartmentEmployeePercentage(departmentId: number): number {
        const departmentEmployeeCount = this.getEmployeeCount(departmentId);
        const totalEmployees = this.employees.length;
        return totalEmployees > 0 ? (departmentEmployeeCount / totalEmployees) * 100 : 0;
    }

    getStatusClass(status: string): string {
        switch (status) {
            case RequestStatus.PENDING:
                return 'text-warning';
            case RequestStatus.APPROVED:
                return 'text-success';
            case RequestStatus.REJECTED:
                return 'text-danger';
            case RequestStatus.CANCELLED:
                return 'text-secondary';
            default:
                return 'text-primary';
        }
    }

    private checkScreenSize() {
        if (window.innerWidth <= 767.98) {
            this.isSidebarCollapsed = true;
            this.isSidebarVisible = false;
        } else {
            this.isSidebarCollapsed = false;
            this.isSidebarVisible = true;
        }
    }

    toggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
        if (window.innerWidth <= 767.98) {
            this.isSidebarVisible = !this.isSidebarVisible;
        }
    }
}
