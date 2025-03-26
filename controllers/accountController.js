/* *****************************
 * Account Controller
 * Unit 4, deliver login view activity
 * From video (https://www.youtube.com/watch?v=5H0aIxO1oC0)
 ******************************** */
const accountModel = require("../models/account-model");
const utilities = require("../utilities/");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
    req.flash("notice", "Please check your credentials and try again.");
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
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(501).redirect("/account/login");
    }
  } catch (error) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(501).redirect("/account/login");
  }
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
 *  Process Registration
 *  Unit 4 Process registration activity
 *  From video https://www.youtube.com/watch?v=7DHezZ7AO-Y
 *  Guide from https://blainerobertson.github.io/340-js/views/account-process-register.html
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Deliver management view
 * *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  let accountInfo = await accountModel.getAccountById(
    res.locals.accountData.account_id
  );
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ****************************************
 * Updated with unit 5, Login process
 * Guide from https://byui-cse.github.io/cse340-ww-content/views/login.html
 * *************************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id } = req.params;
  const accountResult = await actModel.getAccountById(account_id);
  if (res.locals.loggedin) {
    if (accountResult) {
      res.status(201).render("account/update-account", {
        title: "Edit Account",
        nav,
        errors: null,
        accountData: accountResult,
      });
    } else {
      req.flash("notice", "We could not find the requested account.");
      res.status(501).redirect(`/account`);
    }
  } else {
    req.flash("notice", "Please login");
    res.status(501).redirect("/account/login");
  }
}
/* ****************************************
 * Updated with unit 5, Login process
 * Guide from https://byui-cse.github.io/cse340-ww-content/views/login.html
 * *************************************** */
async function updateAccount(req, res, next) {
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  const accountResult = await actModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );
  if (res.locals.loggedin) {
    if (accountResult) {
      delete accountResult.account_email;
      utilities.updateJWTAccountInfo(accountResult, req, res, next);
      req.flash("notice", "Account has been updated successfully!");
      res.status(201).redirect("/account");
    } else {
      req.flash("notice", "There was an error updating the account");
      res.status(501).redirect(`/account/update/${account_id}`);
    }
  } else {
    req.flash("notice", "Please login");
    res.redirect("/account/login");
  }
}
/* ****************************************
 * Updated with unit 5, Login process
 * Guide from https://byui-cse.github.io/cse340-ww-content/views/login.html
 * *************************************** */
async function updateAccountPassword(req, res, next) {
  const { account_password, account_id } = req.body;
  let hashedPassword;
  try {
    hashedPassword = bcrypt.hashSync(account_password, 10);
  } catch (error) {
    console.error("There was an error");
    console.log(error);
  }
  const updatePasswordResult = await actModel.updatePassword(
    hashedPassword,
    account_id
  );
  if (res.locals.loggedin) {
    if (updatePasswordResult) {
      req.flash("notice", "Password has been updated successfully!");
      res.status(201).redirect("/account");
    } else {
      req.flash("notice", "There was an error updating the password");
      res.status(501).redirect(`/account/update/${account_id}`);
    }
  } else {
    req.flash("notice", "Please login");
    req.redirect("/account/login");
  }
}
/* ****************************************
 * Updated with unit 5, Login process
 * Guide from https://byui-cse.github.io/cse340-ww-content/views/login.html
 * *************************************** */
async function logout(req, res, next) {
  if (req.cookies.jwt) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).redirect("/account");
      } else {
        res.clearCookie("jwt");
        res.clearCookie("sessionId");
        res.locals;
        res.status(201).redirect("/");
      }
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  buildManagement,
  accountLogin,
  buildUpdateAccount,
  updateAccount,
  updateAccountPassword,
  logout,
};
