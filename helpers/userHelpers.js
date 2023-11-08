// Helper functions


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

/**
 * Checks if the email is already in the database or not
 * @param {string} email
 * @param {object} userDatabase users database
 * @returns {boolean} true if email is in the database. false otherwise
 */
const isRegisteredEmail = (email, userDatabase) => {
  for (const userId in userDatabase) {
    if (userDatabase[userId].email === email) {
      return true;
    }
  }
  return false;
};

/**
 * Finds the user object in the "users" database given the email
 * @param {string} email email registerd with the user to find
 * @param {object} userDatabase users database
 * @returns {object} the user object. null if not found.
 */
const getUserByEmail = (email, userDatabase) => {
  for (const userId in userDatabase) {
    if (userDatabase[userId].email === email) {
      return userDatabase[userId];
    }
  }
};

/**
 * Returns an object of all the URLs in urlDatabase that belong to user
 * @param {string} user user's id from the user object {id, email, password}
 * @param {object} urlDatabase URL database
 * @returns {obj}
 */
const urlsForUser = (id, urlDatabase) => {
  const userUrls = {};
  for (const shortUrlKey in urlDatabase) {
    if (urlDatabase[shortUrlKey].userId === id) {
      userUrls[shortUrlKey] = urlDatabase[shortUrlKey];
    }
  }
  return userUrls;
};

module.exports = {
  isRegisteredEmail,
  getUserByEmail,
  urlsForUser,
  generateRandomString
};