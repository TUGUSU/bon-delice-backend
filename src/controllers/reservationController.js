const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');

/**
 * GET /api/reservations
 * Query: page, limit, restaurantId, status
 */
exports.getReservations = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const { restaurantId, status } = req.query;

    const filter = {};
    if (restaurantId) filter.restaurantId = restaurantId;
    if (status) filter.status = status;

    const [data, total] = await Promise.all([
      Reservation.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('restaurantId', 'name image'),
      Reservation.countDocuments(filter),
    ]);

    res.json({ page, limit, total, totalPages: Math.ceil(total / limit), data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/reservations/:id
 */
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate(
      'restaurantId',
      'name image address phone'
    );
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/reservations
 * Body: { restaurantId, name, phone, date, time, people, note }
 */
exports.createReservation = async (req, res) => {
  try {
    const { restaurantId } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const reservation = new Reservation(req.body);
    const saved = await reservation.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/reservations/:id
 * Body: { date, time, people, note, status }
 */
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/reservations/:id  (cancel)
 */
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
