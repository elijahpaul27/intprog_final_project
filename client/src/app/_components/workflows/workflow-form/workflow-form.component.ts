import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Workflow, WorkflowStep } from '../../../_models/workflow.model';
import { Department } from '../../../_models/department.model';
import { WorkflowService } from '../../../_services/workflow.service';
import { DepartmentService } from '../../../_services/department.service';

@Component({
    selector: 'app-workflow-form',
    templateUrl: './workflow-form.component.html',
    styleUrls: ['./workflow-form.component.less']
})
export class WorkflowFormComponent implements OnInit {
    workflowForm: FormGroup;
    departments: Department[] = [];
    isEditMode = false;
    loading = false;
    error = '';
    workflowId: number | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private workflowService: WorkflowService,
        private departmentService: DepartmentService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.workflowForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required, Validators.minLength(10)]],
            departmentId: ['', Validators.required],
            steps: this.formBuilder.array([])
        });
    }

    ngOnInit(): void {
        this.loadDepartments();
        this.workflowId = this.route.snapshot.params['id'];
        if (this.workflowId) {
            this.isEditMode = true;
            this.loadWorkflow();
        } else {
            this.addStep(); // Add initial step for new workflow
        }
    }

    get steps() {
        return this.workflowForm.get('steps') as FormArray;
    }

    createStepForm(): FormGroup {
        return this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            order: [0],
            approverRole: ['', [Validators.required, Validators.minLength(3)]],
            isActive: [true]
        });
    }

    addStep(): void {
        const stepForm = this.createStepForm();
        stepForm.patchValue({ order: this.steps.length });
        this.steps.push(stepForm);
    }

    removeStep(index: number): void {
        if (this.steps.length > 1) {
            this.steps.removeAt(index);
            // Update order of remaining steps
            this.steps.controls.forEach((control, i) => {
                control.patchValue({ order: i });
            });
        }
    }

    loadDepartments(): void {
        this.departmentService.getAll().subscribe({
            next: (departments) => {
                this.departments = departments;
            },
            error: (error) => {
                this.error = 'Error loading departments';
                console.error('Error loading departments:', error);
            }
        });
    }

    loadWorkflow(): void {
        if (!this.workflowId) return;

        this.loading = true;
        this.workflowService.getById(this.workflowId).subscribe({
            next: (workflow) => {
                // Clear existing steps
                while (this.steps.length) {
                    this.steps.removeAt(0);
                }

                // Add workflow steps
                workflow.steps.forEach(step => {
                    const stepForm = this.createStepForm();
                    stepForm.patchValue(step);
                    this.steps.push(stepForm);
                });

                this.workflowForm.patchValue({
                    name: workflow.name,
                    description: workflow.description,
                    departmentId: workflow.departmentId
                });
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Error loading workflow';
                this.loading = false;
                console.error('Error loading workflow:', error);
            }
        });
    }

    onSubmit(): void {
        if (this.workflowForm.invalid) {
            return;
        }

        this.loading = true;
        const workflow: Workflow = this.workflowForm.value;

        if (this.isEditMode && this.workflowId) {
            this.workflowService.update(this.workflowId, workflow).subscribe({
                next: () => {
                    this.router.navigate(['/workflows']);
                },
                error: (error) => {
                    this.error = 'Error updating workflow';
                    this.loading = false;
                    console.error('Error updating workflow:', error);
                }
            });
        } else {
            this.workflowService.create(workflow).subscribe({
                next: () => {
                    this.router.navigate(['/workflows']);
                },
                error: (error) => {
                    this.error = 'Error creating workflow';
                    this.loading = false;
                    console.error('Error creating workflow:', error);
                }
            });
        }
    }

    get f() { return this.workflowForm.controls; }
} 