import { Component, OnInit } from '@angular/core';
import { Request, RequestStatus } from '../../../_models/request.model';
import { RequestService } from '../../../_services/request.service';
import { EmployeeService } from '../../../_services/employee.service';
import { WorkflowService } from '../../../_services/workflow.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-request-list',
    templateUrl: './request-list.component.html',
    styleUrls: ['./request-list.component.less']
})
export class RequestListComponent implements OnInit {
    requests: Request[] = [];
    employees: Map<number, string> = new Map();
    workflows: Map<number, string> = new Map();
    loading = false;
    error = '';
    statusFilter: RequestStatus | 'ALL' = 'ALL';
    RequestStatus = RequestStatus; // Make enum available in template

    constructor(
        private requestService: RequestService,
        private employeeService: EmployeeService,
        private workflowService: WorkflowService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadRequests();
        this.loadEmployees();
        this.loadWorkflows();
    }

    loadRequests(): void {
        this.loading = true;
        this.requestService.getAll().subscribe({
            next: (data) => {
                this.requests = data;
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Error loading requests';
                this.loading = false;
                console.error('Error loading requests:', error);
            }
        });
    }

    loadEmployees(): void {
        this.employeeService.getAll().subscribe({
            next: (employees) => {
                employees.forEach(emp => {
                    this.employees.set(emp.id, `${emp.firstName} ${emp.lastName}`);
                });
            },
            error: (error) => {
                console.error('Error loading employees:', error);
            }
        });
    }

    loadWorkflows(): void {
        this.workflowService.getAll().subscribe({
            next: (workflows) => {
                workflows.forEach(wf => {
                    this.workflows.set(wf.id, wf.name);
                });
            },
            error: (error) => {
                console.error('Error loading workflows:', error);
            }
        });
    }

    getEmployeeName(employeeId: number): string {
        return this.employees.get(employeeId) || 'Unknown Employee';
    }

    getWorkflowName(workflowId: number): string {
        return this.workflows.get(workflowId) || 'Unknown Workflow';
    }

    getStatusClass(status: RequestStatus): string {
        switch (status) {
            case RequestStatus.PENDING:
                return 'bg-warning';
            case RequestStatus.APPROVED:
                return 'bg-success';
            case RequestStatus.REJECTED:
                return 'bg-danger';
            case RequestStatus.CANCELLED:
                return 'bg-secondary';
            default:
                return 'bg-light';
        }
    }

    filterByStatus(status: RequestStatus | 'ALL'): void {
        this.statusFilter = status;
    }

    get filteredRequests(): Request[] {
        if (this.statusFilter === 'ALL') {
            return this.requests;
        }
        return this.requests.filter(r => r.status === this.statusFilter);
    }

    viewRequest(id: number): void {
        this.router.navigate(['/requests/view', id]);
    }

    approveRequest(id: number): void {
        if (confirm('Are you sure you want to approve this request?')) {
            this.requestService.approve(id).subscribe({
                next: () => {
                    const request = this.requests.find(r => r.id === id);
                    if (request) {
                        request.status = RequestStatus.APPROVED;
                    }
                },
                error: (error) => {
                    this.error = 'Error approving request';
                    console.error('Error approving request:', error);
                }
            });
        }
    }

    rejectRequest(id: number): void {
        if (confirm('Are you sure you want to reject this request?')) {
            this.requestService.reject(id).subscribe({
                next: () => {
                    const request = this.requests.find(r => r.id === id);
                    if (request) {
                        request.status = RequestStatus.REJECTED;
                    }
                },
                error: (error) => {
                    this.error = 'Error rejecting request';
                    console.error('Error rejecting request:', error);
                }
            });
        }
    }
} 