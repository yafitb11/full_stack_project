
export type { TProduct, TCategory, TOrder, TCartItem, Tuser } from './types';
export type { FormData } from './formData';

// Additional types for the project
export interface PaymentDetails {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
}

export interface CartState {
    items: TCartItem[];
    totalItems: number;
    totalPrice: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface SearchParams {
    query: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
}
