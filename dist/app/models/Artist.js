"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _mongoose = require('mongoose');

const Artist = new (0, _mongoose.Schema)({
    spotifyId: String,
    name: String,
    popularity: Number,
    followers: Number,
    genres: Array,
    images: Array,

})

exports. default = _mongoose.model.call(void 0, 'Artist', Artist);