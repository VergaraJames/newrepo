const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const watchlistController = require("../controllers/watchlistController");

router.get("/", utilities.handleErrors(watchlistController.watchlistHome));
router.get(
  "/remove/:watchlist_id",
  utilities.handleErrors(watchlistController.removeFromWatchList)
);

router.post("/add", utilities.handleErrors(watchlistController.addToWatchList));

module.exports = router;
