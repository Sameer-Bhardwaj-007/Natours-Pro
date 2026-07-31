/* eslint-disable prettier/prettier */
const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

// Create Razorpay Order
router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

// Verify payment and create booking
router.post('/verify-payment', bookingController.verifyPayment);

// Admin routes
router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
