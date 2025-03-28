const { body, validationResult } = require("express-validator");
const utilities = require(".");
const invModel = require("../models/inventory-model");
const validate = {};

/* ******************************
 *  Classification Validation Rules
 * ***************************** */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage(
        "Classification name cannot contain spaces or special characters."
      )
      .custom(async (classification_name) => {
        console.log("Validating classification:", classification_name); // Debug log
        const exists = await invModel.checkExistingClassification(
          classification_name
        );
        if (exists) {
          throw new Error(
            "This classification already exists. \nPlease use a different name."
          );
        }
      }),
  ];
};

/* ******************************
 * Check Classification Data and return errors or continue to addition
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  console.log("Classification validation result:", errors.array()); // Debug log
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name,
    });
  }
  next();
};

/* ******************************
 *  Inventory Validation Rules
 * ***************************** */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Please select a classification."),

    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Make is required."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Model is required."),

    body("inv_year")
      .trim()
      .escape()
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Year must be between 1900 and next year.")
      .custom(async (value, { req }) => {
        const exists = await invModel.checkExistingInventory(
          req.body.inv_make,
          req.body.inv_model,
          value
        );
        if (exists) {
          throw new Error("This vehicle already exists in the inventory.");
        }
      }),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .trim()
      .escape()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    body("inv_miles")
      .trim()
      .escape()
      .isInt({ min: 0 })
      .withMessage("Mileage must be a non-negative integer."),
  ];
};

/* ******************************
 * Check Inventory Data and return errors or continue to addition
 * when errors exist it returned to edit view
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(
      req.body.classification_id
    );
    return res.render("inventory/add-inventory", {
      classificationList,
      title: "Add Inventory",
      errors: errors.array(),
      classification_id,
      nav,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

/* ******************************
 *  Update Inventory Validation Rules (no duplicate check)
 * ***************************** */
validate.updateInventoryRules = () => {
  return [
    body("inv_id")
    .trim()
    .isInt()
    .withMessage("Inventory ID must be a valid integer.")
    .toInt(),
    body("classification_id")
    .trim()
    .notEmpty()
    .withMessage("Please select a classification."),
    body("inv_make")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Make is required."),
    body("inv_model")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Model is required."),
    body("inv_year")
    .trim()
    .escape()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage("Year must be between 1900 and next year."),
    body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Color is required."),
    body("inv_description")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Description is required."),
    body("inv_image")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Image path is required."),
    body("inv_thumbnail")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Thumbnail path is required."),
    body("inv_price")
    .trim()
    .escape()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),
    body("inv_miles")
    .trim()
    .escape()
    .isInt({ min: 0 })
    .withMessage("Mileage must be a non-negative integer."),
  ]
}

/* ******************************
 * Errors directed back to the edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { 
    inv_id, 
    inv_make, 
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id 
  } = req.body
  const errors = validationResult(req) 
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    return res.render("inventory/edit-vehicle", { 
      title: "Edit " + itemName,
      nav,
      classificationList, 
      errors: errors.array(), 
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    })
  }
  next()
}

module.exports = validate;
