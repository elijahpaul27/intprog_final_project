import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { WorkflowService } from '../../services/workflow.service';
import { EmployeeService } from '../../services/employee.service';
import { Request, RequestStatus, RequestPriority } from '../../models/request.model';
import { Employee } from '../../models/employee.model';
import { Workflow } from '../../models/workflow.model';

@Component({
    selector: 'app-request-list',
    template: `
        <div class="container">
            <div class="header">
                <h2>Requests Management</h2>
                <button class="btn btn-primary" (click)="addRequest()">
                    <i class="fas fa-plus"></i> New Request
                </button>
            </div>

            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Employee</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Workflow</th>
                            <th>Current Step</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let request of requests">
                            <td>{{request.title || '-'}}</td>
                            <td>{{getEmployeeName(request.employeeId) || '-'}}</td>
                            <td>{{request.type || '-'}}</td>
                            <td>
                                <span class="badge" [ngClass]="getStatusClass(request.status)">
                                    {{request.status || 'Pending'}}
                                </span>
                            </td>
                            <td>
                                <span class="badge" [ngClass]="getPriorityClass(request.priority)">
                                    {{request.priority || 'Medium'}}
                                </span>
                            </td>
                            <td>{{getWorkflowName(request.workflowId) || '-'}}</td>
                            <td>
                                <span>
                                    {{request.currentStep ? 'Step ' + request.currentStep : '-'}}
                                </span>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-info me-2" (click)="editRequest(request.id)">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger" (click)="deleteRequest(request.id)">
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
        .badge {
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: 500;
        }
        .badge-pending {
            background-color: #ffc107;
            color: #000;
        }
        .badge-in-progress {
            background-color: #17a2b8;
            color: #fff;
        }
        .badge-completed {
            background-color: #28a745;
            color: #fff;
        }
        .badge-rejected {
            background-color: #dc3545;
            color: #fff;
        }
        .badge-low {
            background-color: #6c757d;
            color: #fff;
        }
        .badge-medium {
            background-color: #17a2b8;
            color: #fff;
        }
        .badge-high {
            background-color: #ffc107;
            color: #000;
        }
        .badge-urgent {
            background-color: #dc3545;
            color: #fff;
        }
    `]
})
export class RequestListComponent implements OnInit {
    requests: Request[] = [];
    employees: Employee[] = [];
    workflows: Workflow[] = [];
    loading = false;
    error = '';
    statusFilter = 'ALL';
    RequestStatus = RequestStatus;
    filteredRequests: Request[] = [];

    constructor(
        private requestService: RequestService,
        private workflowService: WorkflowService,
        private employeeService: EmployeeService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;
        this.loadRequests();
        this.loadEmployees();
        this.loadWorkflows();
    }

    loadRequests() {
        this.requestService.getAll()
            .subscribe({
                next: (requests) => {
                    this.requests = requests;
                    this.filteredRequests = requests;
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading requests:', error);
                    this.error = 'Failed to load requests. Please try again.';
                    this.loading = false;
                }
            });
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

    loadWorkflows() {
        this.workflowService.getAll()
            .subscribe({
                next: (workflows) => {
                    this.workflows = workflows;
                },
                error: (error) => {
                    console.error('Error loading workflows:', error);
                }
            });
    }

    getEmployeeName(employeeId: number): string {
        if (!employeeId) return '';
        const employee = this.employees.find(e => e.id === employeeId);
        return employee ? `${employee.firstName} ${employee.lastName}` : '';
    }

    getWorkflowName(workflowId: number): string {
        if (!workflowId) return '';
        const workflow = this.workflows.find(w => w.id === workflowId);
        return workflow ? workflow.name : '';
    }

    filterByStatus(status: string) {
        this.statusFilter = status;
        if (status === 'ALL') {
            this.filteredRequests = this.requests;
        } else {
            this.filteredRequests = this.requests.filter(r => r.status === status);
        }
    }

    addRequest() {
        this.router.navigate(['/admin/requests/add']);
    }

    editRequest(id: number) {
        this.router.navigate(['/admin/requests/edit', id]);
    }

    deleteRequest(id: number) {
        if (confirm('Are you sure you want to delete this request?')) {
            this.requestService.delete(id)
                .subscribe({
                    next: () => {
                        this.requests = this.requests.filter(x => x.id !== id);
                        this.filteredRequests = this.filteredRequests.filter(x => x.id !== id);
                    },
                    error: (error) => {
                        console.error('Error deleting request:', error);
                        this.error = 'Failed to delete request. Please try again.';
                    }
                });
        }
    }    getStatusClass(status: RequestStatus): string {
        if (!status) return 'badge-pending';
        
        try {
            // First, check if it's a valid enum value
            const validStatuses = Object.values(RequestStatus);
            const normalizedStatus = typeof status === 'string' ? 
                status.toLowerCase() : String(status).toLowerCase();
            
            // Check if normalized status is valid
            const isValidStatus = validStatuses.some(s => 
                typeof s === 'string' && s.toLowerCase() === normalizedStatus);
            
            if (isValidStatus) {
                return `badge-${normalizedStatus}`;
            } else {
                // Default to pending if not a valid status
                return 'badge-pending';
            }
        } catch (e) {
            console.error('Error processing status', e);
            return 'badge-pending';
        }
    }getPriorityClass(priority: RequestPriority): string {
        if (!priority) return 'badge-medium';
        
        try {
            // First, check if it's a valid enum value
            const validPriorities = Object.values(RequestPriority);
            const normalizedPriority = typeof priority === 'string' ? 
                priority.toLowerCase() : String(priority).toLowerCase();
            
            // Check if normalized priority is valid
            const isValidPriority = validPriorities.some(p => 
                typeof p === 'string' && p.toLowerCase() === normalizedPriority);
            
            if (isValidPriority) {
                return `badge-${normalizedPriority}`;
            } else {
                // Default to medium if not a valid priority
                return 'badge-medium';
            }
        } catch (e) {
            console.error('Error processing priority', e);
            return 'badge-medium';
        }
    }
}