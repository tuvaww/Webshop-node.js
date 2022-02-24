require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const exphbs = require("express-handlebars");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const UserModel = require("./models/Usermodel");

const store = new MongoDbStore({
  uri: process.env.MONGOOSE,
  collection: "sessions",
});

app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", "hbs");

app.use(express.static("public"));

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

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

mongoose
  .connect(process.env.MONGOOSE)
  .then((result) => {
    app.listen(3000);
    console.log("http://localhost:3000/");
  })
  .catch((err) => {
    console.log(err);
  });
