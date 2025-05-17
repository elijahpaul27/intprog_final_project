import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { Employee } from '../../models/employee.model';
import { Department } from '../../models/department.model';

@Component({
    selector: 'app-employee-form',
    templateUrl: './employee-form.component.html',
    styleUrls: ['./employee-form.component.less']
})
export class EmployeeFormComponent implements OnInit {
    employeeForm: FormGroup;
    departments: Department[] = [];
    loading = false;
    submitting = false;
    error = '';
    isEditMode = false;
    currentEmployeeId: number | null = null;

    constructor(
        private fb: FormBuilder,
        private employeeService: EmployeeService,
        private departmentService: DepartmentService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.employeeForm = this.fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            position: ['', [Validators.required]],
            departmentId: [null, [Validators.required]],
            salary: [null, [Validators.required, Validators.min(0)]],
            isActive: [true]
        });
    }

    ngOnInit(): void {
        this.loadDepartments();
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.isEditMode = true;
            this.currentEmployeeId = +id;
            this.loadEmployee(id);
        }
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

    loadEmployee(id: number): void {
        this.loading = true;
        this.employeeService.getById(id).subscribe({
            next: (employee) => {
                this.employeeForm.patchValue({
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    email: employee.email,
                    position: employee.position,
                    departmentId: employee.departmentId,
                    salary: employee.salary,
                    isActive: employee.isActive
                });
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Error loading employee';
                this.loading = false;
                console.error('Error loading employee:', error);
            }
        });
    }

    onSubmit(): void {
        if (this.employeeForm.invalid) {
            return;
        }

        this.submitting = true;
        const employeeData = {
            ...this.employeeForm.value
        };

        if (this.isEditMode && this.currentEmployeeId) {
            this.employeeService.update(this.currentEmployeeId, employeeData).subscribe({
                next: () => {
                    this.router.navigate(['/admin/employees']);
                },
                error: (error) => {
                    this.error = 'Error updating employee';
                    this.submitting = false;
                    console.error('Error updating employee:', error);
                }
            });
        } else {
            this.employeeService.create(employeeData).subscribe({
                next: () => {
                    this.router.navigate(['/admin/employees']);
                },
                error: (error) => {
                    this.error = 'Error creating employee';
                    this.submitting = false;
                    console.error('Error creating employee:', error);
                }
            });
        }
    }

    cancel(): void {
        this.router.navigate(['/admin/employees']);
    }
} 