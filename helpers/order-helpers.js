var db = require("../essentials/database");
const userHelpers = require("./user-helpers");

module.exports = {
  placeOrder: function (userId, paymentmethod, orderAddress) {
    return new Promise((resolve, reject) => {
      userHelpers
        .getAllProductsInUserCart(userId)
        .then(async (data) => {
          var userName = await userHelpers.getUserData(userId);
          var orderInfo = {
            date: new Date(),
            userId,
            userName:userName.name,
            address: orderAddress,
            products: [],
            cartSum: data.cartSum,
            paymentmethod,
          };
          for (i in data.cartProducts) {
            var productInfo = {
              productId: String(data.cartProducts[i]._id),
              productName: data.cartProducts[i].productName,
              productPrice: data.cartProducts[i].productPrice,
              productQty: data.cartProducts[i].productQty,
              productTotelPrice: data.cartProducts[i].productTotelPrice,
            };
            orderInfo.products.push(productInfo);
          }

          db.collection.orders.insertOne(orderInfo).then(() => {
            userHelpers
              .clearCart(userId)
              .then(() => resolve())
              .catch(() => reject());
          });
        })
        .catch((data) => {
          reject(data);
        });
    });
  },

  // Get all orders
  getAllOrders: async function () {
    return new Promise(async (resolve, reject) => {
      var orders = await db.collection.orders.find().toArray();
      if (orders.length == 0) {
        reject();
      } else {
        for (i in orders) {
          orders[i]._id = String(orders[i]._id);
        }
        resolve(orders);
      }
    });
  },

  // Get all orders by a user
  getAllOrdersByAUser: async function (userId) {
    return new Promise(async (resolve, reject) => {
      var orders = await db.collection.orders.find({userId}).toArray();
      if (orders.length == 0) {
        reject();
      } else {
        for (i in orders) {
          orders[i]._id = String(orders[i]._id);
        }
        resolve(orders);
      }
    });
  },
};
