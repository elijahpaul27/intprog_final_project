import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { Request, RequestStatus, RequestPriority } from '../../models/request.model';

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
                            <th>Requester</th>
                            <th>Workflow</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Current Step</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let request of requests">
                            <td>{{request.title}}</td>
                            <td>{{request.requester?.firstName}} {{request.requester?.lastName}}</td>
                            <td>{{request.workflow?.name}}</td>
                            <td>
                                <span class="badge" [ngClass]="getStatusClass(request.status)">
                                    {{request.status}}
                                </span>
                            </td>
                            <td>
                                <span class="badge" [ngClass]="getPriorityClass(request.priority)">
                                    {{request.priority}}
                                </span>
                            </td>
                            <td>
                                <span *ngIf="request.currentStep">
                                    Step {{request.currentStep}} - {{request.currentDepartment?.name}}
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

    constructor(
        private requestService: RequestService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadRequests();
    }

    loadRequests() {
        this.requestService.getAll()
            .subscribe({
                next: (requests) => {
                    this.requests = requests;
                },
                error: (error) => {
                    console.error('Error loading requests:', error);
                }
            });
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
                    },
                    error: (error) => {
                        console.error('Error deleting request:', error);
                    }
                });
        }
    }

    getStatusClass(status: RequestStatus): string {
        return `badge-${status.toLowerCase()}`;
    }

    getPriorityClass(priority: RequestPriority): string {
        return `badge-${priority.toLowerCase()}`;
    }
} 