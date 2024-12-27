// Import Libraries -->
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const signup = require('./routers/singup/signup'); // Corrected typo in filename
const mng = require("./routers/manageClients/mng");
const page = require("./routers/page/page");
const pageSchema = require("./models/page.model");
// Add Environment Variables -->
const environments = {
    port: process.env.PORT || 9000, // Corrected to use process.env
};

// Activate Libraries -->
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Added middleware to parse JSON
app.use(bodyParser.urlencoded({ extended: true })); // Added middleware to parse URL-encoded data

// My Routes -->
app.get("/", async (req, res) => {
    try {
        const ifpage = pageSchema.find();
        if(ifpage[0]) {
            return res.status(200).send("You Have Already Page Information YOu Don't Need To Add Anthor One")
        }
        const page = new pageSchema({
            types: ["General physician","Dermatologist","Pediatricians","Neurologist","Gastroenterologist"],
            contactInfo: {
                phoneNumber: "01064032608",
                email: "mostafawaseem22@gmail.com",
            },
            about: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
        })
        await page.save()
        res.status(201).send("Server Working Successfully And Page Added Successfully");
        console.log("Server Working Successfully And Page Added Successfully");
        
    }catch(e) {
        res.send("Error while adding Page data" , e);
    }
});

app.use('/signup', signup);
app.use('/mng', mng);
app.use('/def', page);

// Run The Server
app.listen(environments.port, () => {
    mongoose.connect('mongodb+srv://mostafawaseem22:cKfpbcSwNadMl5Tv@cluster0.dbirg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => {
        console.log("Database Connected Successfully!");
    }).then(() => {
        console.log("Application Running On Port ---> " + environments.port);
    }).catch((e) => {
        console.log("Error Connecting Database:", e);
    });
});
