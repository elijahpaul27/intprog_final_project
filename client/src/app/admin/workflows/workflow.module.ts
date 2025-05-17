import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';
import { WorkflowFormComponent } from './workflow-form/workflow-form.component';

const routes: Routes = [
    { path: '', component: WorkflowListComponent },
    { path: 'add', component: WorkflowFormComponent },
    { path: 'edit/:id', component: WorkflowFormComponent }
];

@NgModule({
    declarations: [
        WorkflowListComponent,
        WorkflowFormComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ]
})
export class WorkflowModule { } 