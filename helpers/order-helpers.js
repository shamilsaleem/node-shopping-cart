var db = require("../essentials/database");
const userHelpers = require("./user-helpers");

module.exports = {
  placeOrder: function (userId, paymentmethod, orderAddress) {
    return new Promise(async (resolve, reject) => {
      userHelpers
        .getAllProductsInUserCart(userId)
        .then((data) => {
          var orderInfo = {
            userId: userId,
            address: orderAddress,
            products: [],
            cartSum: data.cartSum,
            paymentmethod,
          };
          for (i in data.cartProducts) {
            var productInfo = {
              productId: data.cartProducts[i]._id,
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
};
