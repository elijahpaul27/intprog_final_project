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
        this.accountService.account.subscribe(x => this.account = x);
    }

    ngOnInit() {
        this.checkScreenSize();
        window.addEventListener('resize', () => this.checkScreenSize());
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
        return this.account?.role === Role.Admin;
    }

    navigateTo(path: string) {
        this.router.navigate([path]);
    }

    isActive(path: string): boolean {
        return this.router.url === path;
    }
} 