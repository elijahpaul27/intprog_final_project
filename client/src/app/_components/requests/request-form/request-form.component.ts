import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Request, RequestStatus } from '../../../_models/request.model';
import { Employee } from '../../../_models/employee.model';
import { Workflow } from '../../../_models/workflow.model';
import { RequestService } from '../../../_services/request.service';
import { EmployeeService } from '../../../_services/employee.service';
import { WorkflowService } from '../../../_services/workflow.service';

@Component({
    selector: 'app-request-form',
    templateUrl: './request-form.component.html',
    styleUrls: ['./request-form.component.less']
})
export class RequestFormComponent implements OnInit {
    requestForm: FormGroup;
    employees: Employee[] = [];
    workflows: Workflow[] = [];
    isViewMode = false;
    loading = false;
    error = '';
    requestId: number | null = null;
    currentRequest: Request | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private requestService: RequestService,
        private employeeService: EmployeeService,
        private workflowService: WorkflowService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.requestForm = this.formBuilder.group({
            employeeId: ['', Validators.required],
            workflowId: ['', Validators.required],
            data: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadEmployees();
        this.loadWorkflows();
        this.requestId = this.route.snapshot.params['id'];
        if (this.requestId) {
            this.isViewMode = true;
            this.loadRequest();
        }
    }

    loadEmployees(): void {
        this.employeeService.getAll().subscribe({
            next: (employees) => {
                this.employees = employees;
            },
            error: (error) => {
                this.error = 'Error loading employees';
                console.error('Error loading employees:', error);
            }
        });
    }

    loadWorkflows(): void {
        this.workflowService.getAll().subscribe({
            next: (workflows) => {
                this.workflows = workflows;
            },
            error: (error) => {
                this.error = 'Error loading workflows';
                console.error('Error loading workflows:', error);
            }
        });
    }

    loadRequest(): void {
        if (!this.requestId) return;

        this.loading = true;
        this.requestService.getById(this.requestId).subscribe({
            next: (request) => {
                this.currentRequest = request;
                this.requestForm.patchValue(request);
                this.requestForm.disable(); // Disable form in view mode
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Error loading request';
                this.loading = false;
                console.error('Error loading request:', error);
            }
        });
    }

    onSubmit(): void {
        if (this.requestForm.invalid) {
            return;
        }

        this.loading = true;
        const request: Request = {
            ...this.requestForm.value,
            status: RequestStatus.PENDING,
            currentStep: 1
        };

        this.requestService.create(request).subscribe({
            next: () => {
                this.router.navigate(['/requests']);
            },
            error: (error) => {
                this.error = 'Error creating request';
                this.loading = false;
                console.error('Error creating request:', error);
            }
        });
    }

    get f() { return this.requestForm.controls; }

    getEmployeeName(employee: Employee): string {
        return `${employee.firstName} ${employee.lastName}`;
    }

    getStatusClass(status: RequestStatus): string {
        switch (status) {
            case RequestStatus.PENDING:
                return 'bg-warning';
            case RequestStatus.APPROVED:
                return 'bg-success';
            case RequestStatus.REJECTED:
                return 'bg-danger';
            case RequestStatus.CANCELLED:
                return 'bg-secondary';
            default:
                return 'bg-light';
        }
    }
} 