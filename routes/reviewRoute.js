const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities/");
const reviewValidate = require("../utilities/review-validation");


// Final Project
// Route to add a Review
router.post(
  "/add",
  utilities.checkJWTToken,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
);

// Final Project
// Route to edit a Review
router.get(
  "/edit/:review_id",
  utilities.checkJWTToken,
  utilities.handleErrors(reviewController.buildEditReviewView)
);

// Final Project
// Route to Update a Review
router.post(
  "/update",
  utilities.checkJWTToken,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.updateReview)
);

// Final Project
// Route to delete a Review
router.post(
  "/delete",
  utilities.checkJWTToken,
  utilities.handleErrors(reviewController.deleteReview)
);

module.exports = router;