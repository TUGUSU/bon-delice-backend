const express = require('express');
const router = express.Router();

const {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  cancelReservation,
} = require('../controllers/reservationController');

router.get('/', getReservations);
router.get('/:id', getReservationById);
router.post('/', createReservation);
router.put('/:id', updateReservation);
router.delete('/:id', cancelReservation);

module.exports = router;
