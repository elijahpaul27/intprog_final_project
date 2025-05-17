import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    accounts = null;
    currentUser = null;

    constructor(private accountService: AccountService) {
        this.currentUser = this.accountService.accountValue;
    }

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(accounts => this.accounts = accounts);
    }

    deleteAccount(id: string) {
        // Prevent admin from deleting their own account
        if (id === this.currentUser.id) {
            return;
        }

        const account = this.accounts.find(x => x.id === id);
        account.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.accounts = this.accounts.filter(x => x.id !== id);
            });
    }

    isOwnAccount(id: string): boolean {
        return this.currentUser && this.currentUser.id === id;
    }
}