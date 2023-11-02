const express = require("express");
//const ejs = require("ejs");
const app = express();
const PORT = 8080; // default port 8080

// set the view engine
app.set("view engine", 'ejs');

// database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// routes
app.get("/", (req, res) => {
  //res.send("Hello!");
  let mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
    { name: 'Tux', organization: "Linux", birth_year: 1996},
    { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
  ];
  let tagline = "No programming concept is complete without a cute animal mascot.";

  res.render('pages/index', {
    mascots: mascots,
    tagline: tagline
  });
});

app.get("/about", (req, res) => {
  res.render("pages/about");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req,res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req,res) => {
  res.send(`a = ${a}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});