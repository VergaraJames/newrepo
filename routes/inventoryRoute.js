// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/inventory-validation")

// Build management view
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Route to build inventory by classification view
router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId));

// New route for individual vehicle details
// Route to bulid inventory detail - from video https://www.youtube.com/watch?v=yc6zcWe87VM&t=20s
router.get('/detail/:id', utilities.handleErrors(invController.getVehicleDetails));

// Add GET routes for forms
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Add a new classification
router.post("/add-classification", 
  validate.classificationRules(), 
  validate.checkClassificationData, 
  utilities.handleErrors(invController.addClassification)
)

// Add a new inventory item
router.post("/add-inventory", 
  validate.inventoryRules(), 
  validate.checkInventoryData, 
  utilities.handleErrors(invController.addInventory)
)

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

module.exports = router;