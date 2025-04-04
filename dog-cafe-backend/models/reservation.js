const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: String, required: true, enum: ["Tourist Area", "Dog Play Area", "Pet Grooming", "Indoor Dog Pool", "Dog Hotel"] },
  date: { type: String, required: true }, // YYYY-MM-DD format
  time: { type: String, required: true }, // HH:mm format
  visitors: { type: Number, required: true },
  dogs: { type: Number, default: 0 },
  status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" },
});

module.exports = mongoose.model("Reservation", ReservationSchema);
