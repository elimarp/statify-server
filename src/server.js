import app from './app';
import 'dotenv/config';

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => { console.log(`Listening on ${PORT}`) });
