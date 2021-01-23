require("dotenv").config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const app = express();
const bcrypt = require("bcryptjs");
const {
    jwt
} = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

require("./db/conn");
const Register = require("./models/registers");
const Message = require("./models/contacts");
const {
    json
} = require("express");
const {
    log
} = require("console");

const port = process.env.PORT || 8000;


const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({
    extended: false
}));

app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialsPath);

app.get("/", (_req, res) => {
    res.render("index", {
        channelName: "shakya"
    });
});

app.get("/home", auth, (_req, res) => {
    //console.log(`this is the cookie awesome ${req.cookies.jwt}`);
    res.render("home", {
        userName: ""
    });
});

app.get("/logout", auth, async (req, res) => {
    try {
        console.log(req.user);

        //req.user.tokens = req.user.tokens.filter((currElement) => {
        //return currElement.token !== req.token })
        req.user.tokens = [];

        res.clearCookie("jwt");
        console.log("logout successfully");
        await req.user.save();
        res.render("index");
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/30DaysFreeTrai", auth, (_req, res) => {
    res.render("30DaysFreeTrai");
});

app.get("/about", auth, (_req, res) => {
    res.render("about");
});

app.get("/htmlBlog", auth, (_req, res) => {
    res.render("htmlBlog");
});

app.get("/cssBlog", auth, (_req, res) => {
    res.render("cssBlog");
});

app.get("/javaBlog", auth, (_req, res) => {
    res.render("javaBlog");
});

app.get("/pythonBlg", auth, (_req, res) => {
    res.render("pythonBlg");
});

app.get("/contact", (_req, res) => {
    res.render("contact");
});

app.post("/contact", async (req, res) => {
    try {
        const userEmployee = new Message({
            fulname: req.body.fulname,
            email: req.body.email,
            phone: req.body.phone,
            city: req.body.city,
            gender: req.body.gender,
            age: req.body.age,
            message: req.body.message
        })
        const contacted = await userEmployee.save();
        console.log("the contact part" + contacted);
        res.status(201).render("index");
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/register", (_req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {

            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                gender: req.body.gender,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            })
            //console.log("the success part" + registerEmployee);

            const token = await registerEmployee.generateAuthToken();
            console.log("the token part " + token);

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 60000),
                httpOnly: true
            });

            const registered = await registerEmployee.save();
            console.log("the registered part" + registered);
            res.status(201).render("signin");

        } else {
            res.send("password are not matching");
        }

    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/signin", (_req, res) => {
    res.render("signin");
});

app.post("/signin", async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({
            email: email
        });

        const isMatch = await bcrypt.compare(password, useremail.password);

        const token = await useremail.generateAuthToken();
        console.log("the token part " + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 60000),
            httpOnly: true
        });

        if (isMatch) {
            res.status(201).render("home");
        } else {
            res.send("invalid signin details");
        }

    } catch (error) {
        res.status(400).send("invalid signin details");
    }
});

app.get("/9896", auth, (_req, res) => {
    res.render("9896");
});

app.get("*", (_req, res) => {
    res.render("404", {
        errorComment: "Oops! Page Not Found We couldn't find that page"
    });
});

app.get("/*", (_req, res) => {
    res.render(error, {
        error: "Oops ! Page Not Found We couldn't find that page..."
    });
});

app.listen(port, () => {
    console.log(`running the port no ${port}`);
});