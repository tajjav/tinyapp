const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const generateRandomString = function(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

app.set("view engine", "ejs");

// Middlewares
app.use(express.urlencoded({ extended: true }));

// DB
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Routes
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World!" };
  res.render("hello_world", templateVars);
});

app.post("/urls", (req, res) => {
  const id = generateRandomString(6);
  const value = req.body.longURL;
  urlDatabase[id] = value;
  res.redirect(`/urls/${id}`);
});

app.get("/u/:id", (req,res) => {
  if (urlDatabase[req.params.id] !== undefined) {
    const longURL = urlDatabase[req.params.id];
    res.redirect(longURL);
  } else {
    throw new Error(`Long URL not found for ${req.params.id}`);
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});