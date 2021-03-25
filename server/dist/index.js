"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var server_1 = require("./server");
var app = new server_1.AppServer().getApp();
exports.app = app;
