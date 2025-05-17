import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services';
import { Account } from '@app/_models';

@Component({
    selector: 'app-account-list',
    templateUrl: './account-list.component.html',
    styleUrls: ['./account-list.component.less']
})
export class AccountListComponent implements OnInit {
    accounts: Account[] = [];

    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    ngOnInit() {
        this.loadAccounts();
    }

    loadAccounts() {
        this.accountService.getAll()
            .subscribe(accounts => {
                this.accounts = accounts;
            });
    }

    addAccount() {
        this.router.navigate(['/admin/accounts/add']);
    }

    editAccount(id: string) {
        this.router.navigate(['/admin/accounts/edit', id]);
    }

    deleteAccount(id: string) {
        if (confirm('Are you sure you want to delete this account?')) {
            this.accountService.delete(id)
                .subscribe(() => {
                    this.loadAccounts();
                });
        }
    }
} 