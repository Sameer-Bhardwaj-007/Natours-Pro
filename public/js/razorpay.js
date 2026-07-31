/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    // 1) Get Razorpay Order
    const { data } = await axios.get(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    );

    const order = data.session;

    // 2) Configure Razorpay
    const options = {
      key: data.key,

      amount: order.amount,

      currency: order.currency,

      name: 'Natours',

      description: `${data.tour.name} Tour`,

      image: '/img/logo-green-round.png',

      order_id: order.id,

      prefill: {
        name: data.user.name,
        email: data.user.email,
      },

      theme: {
        color: '#55c57a',
      },

      modal: {
        ondismiss() {
          showAlert('error', 'Payment cancelled.');
        },
      },

      handler: async function (response) {
        try {
          const verifyRes = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/bookings/verify-payment',
            data: {
              tourId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            },
          });

          if (verifyRes.data.status === 'success') {
            showAlert('success', 'Booking successful!');

            window.setTimeout(() => {
              location.assign('/my-tours');
            }, 1500);
          }
        } catch (err) {
          showAlert(
            'error',
            err.response?.data?.message || 'Payment verification failed.',
          );
        }
      },
    };

    const razorpay = new Razorpay(options);

    razorpay.on('payment.failed', function (response) {
      showAlert('error', response.error.description || 'Payment failed.');
    });

    razorpay.open();
  } catch (err) {
    showAlert(
      'error',
      err.response?.data?.message || 'Unable to initiate payment.',
    );
  }
};
