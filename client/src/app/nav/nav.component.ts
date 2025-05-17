import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../admin/services/account.service';
import { Account } from '../admin/models/account.model';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent {
    account: Account | null;

    constructor(
        private router: Router,
        private accountService: AccountService
    ) {
        this.accountService.account.subscribe(x => this.account = x);
    }

    logout() {
        this.accountService.logout();
        this.router.navigate(['/login']);
    }
} 