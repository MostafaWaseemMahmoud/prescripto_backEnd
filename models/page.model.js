const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
    types: {type: Array},
    contactInfo: {},
    about: {type:String}
});

module.exports = mongoose.model("Page", pageSchema);
