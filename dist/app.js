"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _bodyparser = require('body-parser'); var _bodyparser2 = _interopRequireDefault(_bodyparser);
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
require('dotenv/config');
var _routes = require('./routes'); var _routes2 = _interopRequireDefault(_routes);
var _spotifyAuth = require('./config/spotifyAuth'); var _spotifyAuth2 = _interopRequireDefault(_spotifyAuth);
var _mongodb = require('./database/mongodb'); var _mongodb2 = _interopRequireDefault(_mongodb);

class App {
    constructor() {
        this.server = _express2.default.call(void 0, );
        this.init();
    }

    async init() {
        try {
            await _spotifyAuth2.default.call(void 0, );
            await _mongodb2.default.connect();
            await _mongodb2.default.keepDatabaseUpdated();
            this.middlewares();
            this.routes();
        } catch (error) {
            console.error(error, '\n Server failed to init.');
        }
    }

    middlewares() {
        this.server.use(_express2.default.json());
        this.server.use(_cors2.default.call(void 0, ));
        this.server.use(_bodyparser2.default.urlencoded({ extended: true }));
    }

    routes() {
        this.server.use(_routes2.default);
        console.log('Routes is on!');
    }
}

exports. default = new App().server;