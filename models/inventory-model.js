const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* module.exports = {getClassifications}

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
    )
    console.log(`Query for classification ${classification_id} returned ${data.rows.length} results`);
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
    return [];
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
    )
    return data.rows[0] // Return just one vehicle or null if not found
  } catch (error) {
    console.error("getVehicleById error " + error)
    return null // Return null on error or if vehicle not found
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById};