export interface Workflow {
    id?: number;
    name: string;
    description: string;
    type: string;
    employeeId: number;
    totalSteps: number;
    isActive: boolean;
    steps: WorkflowStep[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface WorkflowStep {
    id?: number;
    name: string;
    description: string;
    order: number;
    departmentId: number;
    department?: {
        id: number;
        name: string;
    };
    isRequired: boolean;
    estimatedDays: number;
    workflowId?: number;
    createdAt?: Date;
    updatedAt?: Date;
} 