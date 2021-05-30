// ./app.js

// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
var dateFormat = require("dateformat");

//const { startSqlDatabase } = require('./database/mysql');
require('dotenv').config({ path: './.env' });

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// START ENDPOINTS
// ADD / RETURN Quote
const verifCode = process.env.VERIFICATION_CODE;

app.get('/domain-hook', (req, res) => {
    let reqVerifCode = req.query.verification;
    if (verifCode == reqVerifCode) {
        fs.appendFileSync('output.txt',
            "Valid verification code " + reqVerifCode + '\n',
            function (err) {
                if (err) console.log(err);
            });
        res.status(204).end();
    } else {
        fs.appendFileSync('output.txt',
            "Incorrect verification code provided " + reqVerifCode + '\n',
            function (err) {
                if (err) console.log(err);
            });
        res.status(404).end();
    }
});

app.post('/domain-hook', async (req, res) => {
    var now = new Date();

    fs.appendFileSync('output.txt',
        "Domain hook endpoint hit at " +
        dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT") + '\n',
        function (err) {
            if (err) console.log(err);
            console.log("Domain hook endpoint hit");
        });

    fs.appendFileSync('output.txt', JSON.stringify(req.body) + '\n',
        function (err) {
            if (err) console.log(err);
            console.log(req.body);
        });

    res.status(204).end();
});
// END ENDPOINTS

// Start SQL server
const port = process.env.PORT;

app.listen(port, async () => {
    console.log(`listening on port ${port}`);
});