/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */

const Razorpay = require('razorpay');
const crypto = require('crypto');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Email = require('../utils/email');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create Razorpay Order
  const order = await razorpay.orders.create({
    amount: Math.round(tour.price * 100),
    currency: 'INR',
    receipt: `tour_${tour.id}`,
    notes: {
      tourId: tour.id,
      userId: req.user.id,
    },
  });

  // 3) Send order to frontend
  res.status(200).json({
    status: 'success',
    key: process.env.RAZORPAY_KEY_ID,
    session: order,
    tour,
    user: {
      name: req.user.name,
      email: req.user.email,
    },
  });
});

// Verify payment & create booking
exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, tourId } =
    req.body;

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    return next(new AppError('Payment verification failed.', 400));
  }

  // Find tour
  const tour = await Tour.findById(tourId);

  if (!tour) {
    return next(new AppError('No tour found with that ID.', 404));
  }

  // Prevent duplicate bookings
  const existingBooking = await Booking.findOne({
    tour: tour._id,
    user: req.user._id,
  });

  if (existingBooking) {
    return res.status(200).json({
      status: 'success',
      booking: existingBooking,
    });
  }

  // Create booking
  const booking = await Booking.create({
    tour: tour._id,
    user: req.user._id,
    price: tour.price,
    paid: true,
  });

  const user = await User.findById(req.user.id);

  // await new Email(
  //   user,
  //   `${req.protocol}://${req.get('host')}/my-tours`,
  // ).sendBookingConfirmation(tour);

  res.status(201).json({
    status: 'success',
    booking,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => next());

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
