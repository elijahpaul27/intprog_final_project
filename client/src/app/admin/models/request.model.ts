export interface Request {
    id: number;
    employeeId: number;
    workflowId: number;
    status: RequestStatus;
    currentStep: number;
    data: any;
    createdAt: Date;
    updatedAt: Date;
}

export enum RequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED'
} 