const express = require('express');
const app = express();
const connection = require(../configs/ConnectDB');
const initRoute = require(../routes/index');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {limit} = require(../middlewares/rateLimit')
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());

app.use(limit);

connection();

initRoute(app);

app.listen(process.env.PORT || 8080, () => {
    console.log('Server running on port', process.env.PORT || 8080);
})