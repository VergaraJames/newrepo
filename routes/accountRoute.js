// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

/* ***************************************
 * Account routes
 * Unit 4, deliver login view activity
 * **************************************/
router.get("login", utilities.handErrors(accountController.buildLogin));

module.exports = router;