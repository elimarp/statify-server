import { Schema, model } from 'mongoose';

const Artist = new Schema({
    spotifyId: String,
    name: String,
    popularity: Number,
    followers: Number,
    genres: Array,
    images: Array,

})

export default model('Artist', Artist);