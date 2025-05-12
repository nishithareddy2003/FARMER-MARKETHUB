export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    paymentStatus: string;
    deliveryAddress: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}