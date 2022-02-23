require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const exphbs = require("express-handlebars");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

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

app.use("/admin", adminRoutes);
app.use(shopRoutes);

mongoose
  .connect(process.env.MONGOOSE)
  .then((result) => {
    app.listen(3000);
    console.log("http://localhost:3000/");
  })
  .catch((err) => {
    console.log(err);
  });
