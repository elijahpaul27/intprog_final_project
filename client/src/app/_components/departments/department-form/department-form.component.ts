import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from '../../../_models/department.model';
import { DepartmentService } from '../../../_services/department.service';

@Component({
    selector: 'app-department-form',
    templateUrl: './department-form.component.html',
    styleUrls: ['./department-form.component.less']
})
export class DepartmentFormComponent implements OnInit {
    departmentForm: FormGroup;
    isEditMode = false;
    loading = false;
    error = '';
    departmentId: number | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private departmentService: DepartmentService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.departmentForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    ngOnInit(): void {
        this.departmentId = this.route.snapshot.params['id'];
        if (this.departmentId) {
            this.isEditMode = true;
            this.loadDepartment();
        }
    }

    loadDepartment(): void {
        if (!this.departmentId) return;

        this.loading = true;
        this.departmentService.getById(this.departmentId).subscribe({
            next: (department) => {
                this.departmentForm.patchValue(department);
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Error loading department';
                this.loading = false;
                console.error('Error loading department:', error);
            }
        });
    }

    onSubmit(): void {
        if (this.departmentForm.invalid) {
            return;
        }

        this.loading = true;
        const department: Department = this.departmentForm.value;

        if (this.isEditMode && this.departmentId) {
            this.departmentService.update(this.departmentId, department).subscribe({
                next: () => {
                    this.router.navigate(['/departments']);
                },
                error: (error) => {
                    this.error = 'Error updating department';
                    this.loading = false;
                    console.error('Error updating department:', error);
                }
            });
        } else {
            this.departmentService.create(department).subscribe({
                next: () => {
                    this.router.navigate(['/departments']);
                },
                error: (error) => {
                    this.error = 'Error creating department';
                    this.loading = false;
                    console.error('Error creating department:', error);
                }
            });
        }
    }

    get f() { return this.departmentForm.controls; }
} 