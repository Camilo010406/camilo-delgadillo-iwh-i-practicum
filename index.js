const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
// Homepage
app.get('/', (req, res) => {
    res.render('homepage', { title: 'Home Page.' });
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
// * Shows the form
app.get('/update-cobj', (req, res) => {
    res.render('updates', { 
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum.' 
    });
});
// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

// Process form submission
app.post('/update-cobj', async (req, res) => {

    // console.log("BODY:", req.body);
    // console.log("NAME:", req.body.name);


    const body = {
        associations: [
            {
                to: { id: "177531363999" },
                types: [
                    {
                        associationCategory: "USER_DEFINED",
                        associationTypeId: 17
                    }
                ]
            }
        ],
        properties: {
            name: req.body.name,
            type_of_game: req.body.type_of_game,
            gaming_platforms: req.body.gaming_platforms,
            is_it_cross_platforms_: req.body.is_it_cross_platforms_,
            hubspot_owner_id: "68530121"
        },
        labels: {}
    };

    const url = "https://api.hubapi.com/crm/v3/objects/2-53428859";

    try {
        const response = await axios.post(url, body, {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                "Content-Type": "application/json"
            }
        });
        console.log("RESPONSE HS:", response.data);

    } catch (err) {
        console.error("ERROR:", err.response?.data || err.message);
    }

    res.redirect('/');
});


// Start server
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
