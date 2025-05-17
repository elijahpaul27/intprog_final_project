export interface Account {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isVerified: boolean;
    isBlocked: boolean;
    created: Date;
    updated: Date;
} 