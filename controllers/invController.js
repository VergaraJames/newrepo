const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);

  if (!data || data.length === 0) {
    let nav = await utilities.getNav();
    return res.render("./errors/error", {
      title: "No Vehicles Found",
      message: "No vehicles match this classification.",
      nav,
    });
  }

  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 * Build vehicle details for specific inventory item
 * ***************************/
invCont.getVehicleDetails = async function (req, res) {
  // get inventory id from the request
  try {
    const vehicle = await invModel.getVehicleById(req.params.id);
    // use getVehicleById id to get inventory based on id
    if (!vehicle) {
      let nav = await utilities.getNav();
      return res.render("./errors/error", {
        title: "404 Error",
        status: 404,
        message: "Vehicle not found.",
        nav,
      });
    }
    // This will force an error const undefinedValue = undefined;
    // undefinedValue.nonExistentProperty;
    // build a view with the vehicles/inventory results
    const html = utilities.formatVehicleDetails(vehicle);
    let nav = await utilities.getNav();
    // render the datil view with the variables
    res.render("./inventory/detail", {
      // create the title of the page
      title: `${vehicle.inv_make} ${vehicle.inv_model} Details`,
      nav,
      vehicle: html,
    });
  } catch (error) {
    console.error("Error in getVehicleDetails:", error);
    let nav = await utilities.getNav();
    res.status(500).render("./errors/error", {
      title: "500 Error",
      status: 500,
      message: "An error occurred while fetching vehicle details.",
      nav,
    });
  }
};

/* ***************************
 *  Build Management View
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  // updating data activity
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
  });
};

/* ***************************
 *  Build Add Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    classification_name: "",
    errors: null,
  });
};

/* ***************************
 *  Build Add Inventory Form
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav();
  /* from guide https://byui-cse.github.io/cse340-ww-content/views/select-products-ajax.html */
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add inventory",
    nav,
    classificationList,
    errors: null,
  });
};

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
        classification_name,
      });
    }
  } catch (error) {
    let nav = await utilities.getNav();
    req.flash("notice", "An error occurred while adding the classification.");
    res.status(500).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      classification_name,
    });
  }
};

/* ***************************
 * Add New Inventory
 * ***************************/
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
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
    inv_color,
  };

  try {
    const inventoryResult = await invModel.addInventory(inventoryData);

    if (inventoryResult) {
      req.flash("notice", `The new inventory has been added successfuly.`);
      res.redirect("/inv/");
    } else {
      const classificationList = await utilities.buildClassificationList(
        classification_id || null
      );
      req.flash(
        "notice",
        "Failed to add inventory item or vehicle already exists."
      );
      res.status(501).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id, //Don't need
      });
    }
  } catch (error) {
    const classificationList = await utilities.buildClassificationList(
      classification_id || null
    );
    req.flash("notice", "An error occurred while adding the inventory item.");
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id, //Don't need
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * from guide https://byui-cse.github.io/cse340-ww-content/views/update-one.html
 * From video https://www.youtube.com/watch?v=RIzYK1k7c-g
 * ************************** */
/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 *  Unit5, Update step 2 Activity
 *  from video https://www.youtube.com/watch?v=TuVCPUUGCEE
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
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
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
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
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteConfirmView = async function (req, res, next) {
  const inv_id = parseInt(req.params.id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getVehicleById(inv_id);
  if (!itemData) {
    return res.status(404).render("errors/error", {
      title: "404 Error",
      message: "Vehicle not found.",
      nav,
    });
  }
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventoryItem(inv_id);

  if (deleteResult && deleteResult.rowCount === 1) {
    req.flash("notice", `${inv_make} ${inv_model} was deleted successfully`);
    res.redirect("/inv/");
  } else {
    const itemName = `${req.body.inv_make} ${req.body.inv_model}`;
    req.flash("notice", `Error: ${inv_make} ${inv_model} was not deleted`);
    res.status(501).render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_price: req.body.inv_price,
    });
  }
};

module.exports = invCont;
