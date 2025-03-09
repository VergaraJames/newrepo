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
 * **************************************/
// from guide https://blainerobertson.github.io/340-js/views/account-registration.html

// Routes to build something
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the login attempt
// This is how it will handle it later once the login process is built
// utilities.handleErrors(accountController.processLogin)
router.post("/login",
  regValidate.loginRules(), 
  regValidate.checkLoginData, 
  utilities.handleErrors(accountController.accountLogin),
  (req, res) => {
    res.status(200).send("login process complete");
  }
);

// Process the registration data
// from guide https://blainerobertson.github.io/340-js/views/server-validation.html
router.post('/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount),
  (req, res) => {
    res.status(200).send("Register process complete");
  }
);

/* ***************************************
 * Account routes
 * Unit 4, deliver Error handling middleware
 * **************************************/
// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = router;