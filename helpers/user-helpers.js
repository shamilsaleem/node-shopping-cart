var db = require("../essentials/database");
var productHelpers = require("./product-helpers");
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
    userData = await this.getUserData(data.userId);
    return new Promise(async (resolve, reject) => {
      if (
        userData.cart !== undefined &&
        userData.cart.find((product) => product._id === data.productId) !==
          undefined
      ) {
        var qty =
          userData.cart.find((product) => product._id === data.productId).qty +
          1;
        await db.collection.users
          .updateOne(
            { _id: new objectId(data.userId), "cart._id": data.productId },
            { $set: { "cart.$.qty": qty } }
          )
          .then(() => resolve())
          .catch(() => reject());
      } else {
        await db.collection.users
          .updateOne(
            { _id: new objectId(data.userId) },
            { $push: { cart: { _id: data.productId, qty: 1 } } }
          )
          .then(() => resolve())
          .catch(() => reject());
      }
    });
  },

  // Get cart products

  getAllProductsInUserCart: function (userId) {
    return new Promise(async (resolve, reject) => {
      var userData = await this.getUserData(userId);
      if (userData.cart && userData.cart.length !== 0) {
        var cartProducts = [];
        for (i in userData.cart) {
          var singleProduct = await productHelpers.getProductData(
            userData.cart[i]._id
          );
          singleProduct.productQty = userData.cart[i].qty;
          singleProduct.productMrp = parseInt(singleProduct.productMrp)
          singleProduct.productPrice = parseInt(singleProduct.productPrice)
          singleProduct.productTotelPrice = singleProduct.productQty * singleProduct.productPrice
          cartProducts.push(singleProduct);
        }
        resolve(cartProducts);
      } else {
        reject({ noProductsInCart: true });
      }
    });
  },
};
