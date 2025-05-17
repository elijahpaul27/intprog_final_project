import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '@app/_services';
import { Role } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const account = this.accountService.accountValue;
        console.log('RoleGuard - Checking access:', {
            account,
            route: state.url,
            requiredRoles: route.data.roles,
            accountRole: account?.role
        });

        if (account) {
            // check if route is restricted by role
            const { roles } = route.data;
            if (roles && !roles.includes(account.role)) {
                console.log('RoleGuard - Access denied: Role not authorized');
                // role not authorized so redirect to home page
                this.router.navigate(['/']);
                return false;
            }

            console.log('RoleGuard - Access granted');
            // authorized so return true
            return true;
        }

        console.log('RoleGuard - Access denied: Not logged in');
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
} 