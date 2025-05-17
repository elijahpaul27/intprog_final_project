import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/department.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DepartmentService {
    private apiUrl = `${environment.apiUrl}/departments`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Department[]> {
        return this.http.get<Department[]>(this.apiUrl);
    }

    getById(id: number): Observable<Department> {
        return this.http.get<Department>(`${this.apiUrl}/${id}`);
    }

    create(department: Department): Observable<Department> {
        return this.http.post<Department>(this.apiUrl, department);
    }

    update(id: number, department: Department): Observable<Department> {
        return this.http.put<Department>(`${this.apiUrl}/${id}`, department);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
} 