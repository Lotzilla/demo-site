
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
mongoose.set('strictQuery', false)

// Connects to the mongoDB server.
mongoose.connect("mongodb://localhost:27017/Project-Gun(Autotrader")
    .then(() => {
        console.log("imagedb connected");
    })
    .catch(() => {
        console.log("failed to connect");
    })

var imageSchema = new mongoose.Schema({
    name: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});

const imgcollection = mongoose.model('Image', imageSchema);

module.exports = imgcollection;