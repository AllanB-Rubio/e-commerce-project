# E-Commerce Project

## Overview

This is an e-commerce application backend built with Node.js and PostgreSQL. It supports user management, product management, order processing, cart functionality, and reviews.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)

## Getting Started

Follow these instructions to get the project up and running on your local machine.

## Prerequisites

- Node.js
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/e_commerce_project.git
   cd e_commerce_project
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your database URL:
   ```sh
   DATABASE_URL=postgres://yourusername:yourpassword@localhost:5432/e_commerce_project
   ```

## Running the Application

1. Create the database and tables:

   ```sh
   node server/index.js
   ```

2. Start the server:
   ```sh
   npm start
   ```
   By default, the server will run on `http://localhost:3000`.

## Database Schema

The database schema consists of the following tables:

- `user`
- `admin_user`
- `product_categories`
- `product_inventories`
- `products`
- `orders`
- `orderItems`
- `reviews`
- `cartItems`

## API Endpoints

### Users

- `POST /users` - Create a new user
- `GET /users` - Fetch all users
- `GET /users/:id` - Fetch a single user by ID
- `PUT /users/:id` - Update a user
- `DELETE /users/:id` - Soft delete a user

### Products

- `POST /products` - Create a new product
- `GET /products` - Fetch all products
- `GET /products/:id` - Fetch a single product by ID
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Soft delete a product

### Categories

- `POST /categories` - Create a new category
- `GET /categories` - Fetch all categories
- `PUT /categories/:id` - Update a category
- `DELETE /categories/:id` - Soft delete a category

### Orders

- `POST /orders` - Create a new order
- `GET /orders` - Fetch all orders
- `GET /orders/:id` - Fetch a single order by ID
- `PUT /orders/:id` - Update an order
- `DELETE /orders/:id` - Soft delete an order

### Reviews

- `POST /reviews` - Create a new review
- `GET /reviews` - Fetch all reviews
- `GET /reviews/:id` - Fetch a single review by ID
- `PUT /reviews/:id` - Update a review
- `DELETE /reviews/:id` - Soft delete a review (admin only)

### Cart Items

- `POST /cartItems` - Add an item to the cart
- `GET /cartItems` - Fetch all items in the cart
- `GET /cartItems/:id` - Fetch a single cart item by ID
- `PUT /cartItems/:id` - Update a cart item
- `DELETE /cartItems/:id` - Soft delete a cart item

## Project made by

- Allan Rubio
