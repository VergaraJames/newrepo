const utilities = require("../utilities/");
const baseController = {};
/* **************************************
 * Build Home view with MVC
 * Unit 3 Activities
 * (From video https://www.youtube.com/watch?v=bJG6d7rRusU)
 * ************************************** */
baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  // Flash message example for testing css
  // req.flash("notice", "This is a flash message.")
  // (From video https://www.youtube.com/watch?v=bJG6d7rRusU)
  res.render("index", { title: "Home", nav });
};

module.exports = baseController;
