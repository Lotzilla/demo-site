
const imgSchema = require("./imagedb")
const collection = require("./mongodb");
const mongoose = require('mongoose')
const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const path = require('path');
const fileUpload = require("express-fileupload");
const fs = require('fs');

const router = express.Router();
require('dotenv').config();

const app = express();
app.use(express.json());

var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

app.get('/', (req, res) => {
    imgSchema.find({})
        .then((data, err) => {
            if (err) {
                console.log(err);
            }
            res.render('home', { items: data })
        })
});

// Body- parser helps you access req.body from within routes and will use that data.                                                 /
const ejs = require("ejs");
const { check, validationResult } = require("express-validator");
const { values, isLength, get, find, result } = require("lodash");

// Helps you connect to the file path Views. 
const tempelatePath = path.join(__dirname, 'Views');
// const urlencodedParser = bodyParser.urlencoded({ extended: true });     
// Parsing Incoming Data.      
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')


// Without this we cannot access the files in Views.
// Telling express that the public dir has all of our assets. 
app.set("Views", path.join(__dirname, '/Views'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")))


const memorystore = require('memorystore')(sessions)
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    cookie: { maxAge: 86400000 },
    store: new memorystore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: true,
    secret: "itismysecretasdfasdfqwrtqwgvzasdfgsad",
    saveUninitialized: true,
    // cookie: { maxAge: oneDay },
}));
let session;
// Directs you to the home page(starting page).
app.get('/', (req, res) => {
    res.render("home");
});
// Login directs you to the login page.
app.get('/login', (req, res) => {
    res.render("login");
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
            res.render("home")
        }
        else if (check.password !== req.body.password) {
            res.send("Incorrect Password");
        }
    }
    catch {
        res.send('User does not exist');
    }
});
// Directs you to the /register page. 
app.get('/register', (req, res) => {
    res.render("register");
});

// The code that allows you to register a persons details and the saves the data to mongoDB.
app.post("/register", [
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
    let data = ({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        // confirmPassword: req.body.confirmPassword
    });
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

app.get('/userProf', (req, res) => {
    res.render("userProf")

})

app.get('/editProf', (req, res) => {
    res.render('editProf')
})
app.get('/List', (req, res) => {
    res.render('List')
})
app.get('/singlelist', (req, res) => {
    res.render('singlelist')
})

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
    console.log("Session is destroyed")

})
//Buy Firearm page
app.get('/buy', (req, res) => {
    res.render("buy");
});

//Sell Firearm page
app.get('/sell', (req, res) => {
    res.render("sell")
});

app.post('/sell', upload.array('image', 3), (req, res, next) => {

    const obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png',
            path: file.path,
            owner: req.user.userId,
        }
    }
    imgSchema.create(obj)
        .then((err, item) => {
            if (err) {
                console.log(err);
            }
            else {
                // item.save();
                res.redirect('home');
            }
        });
});


//Rifles, shotguns and semi-atuo pages for selling firearms
app.get('/rifle', (req, res) => {
    res.render('rifle');
});
app.get('/shotgun', (req, res) => {
    res.render('shotgun');
});
app.get('/semi', (req, res) => {
    res.render('semi');
});
//Get compentency page
app.get('/compentency', (req, res) => {
    res.render("compentency")
});
app.get('/buysell', (req, res) => {
    res.render("buysell")
});
app.get('/resellsignup', (req, res) => {
    res.render("resellsignup")
});
app.get('/resellogin', (req, res) => {
    res.render("resellogin")
});
app.get('/sell', (req, res) => {
    res.render("sell")
});
const http = require('https');
const index = require('./index');

const PORT = process.env.PORT || 8080;
const server = http.createServer(index);

// The port to connect to https://localhost:8080.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
