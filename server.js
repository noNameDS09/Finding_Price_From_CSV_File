const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/get-price', (req, res) => {
    const state = req.body.state.trim();
    const monthYear = req.body.monthYear.trim();
    let foundPrice;

    fs.createReadStream('data.csv')
        .pipe(csvParser())
        .on('data', (row) => {

            // Check if the first column (state) matches the user input
            if (row[''] === state) {
                // Look for the price in the corresponding month-year column
                foundPrice = row[monthYear];
            }
        })
        .on('end', () => {
            if (foundPrice !== undefined) {
                res.send(`The price of the crop in ${state} for ${monthYear} is: ${foundPrice}`);
            } else {
                res.send(`No data found for ${state} in ${monthYear}`);
            }
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
