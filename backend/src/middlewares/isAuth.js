"use strict";
exports.__esModule = true;
exports.isAuth = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var isAuth = function (req, res, next) {
    var authorization = req.headers.authorization;
    if (authorization) {
        var token = authorization.slice(7, authorization.length);
        (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET, function (err, decode) {
            if (err) {
                res.status(401).send({ message: 'Invalid Token' });
            }
            else {
                req.user = decode;
                next();
            }
        });
    }
    else {
        res.status(401).send({ message: 'No Token' });
    }
};
exports.isAuth = isAuth;
