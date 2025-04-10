const pool = require("../database/");

/* ***************************
 *  Update Review
 *  Final Project
 * ************************** */
async function updateReview(review_id, review_text, account_id) {
  try {
    const sql =
      "UPDATE review SET review_text = $1 WHERE review_id = $2 AND account_id = $3 RETURNING *";
    return await pool.query(sql, [review_text, review_id, account_id]);
  } catch (error) {
    console.error("Update Review Error: " + error);
    throw error;
  }
}

/* ***************************
 *  Get Reviews by Inventory Id
 *  Final Project
 * ************************** */
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname 
      FROM review r 
      JOIN account a ON r.account_id = a.account_id 
      WHERE r.inv_id = $1 
      ORDER BY r.review_date DESC
    `;
    return await pool.query(sql, [inv_id]);
  } catch (error) {
    console.error("Get Reviews Error: " + error);
    throw error;
  }
}

/* ***************************
 *  Get Reviews by Account Id
 *  Final Project
 * ************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const sql = `
      SELECT r.*, i.inv_make, i.inv_model 
      FROM review r 
      JOIN inventory i ON r.inv_id = i.inv_id 
      WHERE r.account_id = $1 
      ORDER BY r.review_date DESC
    `;
    return await pool.query(sql, [account_id]);
  } catch (error) {
    console.error("Get Reviews by Account Error: " + error);
    throw error;
  }
}

/* ***************************
 *  Delete Review
 *  Final Project
 * ************************** */
async function deleteReview(review_id, account_id) {
  try {
    const sql = "DELETE FROM review WHERE review_id = $1 AND account_id = $2";
    return await pool.query(sql, [review_id, account_id]);
  } catch (error) {
    console.error("Delete Review Error: " + error);
    throw error;
  }
}

/* ***************************
 *  Add Review
 *  Final Project
 * ************************** */
async function addReview(review_text, inv_id, account_id) {
  try {
    const sql =
      "INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *";
    return await pool.query(sql, [review_text, inv_id, account_id]);
  } catch (error) {
    console.error("Add Review Error: " + error);
    throw error;
  }
}

// Corrected ordering issue in function module.exports (Comment added)
module.exports = {
  addReview,
  deleteReview,
  getReviewsByAccountId,
  getReviewsByInvId,
  updateReview,
};