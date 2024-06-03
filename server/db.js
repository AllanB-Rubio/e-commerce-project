//DATA LAYER
const pg = require("pg");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const client = new pg.Client(
  process.env.DATABASE_URL || { database: "e_commerce_project" }
);

const createTables = async () => {
  const SQL = `
      DROP TABLE IF EXISTS cartItems;
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS orderItems;
      DROP TABLE IF EXISTS orders;
  
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS product_inventories;
      DROP TABLE IF EXISTS product_categories;
  
      DROP TABLE IF EXISTS user_payments;
      DROP TABLE IF EXISTS user_addresses;
  
      DROP TABLE IF EXISTS admin_user;
      DROP TABLE IF EXISTS "user";
  
      CREATE TABLE "user" (
          id UUID PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          phone_number VARCHAR(15),
          created_at TIMESTAMP DEFAULT NOW(),
          modified_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE admin_user (
          id UUID PRIMARY KEY,
          username VARCHAR(255),
          password VARCHAR(255),
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          permissions TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          modified_at TIMESTAMP DEFAULT NOW()
      );
  
      CREATE TABLE product_categories (
          id UUID PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          modified_at TIMESTAMP DEFAULT NOW(),
          deleted_at TIMESTAMP
      );
      CREATE TABLE product_inventories (
          id UUID PRIMARY KEY,
          quantity INT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          modified_at TIMESTAMP DEFAULT NOW(),
          deleted_at TIMESTAMP
      );
      CREATE TABLE products (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          SKU VARCHAR(255),
          price NUMERIC(10, 2) NOT NULL,
          inventory_id UUID REFERENCES product_inventories(id) ON DELETE CASCADE,
          category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          modified_at TIMESTAMP DEFAULT NOW(),
          deleted_at TIMESTAMP
      );
  

      CREATE TABLE orders (
          id UUID PRIMARY KEY,
          user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
          total_amount NUMERIC(10, 2) NOT NULL,
          status VARCHAR(50),
          created_at TIMESTAMP DEFAULT NOW(),
          modified_at TIMESTAMP DEFAULT NOW(),
          deleted_at TIMESTAMP
      );
      CREATE TABLE orderItems (
          id UUID PRIMARY KEY,
          order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
          product_id UUID REFERENCES products(id) ON DELETE CASCADE,
          quantity INT NOT NULL,
          price NUMERIC(10, 2) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          modified_at TIMESTAMP DEFAULT NOW(),
          deleted_at TIMESTAMP
      );
  
      CREATE TABLE reviews (
          id UUID PRIMARY KEY,
          user_id UUID REFERENCES "user"(id),
          product_id UUID REFERENCES products(id),
          rating INT,
          review TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          modified_at TIMESTAMP DEFAULT NOW(),
          deleted_at TIMESTAMP 
      );
  

      CREATE TABLE cartItems (
          id UUID PRIMARY KEY,
          product_id UUID REFERENCES products(id),
          quantity INT,
          created_at TIMESTAMP DEFAULT NOW(),
          modified_at TIMESTAMP DEFAULT NOW(),
          deleted_at TIMESTAMP
      );
    `;

  await client.query(SQL);
};

// Functions to Implement

// User Functions
// createUser: Create a new user.
// createAdmin: Create a new admin user.
// fetchAllUsers: Fetch all users.
// getUserById: Fetch a single user by their ID.
// updateUser: Update user details.
// deleteUser: Soft delete a user (set deleted_at).

// Product Functions
// createProduct: Create a new product.
// fetchProducts: Fetch all products.
// getProductById: Fetch a single product by its ID.
// updateProduct: Update product details.
// deleteProduct: Soft delete a product (set deleted_at).

// Inventory Functions
// createProductInventory: Create a new product inventory.
// fetchProductInventory: Fetch all product inventories.
// updateProductInventory: Update product inventory details.
// deleteProductInventory: Soft delete a product inventory (set deleted_at).

// Category Functions
// createCategory: Create a new product category.
// fetchCategories: Fetch all categories.
// updateCategory: Update category details.
// deleteCategory: Soft delete a category (set deleted_at).

// Order Functions
// createOrder: Create a new order.
// fetchOrders: Fetch all orders.
// getOrderById: Fetch a single order by its ID.
// updateOrder: Update order details.
// deleteOrder: Soft delete an order (set deleted_at).

// Order Item Functions
// createOrderItem: Create a new order item.
// fetchOrderItems: Fetch all order items.
// getOrderItemById: Fetch a single order item by its ID.
// updateOrderItem: Update order item details.
// deleteOrderItem: Soft delete an order item (set deleted_at).

// Cart Functions
// createCartItem: Add an item to the cart.
// fetchCartItems: Fetch all items in the cart.
// getCartItemById: Fetch a single cart item by its ID.
// updateCartItem: Update cart item details.
// deleteCartItem: Soft delete a cart item (set deleted_at).

// Review Functions
// createReview: Create a new review.
// fetchReviews: Fetch all reviews.
// getReviewById: Fetch a single review by its ID.
// updateReview: Update review details.
// deleteReview: Soft delete a review (admin only).

module.exports = { createTables, client };
