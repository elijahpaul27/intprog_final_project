export interface Workflow {
    id: number;
    name: string;
    description: string;
    departmentId: number;
    steps: WorkflowStep[];
    createdAt: Date;
    updatedAt: Date;
}

export interface WorkflowStep {
    id: number;
    name: string;
    order: number;
    approverRole: string;
    isActive: boolean;
} 