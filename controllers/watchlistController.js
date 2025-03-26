const utilities = require("../utilities");
const watchlistUtils = require("../utilities/watchlist");
const watchlistModel = require("../models/watchlist-model");
let watchlistController = {};

watchlistController.watchlistHome = async (req, res, next) => {
  const nav = await utilities.getNav();
  const watchlistResult = res.locals.watchList;
  console.log("###########################################", watchlistResult);
  if (watchlistResult.length > 0) {
    const watchlist = watchlistUtils.watchlistTemplate(watchlistResult);
    res.render("./watchlist/", {
      title: "My Watchlist",
      nav,
      errors: null,
      watchlist,
    });
  } else {
    res.render("./watchlist/", {
      title: "My Watchlist",
      nav,
      errors: null,
      watchlist: "<h3>You haven't added any vehicle to your list.</h3>",
    });
  }
};

watchlistController.addToWatchList = async (req, res, next) => {
  const { account_id, inv_id } = req.body;
  const watchlistResult = await watchlistModel.addToWatchList(
    account_id,
    inv_id
  );
  if (watchlistResult) {
    req.flash("notice", "Vehicle added to your watchlist successfuly!");
    res.status(201).redirect(req.get("referer").replace(req.get("origin"), ""));
  } else {
    req.flash(
      "notice",
      "There was an error adding the vehicle to your watchlist!"
    );
    res.status(501).redirect(req.get("referer").replace(req.get("origin"), ""));
  }
};

watchlistController.removeFromWatchList = async (req, res, next) => {
  const { watchlist_id } = req.params;
  const watchlistResult = await watchlistModel.removeFromList(watchlist_id);
  res.locals.watchList = await watchlistModel.getWatchList(
    res.locals.accountData.account_id
  );

  if (watchlistResult) {
    req.flash("notice", "Vehicle removed from your watchlist successfuly!");
    res.status(201).redirect(req.get("referer").replace(req.get("origin"), ""));
  } else {
    req.flash(
      "notice",
      "There was an error removing the vehicle from your watchlist!"
    );
    res.status(501).redirect(req.get("referer").replace(req.get("origin"), ""));
  }
};

module.exports = watchlistController;
