const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// Load environment variables from .env file
require('dotenv').config();

// Set EJS as the view engine and public as the directory for your views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

app.use(express.static('public'));

app.get('/', (req, res) => { // Changed from '/public' to '/'
    res.render('index', { GOOGLE_API_KEY: process.env.GOOGLE_API_KEY });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

//Load Shopify API for Customer Table
app.use(bodyParser.json());

const SHOPIFY_API_KEY = "97562adb3fea4b0ddd1b0026682cf950";
const SHOPIFY_PASSWORD = "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";
const SHOPIFY_STORE_URL = 'https://leaf-home-aerovita.myshopify.com';

app.post('/submitForm', async (req, res) => {
    console.log('Received data:', req.body);  // Log incoming data to the console
    const { first_name, last_name, email } = req.body;
    const customerData = {
        customer: {
            first_name: first_name,
            last_name: last_name,
            email: email,
            verified_email: false
        }
    };

    try {
        const response = await axios.post(`${SHOPIFY_STORE_URL}/admin/api/2023-07/customers.json`, customerData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(SHOPIFY_API_KEY + ':' + SHOPIFY_PASSWORD).toString('base64')}`
            }
        });

        console.log('Shopify response:', response.data);  // Log the response data from Shopify

        if (response.status === 201) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    } catch (error) {
        console.error('Error occurred:', error.message);  // Log the error to console
        res.status(500).send(error.message);  // Send the error message as response
    }
});
