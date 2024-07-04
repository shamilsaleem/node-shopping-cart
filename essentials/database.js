const { MongoClient } = require("mongodb");
const db_name = require("./constants")["database-name"];
const db_uri = require("./constants")["database-uri"];

const client = new MongoClient(db_uri);

const db = {
  state: null,
};

//Database connection.
async function run() {
  await client
    .connect()
    .then(() => {
      console.log("You successfully connected to MongoDB!");
      db.state = client;
    })
    .catch(() => console.log("Database connection unsuccessful"));
}

module.exports.connect = run().then(() => {
  module.exports.collection = {
    products: db.state.db(db_name).collection("products"),
    users: db.state.db(db_name).collection("users"),
    orders: db.state.db(db_name).collection("orders"),
  };
});
