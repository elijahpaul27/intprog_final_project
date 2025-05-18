import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Account } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account>;
    public account: Observable<Account>;

    constructor(
        private http: HttpClient
    ) {
        this.accountSubject = new BehaviorSubject<Account>(null);
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue(): Account {
        return this.accountSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<Account>(`${environment.apiUrl}/accounts/authenticate`, { email, password })
            .pipe(map(account => {
                // store account details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('account', JSON.stringify(account));
                this.accountSubject.next(account);
                return account;
            }));
    }

    logout() {
        // remove account from local storage and set current account to null
        localStorage.removeItem('account');
        this.accountSubject.next(null);
    }

    register(account: Account) {
        return this.http.post(`${environment.apiUrl}/accounts/register`, account);
    }

    verifyEmail(token: string) {
        return this.http.post(`${environment.apiUrl}/accounts/verify-email`, { token });
    }

    forgotPassword(email: string) {
        return this.http.post(`${environment.apiUrl}/accounts/forgot-password`, { email });
    }

    validateResetToken(token: string) {
        return this.http.post(`${environment.apiUrl}/accounts/validate-reset-token`, { token });
    }

    resetPassword(token: string, password: string, confirmPassword: string) {
        return this.http.post(`${environment.apiUrl}/accounts/reset-password`, { token, password, confirmPassword });
    }

    refreshToken() {
        return this.http.post<Account>(`${environment.apiUrl}/accounts/refresh-token`, {})
            .pipe(map(account => {
                // store account details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('account', JSON.stringify(account));
                this.accountSubject.next(account);
                return account;
            }));
    }

    getAll() {
        return this.http.get<Account[]>(`${environment.apiUrl}/accounts`);
    }

    getById(id: string) {
        return this.http.get<Account>(`${environment.apiUrl}/accounts/${id}`);
    }

    create(account: Account) {
        return this.http.post(`${environment.apiUrl}/accounts`, account);
    }

    update(id: string, params: any) {
        return this.http.put(`${environment.apiUrl}/accounts/${id}`, params)
            .pipe(map(x => {
                // update stored account if the logged in account was updated
                if (id == this.accountValue?.id) {
                    // update local storage
                    const account = { ...this.accountValue, ...params };
                    localStorage.setItem('account', JSON.stringify(account));

                    // publish updated account to subscribers
                    this.accountSubject.next(account);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/accounts/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in account was deleted
                if (id == this.accountValue?.id) {
                    this.logout();
                }
                return x;
            }));
    }
}