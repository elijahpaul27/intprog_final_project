import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountFormComponent } from './account-form/account-form.component';

const routes: Routes = [
    { path: '', component: AccountListComponent },
    { path: 'add', component: AccountFormComponent },
    { path: 'edit/:id', component: AccountFormComponent }
];

@NgModule({
    declarations: [
        AccountListComponent,
        AccountFormComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ]
})
export class AccountsModule { }
