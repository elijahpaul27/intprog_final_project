import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Request, RequestStatus } from '../models/request.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RequestService {
    private apiUrl = `${environment.apiUrl}/requests`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Request[]> {
        return this.http.get<Request[]>(this.apiUrl);
    }

    getById(id: number): Observable<Request> {
        return this.http.get<Request>(`${this.apiUrl}/${id}`);
    }

    create(request: Request): Observable<Request> {
        return this.http.post<Request>(this.apiUrl, request);
    }

    update(id: number, request: Request): Observable<Request> {
        return this.http.put<Request>(`${this.apiUrl}/${id}`, request);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    updateStatus(id: number, status: RequestStatus): Observable<Request> {
        return this.http.patch<Request>(`${this.apiUrl}/${id}/status`, { status });
    }

    getByRequester(requesterId: number): Observable<Request[]> {
        return this.http.get<Request[]>(`${this.apiUrl}/requester/${requesterId}`);
    }

    getByDepartment(departmentId: number): Observable<Request[]> {
        return this.http.get<Request[]>(`${this.apiUrl}/department/${departmentId}`);
    }

    getByEmployee(employeeId: number): Observable<Request[]> {
        return this.http.get<Request[]>(`${this.apiUrl}/employee/${employeeId}`);
    }

    getByStatus(status: RequestStatus): Observable<Request[]> {
        return this.http.get<Request[]>(`${this.apiUrl}/status/${status}`);
    }

    approve(id: number): Observable<Request> {
        return this.http.put<Request>(`${this.apiUrl}/${id}/approve`, {});
    }

    reject(id: number): Observable<Request> {
        return this.http.put<Request>(`${this.apiUrl}/${id}/reject`, {});
    }
} 