"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);
require('dotenv/config');
var _Artist = require('../app/models/Artist'); var _Artist2 = _interopRequireDefault(_Artist);
var _consts = require('../utils/consts'); var _consts2 = _interopRequireDefault(_consts);
var _AccessToken = require('../config/spotifyAuth/AccessToken'); var _AccessToken2 = _interopRequireDefault(_AccessToken);

class MongoDB {
    async connect() {
        return await _mongoose2.default.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_CLUSTER}.mongodb.net/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }, (err) => {
            if (err) throw new Error(err);
            console.log('MongoDB connection has been established successfully.');
            return true;
        });
    }

    async keepDatabaseUpdated() {
        async function migrateData() {
            const artistsAmount = await _Artist2.default.countDocuments();
            let artists = []; // Will store artists who will be updated

            for (let offset = 0; offset < artistsAmount; offset += 50) {

                // Creating csv list of artists Spotify IDs
                const dbArtists = await _Artist2.default.find({}, { _id: false, spotifyId: true }).skip(offset).limit(50);
                let ids = '';
                for (const { spotifyId } of dbArtists) {
                    ids += spotifyId + ',';
                }
                // Removing last ","
                ids = ids.substr(0, ids.length - 1);

                if (ids !== '') {
                    try {
                        const response = await _axios2.default.call(void 0, {
                            method: 'GET',
                            url: `${_consts2.default.SPOTIFY_BASE_URL}/artists?ids=${ids}`,
                            headers: { 'Authorization': _AccessToken2.default.getFullToken() },
                        });

                        for (const { id: spotifyId, name, popularity, followers: { total: followers }, genres, images } of response.data.artists) {
                            artists.push({ spotifyId, name, popularity, followers, genres, images });
                        }

                        console.log(`Requesting artists: ${offset}/${artistsAmount} done`);
                    } catch (error) {
                        throw new Error(error);
                    }
                }
            }

            try {
                for (const artist of artists) {
                    const response = await _Artist2.default.updateOne({ spotifyId: artist.spotifyId }, artist);
                    // TODO: Log file instead
                    if (response.ok !== 1) throw new Error(`${artist.name} ${artist.spotifyId} not updated.`)
                    console.log(artist.spotifyId, artist.name, 'updated!');
                }
            } catch (error) {
                // TODO: Log file instead
                throw new Error(error);
            }

            return true;
        }

        const INTERVAL = 86400000 - 300000; //24h - 5m

        // await migrateData();
        setInterval(() => {
            migrateData();
        }, INTERVAL);
    }
}

exports. default = new MongoDB();