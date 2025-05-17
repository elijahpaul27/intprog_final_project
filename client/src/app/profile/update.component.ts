import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';
import { Account } from '@app/_models';

@Component({ templateUrl: 'update.component.html' })
export class UpdateComponent implements OnInit {
    account: Account;
    form: UntypedFormGroup;
    loading = false;
    submitted = false;
    deleting = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.account = this.accountService.accountValue;
        const title = this.account ? this.account.title : '';
        const firstName = this.account ? this.account.firstName : '';
        const lastName = this.account ? this.account.lastName : '';
        const email = this.account ? this.account.email : '';
        this.form = this.formBuilder.group({
            title: [title, Validators.required],
            firstName: [firstName, Validators.required],
            lastName: [lastName, Validators.required],
            email: [email, [Validators.required, Validators.email]],
            password: ['', [Validators.minLength(6)]],
            confirmPassword: ['']
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
    
        // reset alerts on submit
        this.alertService.clear();
    
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
    
        this.loading = true;
        this.accountService.update(this.account.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
    
    onDelete() {
        // Check if user is admin and trying to delete own account
        if (this.account.role === 'Admin') {
            this.alertService.error('Admin cannot delete their own account');
            return;
        }

        if (confirm('Are you sure?')) {
            this.deleting = true;
            this.accountService.delete(this.account.id)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.alertService.success('Account deleted successfully', { keepAfterRouteChange: true });
                        this.router.navigate(['/']);
                    },
                    error: error => {
                        this.alertService.error(error);
                        this.deleting = false;
                    }
                });
        }
    }    
}
