import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './_components/layout/layout.component';
import { Role } from './_models';
import { RoleGuard } from './admin/guards/role.guard';
import { AuthGuard } from './_helpers/auth.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard], // Add AuthGuard to protect all routes within Layout
        children: [
            // Routes accessible by all authenticated users
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },

            // Admin only routes
            { 
                path: 'admin',
                canActivate: [RoleGuard],
                data: { roles: [Role.Admin] },
                loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
            }
        ]
    },
    { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
