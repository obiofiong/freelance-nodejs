const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const fs = require("fs");
const mongoose = require("mongoose");
const Contact = require("./models/contact.js");
const User = require("./models/user.js");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();

// console.log(process.env);

mongoose
  .connect(process.env.URI)
  .then((res) => {
    console.log("database connected");

    app.listen(PORT, () => {
      console.log("listening on port", PORT);
    });
  })
  .catch((err) => {
    console.log("error connecting", err);
  });

const bodyParser = require("body-parser");

app.set("view engine", "ejs");

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// passport.use(new LocalStrategy(User.authenticate()));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  // res.sendFile("./index.html", { root: __dirname });
  const jobs = ["Graphic Artist", "Web Designer", "Illustrator"];
  works = [
    {
      img: "assets/img/portfolio/cabin.png",
      id: "#portfolioModal1",
    },
    {
      img: "assets/img/portfolio/cake.png",
      id: "#portfolioModal2",
    },
    {
      img: "assets/img/portfolio/circus.png",
      id: "#portfolioModal3",
    },
    {
      img: "assets/img/portfolio/game.png",
      id: "#portfolioModal4",
    },
    {
      img: "assets/img/portfolio/safe.png",
      id: "#portfolioModal5",
    },
  ];
  const profileImg = "assets/img/avataaars.svg";
  res.render("index", { jobs, works, profile: profileImg });
});
app.get("/about", (req, res) => {
  const name = "mariam";
  res.render("about", { name });
});
app.get("/contact", (req, res) => {
  res.render("contact", { error: false, success: false, values: {} });
});
app.post("/contact", (req, res) => {
  // res.render("contact");
  // res.json({})
  console.log("The request posted to contact", req.body);
  // JSON
  // // JSON.stringify() to convert to a string
  // let result = JSON.stringify(req.body);
  // // JSON
  // console.log(result);
  // console.log(typeof result, typeof req.body);
  // console.log(result.name);
  // let name = req.body.name;
  // let date = new Date().toDateString();
  // let path = "./contacts/" + name + "-" + date + ".txt";
  // validation
  if (!req.body.name) {
    res.render("contact", {
      error: "Name is required",
      success: false,
      values: req.body,
    });
  } else if (!req.body.email) {
    res.render("contact", {
      error: "Email is required",
      success: false,
      values: req.body,
    });
  }

  const payload = {
    fullname: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
  };
  // save to database
  const contact = new Contact(payload);

  // contact.save().then
  contact
    .save()
    .then((result) => {
      console.log("Contact saved", result);
      res.render("contact", {
        error: false,
        success: "Successfully Posted contact",
        values: {},
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("contact", {
        error: "err:" + err,
        success: false,
        values: {},
      });
    });

  // fs.writeFile(path, result, (err) => {
  //   if (err) {
  //     console.log(err);
  //     res.render("contact", {
  //       error: "err:" + err,
  //       success: false,
  //       values: {},
  //     });
  //   } else {
  //     console.log("success");
  //     res.render("contact", {
  //       error: false,
  //       success: "Successfully Posted contact",
  //       values: {},
  //     });
  //   }
  // });
  // fs.writeFile()
  // res.send("request sent");
});
app.post("/about", (req, res) => {
  console.log("The request posted to about", req.body);
});

app.get("/login", (req, res) => {
  res.render("login", { error: false, success: false, values: {} });
});
app.get("/signup", (req, res) => {
  res.render("signup", { error: false, success: false, values: {} });
});
app.post("/signup", (req, res) => {
  console.log("The request posted to contact", req.body);
  const email = req.body.email;
  const payload = {
    fullname: req.body.name,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
  };
  // save to database
  // const user = new User(payload);
  User.findOne({ email }).then((user) => {
    if (user) {
      // errors.push({ msg: "Email is already registered" });

      res.render("signup", {
        error: "Email already registered",
        success: false,
        values: {},
      });
    } else {
      const newUser = new User(payload);
      console.log(newUser);
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              console.log(user);
              // req.flash("success_msg", "You are now registered and can log in");
              // res.redirect("/login");
              res.render("/login", {
                error: false,
                success: "Successfully signed up, Please log in",
                values: {},
              });
            })
            .catch((err) => console.log(err));
        })
      );
    }
  });
});

app.post("/login", (req, res, next) => {
  // loginRouter.post("/", async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
  // });

  // module.exports = loginRouter;
});
