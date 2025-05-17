import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowService } from '../../services/workflow.service';
import { DepartmentService } from '../../services/department.service';
import { EmployeeService } from '../../services/employee.service';
import { Workflow } from '../../models/workflow.model';
import { Department } from '../../models/department.model';
import { Employee } from '../../models/employee.model';

@Component({
    selector: 'app-workflow-form',
    templateUrl: './workflow-form.component.html',
    styleUrls: ['./workflow-form.component.less']
})
export class WorkflowFormComponent implements OnInit {
    workflowForm: FormGroup;
    departments: Department[] = [];
    employees: Employee[] = [];
    loading = false;
    submitting = false;
    error = '';
    isEditMode = false;

    constructor(
        private fb: FormBuilder,
        private workflowService: WorkflowService,
        private departmentService: DepartmentService,
        private employeeService: EmployeeService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.workflowForm = this.fb.group({
            name: ['', [Validators.required]],
            description: ['', [Validators.required]],
            type: ['', [Validators.required]],
            employeeId: [null, [Validators.required]],
            isActive: [true],
            steps: this.fb.array([])
        });
    }

    ngOnInit(): void {
        this.loadDepartments();
        this.loadEmployees();
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.isEditMode = true;
            this.loadWorkflow(id);
        }
    }

    get steps() {
        return this.workflowForm.get('steps') as FormArray;
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

    loadWorkflow(id: number): void {
        this.loading = true;
        this.workflowService.getById(id).subscribe({
            next: (workflow) => {
                this.workflowForm.patchValue({
                    name: workflow.name,
                    description: workflow.description,
                    type: workflow.type,
                    employeeId: workflow.employeeId,
                    isActive: workflow.isActive
                });
                workflow.steps.forEach(step => this.addStep(step));
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Error loading workflow';
                this.loading = false;
                console.error('Error loading workflow:', error);
            }
        });
    }

    createStep(step?: any): FormGroup {
        return this.fb.group({
            name: [step?.name || '', [Validators.required]],
            description: [step?.description || '', [Validators.required]],
            order: [step?.order || this.steps.length + 1, [Validators.required]],
            departmentId: [step?.departmentId || '', [Validators.required]],
            isRequired: [step?.isRequired || false],
            estimatedDays: [step?.estimatedDays || 1, [Validators.required, Validators.min(1)]]
        });
    }

    addStep(step?: any): void {
        this.steps.push(this.createStep(step));
    }

    removeStep(index: number): void {
        this.steps.removeAt(index);
        // Update order of remaining steps
        this.steps.controls.forEach((control, idx) => {
            control.patchValue({ order: idx + 1 });
        });
    }

    onSubmit(): void {
        if (this.workflowForm.invalid) {
            return;
        }

        this.submitting = true;
        const workflowData = {
            ...this.workflowForm.value,
            totalSteps: this.steps.length
        };

        if (this.isEditMode) {
            const id = this.route.snapshot.params['id'];
            this.workflowService.update(id, workflowData).subscribe({
                next: () => {
                    this.router.navigate(['/admin/workflows']);
                },
                error: (error) => {
                    this.error = 'Error updating workflow';
                    this.submitting = false;
                    console.error('Error updating workflow:', error);
                }
            });
        } else {
            this.workflowService.create(workflowData).subscribe({
                next: () => {
                    this.router.navigate(['/admin/workflows']);
                },
                error: (error) => {
                    this.error = 'Error creating workflow';
                    this.submitting = false;
                    console.error('Error creating workflow:', error);
                }
            });
        }
    }

    cancel(): void {
        this.router.navigate(['/admin/workflows']);
    }
} 