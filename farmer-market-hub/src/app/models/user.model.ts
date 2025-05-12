export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}