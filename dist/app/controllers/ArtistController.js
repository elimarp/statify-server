"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Artist = require('../models/Artist'); var _Artist2 = _interopRequireDefault(_Artist);
var _consts = require('../../utils/consts'); var _consts2 = _interopRequireDefault(_consts);

class ArtistController {

    async select(req, res) {
        const { id: spotifyId } = req.params;
        if (spotifyId.length !== 22) return res.status(400).json({ success: false, message: 'Invalid Artist Spotify ID.' });

        try {
            const artist = await _Artist2.default.findOne({ spotifyId }, {
                _id: false,
                __v: false,
            });
            return res.json({ artist });
        } catch (error) {
            console.error(error);
            return res.status(500).json(_consts2.default.STANDARD_RESPONSES.INTERNAL_ERROR);
        }
    }

    async selectAll(req, res) {
        const { sort, limit, genres } = req.query;

        const conditions = {};
        const options = { limit: 50, sort: {} };

        const sorters = sort ? sort.split(',') : [];
        for (const sorter of sorters) {
            if (sorter === 'popularity') options.sort.popularity = -1;
            if (sorter === 'followers') options.sort.followers = -1;
        }
        // Setting default sort
        if (Object.entries(options.sort).length === 0) options.sort = { popularity: -1, followers: -1 };

        if (!isNaN(limit)) options.limit = parseInt(limit);

        if (genres) {
            const genreList = genres.split(',');
            if (genreList.length > 0) conditions.genres = { $in: genreList };
        }

        try {
            const artists = await _Artist2.default.find(
                conditions,
                { _id: false, __v: false },
                options
            );

            return res.json({ artists });
        } catch (error) {
            console.error(error);
            return res.status(500).json(_consts2.default.STANDARD_RESPONSES.INTERNAL_ERROR);
        }
    }
}

exports. default = new ArtistController();