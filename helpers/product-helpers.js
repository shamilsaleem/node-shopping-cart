var formidable = require("formidable");
var fs = require("fs");
var path = require("path");
var db = require("../essentials/database");
var objectId = require("mongodb").ObjectId;

module.exports = {
  //Adding product to the database.
  addProduct: function (req) {
    return new Promise((resolve, reject) => {
      var form = new formidable.IncomingForm();
      form.parse(req, async function (err, product, files) {
        if (err) {
          reject(err);
        } else {
          //Rearranging values
          product.productName = product.productName[0];
          product.productDescription = product.productDescription[0];
          product.productMrp = product.productMrp[0];
          product.productPrice = product.productPrice[0];

          //Adding data to database
          await db.collection.products.insertOne(product).then((data) => {
            var productId = data.insertedId.toString();
            oldPath = files.productImage[0].filepath;
            newPath = path.join(
              path.resolve(__dirname, ".."),
              "/public/images/products/" + productId + ".jpg"
            );
            let rawData = fs.readFileSync(oldPath);

            fs.writeFile(newPath, rawData, function (err) {
              if (err && err.errno == -2) {
                fs.mkdir(path.dirname(newPath), function (err) {
                  if (err) {
                    reject(err);
                  } else {
                    fs.writeFile(newPath, rawData, function () {
                      resolve();
                    });
                  }
                });
              } else {
                resolve();
              }
            });
          });
        }
      });
    });
  },

  //Get all products
  getAllProducts: function () {
    return new Promise(async (resolve, reject) => {
      var products = await db.collection.products.find().toArray();
      if (products.length == 0) {
        reject();
      } else {
        resolve(products);
      }
    });
  },

  // Deleting a product
  deleteProduct: function (productId) {
    return new Promise(async (resolve, reject) => {
      await db.collection.products
        .deleteOne({ _id: new objectId(productId) })
        .then(() => {
          filePath = path.join(
            path.resolve(__dirname, ".."),
            "/public/images/products/" + productId + ".jpg"
          );
          fs.unlink(filePath, (err) => {
            if (err) {
              reject("Image deletion error");
            } else {
              resolve();
            }
          });
        })
        .catch(() => {
          reject("Cant delete product");
        });
    });
  },

  // Get details of a product
  getProductData: function (productId) {
    return new Promise(async (resolve, reject) => {
      await db.collection.products
        .findOne({ _id: new objectId(productId) })
        .then((data) => {
          resolve(data);
        })
        .catch(() => {
          reject("Cannot get product data");
        });
    });
  },

  // Edit product
  editProduct: function (req, productId) {
    return new Promise((resolve, reject) => {
      var form = new formidable.IncomingForm();
      form.parse(req, async function (err, product, files) {
        if (err) {
          reject(err);
        } else {
          //Rearranging values
          product.productName = product.productName[0];
          product.productDescription = product.productDescription[0];
          product.productMrp = product.productMrp[0];
          product.productPrice = product.productPrice[0];


          //Adding data to database
          await db.collection.products
            .updateOne({ _id: new objectId(productId) }, { $set: product })
            .then(() => {
              
              // Saving image
              oldPath = files.productImage[0].filepath;
              newPath = path.join(
                path.resolve(__dirname, ".."),
                "/public/images/products/" + productId + ".jpg"
              );
              let rawData = fs.readFileSync(oldPath);

              fs.writeFile(newPath, rawData, function (err) {
                if (err && err.errno == -2) {
                  fs.mkdir(path.dirname(newPath), function (err) {
                    if (err) {
                      reject(err);
                    } else {
                      fs.writeFile(newPath, rawData, function () {
                        resolve();
                      });
                    }
                  });
                } else {
                  resolve();
                }
              });
            });
        }
      });
    });
  },
};
