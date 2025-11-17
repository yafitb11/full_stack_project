

export type TUserFormData = {
    name: {
        first: string,
        middle?: string,
        last: string,
    },
    phone: number,
    email: string,
    password: string,
    image: {
        url?: string,
        alt?: string,
    },
    address: {
        state?: string,
        country: string,
        city: string,
        street: string,
        houseNumber: number,
        zip: number,
    },
};

export type TProductFormData = {
    title: string;
    subtitle?: string;
    description: string;
    image: {
        url?: string;
        alt?: string;
    };
    category_id?: string;
    quantityInStock: number;
    price: number;
    isDiscount: boolean;
    discountedPrice?: number;
};

export type TCategoryFormData = {
    title: string,
    description: string,
    image: {
        url: string,
        alt: string,
    },
}