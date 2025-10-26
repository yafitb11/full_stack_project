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
    category: string,
    likes: string[],
    createdAt: string,
}

export type TCategory = {
    _id: string,
    name: string,
    description: string,
    image: {
        url: string,
        alt: string,
    },
    createdAt: string,
}

export type TOrder = {
    _id: string,
    user_id: string,
    products: {
        product: TProduct,
        quantity: number
    }[],
    totalPrice: number,
    status: string,
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
