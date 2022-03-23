import * as express from 'express';

const paypalRouter = express.Router();

paypalRouter.get('/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

export { paypalRouter };
