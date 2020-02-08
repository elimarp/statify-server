import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes';
import authentication from './config/spotifyAuth';
import mongodb from './database/mongodb';

class App {
    constructor() {
        this.server = express();
        this.init();
    }

    async init() {
        try {
            await authentication();
            await mongodb.connect();
            await mongodb.keepDatabaseUpdated();
            this.middlewares();
            this.routes();
        } catch (error) {
            console.error(error, '\n Server failed to init.');
        }
    }

    middlewares() {
        this.server.use(express.json());
        this.server.use(cors({ origin: process.env.ORIGIN }));
        this.server.use(bodyParser.urlencoded({ extended: true }));
    }

    routes() {
        this.server.use(routes);
        console.log('Routes is on!');
    }
}

export default new App().server;