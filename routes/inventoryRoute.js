// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const invController = require("../controllers/invController");
const validate = require("../utilities/inventory-validation");
const Util = require("../utilities/");

// Admin Routes
// Unit 5, Check Account
// GET

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// New route for individual vehicle details
// Route to bulid inventory detail - from video https://www.youtube.com/watch?v=yc6zcWe87VM&t=20s
router.get(
  "/detail/:id",
  utilities.handleErrors(invController.getVehicleDetails)
);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/",
  Util.checkAccountType,
  utilities.handleErrors(invController.buildManagementView)
);

// Add GET routes for forms
router.get(
  "/add-classification",
  Util.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);
router.post(
  "/add-classification",
  Util.checkAccountType,
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Add a new inventory item

router.get(
  "/add-inventory",
  Util.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);
router.post(
  "/add-inventory",
  Util.checkAccountType,
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// CRUD by id

router.get(
  "/edit/:id",
  Util.checkAccountType,
  utilities.handleErrors(invController.editInventoryView)
);

// Route Update inventoryy item
// from guide https://byui-cse.github.io/cse340-ww-content/views/update-two.html
router.post(
  "/update/",
  Util.checkAccountType,
  validate.updateInventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);
router.get(
  "/delete/:id",
  Util.checkAccountType,
  utilities.handleErrors(invController.buildDeleteConfirmView)
);
router.post(
  "/delete",
  Util.checkAccountType,
  utilities.handleErrors(invController.deleteInventoryItem)
);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = router;