const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const route = require('./routes');
const cookieParser = require('cookie-parser');

const port = 5000;

dotenv.config();
app.use('/uploads', express.static('src/uploads'));
app.use(cors());
app.set('view engine', 'ejs');
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

route(app);

const db = require('./config/db');
db.connectToMongoDB();

app.listen(port, () => {
    console.log(`Example app listening at  http://localhost:${port}`);
});
