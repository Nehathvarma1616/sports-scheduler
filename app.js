const express = require("express");
const app = express();
const path = require("path");
var cookieParser = require("cookie-parser");
var csrf = require("csurf");
const bodyParser = require("body-parser");

const { User, Sport } = require("./models");
const connectEnsureLogin = require("connect-ensure-login");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");

const saltRounds = 10;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("secret string"));
app.use(csrf({ cookie: true }));

app.use(
  session({
    secret: "my-super-secret-key-7218728182782818218782718hsjahsu8as8a8su88",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(flash());
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username, password: password } })
        .then(async (user) => {
          return done(null, user);
        })
        .catch((error) => {
          console.log(error);
          return done(null, false, { message: "Invalid Email" });
        });
    }
  )
);
passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("home", {
    csrfToken: req.csrfToken(),
  });
});

app.get("/admin_index", (request, response) => {
  response.render("admin_index", {
    csrfToken: request.csrfToken(),
  });
});
app.get("/player_index", (request, response) => {
  response.render("player_index", {
    csrfToken: request.csrfToken(),
  });
});
app.get("/admin_singnup", (request, response) => {
  response.render("admin_singnup", {
    csrfToken: request.csrfToken(),
  });
});
app.get("/admin_1", async (request, response) => {
  const sportlist = await Sport.getSport();
  response.render("admin_1", {
    csrfToken: request.csrfToken(),
    sportlist
  });
});

app.get("/player_signup", (request, response) => {
  response.render("player_signup", {
    //title: "Todo-application",
    csrfToken: request.csrfToken(),
  });
});

app.get("/newsport", (request, response) => {
  response.render("newsport", {
    //title: "Todo-application",
    csrfToken: request.csrfToken(),
  });
});

app.post("/users", async (request, response) => {
  const firstName = request.body.firstName;
  const email = request.body.email;
  const password = request.body.password;

  try {
    const user = await User.create({
      firstName: firstName,
      lastName: request.body.lastName,
      email: email,
      password: password,
    });

    request.login(user, (err) => {
      if (err) {
        console.error(err);
      }
      response.redirect("/admin_1");
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});


app.post("/createSport", async (request, response) => {
  const sporName = request.body.sportName; 
  const sportlist = Sport.getSport();
  try {
    const sport = await Sport.create({
      sportName: sporName,sportlist
    });
    response.render("/admin_1")
  } catch (error) {
    console.log(error);
  }
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/admin_index",
    failureFlash: true,
  }),
  (request, response) => {
    response.redirect("/admin_1");
  }
);
app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/player_index",
    failureFlash: true,
  }),
  (request, response) => {
    response.redirect("/admin_1");
  }
);
module.exports = app;
