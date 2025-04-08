/* *****************************
 * Account Controller
 * Unit 4, deliver login view activity
 * From video (https://www.youtube.com/watch?v=5H0aIxO1oC0)
 ******************************** */
const jwt = require("jsonwebtoken");
require("dotenv").config();
const reviewModel = require("../models/review-model");
const accountModel = require("../models/account-model");
const utilities = require("../utilities/");
const bcrypt = require("bcryptjs");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * ***************************************
 * From the video https://www.youtube.com/watch?v=5H0aIxO1oC0
 * from guide https://blainerobertson.github.io/340-js/views/account-registration.html
 * and https://blainerobertson.github.io/340-js/views/server-validation.html */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver management view
*   Including Review proccess to the final project 
 * *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  const accountData = res.locals.accountData;
  let reviews = []; 
  try {
    const reviewData = await reviewModel.getReviewsByAccountId(accountData.account_id);
    reviews = reviewData.rows || []; 
  } catch (error) {
    console.error("Error getting review information:", error);
    req.flash("notice", "Error getting review information.");
  }
  res.render("account/management", {
    title: "Account Management",
    nav,
    reviews,
    errors: null
  });
}


/* ****************************************
 *  Build Update Account View - step 3 of task 5
 * ************************************ */
async function buildUpdateAccountView(req, res) {
  let nav = await utilities.getNav();
  const accountData = res.locals.accountData; // From checkJWTToken
  res.render("account/update-account", {
    title: "Update Account",
    nav,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 *  Unit 4 Process registration activity
 *  From video https://www.youtube.com/watch?v=7DHezZ7AO-Y
 *  Guide from https://blainerobertson.github.io/340-js/views/account-process-register.html
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.");
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
    return;
  }

  const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword);

  if (regResult) {
    req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}


/* ****************************************
 *  From video https://www.youtube.com/watch?v=7DHezZ7AO-Y
 *  Guide from https://blainerobertson.github.io/340-js/views/account-process-register.html
 * *****************************************
 *  Process Login
 * Updated with unit 5, Login process
 * Guide from https://byui-cse.github.io/cse340-ww-content/views/login.html
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your email. Try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }
      return res.redirect("/account/");
    } else {
      req.flash("message notice", "Password is incorrect. Try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access not permitted");
  }
}

/* ****************************************
 * Updated with unit 5, Login process
 * Guide from https://byui-cse.github.io/cse340-ww-content/views/login.html
 * *************************************** */
/* ****************************************
 *  Update Account Information - for user name and email
 * ************************************ */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } = req.body;
  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);
  if (updateResult) {
    const updatedAccount = await accountModel.getAccountById(account_id);
    delete updatedAccount.account_password;
    const accessToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
    }
    req.flash("notice", "Account updated successfully");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Account update failed");
    res.status(501).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    });
  }
}


/* ****************************************
 * Change Password - for password
 * Updated with unit 5, Login process
 * Guide from https://byui-cse.github.io/cse340-ww-content/views/login.html
 * *************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;
  const hashedPassword = await bcrypt.hash(account_password, 10);
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword);
  if (updateResult) {
    req.flash("notice", "Password changed successfully");
    res.redirect("/account/");
  } else {
    const accountData = await accountModel.getAccountById(account_id);
    req.flash("notice", "Password change failed");
    res.status(501).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id
    });
  }
}

/* ****************************************
 * Updated with unit 5, Login process
 * Guide from https://byui-cse.github.io/cse340-ww-content/views/login.html
 * *************************************** */
async function accountLogout(req, res, next) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}

module.exports = {
  buildLogin,
  buildRegister,
  buildManagement,
  registerAccount,
  accountLogin,
  accountLogout,
  buildUpdateAccountView,
  updateAccount,
  changePassword
};