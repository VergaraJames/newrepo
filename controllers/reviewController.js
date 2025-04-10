/* Review process for the final project */

const reviewModel = require("../models/review-model");
const utilities = require("../utilities/");
const reviewValidate = require("../utilities/review-validation");

/* ***************************
 *  Function to add a new review
 * *************************** */
async function addReview(req, res) {
  const { review_text, inv_id } = req.body;
  const accountData = res.locals.accountData;
  try {
    const result = await reviewModel.addReview(review_text, inv_id, accountData.account_id);
    if (result.rowCount > 0) {
      req.flash("notice", "Review added successfully!");
      res.redirect(`/inv/detail/${inv_id}`);
    } else {
      req.flash("notice", "Failed to add review.");
      res.redirect(`/inv/detail/${inv_id}`);
    }
  } catch (error) {
    req.flash("notice", "Error adding review.");
    res.redirect(`/inv/detail/${inv_id}`);
  }
}

/* ***************************
 *  Function to display edit review view
 * *************************** */
async function buildEditReviewView(req, res) {
  const review_id = req.params.review_id;
  const accountData = res.locals.accountData;
  let nav = await utilities.getNav();
  const review = await reviewModel.getReviewsByAccountId(accountData.account_id);
  const reviewData = review.rows.find(r => r.review_id == review_id);
  if (!reviewData || reviewData.account_id != accountData.account_id) {
    req.flash("notice", "Review not found");
    return res.redirect("/account/");
  }
  res.render("account/edit-review", {
    title: "Edit Review",
    nav,
    review_text: reviewData.review_text,
    review_id,
    inv_id: reviewData.inv_id,
    errors: null
  });
}

/* ***************************
 *  Function to delete a review
 * *************************** */
async function deleteReview(req, res) {
  const { review_id } = req.body;
  const accountData = res.locals.accountData;
  try {
    const result = await reviewModel.deleteReview(review_id, accountData.account_id);
    if (result.rowCount > 0) {
      req.flash("notice", "Review deleted successfully!");
    } else {
      req.flash("notice", "Error deleting review.");
    }
    res.redirect("/account/");
  } catch (error) {
    req.flash("notice", "Error deleting review.");
    res.redirect("/account/");
  }
}

/* ***************************
 *  Function to update a review
 * *************************** */
async function updateReview(req, res) {
  const { review_text, review_id, inv_id } = req.body;
  const accountData = res.locals.accountData;
  try {
    const result = await reviewModel.updateReview(review_id, review_text, accountData.account_id);
    if (result.rowCount > 0) {
      req.flash("notice", "Review updated successfully!");
      res.redirect("/account/");
    } else {
      req.flash("notice", "Error updating review.");
      res.redirect(`/review/edit/${review_id}`);
    }
  } catch (error) {
    req.flash("notice", "Error updating review.");
    res.redirect(`/review/edit/${review_id}`);
  }
}

module.exports = { addReview, buildEditReviewView, deleteReview, updateReview };