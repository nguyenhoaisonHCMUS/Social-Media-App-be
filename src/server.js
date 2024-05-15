const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const route = require('./routes');
const cookieParser = require('cookie-parser');

dotenv.config();
app.use('/uploads', express.static('src/uploads'));
app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true,
    }),
);
app.set('view engine', 'ejs');
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

route(app);

const db = require('./config/db');
db.connectToMongoDB();

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at  http://localhost:${process.env.PORT}`);
});
