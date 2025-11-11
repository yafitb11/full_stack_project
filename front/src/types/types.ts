export type TProduct = {
    _id: string,
    title: string,
    subtitle: string,
    description: string,
    image: {
        url: string,
        alt: string,
    },
    quantityInStock: number,
    price: number,
    isDiscount: boolean,
    discountedPrice: number,
    category_id: string,
    likes: string[],
    createdAt: string,
}

export type TCategory = {
    _id: string,
    title: string,
    description: string,
    image: {
        url: string,
        alt: string,
    },
    products: [string],
    createdAt: string,
}

export type TOrder = {
    _id: string,
    orderNumber: number,
    user_id: string,
    items: {
        product: TProduct,
        quantity: number
    }[],
    totalItems: number,
    totalPrice: number,
    createdAt: string,
}

export type TCartItem = {
    product: TProduct,
    quantity: number
}

export type Tuser = {
    _id: string;
    name: {
        first: string;
        middle?: string;
        last: string;
    },
    phone: number;
    email: string;
    password: string;
    image: {
        url: string;
        alt: string;
    },
    address: {
        state: string;
        country: string;
        city: string;
        street: string;
        houseNumber: number;
        zip: number;
    },
    isAdmin: boolean;
    createdAt: string;
}
