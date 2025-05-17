import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WorkflowListComponent } from './workflow-list/workflow-list.component';
import { WorkflowFormComponent } from './workflow-form/workflow-form.component';

@NgModule({
    declarations: [
        WorkflowListComponent,
        WorkflowFormComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule
    ],
    exports: [
        WorkflowListComponent,
        WorkflowFormComponent
    ]
})
export class WorkflowModule { } 