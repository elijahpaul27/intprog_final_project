import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WorkflowService } from '../../services/workflow.service';
import { Workflow } from '../../models/workflow.model';

@Component({
    selector: 'app-workflow-list',
    template: `
        <div class="container">
            <div class="header">
                <h2>Workflows Management</h2>
                <button class="btn btn-primary" (click)="addWorkflow()">
                    <i class="fas fa-plus"></i> Add Workflow
                </button>
            </div>

            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Steps</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let workflow of workflows">
                            <td>{{workflow.name}}</td>
                            <td>{{workflow.description}}</td>
                            <td>{{getStepCount(workflow)}} steps</td>
                            <td>
                                <div class="form-check form-switch">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        [checked]="workflow.isActive"
                                        (change)="toggleStatus(workflow)"
                                    >
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-info me-2" (click)="editWorkflow(workflow.id)">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger" (click)="deleteWorkflow(workflow.id)">
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
        .form-check-input {
            cursor: pointer;
        }
    `]
})
export class WorkflowListComponent implements OnInit {
    workflows: Workflow[] = [];
    loading = false;
    error = '';

    constructor(
        private workflowService: WorkflowService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadWorkflows();
    }

    loadWorkflows() {
        this.loading = true;
        this.workflowService.getAll()
            .subscribe({
                next: (workflows) => {
                    this.workflows = workflows;
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading workflows:', error);
                    this.error = error.message || 'Failed to load workflows';
                    this.loading = false;
                }
            });
    }

    addWorkflow() {
        this.router.navigate(['/admin/workflows/add']);
    }

    editWorkflow(id: number) {
        this.router.navigate(['/admin/workflows/edit', id]);
    }

    deleteWorkflow(id: number) {
        if (confirm('Are you sure you want to delete this workflow?')) {
            this.workflowService.delete(id)
                .subscribe({
                    next: () => {
                        this.workflows = this.workflows.filter(x => x.id !== id);
                    },
                    error: (error) => {
                        console.error('Error deleting workflow:', error);
                    }
                });
        }
    }

    toggleStatus(workflow: Workflow) {
        this.workflowService.toggleStatus(workflow.id, !workflow.isActive)
            .subscribe({
                next: (updatedWorkflow) => {
                    const index = this.workflows.findIndex(w => w.id === workflow.id);
                    if (index !== -1) {
                        this.workflows[index] = updatedWorkflow;
                    }
                },
                error: (error) => {
                    console.error('Error toggling workflow status:', error);
                }
            });
    }

    getStepCount(workflow: any): number {
        if (workflow.workflowSteps && Array.isArray(workflow.workflowSteps)) {
            return workflow.workflowSteps.length;
        }
        return workflow.totalSteps || 0;
    }

    getDepartmentName(departmentId: number): string {
        // This would ideally fetch the department name from a service
        // For now, just return a placeholder
        return departmentId ? `Department ${departmentId}` : 'N/A';
    }
}