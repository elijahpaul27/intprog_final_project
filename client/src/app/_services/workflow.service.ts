import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workflow } from '../_models/workflow.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WorkflowService {
    private apiUrl = `${environment.apiUrl}/workflows`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Workflow[]> {
        return this.http.get<Workflow[]>(this.apiUrl);
    }

    getById(id: number): Observable<Workflow> {
        return this.http.get<Workflow>(`${this.apiUrl}/${id}`);
    }

    create(workflow: Workflow): Observable<Workflow> {
        return this.http.post<Workflow>(this.apiUrl, workflow);
    }

    update(id: number, workflow: Workflow): Observable<Workflow> {
        return this.http.put<Workflow>(`${this.apiUrl}/${id}`, workflow);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getByDepartment(departmentId: number): Observable<Workflow[]> {
        return this.http.get<Workflow[]>(`${this.apiUrl}/department/${departmentId}`);
    }
} 