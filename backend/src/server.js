"use strict";
exports.__esModule = true;
var express = require("express");
var path = require("path");
var index_1 = require("./routes/index");
var cors = require("cors");
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
var __dirname = path.resolve();
app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html'));
});
app.use(express.static(path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html')));
app.use(index_1.routes);
app.use(function (err, req, res, next) {
    res.status(500).send({ message: err.message });
});
var PORT = process.env.PORT || 3333;
app.listen(PORT, function () { return console.log("Server rodando na porta ".concat(PORT)); });
