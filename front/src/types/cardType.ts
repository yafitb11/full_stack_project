export type TProduct = {
    _id: string,
    name: string,
    description: string,
    price: number,
    category: string,
    image: {
        url: string,
        alt: string,
    },
    likes: string[],
    user_id: string,
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