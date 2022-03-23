"use strict";
exports.__esModule = true;
exports.generateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var generateToken = function (_a) {
    var id = _a.id, name = _a.name, email = _a.email, isAdmin = _a.isAdmin;
    return (0, jsonwebtoken_1.sign)({
        id: id,
        name: name,
        email: email,
        isAdmin: isAdmin
    }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};
exports.generateToken = generateToken;
