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
        console.log('AccountService - Registering account:', account);
        return this.http.post(`${baseUrl}/register`, account, { withCredentials: true })
            .pipe(map((response: any) => {
                // Don't auto login after registration since verification is required
                // Only update the account if we have a valid token
                if (response && response.jwtToken) {
                    this.accountSubject.next(response);
                    this.startRefreshTokenTimer();
                }
                return response;
            }));
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
    
    private refreshTokenTimeout;    private startRefreshTokenTimer() {
        // Check if account and jwtToken exist before proceeding
        if (!this.accountValue || !this.accountValue.jwtToken) {
            console.log('AccountService - No JWT token available, skipping refresh timer');
            return;
        }
        
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(atob(this.accountValue.jwtToken.split('.')[1]));
        console.log('AccountService - Starting refresh token timer:', {
            tokenExpiry: new Date(jwtToken.exp * 1000),
            currentTime: new Date()
        });

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        console.log('AccountService - Stopping refresh token timer');
        clearTimeout(this.refreshTokenTimeout);
    }
}