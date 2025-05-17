import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';

@Component({
    selector: 'app-department-form',
    template: `
        <div class="container">
            <h2>{{isAddMode ? 'Add Department' : 'Edit Department'}}</h2>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input
                        type="text"
                        formControlName="name"
                        class="form-control"
                        [ngClass]="{ 'is-invalid': submitted && f.name.errors }"
                    />
                    <div *ngIf="submitted && f.name.errors" class="invalid-feedback">
                        <div *ngIf="f.name.errors.required">Name is required</div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea
                        formControlName="description"
                        class="form-control"
                        rows="3"
                    ></textarea>
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
export class DepartmentFormComponent implements OnInit {
    form: FormGroup;
    id: number;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private departmentService: DepartmentService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['']
        });

        if (!this.isAddMode) {
            this.departmentService.getById(this.id)
                .subscribe({
                    next: (department) => {
                        this.form.patchValue(department);
                    },
                    error: (error) => {
                        console.error('Error loading department:', error);
                    }
                });
        }
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createDepartment();
        } else {
            this.updateDepartment();
        }
    }

    private createDepartment() {
        this.departmentService.create(this.form.value)
            .subscribe({
                next: () => {
                    this.router.navigate(['/admin/departments']);
                },
                error: (error) => {
                    console.error('Error creating department:', error);
                    this.loading = false;
                }
            });
    }

    private updateDepartment() {
        this.departmentService.update(this.id, this.form.value)
            .subscribe({
                next: () => {
                    this.router.navigate(['/admin/departments']);
                },
                error: (error) => {
                    console.error('Error updating department:', error);
                    this.loading = false;
                }
            });
    }

    cancel() {
        this.router.navigate(['/admin/departments']);
    }
} 