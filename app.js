const express = require("express");
const app = express();
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/admin_index", (request, response) => {
  response.render("admin_index", );
});
app.get("/player_index", (request, response) => {
	response.render("player_index", );
  });
app.get("/admin_singnup", (request, response) => {
	response.render("admin_singnup", );
  });

app.get("/player_signup", (request, response) => {
	response.render("player_signup", );
});

module.exports = app;
