// Needed Resources
// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

/* ***************************************
 * Account routes
 * Unit 4: Register View Activity
 * Unit 5: JWT Authorization & Update Password
 * from video https://www.youtube.com/watch?v=5H0aIxO1oC0
 * Unit 5, JWT Authorization Activity
 * From video https://www.youtube.com/watch?v=C2JiypeJqbQ 
 * Updated with unit 5, login proccess from guide https://byui-cse.github.io/cse340-ww-content/views/login.html
 * ************************************** */

// Route for logging in
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
);

// Route for logging out
router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
);

// Default route to /account/ root
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);

// Process the registration data
// from guide https://blainerobertson.github.io/340-js/views/server-validation.html
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Route to access update view
// Task 5: Process update account and change password
router.get(
  "/update",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildUpdateAccountView)
);

// Process change password
router.post(
  "/change-password",
  utilities.checkJWTToken,
  regValidate.changePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
);

// Process login data
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Process registration data
// from guide https://blainerobertson.github.io/340-js/views/server-validation.html
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process update account
router.post(
  "/update",
  utilities.checkJWTToken,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = router;