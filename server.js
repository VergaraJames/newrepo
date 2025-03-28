/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database')
const accountRoute = require('./routes/accountRoute');
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

/* ***********************
 * Middleware 
 * (From video https://www.youtube.com/watch?v=bJG6d7rRusU)
 * ************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// for parsing application/x-www-form-urlencoded
//  Process Registration
// Unit 4 Process registration activity
// From video https://www.youtube.com/watch?v=7DHezZ7AO-Y
// Guide from https://blainerobertson.github.io/340-js/views/account-process-register.html
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//unit 5, login activity
app.use(cookieParser())
// unit 5, Login proccess activity
app.use(utilities.checkJWTToken)

// Express Messages Middleware
// From instructions https://blainerobertson.github.io/340-js/views/session-message.html
app.use(require("connect-flash")())
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);
// Index route - Unit 3, activity
app.get("/", utilities.handleErrors(baseController.buildHome));
// Inventory routes - Unit 3, activity
app.use("/inv", require("./routes/inventoryRoute"));
// Account routes - Unit 4, Activity
// from guide https://blainerobertson.github.io/340-js/views/account-registration.html
app.use("/account", require("./routes/accountRoute"));
app.use("/watchlist", require("./routes/watchListRoute"))
// Server crash
app.get("/trigger-500-error", (req, res, next) => {
  const undefinedValue = undefined;
  undefinedValue.ExistentProperty;
});

// 404 File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 * Unit 3, Basic Error Handling Activity
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if (err.status == 404) { message = err.message } else { message = "Oh no! There was a crash. Maybe try a different route?" }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
