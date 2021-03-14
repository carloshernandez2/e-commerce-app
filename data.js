const bcrypt = require('bcryptjs');

const data = {
  users: [
    {
      name: 'Basir',
      email: 'admin@example.com',
      password: bcrypt.hashSync('1234', 8),
      isAdmin: true,
    },
    {
      name: 'John',
      email: 'user@example.com',
      password: bcrypt.hashSync('1234', 8),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Muffin de chocolate',
      category: 'Muffins',
      image: '/images/p1.jpg',
      price: 10000,
      brand: 'Abuelita',
      rating: 4.5,
      numReviews: 10,
      description: 'Producto de alta calidad',
      countInStock: 40
    },
    {
      name: 'Tabla de Muffins de fruta',
      category: 'Muffins',
      image: '/images/p2.jpg',
      price: 50000,
      brand: 'Abuelita',
      rating: 5,
      numReviews: 10,
      description: 'Producto de alta calidad',
      countInStock: 0
    },
    {
      name: 'Brownie con helado',
      category: 'Helados',
      image: '/images/p3.jpg',
      price: 10000,
      brand: 'Abuelita',
      rating: 4,
      numReviews: 10,
      description: 'Producto de alta calidad',
      countInStock: 40
    },
    {
      name: 'Muffin de oreo',
      category: 'Muffins',
      image: '/images/p4.jpg',
      price: 10000,
      brand: 'Abuelita',
      rating: 4.5,
      numReviews: 10,
      description: 'Producto de alta calidad',
      countInStock: 40
    },
    {
      name: 'Cono sencillo',
      category: 'Helados',
      image: '/images/p5.jpg',
      price: 10000,
      brand: 'Abuelita',
      rating: 4.5,
      numReviews: 10,
      description: 'Producto de alta calidad',
      countInStock: 40
    },
    {
      name: 'Donas heladas',
      category: 'Helados',
      image: '/images/p6.jpg',
      price: 10000,
      brand: 'Abuelita',
      rating: 4.5,
      numReviews: 10,
      description: 'Producto de alta calidad',
      countInStock: 40
    },
  ],
};
module.exports = data;