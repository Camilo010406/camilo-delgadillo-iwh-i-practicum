require('dotenv').config();
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

    const { action, objectId, name, type_of_game, gaming_platforms, is_it_cross_platforms_ } = req.body;

    // Validations
    if (!name || name.trim() === "") {
        return res.send("❌ Name is required.");
    }

    if (action === "update" && (!objectId || objectId.trim() === "")) {
        return res.send("❌ objectId is required for updates.");
    }

    // Build properties object
    const properties = { name };

    if (type_of_game) properties.type_of_game = type_of_game;
    if (gaming_platforms) {
    properties.gaming_platforms = gaming_platforms;
    }
    if (is_it_cross_platforms_) properties.is_it_cross_platforms_ = is_it_cross_platforms_;

    let url = `https://api.hubapi.com/crm/v3/objects/2-53428859`;
    let method = "POST";
    let body = { properties };

    // Add asspciations only when creating
    if (action === "create") {
        body.associations = [
            {
                to: { id: "177531363999" },
                types: [
                    {
                        associationCategory: "USER_DEFINED",
                        associationTypeId: 17
                    }
                ]
            }
        ];
    }

    // Si estamos actualizando, usamos PATCH + objectId
    if (action === "update") {
        method = "PATCH";
        url = `https://api.hubapi.com/crm/v3/objects/2-53428859/${objectId}`;
    }

    try {
        const response = await axios({
            method,
            url,
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                "Content-Type": "application/json"
            },
            data: body
        });

        console.log("HUBSPOT RESPONSE:", response.data);

        res.redirect('/');

    } catch (error) {
        console.error("ERROR HUBSPOT:", error.response?.data || error.message);
        res.send("HubSpot error: " + JSON.stringify(error.response?.data));
    }
});



// Start server
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
