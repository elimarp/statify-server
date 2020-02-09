"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }require('dotenv/config');
var _requestpromise = require('request-promise'); var _requestpromise2 = _interopRequireDefault(_requestpromise);
var _AccessToken = require('./AccessToken'); var _AccessToken2 = _interopRequireDefault(_AccessToken);

async function spotifyAuth() {
    // TODO: Try x times before fail.
    try {
        const { token_type, access_token, expires_in } = await _requestpromise2.default.call(void 0, {
            uri: 'https://accounts.spotify.com/api/token',
            method: 'POST',
            headers: { 'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')) },
            form: { grant_type: 'client_credentials' },
            json: true,
        });

        _AccessToken2.default.set({
            type: token_type,
            value: access_token,
            lifetime: expires_in,
        });

        tokenLifeKeeper();

        console.log(_AccessToken2.default.get());
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

// recycle token before expiring
async function tokenLifeKeeper() {
    setInterval(async () => {
        await spotifyAuth();
    }, _AccessToken2.default.getLifetime() * 1000 - 300000); // Setting timeout 5min advanced to token expiration
}

exports. default = spotifyAuth;