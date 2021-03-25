"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticRoutes = void 0;
var express = require("express");
var path = require("path");
var StaticRoutes = /** @class */ (function () {
    function StaticRoutes() {
    }
    StaticRoutes.set = function (app) {
        app.use('/', express.static(path.join(__dirname, '../../../client/dist/')));
    };
    return StaticRoutes;
}());
exports.StaticRoutes = StaticRoutes;
