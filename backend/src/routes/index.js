"use strict";
exports.__esModule = true;
exports.routes = void 0;
var express = require("express");
var path = require("path");
var productsRoutes_1 = require("./productsRoutes");
var usersRoutes_1 = require("./usersRoutes");
var seedRoutes_1 = require("./seedRoutes");
var ordersRoutes_1 = require("./ordersRoutes");
var paypalRoutes_1 = require("./paymentsRoutes/paypalRoutes");
var routes = express.Router();
exports.routes = routes;
routes.use('/api', paypalRoutes_1.paypalRouter);
routes.use('/api/products', productsRoutes_1.productsRouter);
routes.use('/api/users', usersRoutes_1.usersRouter);
routes.use('/api/seed', seedRoutes_1.seedRouter);
routes.use('/api/orders', ordersRoutes_1.ordersRouter);
var __dirname = path.resolve();
routes.use(express.static(path.join(__dirname, '/frontend/dist')));
routes.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});
