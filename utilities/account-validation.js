const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const accountModel = require("../models/account-model");

/*  **********************************
 *  Registration Data Validation Rules
 *  From video https://www.youtube.com/watch?v=zkoPq7nbH3s
 *  From guide https://blainerobertson.github.io/340-js/views/server-validation.html
 * ********************************* */
validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 *  From video https://www.youtube.com/watch?v=zkoPq7nbH3s
 *  From guide https://blainerobertson.github.io/340-js/views/server-validation.html
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Register",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // Email is required and must be a valid format
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    // Password is required
    body("account_password")
      .trim()
      .notEmpty()
      .isLength({ min: 12 })
      .withMessage("Does not meet password requirements."),
  ];
};

/* ******************************
 * Check Login Data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email, account_password } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
      account_password,
    });
    return;
  }
  next();
};

/* ******************************
 * Update account and Change password Validation
 * ***************************** */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .matches(/^[A-Za-z -]+$/)
      .withMessage("First name must contain only letters, spaces, or hyphens"),
    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .matches(/^[A-Za-z -]+$/)
      .withMessage("Last name must contain only letters, spaces, or hyphens"),
    body("account_email").trim().isEmail().withMessage("Valid email required"),
    body("account_id").isInt().withMessage("Invalid account ID"),
  ];
};

validate.changePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/
      )
      .withMessage(
        "Password must be 12 + characters with 1 number, 1 capital, 1 special character"
      ),
    body("account_password_confirm")
      .trim()
      .custom((value, { req }) => value === req.body.account_password)
      .withMessage("Passwords must match"),
    body("account_id").isInt().withMessage("Invalid account ID"),
  ];
};

/* ******************************
 * Validation Handler
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  let nav = await utilities.getNav();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    });
  }
  next();
};

validate.checkPasswordData = async (req, res, next) => {
  const { account_password, account_password_confirm, account_id } = req.body;
  let nav = await utilities.getNav();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors,
      account_password: "",
      account_password_confirm: "",
      account_id,
    });
  }
  next();
};

module.exports = validate;
