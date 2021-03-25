"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppServer = void 0;
var http_1 = require("http");
var express = require("express");
var socketIo = require("socket.io");
var bodyParser = require("body-parser");
var static_1 = require("./routes/static");
var goto_1 = require("./routes/goto");
//import { Message } from './model';
var AppServer = /** @class */ (function () {
    function AppServer() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }
    AppServer.prototype.createApp = function () {
        this.app = express();
        this.router = express.Router();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    };
    AppServer.prototype.createServer = function () {
        this.server = http_1.createServer(this.app);
    };
    AppServer.prototype.config = function () {
        this.port = process.env.PORT || AppServer.PORT;
    };
    AppServer.prototype.sockets = function () {
        this.io = socketIo(this.server);
    };
    AppServer.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log('Running server on port %s', _this.port);
            //this.app.use('/', express.static(path.join(__dirname, '../../client/dist/')));
            static_1.StaticRoutes.set(_this.app);
            goto_1.GoToRoutes.set(_this.app);
        });
        this.io.on('connect', function (socket) {
            console.log('Connected client on port %s.', _this.port);
            socket.on('message', function (m) {
                console.log('[server](message): %s', JSON.stringify(m));
                _this.io.emit('message', m);
            });
            socket.on('disconnect', function () {
                console.log('Client disconnected');
            });
        });
    };
    AppServer.prototype.getApp = function () {
        return this.app;
    };
    AppServer.PORT = 8080;
    return AppServer;
}());
exports.AppServer = AppServer;
