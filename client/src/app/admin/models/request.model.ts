export interface Request {
    id?: number;
    title: string;
    description: string;
    status: RequestStatus;
    priority: RequestPriority;
    workflowId: number;
    workflow?: {
        id: number;
        name: string;
        steps: WorkflowStep[];
    };
    requesterId: number;
    requester?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    employeeId: number;
    type: string;
    currentStep?: number;
    currentDepartmentId?: number;
    currentDepartment?: {
        id: number;
        name: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export enum RequestStatus {
    Pending = 'pending',
    InProgress = 'in_progress',
    Completed = 'completed',
    Rejected = 'rejected'
}

export enum RequestPriority {
    Low = 'low',
    Medium = 'medium',
    High = 'high',
    Urgent = 'urgent'
}

export interface WorkflowStep {
    id?: number;
    name: string;
    description?: string;
    order: number;
    departmentId: number;
    department?: {
        id: number;
        name: string;
    };
    isRequired: boolean;
    estimatedDays: number;
}