const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;
const {isRegisteredEmail, getUser, getUserByEmail, urlsForUser, isUserUrl, isValidUrl} = require("./helpers/userHelpers");

/**
 * generateRandomString function definition
 * @param {Number} length 
 * @returns {String} alphanumeric random string of length 'length'
 */
function generateRandomString(length) {
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

// Templates
app.set("view engine", "ejs");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// DB - hardcoded
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};
//-------------------------End Points-----------------------------//
// if there is no cookie redirect to /register and if there is cookie, redirect to /urls
app.get("/", (req, res) => {
  res.send("Hello!");
});




////////////////////////////////////
//////////// Auth API //////////////
////////////////////////////////////
// Auth Register
app.post("/register", (req,res) => {
  const newUserId = generateRandomString(6);
  const newUserEmail = req.body.email;
  const newUserPassword = req.body.password;
  if(newUserEmail === "" || newUserPassword === "") {
    res.sendStatus(400);
  }
  if(isRegisteredEmail(newUserEmail,users)) {
    res.status(400);
    res.send("Email already registered");
  }

  const newUser = {
    id: newUserId,
    email: newUserEmail,
    password: newUserPassword
  };
  users[newUserId] = newUser;
  
  res.cookie('user_id', newUser.id);
  res.redirect("/urls");
  });


// Auth Login
app.post("/login", (req, res) => {
  const {email, password} = req.body;
  const user = getUserByEmail(email,users);
  if(user && user.password === password) {
    res.cookie('user_id', user.id);
    res.redirect('/urls');
  } else {
    res.status(403);
    res.send("User not found");
  }
});

// Auth Logout
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/login");
})


/////////////////////////////////////////////
/// Auth FrontEnd or Rendering //////////////
////////////////////////////////////////////

// Auth Register
app.get("/register", (req,res) => {
  const templateVars = { 
    user: null
  };
res.render("urls_signup", templateVars);
});


// Auth Login
app.get("/login", (req, res) => {
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
  const id = generateRandomString(6);
  const value = req.body.longURL;
  urlDatabase[id] = value;
  res.redirect(`/urls/${id}`);
});

// Read all URL
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Read one URL
app.get("/u/:id", (req,res) => {
  if (urlDatabase[req.params.id] !== undefined) {
    const longURL = urlDatabase[req.params.id];
    res.redirect(longURL);
  } else {
    throw new Error(`Long URL not found for ${req.params.id}`);
  }
});

// Edit URL
app.post("/urls/:id", (req, res) => {
  const {id} = req.params;
  const {newLongURL} =  req.body;
  urlDatabase[id] = newLongURL;
  res.redirect("/urls");
});


// Delete URL
app.post("/urls/:id/delete", (req,res) => {
  const {id} = req.params;
  delete urlDatabase[id];
  res.redirect("/urls");
});
//////////////////////////////////////////////////////
///////////// URLs FRONTEND/ RENDERING PAGES /////////
/////////////////////////////////////////////////////

// List or Index URL
app.get("/urls", (req, res) => {
  const {user_id} = req.cookies;
    const templateVars = { 
      urls: urlDatabase,
      user: users[user_id]
    };

  res.render("urls_index", templateVars);
})

// New URL
app.get("/urls/new", (req, res) => {
  const {user_id} = req.cookies;
  const templateVars = {
    user: users[user_id]
  };
  res.render("urls_new", templateVars);
});

// Show URL
app.get("/urls/:id", (req, res) => {
  const {user_id} = req.cookies;
  const templateVars = { 
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[user_id]
  };
  res.render("urls_show", templateVars);
});

// Listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

