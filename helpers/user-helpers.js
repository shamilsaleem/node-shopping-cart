var db = require("../essentials/database");
const bcrypt = require("bcrypt");
var objectId = require("mongodb").ObjectId;
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

  // User login
  doUserLogin: function (user) {
    return new Promise(async (resolve, reject) => {
      var userData = await db.collection.users.findOne({ email: user.email });
      if (userData) {
        bcrypt.compare(
          user.password,
          userData.password,
          function (err, result) {
            if (err) {
              reject({ bcryptError: true });
            } else {
              if (result == true) {
                resolve(userData);
              } else {
                reject({ invalidPassword: true });
              }
            }
          }
        );
      } else {
        reject({ invalidEmail: true });
      }
    });
  },

  //Get user data
  getUserData: async function (userId) {
    var userData = await db.collection.users.findOne({
      _id: new objectId(userId),
    });
    return userData;
  },

  //Adding product to cart
  addToCart: async function (data) {
    console.log(data)
    await db.collection.users.updateOne(
      { _id: new objectId(data.userId) },
      { $push: { cart: data.productId } }
    );
  },
};
