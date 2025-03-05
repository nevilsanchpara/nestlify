require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const connectDB = require("./config/db");
const routes = require("./routes");
const swaggerDocs = require("./utils/swagger");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const path = require("path");
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(express.json());
app.use(cors());

// Connect to Database

connectDB();
swaggerDocs(app);

// Routes
app.use("/api", routes);

// Error Handling Middleware
app.use(errorHandler);
// console.log(process.env)
// Start Server
const PORT = process.env.PORT || 4949;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
