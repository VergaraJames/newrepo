// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

/* ***************************************
 * Account routes
 * Unit 4, deliver login view activity
 * **************************************/
// Route to deliver login view

router.get("login", utilities.handleErrors(accountController.buildLogin));

/* ***************************************
 * Account routes
 * Unit 4, deliver Register view activity
 * **************************************/
// Route to deliver register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

/* ***************************************
 * Account routes
 * Unit 4, deliver Error handling middleware
 * **************************************/
// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

// Process the login attempt
// This is how it will handle it later once the login process is built
// utilities.handleErrors(accountController.processLogin)
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, (req, res) => {res.status(200).send('login process complete')})

module.exports = router;
