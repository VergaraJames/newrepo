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
router.get("login", utilities.handleErrors(accountController.buildLogin));

/* ***************************************
 * Account routes
 * Unit 4, deliver Register view activity
 * **************************************/

router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

/* ***************************************
 * Account routes
 * Unit 4, deliver Error handling middleware
 * **************************************/
router.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

module.exports = router;
