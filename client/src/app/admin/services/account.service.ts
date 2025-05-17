import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Account } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account | null>;
    public account: Observable<Account | null>;

    constructor(private http: HttpClient) {
        this.accountSubject = new BehaviorSubject<Account | null>(null);
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue(): Account | null {
        return this.accountSubject.value;
    }

    getAll() {
        return this.http.get<Account[]>(`${environment.apiUrl}/admin/accounts`);
    }

    getById(id: string) {
        return this.http.get<Account>(`${environment.apiUrl}/admin/accounts/${id}`);
    }

    create(account: Account) {
        return this.http.post(`${environment.apiUrl}/admin/accounts`, account);
    }

    update(id: string, account: Account) {
        return this.http.put(`${environment.apiUrl}/admin/accounts/${id}`, account);
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/admin/accounts/${id}`);
    }

    blockAccount(id: string) {
        return this.http.put(`${environment.apiUrl}/admin/accounts/${id}/block`, {});
    }

    unblockAccount(id: string) {
        return this.http.put(`${environment.apiUrl}/admin/accounts/${id}/unblock`, {});
    }

    login(email: string, password: string) {
        return this.http.post<Account>(`${environment.apiUrl}/accounts/authenticate`, { email, password })
            .pipe(map(account => {
                this.accountSubject.next(account);
                return account;
            }));
    }

    logout() {
        this.accountSubject.next(null);
    }
} 