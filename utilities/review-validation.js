const { body, validationResult } = require("express-validator");
const utilities = require("./");

const validate = {};

validate.reviewRules = () => {
  return [
    body("review_text")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Review text is required.")
  ];
};

validate.checkReviewData = async (req, res, next) => {
  const { review_text, inv_id, review_id } = req.body;
  let nav = await utilities.getNav();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let view = review_id ? "account/edit-review" : "inventory/detail/" + inv_id;
    return res.render(view, {
      title: review_id ? "Edit Review" : "Vehicle Details",
      nav,
      review_text,
      inv_id,
      review_id,
      errors,
      accountData: res.locals.accountData
    });
  }
  next();
};

module.exports = validate;