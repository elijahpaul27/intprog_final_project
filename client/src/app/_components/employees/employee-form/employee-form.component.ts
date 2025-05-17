import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../../_models/employee.model';
import { Department } from '../../../_models/department.model';
import { EmployeeService } from '../../../_services/employee.service';
import { DepartmentService } from '../../../_services/department.service';

@Component({
    selector: 'app-employee-form',
    templateUrl: './employee-form.component.html',
    styleUrls: ['./employee-form.component.less']
})
export class EmployeeFormComponent implements OnInit {
    employeeForm: FormGroup;
    departments: Department[] = [];
    isEditMode = false;
    loading = false;
    error = '';
    employeeId: number | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private employeeService: EmployeeService,
        private departmentService: DepartmentService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.employeeForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            departmentId: ['', Validators.required],
            position: ['', [Validators.required, Validators.minLength(3)]],
            hireDate: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadDepartments();
        this.employeeId = this.route.snapshot.params['id'];
        if (this.employeeId) {
            this.isEditMode = true;
            this.loadEmployee();
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

    loadEmployee(): void {
        if (!this.employeeId) return;

        this.loading = true;
        this.employeeService.getById(this.employeeId).subscribe({
            next: (employee) => {
                this.employeeForm.patchValue({
                    ...employee,
                    hireDate: new Date(employee.hireDate).toISOString().split('T')[0]
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

        this.loading = true;
        const employee: Employee = {
            ...this.employeeForm.value,
            hireDate: new Date(this.employeeForm.value.hireDate)
        };

        if (this.isEditMode && this.employeeId) {
            this.employeeService.update(this.employeeId, employee).subscribe({
                next: () => {
                    this.router.navigate(['/employees']);
                },
                error: (error) => {
                    this.error = 'Error updating employee';
                    this.loading = false;
                    console.error('Error updating employee:', error);
                }
            });
        } else {
            this.employeeService.create(employee).subscribe({
                next: () => {
                    this.router.navigate(['/employees']);
                },
                error: (error) => {
                    this.error = 'Error creating employee';
                    this.loading = false;
                    console.error('Error creating employee:', error);
                }
            });
        }
    }

    get f() { return this.employeeForm.controls; }
} 