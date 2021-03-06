// DOTENV SETUP

require("dotenv").config();

// MODULES

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const artworksRoutes = require("./routes/artworks");
const errorRoutes = require("./routes/error");
const profileRoutes = require("./routes/profile.js");
const UserModel = require("./models/Usermodel");

const store = new MongoDbStore({
  uri: process.env.MONGOOSE,
  collection: "sessions",
});

// APP SETUP

app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(fileUpload());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "our secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  UserModel.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  if (req.user) {
    res.locals.currentUser = req.user._id;
    res.locals.loggedInUser = req.session.isLoggedIn = true;
  }
  next();
});

// ROUTES

app.use("/admin", adminRoutes);
app.use(artworksRoutes);
app.use(authRoutes);
app.use(profileRoutes);
app.use(errorRoutes.get404);

//SERVER

mongoose
  .connect(process.env.MONGOOSE)
  .then((result) => {
    app.listen(3000);
    console.log("http://localhost:3000/");
  })
  .catch((err) => {
    console.log(err);
  });
