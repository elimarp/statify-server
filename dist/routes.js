"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _ArtistController = require('./app/controllers/ArtistController'); var _ArtistController2 = _interopRequireDefault(_ArtistController);

const routes = new (0, _express.Router)();

routes.route('/artists').get(_ArtistController2.default.selectAll);
routes.route('/artists/:id').get(_ArtistController2.default.select);

exports. default = routes;
