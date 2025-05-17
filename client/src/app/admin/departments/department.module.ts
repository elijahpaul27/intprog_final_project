import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentFormComponent } from './department-form/department-form.component';

const routes: Routes = [
    { path: '', component: DepartmentListComponent }
];

@NgModule({
    declarations: [
        DepartmentListComponent,
        DepartmentFormComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        DepartmentListComponent,
        DepartmentFormComponent
    ]
})
export class DepartmentModule { } 