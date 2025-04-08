const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("Error in inventory by classification ID " + error);
  }
}

/* ***************************
 *  Get specific vehicle by ID
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    );
    return data.rows[0]; 
  } catch (error) {
    console.error("Error getting vehicle by ID." + error);
    return null; 
  }
}

/* ***************************
 * Add New Classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    const data = await pool.query(sql, [classification_name]);
    return data.rows[0];
  } catch (error) {
    console.error("Add Classification error " + error);
    return null;
  }
}

/* ***************************
 * Add New Inventory
 * ************************** */
async function addInventory(inventoryData) {
  try {
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
    } = inventoryData;
    const sql = `
      INSERT INTO public.inventory (
        classification_id, inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    const data = await pool.query(sql, [
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
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("add Inventory error " + error);
    return null;
  }
}

/* **********************
 *   Check for existing classification
 * ********************* */
async function checkExistingClassification(classification_name) {
  try {
    const sql =
      "SELECT * FROM public.classification WHERE classification_name = $1";
    const data = await pool.query(sql, [classification_name]);
    return data.rowCount > 0;
  } catch (error) {
    console.error("check Existing Classification error " + error);
    return true;
  }
}

/* **********************
 *   Check for existing inventory item
 * ********************* */
async function checkExistingInventory(inv_make, inv_model, inv_year) {
  try {
    console.log("Checking for existing inventory:", {
      inv_make,
      inv_model,
      inv_year,
    });
    const sql =
      "SELECT * FROM inventory WHERE inv_make = $1 AND inv_model = $2 AND inv_year = $3";
    const result = await pool.query(sql, [inv_make, inv_model, inv_year]);
    console.log("Query result rowCount:", result.rowCount);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error checking existing inventory:", error);
    return false;
  }
}

/* ***************************
 *  Update Inventory Data
 *  From guide https://byui-cse.github.io/cse340-ww-content/views/update-two.html
 *  Video help from https://www.youtube.com/watch?v=TuVCPUUGCEE
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 *  From guide https://byui-cse.github.io/cse340-ww-content/views/update-two.html
 *  Video help from https://www.youtube.com/watch?v=TuVCPUUGCEE
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.error("Delete Inventory Error: " + error);
    return null;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventory,
  checkExistingClassification,
  checkExistingInventory,
  updateInventory,
  deleteInventoryItem,
};
