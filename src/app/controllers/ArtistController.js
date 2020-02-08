import Artist from '../models/Artist';
import CONSTS from '../../utils/consts';

class ArtistController {

    async select(req, res) {
        const { id: spotifyId } = req.params;
        if (spotifyId.length !== 22) return res.status(400).json({ success: false, message: 'Invalid Artist Spotify ID.' });

        try {
            const artist = await Artist.findOne({ spotifyId }, {
                _id: false,
                __v: false,
            });
            return res.json({ artist });
        } catch (error) {
            console.error(error);
            return res.status(500).json(CONSTS.STANDARD_RESPONSES.INTERNAL_ERROR);
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
            const artists = await Artist.find(
                conditions,
                { _id: false, __v: false },
                options
            );

            return res.json({ artists });
        } catch (error) {
            console.error(error);
            return res.status(500).json(CONSTS.STANDARD_RESPONSES.INTERNAL_ERROR);
        }
    }
}

export default new ArtistController();