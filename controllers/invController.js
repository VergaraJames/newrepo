const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}


/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  
  if (!data || data.length === 0) {
    let nav = await utilities.getNav()
    return res.render("./errors/error", {
      title: "No Vehicles Found",
      message: "No vehicles match this classification.",
      nav
    });
  }
  
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}
/* ***************************
 * Build vehicle details for specific inventory item
 * ***************************/
invCont.getVehicleDetails = async function (req, res) {
  // get inventory id from the request
  try {
    const vehicle = await invModel.getVehicleById(req.params.id);
      // use getVehicleById id to get inventory based on id
    if (!vehicle) {
      let nav = await utilities.getNav()
      return res.render("./errors/error", {
        title: "404 Error",
        status: 404,
        message: "Vehicle not found.",
        nav
      });
    }
    // This will force an error
    // const undefinedValue = undefined;
    // undefinedValue.nonExistentProperty;
    // build a view with the vehicles/inventory results
    const html = utilities.formatVehicleDetails(vehicle);
    // get our nav
    let nav = await utilities.getNav()
    // render the datil view with the variables
    res.render("./inventory/detail", { 
    // create the title of the page
      title: `${vehicle.inv_make} ${vehicle.inv_model} Details`,
      nav,
      vehicle: html 
    });
    
  } catch (error) {
    console.error("Error in getVehicleDetails:", error);
    let nav = await utilities.getNav()
    res.status(500).render("./errors/error", {
      title: "500 Error",
      status: 500,
      message: "An error occurred while fetching vehicle details.",
      nav
    });
  }
}

/* ***************************
*  Build Management View
* ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
  });
};

/* ***************************
 *  Build Add Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    classification_name: ""
  })
}

/* ***************************
 *  Build Add Inventory Form
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList
  })
}

/* ***************************
 *  Add new classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  try {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      let nav = await utilities.getNav();
      req.flash("notice", "Classification added successfully!");
      res.redirect("/inv/");
    } else {
      let nav = await utilities.getNav();
      req.flash("notice", "Failed to add classification.");
      res.status(501).render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        classification_name
      });
    }
  } catch (error) {
    let nav = await utilities.getNav();
    req.flash("notice", "An error occurred while adding the classification.");
    res.status(500).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      classification_name
    });
  }
};

/* ***************************
 * Add New Inventory
 * ***************************/
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { 
    classification_id, inv_make, inv_model, inv_year, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color 
  } = req.body;
  const inventoryData = {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  };

  try {
    const inventoryResult = await invModel.addInventory(inventoryData);
    if (inventoryResult) {
      req.flash("notice", "Inventory item added successfully!");
      res.redirect("/inv/");
    } else {
      const classificationList = await utilities.buildClassificationList(classification_id || null);
      req.flash("notice", "Failed to add inventory item or vehicle already exists.");
      res.status(501).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        ...inventoryData
      });
    }
  } catch (error) {
    const classificationList = await utilities.buildClassificationList(classification_id || null);
    req.flash("notice", "An error occurred while adding the inventory item.");
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      ...inventoryData
    });
  }
};

module.exports = invCont