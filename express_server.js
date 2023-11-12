const express = require("express");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const app = express();
const PORT = 8080;
const { generateRandomString, isRegisteredEmail, getUserByEmail, urlsForUser} = require("./helpers/userHelpers");

// Templates
app.set("view engine", "ejs");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ["OulAla", "seEhaa", "croPtop"],
  maxAge: 24 * 60 * 60 * 1000
}));

// DB - hardcoded
const urlDatabase = {
  "b2xVn2": {
    id: "b2xVn2",
    longURL: "http://www.lighthouselabs.ca",
    userId: "userRandomID"
  },

  "9sm5xK": {
   id: "9sm5xK",
   longURL: "http://www.google.com",
   userId: "user2RandomID"
  }
};
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    hashedPassword: bcrypt.hashSync("purple-monkey-dinosaur", 11)
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    hashedPassword: bcrypt.hashSync("dishwasher-funk", 11)
  },
};

//-------------------------End Points-----------------------------//
// if there is no cookie redirect to /register and if there is cookie, redirect to /urls
app.get("/", (req, res) => {
  // res.send("Hello!");
  res.redirect("/login");
});

////////////////////////////////////
//////////// Auth API //////////////
////////////////////////////////////
// Auth Register
app.post("/register", (req, res) => {
  const newUserId = generateRandomString(6);
  const newUserEmail = req.body.email;
  const newUserPassword = req.body.password;
  if (newUserEmail === "" || newUserPassword === "") {
    return res.sendStatus(400);
  }
  if (isRegisteredEmail(newUserEmail, users)) {
    return res.status(400).send("Email already registered");
  }

  const newUser = {
    id: newUserId,
    email: newUserEmail,
    hashedPassword: bcrypt.hashSync(newUserPassword, 11)
  };
  users[newUserId] = newUser;

  req.session.user_id = newUser.id;
  res.redirect("/urls");
});


// Auth Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email, users);
  if (!user) {
    return res.status(400).send("Invalid Credentials");
  }

  const passwordMatch = bcrypt.compareSync(password, user.hashedPassword);
  if (!passwordMatch) {
    return res.status(400).send("Invalid Credentials");
  }
  req.session.user_id = user.id;
  res.redirect('/urls');
});

// Auth Logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
})

/////////////////////////////////////////////
/// Auth FrontEnd or Rendering //////////////
////////////////////////////////////////////

// Auth Register
app.get("/register", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user: null
  };
  res.render("urls_signup", templateVars);
});

// Auth Login
app.get("/login", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user: null
  };
  res.render("urls_signin", templateVars);
})

////////////////////////////////////////////////////
//////// CRUD URL API //////////////////////////////
///////////////////////////////////////////////////
// create URL
app.post("/urls", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    return res.redirect("/register");
  }
  const id = generateRandomString(6);
  const {longURL} = req.body;
  urlDatabase[id] = {id,longURL,userId}
  res.redirect(`/urls/${id}`);
});

// Read all URL
app.get("/urls.json", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/register");
  }
  res.json(urlDatabase);
});

// Read one URL
app.get("/u/:id", (req, res) => {
  const urlObj = urlDatabase[req.params.id];
  if (!urlObj) {
    return res.status(404).send(`Long URL not found for ${req.params.id}`)
  }
  res.redirect(urlObj.longURL);
});

// Edit URL
app.post("/urls/:id", (req, res) => {
  const {user_id} = req.session;
  if (!user_id) {
    return res.redirect("/register");
  }
  const urlObj = urlDatabase[req.params.id];
  if(!urlObj) {
    return res.status(404).send("URL not found");
  }
  const urlBelongsToUser = urlObj.userId === user_id;
  if(!urlBelongsToUser) {
    return res.status(404).send("You are not the owner of URL");
  }

  const { id } = req.params;
  const { newLongURL } = req.body;
  urlDatabase[id].longURL = newLongURL;
  res.redirect("/urls");
});


// Delete URL
app.post("/urls/:id/delete", (req, res) => {
 const {user_id} = req.session;
  if (!user_id) {
    return res.redirect("/register");
  }
  const urlObj = urlDatabase[req.params.id];
  if(!urlObj) {
    return res.status(404).send("URL not found");
  }
  const urlBelongsToUser = urlObj.userId === user_id;
  if(!urlBelongsToUser) {
    return res.status(404).send("You are not the owner of URL");
  }

  const { id } = req.params;
  delete urlDatabase[id];
  res.redirect("/urls");
});
//////////////////////////////////////////////////////
///////////// URLs FRONTEND/ RENDERING PAGES /////////
/////////////////////////////////////////////////////

// List or Index URL
app.get("/urls", (req, res) => {
  const { user_id } = req.session;
  if (!user_id) {
    return res.redirect("/register");
  }
  
  const templateVars = {
    urls: urlsForUser(user_id,urlDatabase),
    user: users[user_id]
  };

  res.render("urls_index", templateVars);
})

// New URL
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/register");
  }
  const { user_id } = req.session;
  const templateVars = {
    user: users[user_id]
  };
  res.render("urls_new", templateVars);
});

// Show URL
app.get("/urls/:id", (req, res) => {
  const { user_id } = req.session;
  if (!user_id) {
    return res.redirect("/register");
  }

  const urlObj = urlDatabase[req.params.id];
  if(!urlObj) {
    return res.status(404).send("URL not found");
  }

  const urlBelongsToUser = urlObj.userId === user_id;
  if(!urlBelongsToUser) {
    return res.status(404).send("You are not the owner of URL");
  }

  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[user_id]
  };
  res.render("urls_show", templateVars);
});

// Listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

