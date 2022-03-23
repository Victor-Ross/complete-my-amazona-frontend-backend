"use strict";
exports.__esModule = true;
exports.data = void 0;
var bcryptjs_1 = require("bcryptjs");
exports.data = {
    users: [
        {
            name: 'Victor',
            email: 'admin@example.com',
            password: (0, bcryptjs_1.hashSync)('123456'),
            isAdmin: true
        },
        {
            name: 'Maura',
            email: 'user@example.com',
            password: (0, bcryptjs_1.hashSync)('123456')
        },
    ],
    products: [
        {
            name: 'Nike Slim shirt',
            slug: 'nike-slim-shirt',
            category: 'Shirts',
            image: '/images/p1.jpg',
            price: 120,
            countInStock: 10,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 10,
            description: 'high quality shirt'
        },
        {
            name: 'Adidas Fit shirt',
            slug: 'adidas-fit-shirt',
            category: 'Shirts',
            image: '/images/p2.jpg',
            price: 250,
            countInStock: 0,
            brand: 'Adidas',
            rating: 4,
            numReviews: 10,
            description: 'high quality product'
        },
        {
            name: 'Nike Slim pant',
            slug: 'nike-slim-pant',
            category: 'Pants',
            image: '/images/p3.jpg',
            price: 25,
            countInStock: 15,
            brand: 'Nike',
            rating: 4.5,
            numReviews: 14,
            description: 'high quality shirt'
        },
        {
            name: 'Adidas Fit Pant',
            slug: 'adidas-fit-pant',
            category: 'Pants',
            image: '/images/p4.jpg',
            price: 65,
            countInStock: 5,
            brand: 'Adidas',
            rating: 4.5,
            numReviews: 10,
            description: 'high quality shirt'
        },
    ]
};
