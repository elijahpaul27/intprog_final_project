import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestFormComponent } from './request-form/request-form.component';

@NgModule({
    declarations: [
        RequestListComponent,
        RequestFormComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule
    ],
    exports: [
        RequestListComponent,
        RequestFormComponent
    ]
})
export class RequestModule { } 