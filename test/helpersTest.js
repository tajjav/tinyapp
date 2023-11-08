const { assert } = require('chai');
const { isRegisteredEmail, getUserByEmail } = require("../helpers/userHelpers");

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function () {
  it('should return a user with valid email', function () {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.strictEqual(expectedUserID, user.id);
  });
  it('should return undefined if user with invalid email', function () {
    const user = getUserByEmail("tom@maple.com", testUsers)
    const expectedUserID = undefined;
    assert.strictEqual(expectedUserID, user);
  });
});
describe('isRegisteredEmail', function () {
  it('should return true for user with valid email', function () {
    const registeredEmail = isRegisteredEmail("user@example.com", testUsers)
    const expected = true;
    assert.strictEqual(expected, registeredEmail);
  });
  it('should return false if user with invalid email', function () {
    const registeredEmail = isRegisteredEmail("tom@maple.com", testUsers)
    const expected = false;
    assert.strictEqual(expected, registeredEmail);
  });
});