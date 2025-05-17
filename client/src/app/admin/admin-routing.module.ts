import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview.component';

const routes: Routes = [
  { path: '', component: OverviewComponent },
  { 
    path: 'accounts',
    loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule)
  },
  { 
    path: 'departments',
    loadChildren: () => import('./departments/department.module').then(m => m.DepartmentModule)
  },
  { 
    path: 'employees',
    loadChildren: () => import('./employees/employee.module').then(m => m.EmployeeModule)
  },
  { 
    path: 'workflows',
    loadChildren: () => import('./workflows/workflow.module').then(m => m.WorkflowModule)
  },
  { 
    path: 'requests',
    loadChildren: () => import('./requests/request.module').then(m => m.RequestModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }