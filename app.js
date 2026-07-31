/* eslint-disable */
const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Security HTTP headers
const scriptSrcUrls = [
  'https://cdn.jsdelivr.net',
  'https://api.mapbox.com',
  'https://api.tiles.mapbox.com',
  'https://checkout.razorpay.com', // 👈 Added for Razorpay Checkout JS
  'https://cdn.razorpay.com',
];

const styleSrcUrls = [
  'https://fonts.googleapis.com',
  'https://api.mapbox.com',
  'https://api.tiles.mapbox.com',
];

const fontSrcUrls = [
  'https://fonts.gstatic.com',
  'https://api.mapbox.com',
  'https://api.tiles.mapbox.com',
];

const connectSrcUrls = [
  'https://api.mapbox.com',
  'https://events.mapbox.com',
  'https://*.tiles.mapbox.com',
  'https://api.razorpay.com', // 👈 Added for Razorpay API calls
  'https://cdn.razorpay.com',
  'https://lumberjack.razorpay.com',
  'ws://127.0.0.1:*', // 👈 Whitelists dev server WebSocket
  'ws://localhost:*',
];

const frameSrcUrls = [
  'https://checkout.razorpay.com', // 👈 Added for Razorpay Checkout iFrame popup
  'https://api.razorpay.com',
];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", ...fontSrcUrls, 'data:'],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      scriptSrcElem: ["'self'", ...scriptSrcUrls], // 👈 Handles script element checks
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      connectSrc: ["'self'", ...connectSrcUrls],
      frameSrc: ["'self'", ...frameSrcUrls], // 👈 Allows rendering Razorpay modal
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  }),
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'difficulty',
      'maxGroupSize',
      'ratingsQuantity',
      'price',
    ],
  }),
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
