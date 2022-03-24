"use strict";
exports.__esModule = true;
var express = require("express");
var index_1 = require("./routes/index");
var cors = require("cors");
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(index_1.routes);
app.use(function (err, req, res, next) {
    res.status(500).send({ message: err.message });
});
var PORT = process.env.PORT || 3333;
app.listen(PORT, function () { return console.log("Server rodando na porta ".concat(PORT)); });
