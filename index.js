const express = require('express');
const bcrypt = require('bcrypt');
const path = require("path");
const collection = require("./config");

const app = express();
//data to json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

//static file
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

//Register user
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password
  };

  //user exists if already
  const existingUser = await collection.findOne({ name: data.name });
  if (existingUser) {
    res.send("USER ALREADY EXISTS! CHOOSE DIFFERENT USERNAME");
  } else {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword;
    const userdata = await collection.insertMany(data);
    console.log(userdata);
    res.redirect("/");
  }
});

//LOGIN USER
app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.username });
    if (!check) {
      res.send("user name not found");
    } else {
      const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
      if (isPasswordMatch) {
        res.render("home");
      } else {
        res.send("wrong password");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// Start the server
const PORT = 7000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});