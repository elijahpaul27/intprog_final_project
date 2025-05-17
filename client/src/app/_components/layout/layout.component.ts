import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services';
import { Account, Role } from '@app/_models';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {
    account: Account;
    isSidebarCollapsed = false;
    isSidebarVisible = false;

    constructor(
        public router: Router,
        private accountService: AccountService
    ) {
        // Subscribe to account changes
        this.accountService.account.subscribe(x => {
            this.account = x;
            console.log('Current account:', this.account);
            console.log('Is admin?', this.isAdmin());
        });

        // Initialize account from current value
        this.account = this.accountService.accountValue;
        console.log('Initial account value:', this.account);
    }

    ngOnInit() {
        this.checkScreenSize();
        window.addEventListener('resize', () => this.checkScreenSize());
        
        // Ensure account is loaded
        if (!this.account && this.accountService.accountValue) {
            this.account = this.accountService.accountValue;
            console.log('Account loaded in ngOnInit:', this.account);
        }
    }

    private checkScreenSize() {
        if (window.innerWidth <= 767.98) {
            this.isSidebarCollapsed = true;
            this.isSidebarVisible = false;
        } else {
            this.isSidebarCollapsed = false;
            this.isSidebarVisible = true;
        }
    }

    toggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
        if (window.innerWidth <= 767.98) {
            this.isSidebarVisible = !this.isSidebarVisible;
        }
    }

    logout() {
        this.accountService.logout();
    }

    isAdmin(): boolean {
        if (!this.account) {
            console.log('No account available');
            return false;
        }
        const isAdmin = this.account.role === Role.Admin;
        console.log('Checking admin status:', { 
            account: this.account, 
            role: this.account.role, 
            isAdmin,
            roleType: typeof this.account.role,
            expectedRole: Role.Admin,
            expectedRoleType: typeof Role.Admin
        });
        return isAdmin;
    }

    navigateTo(path: string) {
        console.log('Navigating to:', path);
        this.router.navigate([path]);
    }

    isActive(path: string): boolean {
        return this.router.url === path;
    }
} 