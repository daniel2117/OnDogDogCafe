const Reservation = require("../models/Reservation");

exports.createReservation = async (req, res) => {
  try {
    const newReservation = await Reservation.create({ ...req.body, user: req.user.userId });
    res.status(201).json(newReservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.userId });
    res.json(reservations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
