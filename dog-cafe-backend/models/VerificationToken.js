const mongoose = require("mongoose");

const VerificationTokenSchema = new mongoose.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    reservationData: { type: Object, required: true },
    expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model("VerificationToken", VerificationTokenSchema);
