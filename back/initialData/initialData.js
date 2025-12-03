const config = require("config");
const port = config.get("PORT");

module.exports = {
    "users": [
        {
            "name": {
                "first": "first",
                "last": "user"
            },
            "phone": "050-0000000",
            "email": "first@gmail.com",
            "password": "First1234!",
            "address": {
                "country": "israel",
                "city": "tel-aviv",
                "street": "magnive",
                "houseNumber": "5",
                "zip": "1234"
            },
            "image": {
                "url": "",
                "alt": ""
            }
        },
        {
            "name": {
                "first": "second",
                "last": "user"
            },
            "phone": "050-0000000",
            "email": "second@gmail.com",
            "password": "Second1234!",
            "address": {
                "state": "random state",
                "country": "israel",
                "city": "tel-aviv",
                "street": "renanim",
                "houseNumber": "5",
                "zip": "2233"
            },
            "image": {
                "url": "",
                "alt": ""
            }
        },
        {
            "name": {
                "first": "admin",
                "last": "user"
            },
            "isAdmin": true,
            "phone": "050-0000000",
            "email": "admin@gmail.com",
            "password": "Admin1234!",
            "address": {
                "country": "israel",
                "city": "tel-aviv",
                "street": "vermiza",
                "houseNumber": "5",
                "zip": "1122"
            },
            "image": {
                "url": "",
                "alt": ""
            }
        }
    ],
    "categories": [
        {
            "title": "Electronics (initial-data category)",
            "description": "this category is made for the initial-data products, in case there are no other products in store",
            "image": {
                "url": `http://localhost:${port}/public/electronics.jpg`,
                "alt": "electronics"
            }
        }
    ],
    "products": [
        {
            "title": "Laptop",
            "subtitle": "our premium laptop",
            "description": "this is the first product in the initial-data category in the storePremiup laptop with very high preformance. 16GB RAM.",
            "image": {
                "url": `http://localhost:${port}/public/laptops.JPG`,
                "alt": "laptop"
            },
            "quantityInStock": 5,
            "price": 500,
            "isDiscount": false
        },
        {
            "title": "Television",
            "subtitle": "Our best selling TV",
            "description": "Experience crystal-clear picture and vibrant colors with this 55-inch Smart LED TV. Perfect for movies, gaming, and streaming your favorite shows.",
            "image": {
                "url": `http://localhost:${port}/public/TVs.JPG`,
                "alt": "television"
            },
            "quantityInStock": 7,
            "price": 250,
            "isDiscount": true,
            "discountedPrice": 190
        },
        {
            "title": "Computer Screen",
            "subtitle": "27 inch full HD Monitor",
            "description": "Enhance your productivity with this advanced monitor. Features ultra-sharp display, fast response time, and adjustable stand for comfortable viewing. Ideal for work, gaming, or entertainment.",
            "image": {
                "url": `http://localhost:${port}/public/screen1s.JPG`,
                "alt": "monitor"
            },
            "quantityInStock": 12,
            "price": 120,
            "isDiscount": false
        }
    ]
}
