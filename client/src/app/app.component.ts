import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './_services';
import { Account, Role } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    title = 'Client';
    Role = Role;
    account: Account;

    constructor(
        private accountService: AccountService,
        private router: Router // <-- Add this line
    ) {
        this.accountService.account.subscribe(x => this.account = x);
    }

    logout() {
        this.accountService.logout();
        this.router.navigate(['/account/login']);
    }
}