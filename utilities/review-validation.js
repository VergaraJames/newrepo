// Required module imports
const { body, validationResult } = require("express-validator");
const utilities = require("./");
const validate = {};

// to apply review validation rules
validate.reviewRules = () => {
  return [
    body("review_text") 
      .trim() // Remove spaces
      .isLength({ min: 1 }) // Ensure the text contains at least one character
      .withMessage("Review text is required.") // Error message if validation fails
  ];
};

// Function to check review data
validate.checkReviewData = async (req, res, next) => {
  const { review_text, inv_id, review_id } = req.body; 
  let nav = await utilities.getNav(); 
  const errors = validationResult(req); // Check for validation errors

  if (!errors.isEmpty()) {
    let view = review_id ? "account/edit-review" : "inventory/detail/" + inv_id; 
    return res.render(view, { 
      title: review_id ? "Edit Review" : "Vehicle Details", 
      nav, 
      review_text, 
      inv_id, 
      review_id, 
      errors, 
      accountData: res.locals.accountData // Account-related data
    });
  }
  next(); // Proceed to the next middleware
};

// Export the validate object
module.exports = validate;