
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;


mongoose.set('strictQuery', false)
// Connects to the mongoDB server.
mongoose.connect("mongodb://localhost:27017/Project-Gun(Autotrader")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log("failed to connect");
    })

const LogInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },


    // confirmPassword: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     trim: true
    // },
    // salt: String,
}, { timestamps: true })


const collection = mongoose.model("LogInCollection", LogInSchema);

module.exports = collection;