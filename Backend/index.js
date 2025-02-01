require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const connectDB = require("./config/db");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middleware
app.use(express.json());

// Connect to Database


connectDB();

// Routes
app.use("/api", routes);

// Error Handling Middleware
app.use(errorHandler);
// console.log(process.env)
// Start Server
const PORT = process.env.PORT || 4949;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
