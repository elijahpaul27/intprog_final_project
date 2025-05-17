export interface Employee {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    departmentId: number;
    department?: {
        id: number;
        name: string;
    };
    accountId: number;
    hireDate: Date;
    isActive: boolean;
    salary: number;
    createdAt?: Date;
    updatedAt?: Date;
} 