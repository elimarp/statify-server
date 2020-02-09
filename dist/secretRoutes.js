"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _ArtistController = require('./app/controllers/ArtistController'); var _ArtistController2 = _interopRequireDefault(_ArtistController);
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);
var _AccessToken = require('./config/spotifyAuth/AccessToken'); var _AccessToken2 = _interopRequireDefault(_AccessToken);
var _consts = require('./utils/consts'); var _consts2 = _interopRequireDefault(_consts);
var _Artist = require('./app/models/Artist'); var _Artist2 = _interopRequireDefault(_Artist);

const routes = new (0, _express.Router)();

// TODO: Protect this route;
// TODO: Secret routes;
routes.route('/store/artists/').get(async (req, res) => {

    const searchs = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const indexesAndIds = [];
    const indexesAndArtists = [];
    let itemCounter = 0;

    for (const search of searchs) {
        console.log('search', search);
        let offset = 0;

        for (let i = 0; i < 2; i++) {
            console.log('offset', offset)
            // for (artist of artists){
            //     console.log('artist', artist);
            //     result.push(artist);
            // }
            try {
                const response = await _axios2.default.call(void 0, {
                    method: 'GET',
                    url: `${_consts2.default.SPOTIFY_BASE_URL}/search?q=${search}&type=artist&offset=${offset}&limit=50`,
                    headers: { 'Authorization': _AccessToken2.default.getFullToken() },
                });

                // return res.json(response.data);
                // return res.json({ items: response.data.artists.items })
                // limiter = response.data.artists.total;

                for (const item of response.data.artists.items) {
                    const { id: spotifyId, name, popularity, followers: { total: followers }, genres, images } = item;

                    indexesAndIds.push([itemCounter, spotifyId]);

                    indexesAndArtists.push([itemCounter, {
                        spotifyId,
                        name,
                        popularity,
                        followers,
                        genres,
                        images,
                    }]);

                    console.log(itemCounter, name, popularity, spotifyId);
                    itemCounter++;
                }
            } catch (error) {
                console.log(error, '\n Error while doing search.');
                return res.json({ succcess: false });
            }

            offset += 50;
        }
    }

    const uniqueIds = [];
    const uniqueIterations = [];

    for (const item of indexesAndIds) {
        if (!uniqueIds.includes(item[1])) {
            uniqueIds.push(item[1]);
            uniqueIterations.push(item[0]);
        }
    }

    const uniqueArtists = [];

    for (const i of uniqueIterations) {
        uniqueArtists.push(indexesAndArtists[i][1]);
    }

    // Salvar no banco
    let totalCreated = 0;
    for (const item of uniqueArtists) {
        try {
            if ((await _Artist2.default.findOne({ spotifyId: item.spotifyId }) === null)) {
                const artist = await _Artist2.default.create(item);
                totalCreated++;
                console.log(totalCreated, artist.name);
            }
            // TODO: else update
        } catch (error) {
            console.log(error, '\n Find or Create error.');
            return res.status(500).json({ succcess: false });
        }
    }

    return res.json({ success: true, totalFound: itemCounter, totalCreated });

});

exports. default = routes;
