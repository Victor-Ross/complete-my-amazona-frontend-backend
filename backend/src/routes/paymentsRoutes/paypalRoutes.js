"use strict";
exports.__esModule = true;
exports.paypalRouter = void 0;
var express = require("express");
var paypalRouter = express.Router();
exports.paypalRouter = paypalRouter;
paypalRouter.get('/keys/paypal', function (req, res) {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
