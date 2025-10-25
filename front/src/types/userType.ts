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
    isBusiness: boolean;
    isAdmin: boolean;
    createdAt: string;
}
