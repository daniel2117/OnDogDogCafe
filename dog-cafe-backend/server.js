const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const reservationRoutes = require("./routes/reservationRoutes");

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
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Exit process if connection fails
    }
};

// Call Database Connection
connectDB();

// API Routes
app.use("/api/reservations", reservationRoutes);

// Root Route (Optional for testing if server is running)
app.get("/", (req, res) => {
    res.send("Dog Café Reservation Backend is Running!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
