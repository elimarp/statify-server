import 'dotenv/config';
import request from 'request-promise';
import AccessToken from './AccessToken';

async function spotifyAuth() {
    // TODO: Try x times before fail.
    try {
        const { token_type, access_token, expires_in } = await request({
            uri: 'https://accounts.spotify.com/api/token',
            method: 'POST',
            headers: { 'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')) },
            form: { grant_type: 'client_credentials' },
            json: true,
        });

        AccessToken.set({
            type: token_type,
            value: access_token,
            lifetime: expires_in,
        });

        tokenLifeKeeper();

        console.log(AccessToken.get());
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

// recycle token before expiring
async function tokenLifeKeeper() {
    setInterval(async () => {
        await spotifyAuth();
    }, AccessToken.getLifetime() * 1000 - 300000); // Setting timeout 5min advanced to token expiration
}

export default spotifyAuth;