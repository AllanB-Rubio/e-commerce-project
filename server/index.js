// Express Application // API Routes // Init Function

const express = require("express");
const app = express();
app.use(express.json());
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { client, createTables } = require("./db");

const someUsers = []; // In-memory array to store users for testing purposes
let userIdCounter = 1; // Simple counter to assign user IDs

app.use(bodyParser.json());

//  ROUTES
// Home Page - test welcome message
app.get("/", (req, res) => {
  res.send("Hello World!!");
});
// Register - creates new user
app.post("/api/register", async (req, res, next) => {
  try {
    const { username, email, password, first_name, last_name, phone_number } =
      req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: userIdCounter.toString(),
      username,
      email,
      password: hashedPassword, // Store the hashed password
      first_name,
      last_name,
      phone_number,
    };

    someUsers.push(newUser);
    userIdCounter++;
    console.log("Registered User:", newUser); // Log the registered user
    res
      .status(201)
      .send({ message: "User registered successfully", user: newUser });
  } catch (error) {
    next(error);
  }
});
// Login - log in existing user
app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = someUsers.find((u) => u.email === email);

    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("Invalid password for email:", email);
      return res.status(401).send({ message: "Invalid email or password" });
    }

    console.log("User logged in:", user); // Log successful login
    res.status(200).send({ message: "User logged in successfully", user });
  } catch (error) {
    next(error);
  }
});
// Account - access existing user account including shopping cart
app.post("/api/account", async (req, res, next) => {
  try {
    const { user_id } = req.body;
    const user = someUsers.find((u) => u.id === user_id);
    if (!user) {
      console.log("User not found with ID:", user_id);
      return res.status(404).send({ message: "User not found" });
    }

    // Shopping cart with users details
    const cart = shoppingCarts[user_id] || [];
    console.log("Accessing account for user:", user);
    res.status(200).send({ user, cart });
  } catch (error) {
    next(error);
  }
});

// Admin Users Endpoints:
let adminUsers = [
  {
    id: "1",
    username: "admin1",
    email: "admin1@email.com",
    password: "password1",
    first_name: "John",
    last_name: "Doe",
  },
  {
    id: "2",
    username: "admin2",
    email: "admin2@email.com",
    password: "password2",
    first_name: "Jane",
    last_name: "Smith",
  },
];
//POST // Create Admin User:/api/admin/users
app.post("/api/admin/users", async (req, res, next) => {
  try {
    const { username, email, password, first_name, last_name } = req.body;
    const id = uuidv4(); // Generate a unique ID for the new admin user

    // Add the new admin user to the array
    const newAdminUser = {
      id,
      username,
      email,
      password,
      first_name,
      last_name,
    };
    adminUsers.push(newAdminUser);

    res
      .status(201)
      .send({ message: "Admin user created successfully", user: newAdminUser });
  } catch (error) {
    next(error);
  }
});
//GET //Get Admin Users:/api/admin/users
app.get("/api/admin/users", async (req, res, next) => {
  try {
    res.status(200).send(adminUsers);
  } catch (error) {
    next(error);
  }
});
// Update Admin User:
//PUT /api/admin/users/:adminUserId
app.put("/api/admin/users/:adminUserId", async (req, res, next) => {
  try {
    const { adminUserId } = req.params;
    const { username, email, password, first_name, last_name } = req.body;

    // Find the admin user by ID
    const adminUser = adminUsers.find((user) => user.id === adminUserId);
    if (!adminUser) {
      return res.status(404).send({ message: "Admin user not found" });
    }

    // Update admin user data
    adminUser.username = username || adminUser.username;
    adminUser.email = email || adminUser.email;
    adminUser.password = password || adminUser.password;
    adminUser.first_name = first_name || adminUser.first_name;
    adminUser.last_name = last_name || adminUser.last_name;

    res
      .status(200)
      .send({ message: "Admin user updated successfully", user: adminUser });
  } catch (error) {
    next(error);
  }
});
// Delete Admin User:
//DELETE /api/admin/users/:adminUserId
app.delete("/api/admin/users/:adminUserId", async (req, res, next) => {
  try {
    const { adminUserId } = req.params;

    // Filter out the admin user to delete
    adminUsers = adminUsers.filter((user) => user.id !== adminUserId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Users Endpoints:
const users = [
  {
    first_name: "Alice",
    last_name: "Wonderland",
    email: "alicew@email.com",
    phone_number: "555-1234",
  },
  {
    first_name: "Robert",
    last_name: "Jones",
    email: "robertoj@email.com",
    phone_number: "555-1234",
  },
  {
    first_name: "Jake",
    last_name: "Smith",
    email: "jakes@email.com",
    phone_number: "555-1234",
  },
  {
    first_name: "Sara",
    last_name: "Landry",
    email: "saral@email.com",
    phone_number: "555-1234",
  },
];
// CREATE/ POST /api/users - creates user
app.post("/api/users", async (req, res, next) => {
  try {
    const { username, email, password, first_name, last_name, phone_number } =
      req.body;
    const id = uuidv4(); // Generate a unique ID for the new user

    // Add the new user to the array
    const newUser = {
      id,
      username,
      email,
      password,
      first_name,
      last_name,
      phone_number,
    };
    users.push(newUser);

    res
      .status(201)
      .send({ message: "User created successfully", user: newUser });
  } catch (error) {
    next(error);
  }
});
// READ/ GET /api/users - returns array of users
app.get("/api/users", async (req, res, next) => {
  res.status(200).send(users);
});
// PUT / Update User
app.put("/api/users/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { username, email, password, first_name, last_name, phone_number } =
      req.body;

    // Find the user by ID
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Update user data
    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password || user.password;
    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.phone_number = phone_number || user.phone_number;

    res.status(200).send({ message: "User updated successfully", user });
  } catch (error) {
    next(error);
  }
});
// DELETE /api/users/:userId - deletes a user by ID
app.delete("/api/users/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Find the index of the user in the array
    const index = users.findIndex((u) => u.id === userId);

    // If user not found, return 404
    if (index === -1) {
      return res.status(404).send({ message: "User not found" });
    }

    // Remove the user from the array
    const deletedUser = users.splice(index, 1)[0];

    res
      .status(200)
      .send({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    next(error);
  }
});

// Products endpoints:
const products = [
  {
    id: "1",
    name: "T-Shirt",
    description: "A plain T-shirt",
    category: "Clothing",
    price: 19.99,
    size: "Large",
    SKU: "TSHIRT-L",
    inventory: 100,
    image: "👕",
  },
  {
    id: "2",
    name: "Laptop",
    description: "A high performance laptop",
    category: "Electronics",
    price: 999.99,
    SKU: "LAPTOP-HP",
    inventory: 50,
    image: "💻",
  },
  {
    id: "3",
    name: "Book",
    description: "A best-selling novel",
    category: "Books",
    price: 14.99,
    SKU: "BOOK-BSN",
    inventory: 200,
    image: "📖",
  },
  {
    id: "4",
    name: "Headphones",
    description: "Noise-cancelling headphones",
    category: "Electronics",
    price: 199.99,
    SKU: "HEADPHONES-NC",
    inventory: 75,
    image: "🎧",
  },
  {
    id: "5",
    name: "Coffee Mug",
    description: "A ceramic coffee mug",
    category: "Home & Kitchen",
    price: 9.99,
    SKU: "MUG-CERAMIC",
    inventory: 150,
    image: "☕",
  },
  {
    id: "6",
    name: "Sneakers",
    description: "Comfortable running shoes",
    category: "Footwear",
    price: 59.99,
    size: "10",
    SKU: "SNEAKERS-10",
    inventory: 80,
    image: "👟",
  },
];
// READ/ GET /api/products - returns an array of products
app.get("/api/products", (req, res) => {
  res.status(200).send(products);
});
// READ/ GET /api/products/:id - returns a specific product
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);

  if (!product)
    return res.status(404).send("Unable to find product with given ID");
  res.status(200).send(product);
});
// UPDATE /api/products/:id - updates a specific product by ID
app.put("/api/products/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, size, SKU, inventory, image } =
      req.body;

    // Find the index of the product in the array
    const index = products.findIndex((p) => p.id === id);

    // If product not found, return 404
    if (index === -1) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Update the product
    products[index] = {
      id,
      name,
      description,
      category,
      price,
      size,
      SKU,
      inventory,
      image,
    };

    res.status(200).send({
      message: "Product updated successfully",
      product: products[index],
    });
  } catch (error) {
    next(error);
  }
});
// DELETE /api/products/:id - deletes a specific product by ID
app.delete("/api/products/:id", (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the index of the product in the array
    const index = products.findIndex((p) => p.id === id);

    // If product not found, return 404
    if (index === -1) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Remove the product from the array
    const deletedProduct = products.splice(index, 1)[0];

    res.status(200).send({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
});

// Orders endpoints:
let orders = [];
let orderIdCounter = 1;
// GET /api/orders - returns an array of orders
app.get("/api/orders", async (req, res, next) => {
  try {
    res.status(200).send(orders);
  } catch (error) {
    next(error);
  }
});
// POST /api/users/:id/orders - creates a new order for a specific user
app.post("/api/users/:id/orders", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { product, quantity } = req.body;

    const newOrder = {
      orderId: orderIdCounter.toString(),
      userId: id,
      product,
      quantity,
      orderDate: new Date().toISOString(),
    };

    orders.push(newOrder);
    orderIdCounter++;
    console.log("Created Order:", newOrder); // Log the created order
    res.status(201).send(newOrder);
  } catch (error) {
    next(error);
  }
});
// GET /api/users/:id/orders - returns orders for a specific user
app.get("/api/users/:id/orders", async (req, res, next) => {
  try {
    const { id } = req.params;

    // Filter orders to find orders associated with the given user ID
    const userOrders = orders.filter((order) => order.userId === id);

    res.status(200).send(userOrders);
  } catch (error) {
    next(error);
  }
});
// DELETE /api/users/:userId/orders/:id - deletes an order by order id and user id
app.delete("/api/users/:userId/orders/:id", async (req, res, next) => {
  try {
    const { userId, id } = req.params;

    orders = orders.filter(
      (order) => !(order.userId === userId && order.orderId === id)
    );

    console.log(`Deleted Order with ID ${id} for User ID ${userId}`); // Log the deletion
    res.status(204).send({ message: "Order deleted successfully" }); // No content response
  } catch (error) {
    next(error);
  }
});

// Shopping cart endpoints:
const shoppingCarts = {};
// GET /api/users/:id/cart - returns the shopping cart for a specific user
app.get("/api/users/:id/cart", async (req, res, next) => {
  try {
    const { id } = req.params;
    const cart = shoppingCarts[id] || [];
    res.status(200).send(cart);
  } catch (error) {
    next(error);
  }
});
// POST /api/users/:id/cart/add - adds a product to the shopping cart for a specific user
app.post("/api/users/:id/cart/add", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { productId, quantity } = req.body;

    const product = products.find((p) => p.id === productId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    const cartItem = { productId, quantity };
    if (!shoppingCarts[id]) {
      shoppingCarts[id] = [cartItem];
    } else {
      shoppingCarts[id].push(cartItem);
    }

    console.log(
      `Added product ${productId} to the shopping cart for user ${id}`
    );
    res
      .status(200)
      .send({ message: "Product added to cart successfully", cartItem });
  } catch (error) {
    next(error);
  }
});
// PUT /api/users/:id/cart/update/:productId - updates a product in the shopping cart for a specific user
app.put("/api/users/:id/cart/update/:productId", async (req, res, next) => {
  try {
    const { id, productId } = req.params;
    const { quantity } = req.body;

    if (!shoppingCarts[id]) {
      return res
        .status(404)
        .send({ message: "Shopping cart not found for the user" });
    }

    const cartItem = shoppingCarts[id].find(
      (item) => item.productId === productId
    );

    if (!cartItem) {
      return res
        .status(404)
        .send({ message: "Product not found in the shopping cart" });
    }

    cartItem.quantity = quantity;

    console.log(
      `Updated quantity of product ${productId} in the shopping cart for user ${id}`
    );
    res
      .status(200)
      .send({ message: "Product quantity updated successfully", cartItem });
  } catch (error) {
    next(error);
  }
});
// DELETE /api/users/:id/cart/remove/:productId - removes a product from the shopping cart for a specific user
app.delete("/api/users/:id/cart/remove/:productId", async (req, res, next) => {
  try {
    const { id, productId } = req.params;

    if (!shoppingCarts[id]) {
      return res
        .status(404)
        .send({ message: "Shopping cart not found for the user" });
    }

    shoppingCarts[id] = shoppingCarts[id].filter(
      (item) => item.productId !== productId
    );

    console.log(
      `Removed product ${productId} from the shopping cart for user ${id}`
    );
    res.status(204).send({ message: "Product removed from cart successfully" });
  } catch (error) {
    next(error);
  }
});

// Middleware to check for admin users
const isAdmin = (req, res, next) => {
  const { adminId } = req.body; // Assuming adminId is passed in the request body
  const admin = adminUsers.find((user) => user.id === adminId);

  if (!admin) {
    return res.status(403).send({ message: "Access denied. Admins only." });
  }
  next();
};

// Reviews Endpoints:
const reviews = []; // In-memory array to store reviews for testing purposes

// POST /api/reviews - creates a review
app.post("/api/reviews", async (req, res, next) => {
  try {
    const { product_id, user_id, rating, comment } = req.body;
    const newReview = {
      id: uuidv4(),
      product_id,
      user_id,
      rating,
      comment,
      created_at: new Date(),
    };

    reviews.push(newReview);
    res
      .status(201)
      .send({ message: "Review created successfully", review: newReview });
  } catch (error) {
    next(error);
  }
});
// GET /api/reviews - returns array of reviews
app.get("/api/reviews", async (req, res, next) => {
  res.status(200).send(reviews);
});
// PUT /api/reviews/:reviewId - updates a review by ID
app.put("/api/reviews/:reviewId", async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = reviews.find((r) => r.id === reviewId);
    if (!review) {
      return res.status(404).send({ message: "Review not found" });
    }

    review.rating = rating !== undefined ? rating : review.rating;
    review.comment = comment !== undefined ? comment : review.comment;
    review.updated_at = new Date();

    res.status(200).send({ message: "Review updated successfully", review });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/reviews/:reviewId - deletes a review by ID (admin only)
app.delete("/api/reviews/:reviewId", isAdmin, async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const reviewIndex = reviews.findIndex((r) => r.id === reviewId);
    if (reviewIndex === -1) {
      return res.status(404).send({ message: "Review not found" });
    }

    reviews.splice(reviewIndex, 1);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// X -- Error handling middleware  -- X //
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send({ message: error.message });
});

const init = async () => {
  try {
    console.log("connecting to database");
    await client.connect();

    console.log("connected to database");
    console.log("creating tables");

    // add functions below

    // create tables

    // create categories

    // create users

    // create admin user and assign role

    // create products
  } catch (error) {
    console.error(error);
  }
  // PORT
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`It's alive on http://localhost:${port}`);
  });
};

init();
