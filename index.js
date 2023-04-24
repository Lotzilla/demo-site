const collection = require("./mongodb");
const mongoose = require('mongoose')
const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const app = express();


// Body- parser helps you access req.body from within routes and will use that data.
const bodyParser = require("body-Parser")
const path = require("path");                                                       // It helps you work with directories and file path,
const ejs = require("ejs");
const { check, validationResult } = require("express-validator");
const { values, isLength, get, find, result } = require("lodash");

// Helps you connect to the file path Views. 
const tempelatePath = path.join(__dirname, 'Views');
const urlencodedParser = bodyParser.urlencoded({ extended: true });            // Parsing Incoming Data.
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
// Without this we cannot access the files in Views.
app.set("Views");
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")))                     // Telling express that the public dir has all of our assets.   

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "itismysecretasdfasdfqwrtqwgvzasdfgsad",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}))
let session;
// Directs you to the home page(starting page).
app.get('/', (req, res) => {
    res.render("home");
})
// Login directs you to the login page.
app.get('/login', (req, res) => {
    res.render("login");
})
// Directs you to the /register page. 
app.get('/register', (req, res) => {
    res.render("register");
})
//Buy Firearm page
app.get('/buy', (req, res) => {
    res.render("buy")
})
//Sell Firearm page
app.get('/sell', (req, res) => {
    res.render("sell")
})
//Get compentency page
app.get('/compentency', (req, res) => {
    res.render("compentency")
})
// The code that allows you to register a persons details and the saves the data to mongoDB.
app.post("/register", urlencodedParser, [
    check('name', 'The name must be 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('email', "Email is not valid")
        .isEmail()
        .normalizeEmail(),
    check('password', "Password needs to be 6 or more characters")
        .isLength({ min: 6 }),
], async (req, res) => {
    // This is the data that will go into our database.
    let data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        // confirmPassword: req.body.confirmPassword
    };
    // Checks if all fields are correct.
    const error = validationResult(req)
    // console.log(error);
    // console.log(data.password);
    // console.log(data.confirmPassword);
    if (error.isEmpty()) {
        await collection.insertMany([data]),
            res.render('home');
    }
    // If there are errors in the input fields will result in error message that will pop up.
    else {
        //return res.status(422).json(error.array())            //Checks the server side of what is needed to be put into the database (requirements).
        const alert = error.array()
        res.render("register", {
            alert,
        });
    }
});

// Can login with the registered users data that is in the database.
app.post("/login", async (req, res) => {

    try {

        const check = await collection.findOne({ name: req.body.name });

        if (check.password == req.body.password && check.name == req.body.name) {
            session = req.session;
            session.userid = req.body.name;
            console.log("Session has been Created")
            console.log(req.session)
            res.render("userProf")
        }
        else if (check.password !== req.body.password) {
            res.send("Incorrect Password");
        }
    }
    catch {
        res.send('User does not exist');
    }
});

app.get('/userProf', (req, res) => {
    session = req.session;
    if (session.userid) {
        res.render("userProf")
    }
})


app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
    console.log("Session is destroyed")

})

// The port to connect to https://localhost:8080.
app.listen(process.env.PORT || 8080)