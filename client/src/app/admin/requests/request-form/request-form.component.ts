import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { WorkflowService } from '../../services/workflow.service';
import { Request, RequestStatus, RequestPriority } from '../../models/request.model';
import { Workflow } from '../../models/workflow.model';

@Component({
    selector: 'app-request-form',
    template: `
        <div class="container">
            <h2>{{isAddMode ? 'New Request' : 'Edit Request'}}</h2>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input
                        type="text"
                        formControlName="title"
                        class="form-control"
                        [ngClass]="{ 'is-invalid': submitted && f.title.errors }"
                    />
                    <div *ngIf="submitted && f.title.errors" class="invalid-feedback">
                        <div *ngIf="f.title.errors.required">Title is required</div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea
                        formControlName="description"
                        class="form-control"
                        rows="3"
                        [ngClass]="{ 'is-invalid': submitted && f.description.errors }"
                    ></textarea>
                    <div *ngIf="submitted && f.description.errors" class="invalid-feedback">
                        <div *ngIf="f.description.errors.required">Description is required</div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="workflowId">Workflow</label>
                            <select
                                formControlName="workflowId"
                                class="form-control"
                                [ngClass]="{ 'is-invalid': submitted && f.workflowId.errors }"
                            >
                                <option value="">Select Workflow</option>
                                <option *ngFor="let workflow of workflows" [value]="workflow.id">
                                    {{workflow.name}}
                                </option>
                            </select>
                            <div *ngIf="submitted && f.workflowId.errors" class="invalid-feedback">
                                <div *ngIf="f.workflowId.errors.required">Workflow is required</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="priority">Priority</label>
                            <select
                                formControlName="priority"
                                class="form-control"
                                [ngClass]="{ 'is-invalid': submitted && f.priority.errors }"
                            >
                                <option value="">Select Priority</option>
                                <option *ngFor="let priority of priorities" [value]="priority">
                                    {{priority}}
                                </option>
                            </select>
                            <div *ngIf="submitted && f.priority.errors" class="invalid-feedback">
                                <div *ngIf="f.priority.errors.required">Priority is required</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group mt-3">
                    <button [disabled]="loading" class="btn btn-primary me-2">
                        <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                        Save
                    </button>
                    <button type="button" class="btn btn-link" (click)="cancel()">Cancel</button>
                </div>
            </form>
        </div>
    `,
    styles: [`
        .container {
            padding: 20px;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        label {
            font-weight: 500;
        }
        .invalid-feedback {
            display: block;
        }
    `]
})
export class RequestFormComponent implements OnInit {
    form: FormGroup;
    id: number;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    workflows: Workflow[] = [];
    priorities = Object.values(RequestPriority);

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private requestService: RequestService,
        private workflowService: WorkflowService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            workflowId: ['', Validators.required],
            priority: ['', Validators.required]
        });

        this.loadWorkflows();

        if (!this.isAddMode) {
            this.requestService.getById(this.id)
                .subscribe({
                    next: (request) => {
                        this.form.patchValue({
                            title: request.title,
                            description: request.description,
                            workflowId: request.workflowId,
                            priority: request.priority
                        });
                    },
                    error: (error) => {
                        console.error('Error loading request:', error);
                    }
                });
        }
    }

    get f() { return this.form.controls; }

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

    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        const request: Request = {
            ...this.form.value,
            status: RequestStatus.Pending,
            requesterId: 1 // TODO: Get from auth service
        };

        this.loading = true;
        if (this.isAddMode) {
            this.createRequest(request);
        } else {
            this.updateRequest(request);
        }
    }

    private createRequest(request: Request) {
        this.requestService.create(request)
            .subscribe({
                next: () => {
                    this.router.navigate(['/admin/requests']);
                },
                error: (error) => {
                    console.error('Error creating request:', error);
                    this.loading = false;
                }
            });
    }

    private updateRequest(request: Request) {
        this.requestService.update(this.id, request)
            .subscribe({
                next: () => {
                    this.router.navigate(['/admin/requests']);
                },
                error: (error) => {
                    console.error('Error updating request:', error);
                    this.loading = false;
                }
            });
    }

    cancel() {
        this.router.navigate(['/admin/requests']);
    }
} 