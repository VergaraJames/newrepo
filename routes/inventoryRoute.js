// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));

// New route for individual vehicle details
// Route to bulid inventory detail - from video https://www.youtube.com/watch?v=yc6zcWe87VM&t=20s
router.get('/detail/:id', utilities.handleErrors(invController.getVehicleDetails));

module.exports = router;