# Database Setup Guide

## Prerequisites

- PostgreSQL installed and running
- Node.js and npm installed
- Prisma CLI installed globally (`npm install -g prisma`)

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install @prisma/client prisma
   ```

2. Configure Database:
   - Create a new MySQL database named 'farmer_market_hub'
   - Update the DATABASE_URL in .env file with your PostgreSQL credentials

3. Run Migrations:
   ```bash
   # Generate migration files
   npx prisma migrate dev --name init

   # Apply migrations to database
   npx prisma migrate deploy
   ```

4. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

## Database Schema

The database includes the following models:

- **User**: Stores user information with role-based access (FARMER/CUSTOMER)
- **Profile**: Extended user information including contact details
- **Address**: User shipping addresses
- **Product**: Product listings with inventory management
- **Category**: Product categories
- **Cart**: Shopping cart implementation
- **CartItem**: Items in shopping cart
- **Order**: Order management
- **OrderItem**: Individual items in orders

## Development

- View database: `npx prisma studio`
- Update schema: Edit `schema.prisma` and run `npx prisma generate`
- Create migration: `npx prisma migrate dev --name <migration_name>`

## Security Notes

- Never commit the .env file
- Keep database credentials secure
- Use strong passwords for database access