import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/account.model';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-account-management',
    templateUrl: './account-management.component.html',
    styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit {
    accounts: Account[] = [];
    loading = false;
    error = '';

    constructor(private accountService: AccountService) { }

    ngOnInit() {
        this.loadAccounts();
    }

    loadAccounts() {
        this.loading = true;
        this.accountService.getAll()
            .pipe(first())
            .subscribe({
                next: (accounts) => {
                    this.accounts = accounts;
                    this.loading = false;
                },
                error: (error) => {
                    this.error = error;
                    this.loading = false;
                }
            });
    }

    deleteAccount(id: string) {
        if (confirm('Are you sure you want to delete this account?')) {
            this.accountService.delete(id)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.accounts = this.accounts.filter(x => x.id !== id);
                    },
                    error: (error) => {
                        this.error = error;
                    }
                });
        }
    }

    toggleBlockAccount(account: Account) {
        const action = account.isBlocked ? 'unblock' : 'block';
        if (confirm(`Are you sure you want to ${action} this account?`)) {
            const request = account.isBlocked
                ? this.accountService.unblockAccount(account.id)
                : this.accountService.blockAccount(account.id);

            request.pipe(first())
                .subscribe({
                    next: () => {
                        account.isBlocked = !account.isBlocked;
                    },
                    error: (error) => {
                        this.error = error;
                    }
                });
        }
    }
} 