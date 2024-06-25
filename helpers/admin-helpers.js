var constants = require("../essentials/constants");

module.exports = {
  doAdminLogin: function (data) {
    return new Promise((resolve, reject) => {
      if (
        data.username == constants["admin-username"] &&
        data.password == constants["admin-password"]
      ) {
        resolve();
      } else {
        reject();
      }
    });
  },
};
