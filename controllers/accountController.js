/* *****************************
 * Account Controller
 * Unit 4, deliver login view activity
 * From video (https://www.youtube.com/watch?v=5H0aIxO1oC0)
 ******************************** */
const accountModel = require("../models/account-model");
const utilities = require("../utilities/");
const bcrypt = require("bcryptjs");
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
 *  Deliver registration view
 * ***************************************
 * From the video https://www.youtube.com/watch?v=5H0aIxO1oC0
 * from guide https://blainerobertson.github.io/340-js/views/account-registration.html
 * and https://blainerobertson.github.io/340-js/views/server-validation.html */
 async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver management view
 * *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null
  })
}

/* ****************************************
 *  From video https://www.youtube.com/watch?v=7DHezZ7AO-Y
 *  Guide from https://blainerobertson.github.io/340-js/views/account-process-register.html
 * *****************************************
 *  Process Login
 * *************************************** */
async function processLogin(req, res, next) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData ||!bcrypt.compareSync(account_password, accountData.account_password)) {
    req.flash("notice", "Invalid email or password. Try again");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      account_email,
    });
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Password is incorrect. Try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
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
    req.flash("notice", "Sorry, there was an error processing the registration.");
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
    req.flash("notice", `Congratulations, you are registered ${account_firstname}. Please log in.`);
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Register",
      nav,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegistration,
  buildManagement,
  processLogin,
  registerAccount,
};
