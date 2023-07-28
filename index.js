const express = require('express');
const env = require('dotenv');
const app = express();
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
app.use(cors());

env.config('./.env');
app.use(express.json());




app.get('/', (req, res) => {
    res.send('Server is up and running.Please send POST request with userHandle to /leetcode');
});

app.post('/leetcode',cors(),async (req, res) => {
    try {
        const userHandle = req.body.userHandle;
        if (!userHandle) {
            return res.send(error(400, "User Handle is required"));
        }

        const url = `https://leetcode.com/${userHandle}`;
        const html = await axios.get(url);
        const $ = await cheerio.load(html.data);
        const details = $('.rating-contest-graph').prev().first().first().text().toString();
        let rating = details.slice(14, 19);
        rating = rating.replace(",", "");

        const data = {
            "userHandle": userHandle,
            "rating": rating,
        }

        return res.send({
            "statusCode": 200,
            "status": "OK",
            "message": "Success",
            "data": data
        });
    } catch (e) {
        return res.send({
            "statusCode": 500,
            "status": "Error",
            "message": "Internal Server Error",
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

