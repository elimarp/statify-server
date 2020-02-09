import mongoose from 'mongoose';
import axios from 'axios';
import 'dotenv/config';
import Artist from '../app/models/Artist';
import consts from '../utils/consts';
import AccessToken from '../config/spotifyAuth/AccessToken';

class MongoDB {
    async connect() {
        return await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_CLUSTER}.mongodb.net/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`, {
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
            const artistsAmount = await Artist.countDocuments();
            let artists = []; // Will store artists who will be updated

            for (let offset = 0; offset < artistsAmount; offset += 50) {

                // Creating csv list of artists Spotify IDs
                const dbArtists = await Artist.find({}, { _id: false, spotifyId: true }).skip(offset).limit(50);
                let ids = '';
                for (const { spotifyId } of dbArtists) {
                    ids += spotifyId + ',';
                }
                // Removing last ","
                ids = ids.substr(0, ids.length - 1);

                if (ids !== '') {
                    try {
                        const response = await axios({
                            method: 'GET',
                            url: `${consts.SPOTIFY_BASE_URL}/artists?ids=${ids}`,
                            headers: { 'Authorization': AccessToken.getFullToken() },
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
                    const response = await Artist.updateOne({ spotifyId: artist.spotifyId }, artist);
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

        await migrateData();
        setInterval(() => {
            migrateData();
        }, INTERVAL);
    }
}

export default new MongoDB();