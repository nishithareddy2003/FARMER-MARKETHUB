import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        id: uuidv4(),
        name: 'Vegetables',
        description: 'Fresh, locally grown vegetables',
        updatedAt: new Date(),
      },
    }),
    prisma.category.create({
      data: {
        id: uuidv4(),
        name: 'Fruits',
        description: 'Seasonal and exotic fruits',
        updatedAt: new Date(),
      },
    }),
    prisma.category.create({
      data: {
        id: uuidv4(),
        name: 'Dairy',
        description: 'Farm-fresh dairy products',
        updatedAt: new Date(),
      },
    }),
    prisma.category.create({
      data: {
        id: uuidv4(),
        name: 'Grains',
        description: 'Organic grains and cereals',
        updatedAt: new Date(),
      },
    }),
    prisma.category.create({
      data: {
        id: uuidv4(),
        name: 'Herbs',
        description: 'Fresh culinary and medicinal herbs',
        updatedAt: new Date(),
      },
    }),
  ]);

  // Create Farmers
  const farmers = await Promise.all([
    prisma.user.create({
      data: {
        id: uuidv4(),
        email: 'john@farmer.com',
        firstName: 'John',
        lastName: 'Smith',
        password: 'johnFarmer123', // 'password123'
        role: 'FARMER',
        updatedAt: new Date(),
        profile: {
          create: {
            id: uuidv4(),
            phoneNumber: '+1234567890',
            updatedAt: new Date(),
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        id: uuidv4(),
        email: 'maria@farmer.com',
        firstName: 'Maria',
        lastName: 'Garcia',
        password: 'mariaFarmer123',
        role: 'FARMER',
        updatedAt: new Date(),
        profile: {
          create: {
            id: uuidv4(),
            phoneNumber: '+1987654321',
            updatedAt: new Date(),
          },
        },
      },
    }),
  ]);

  // Create Customer
  const customer = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: 'jane@customer.com',
      firstName: 'Jane',
      lastName: 'Doe',
      password: 'janeCustomer123',
      role: 'CUSTOMER',
      updatedAt: new Date(),
      profile: {
        create: {
          id: uuidv4(),
          phoneNumber: '+1555555555',
          updatedAt: new Date(),
        },
      },
    },
  });

  // Create Products
  const products = await Promise.all([
    // Vegetables
    prisma.product.create({
      data: {
        id: uuidv4(),
        name: 'Organic Tomatoes',
        description: 'Vine-ripened organic tomatoes, perfect for salads and cooking',
        price: 2.99,
        stock: 100,
        unit: 'kg',
        imageUrl: '/assets/images/products/tomatoes.jpg',
        sellerId: farmers[0].id,
        categoryId: categories[0].id,
        updatedAt: new Date(),
      },
    }),
    prisma.product.create({
      data: {
        id: uuidv4(),
        name: 'Fresh Spinach',
        description: 'Nutrient-rich baby spinach leaves',
        price: 3.49,
        stock: 75,
        unit: 'kg',
        imageUrl: '/assets/images/products/spinach.jpg',
        sellerId: farmers[0].id,
        categoryId: categories[0].id,
        updatedAt: new Date(),
      },
    }),
    // Fruits
    prisma.product.create({
      data: {
        id: uuidv4(),
        name: 'Sweet Strawberries',
        description: 'Hand-picked fresh strawberries',
        price: 4.99,
        stock: 50,
        unit: 'kg',
        imageUrl: '/assets/images/products/strawberries.jpg',
        sellerId: farmers[1].id,
        categoryId: categories[1].id,
        updatedAt: new Date(),
      },
    }),
    // Dairy
    prisma.product.create({
      data: {
        id: uuidv4(),
        name: 'Farm Fresh Milk',
        description: 'Pasteurized whole milk from grass-fed cows',
        price: 3.99,
        stock: 30,
        unit: 'L',
        imageUrl: '/assets/images/products/milk.jpg',
        sellerId: farmers[1].id,
        categoryId: categories[2].id,
        updatedAt: new Date(),
      },
    }),
    // Grains
    prisma.product.create({
      data: {
        id: uuidv4(),
        name: 'Organic Quinoa',
        description: 'Premium organic quinoa grains',
        price: 5.99,
        stock: 60,
        unit: 'kg',
        imageUrl: '/assets/images/products/quinoa.jpg',
        sellerId: farmers[0].id,
        categoryId: categories[3].id,
        updatedAt: new Date(),
      },
    }),
    // Herbs
    prisma.product.create({
      data: {
        id: uuidv4(),
        name: 'Fresh Basil',
        description: 'Aromatic fresh basil leaves',
        price: 2.49,
        stock: 40,
        unit: 'bunch',
        imageUrl: '/assets/images/products/basil.jpg',
        sellerId: farmers[1].id,
        categoryId: categories[4].id,
        updatedAt: new Date(),
      },
    }),
  ]);

  // Create Customer's Cart
  const cart = await prisma.cart.create({
    data: {
      id: uuidv4(),
      userId: customer.id,
      updatedAt: new Date(),
      cartItem: {
        create: [
          {
            id: uuidv4(),
            productId: products[0].id,
            quantity: 2,
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            productId: products[2].id,
            quantity: 1,
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            productId: products[3].id,
            quantity: 3,
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            productId: products[4].id,
            quantity: 2,
            updatedAt: new Date(),
          },
          {
            id: uuidv4(),
            productId: products[5].id,
            quantity: 4,
            updatedAt: new Date(),
          },
        ],
      },
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
