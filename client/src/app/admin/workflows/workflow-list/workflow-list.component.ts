import { Component, OnInit } from '@angular/core';
import { Workflow } from '../../../_models/workflow.model';
import { WorkflowService } from '../../../_services/workflow.service';
import { DepartmentService } from '../../../_services/department.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-workflow-list',
    templateUrl: './workflow-list.component.html',
    styleUrls: ['./workflow-list.component.less']
})
export class WorkflowListComponent implements OnInit {
    workflows: Workflow[] = [];
    departments: Map<number, string> = new Map();
    loading = false;
    error = '';

    constructor(
        private workflowService: WorkflowService,
        private departmentService: DepartmentService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadWorkflows();
        this.loadDepartments();
    }

    loadWorkflows(): void {
        this.loading = true;
        this.workflowService.getAll().subscribe({
            next: (data) => {
                this.workflows = data;
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Error loading workflows';
                this.loading = false;
                console.error('Error loading workflows:', error);
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

    getStepCount(workflow: Workflow): number {
        return workflow.steps.length;
    }

    editWorkflow(id: number): void {
        this.router.navigate(['/workflows/edit', id]);
    }

    deleteWorkflow(id: number): void {
        if (confirm('Are you sure you want to delete this workflow?')) {
            this.workflowService.delete(id).subscribe({
                next: () => {
                    this.workflows = this.workflows.filter(w => w.id !== id);
                },
                error: (error) => {
                    this.error = 'Error deleting workflow';
                    console.error('Error deleting workflow:', error);
                }
            });
        }
    }
} 