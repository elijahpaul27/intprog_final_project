import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';

@Component({
    selector: 'app-department-list',
    template: `
        <div class="container">
            <div class="header">
                <h2>Departments Management</h2>
                <button class="btn btn-primary" (click)="addDepartment()">
                    <i class="fas fa-plus"></i> Add Department
                </button>
            </div>

            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let department of departments">
                            <td>{{department.name}}</td>
                            <td>{{department.description}}</td>
                            <td>
                                <button class="btn btn-sm btn-info me-2" (click)="editDepartment(department.id)">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger" (click)="deleteDepartment(department.id)">
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
    `]
})
export class DepartmentListComponent implements OnInit {
    departments: Department[] = [];

    constructor(
        private departmentService: DepartmentService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadDepartments();
    }

    loadDepartments() {
        this.departmentService.getAll()
            .subscribe({
                next: (departments) => {
                    this.departments = departments;
                },
                error: (error) => {
                    console.error('Error loading departments:', error);
                }
            });
    }

    addDepartment() {
        this.router.navigate(['/admin/departments/add']);
    }

    editDepartment(id: number) {
        this.router.navigate(['/admin/departments/edit', id]);
    }

    deleteDepartment(id: number) {
        if (confirm('Are you sure you want to delete this department?')) {
            this.departmentService.delete(id)
                .subscribe({
                    next: () => {
                        this.departments = this.departments.filter(x => x.id !== id);
                    },
                    error: (error) => {
                        console.error('Error deleting department:', error);
                    }
                });
        }
    }
} 