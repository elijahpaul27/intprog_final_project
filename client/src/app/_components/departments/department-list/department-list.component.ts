import { Component, OnInit } from '@angular/core';
import { Department } from '../../../_models/department.model';
import { DepartmentService } from '../../../_services/department.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-department-list',
    templateUrl: './department-list.component.html',
    styleUrls: ['./department-list.component.less']
})
export class DepartmentListComponent implements OnInit {
    departments: Department[] = [];
    loading = false;
    error = '';

    constructor(
        private departmentService: DepartmentService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadDepartments();
    }

    loadDepartments(): void {
        this.loading = true;
        this.departmentService.getAll().subscribe({
            next: (data) => {
                this.departments = data;
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Error loading departments';
                this.loading = false;
                console.error('Error loading departments:', error);
            }
        });
    }

    editDepartment(id: number): void {
        this.router.navigate(['/departments/edit', id]);
    }

    deleteDepartment(id: number): void {
        if (confirm('Are you sure you want to delete this department?')) {
            this.departmentService.delete(id).subscribe({
                next: () => {
                    this.departments = this.departments.filter(d => d.id !== id);
                },
                error: (error) => {
                    this.error = 'Error deleting department';
                    console.error('Error deleting department:', error);
                }
            });
        }
    }
} 