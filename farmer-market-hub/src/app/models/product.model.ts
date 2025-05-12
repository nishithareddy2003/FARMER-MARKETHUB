export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    images: string[];
    stock: number;
    farmerId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}