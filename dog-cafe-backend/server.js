require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.listen(5000, () => console.log("Server running on port 5000"));
