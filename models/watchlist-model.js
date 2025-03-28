const pool = require("../database");

let watchlistModel = {};

watchlistModel.getWatchList = async (account_id) => {
  try {
    const result = await pool.query(
      `SELECT wl.watch_list_id, wl.inv_id, wl.account_id, iv.inv_make, iv.inv_model, iv.inv_year 
      FROM public.watch_list wl
      JOIN account ac
      ON wl.account_id = ac.account_id
      JOIN inventory iv
      ON wl.inv_id = iv.inv_id
      WHERE wl.account_id = $1
      ORDER BY wl.watch_list_id ASC`,
      [account_id]
    );
    return result.rows;
  } catch (error) {
    console.log("getWathcList error:", error);
  }
};

watchlistModel.addToWatchList = async (account_id, inv_id) => {
  try {
    const result = await pool.query(
      `INSERT INTO watch_list (account_id, inv_id) VALUES ($1, $2) RETURNING *`,
      [account_id, inv_id]
    );
    return result;
  } catch (error) {
    throw new Error("Error in addToWatchList: ", error);
  }
};

watchlistModel.removeFromList = async (watchlist_id) => {
  try {
    const result = await pool.query(
      `DELETE FROM watch_list WHERE watch_list_id = $1 RETURNING *`,
      [watchlist_id]
    );
    return result.rows;
  } catch (error) {
    throw new Error("Error in removeFromList: ", error);
  }
};

module.exports = watchlistModel;
