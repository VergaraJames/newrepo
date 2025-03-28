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
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);
// Route to deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to deliver logout view
router.get("/logout", utilities.handleErrors(accountController.accountLogout));
// Route to deliver register view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

/* ***************************************
 * Account routes
 * Unit 5, Update and Update password
 * **************************************/
// Task 5: Deliver update view
router.get(
  "/update",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildUpdateAccountView)
);

// Task 5: Process update account and change password
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
  utilities.handleErrors(accountController.registerAccount),
  (req, res) => {
    res.status(200).send("Register process complete");
  }
);

// Process the login attempt
// This is how it will handle it later once the login process is built
// utilities.handleErrors(accountController.processLogin)
// Updated with unit 5, login proccess from guide https://byui-cse.github.io/cse340-ww-content/views/login.html
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin),
  (req, res) => {
    res.status(200).send("login process complete");
  }
);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

router.get(
  "/update/:account_id",
  utilities.handleErrors(accountController.buildUpdateAccount)
);

module.exports = router;
