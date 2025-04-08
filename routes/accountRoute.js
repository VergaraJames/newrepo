// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

/* ***************************************
 * Account routes
 * Unit 4, deliver Register view activity
 * from video https://www.youtube.com/watch?v=5H0aIxO1oC0
 * Unit 5, JWT Authorization Activity
 * From video https://www.youtube.com/watch?v=C2JiypeJqbQ */
// Updated with unit 5, login proccess from guide https://byui-cse.github.io/cse340-ww-content/views/login.html
// Route to begin with Login and to finish with Logout view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Route to access register view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// default Route to /account/ root
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);

/* ***************************************
 * Account routes
 * Unit 5, Update and Update password
 * **************************************/
// Task 5: To access update view
router.get(
  "/update",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildUpdateAccountView)
);

// Task 5: Process update account and change password
router.post(
  "/update",
  utilities.checkJWTToken,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

router.post(
  "/change-password",
  utilities.checkJWTToken,
  regValidate.changePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
);

// Process the registration data
// from guide https://blainerobertson.github.io/340-js/views/server-validation.html
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = router;
