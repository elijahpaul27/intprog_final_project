import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestFormComponent } from './request-form/request-form.component';

const routes: Routes = [
    { path: '', component: RequestListComponent },
    { path: 'add', component: RequestFormComponent },
    { path: 'edit/:id', component: RequestFormComponent }
];

@NgModule({
    declarations: [
        RequestListComponent,
        RequestFormComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ]
})
export class RequestModule { } 