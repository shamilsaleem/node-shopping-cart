var db = require("../essentials/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  // Adding user to database
  addUser: function (user) {
    return new Promise(async (resolve, reject) => {
      if (user.name && user.email && user.password) {
        await bcrypt.hash(
          user.password,
          saltRounds,
          async function (err, hash) {
            user.password = hash;
            await db.collection.users
              .insertOne(user)
              .then(() => resolve())
              .catch(() => reject({ databaseIssue: true }));
          }
        );
      } else {
        reject({ invalidUserCredentials: true });
      }
    });
  },
};
