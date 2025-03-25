const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const reservationRoutes = require("./routes/reservationRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(" MongoDB Connected Successfully");

        // Handle connection errors after initial connection
        mongoose.connection.on("error", (err) => {
            console.error(" MongoDB Connection Error:", err);
        });

    } catch (err) {
        console.error(" Initial MongoDB Connection Error:", err);
        process.exit(1); // Exit process if connection fails
    }
};

// Call Database Connection
connectDB();

// API Routes
app.use("/api/reservations", reservationRoutes);
app.use("/api/adoption", adoptionRoutes);

// Root Route (Optional for testing if server is running)
app.get("/", (req, res) => {
    res.send(" Dog Cafe Reservation & Adoption Backend is Running!");
});

// Graceful shutdown on process termination
process.on("SIGINT", async () => {
    console.log(" Shutting down server...");
    await mongoose.connection.close();
    process.exit(0);
});

// Prevent crashes from unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error(" Unhandled Rejection:", err);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
