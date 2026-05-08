const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    people: { type: Number, required: true, min: 1 },
    note: { type: String, default: '' },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
