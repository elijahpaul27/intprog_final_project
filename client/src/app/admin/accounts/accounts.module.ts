import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AccountListComponent } from './account-list/account-list.component';

const routes: Routes = [
    { path: '', component: AccountListComponent }
];

@NgModule({
  imports: [
    CommonModule,
        RouterModule.forChild(routes)
  ],
  declarations: [
        AccountListComponent
  ]
})
export class AccountsModule { }
