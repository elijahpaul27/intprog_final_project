import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'layout.component.html' })
export class LayoutComponent implements OnInit {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    ngOnInit() {
        // redirect to home if already logged in
        if (this.accountService.accountValue) {
            this.router.navigate(['/']);
        }
    }
}