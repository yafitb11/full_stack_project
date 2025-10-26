// Export all types from a single file for easier imports
export type { Tuser } from './userType';
export type { TProduct, TCategory, TOrder, TCartItem } from './cardType';
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
