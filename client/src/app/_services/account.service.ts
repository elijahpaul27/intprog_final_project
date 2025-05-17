import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Account } from '@app/_models';

const baseUrl = `${environment.apiUrl}/accounts`;

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account>;
    public account: Observable<Account>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.accountSubject = new BehaviorSubject<Account>(null);
        this.account = this.accountSubject.asObservable();
        console.log('AccountService initialized');
    }

    public get accountValue(): Account {
        const value = this.accountSubject.value;
        console.log('AccountService - Getting account value:', value);
        return value;
    }

    login(email: string, password: string) {
        console.log('AccountService - Attempting login for:', email);
        return this.http.post<any>(`${baseUrl}/authenticate`, { email, password }, { withCredentials: true })
            .pipe(map(account => {
                console.log('AccountService - Login successful:', account);
                this.accountSubject.next(account);
                this.startRefreshTokenTimer();
                return account;
            }));
    }

    logout() {
        console.log('AccountService - Logging out');
        this.http.post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        this.accountSubject.next(null);
        this.router.navigate(['/account/login']);
    }
    
    refreshToken() {
        console.log('AccountService - Refreshing token');
        return this.http.post<any>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
            .pipe(map((account) => {
                console.log('AccountService - Token refreshed:', account);
                this.accountSubject.next(account);
                this.startRefreshTokenTimer();
                return account;
            }));
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
        return this.http.post(`${baseUrl}/verify-email`, { token });
    }
    
    forgotPassword(email: string) {
        return this.http.post(`${baseUrl}/forgot-password`, { email });
    }
    
    validateResetToken(token: string) {
        return this.http.post(`${baseUrl}/validate-reset-token`, { token });
    }
    
    resetPassword(token: string, password: string, confirmPassword: string) {
        return this.http.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
    }
    
    getAll() {
        return this.http.get<Account[]>(baseUrl);
    }
    
    getById(id: string) {
        return this.http.get<Account>(`${baseUrl}/${id}`);
    }
    
    create(params) {
        return this.http.post(baseUrl, params);
    }
    
    update(id, params) {
        return this.http.put(`${baseUrl}/${id}`, params)
            .pipe(map((account: any) => {
            // update the current account if it was updated
            if (account.id === this.accountValue.id) {
                // publish updated account to subscribers
                account = { ...this.accountValue, ...account };
                this.accountSubject.next(account);
            }
            return account;
            }));
    }
    
    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`)
            .pipe(finalize(() => {
            // auto logout if the logged-in account was deleted
            if (id === this.accountValue.id) {
                this.logout();
            }
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