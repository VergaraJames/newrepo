let watchlistUtils = {}

const watchListItemTemplate = (item) => {
  return `
  <li class="watchlist_item">
    <a href="/inv/detail/${item.inv_id}">${item.inv_year} ${item.inv_make} ${item.inv_model}</a>
  </li>`
}

watchlistUtils.watchlistTemplate = (data) => {
  return `
  <ul>
    ${data.map(watchListItemTemplate).join("")}
  </ul>`
}

watchlistUtils.invInCheckList = (data, inv_id) => {
  if (data) {
    return data.filter(item => item.inv_id == inv_id)
  }
  return false
}

watchlistUtils.buildCheckListButton = (res, req) => {
  let watchlistItem = watchlistUtils.invInCheckList(res.locals.watchList, req.params.vehicleId)
  console.log(`En inventario: ${Boolean(watchlistItem.length)}, Vehicle ID: ${req.params.vehicleId}`)
  if (res.locals.loggedin) {
    if (Boolean(watchlistItem.length)) {
      return `
      <div id="removeWatchList">
        <a class="jumbotron_action" href="/watchlist/remove/${watchlistItem[0].watch_list_id}">Remove from watchlist</a>
      </div>`
    } else {
      return `<form id="wathlistForm" action="/watchlist/add" method="post">
        <input type="hidden" name="account_id" value="${res.locals.accountData.account_id}">
        <input type="hidden" name="inv_id" value="${req.params.vehicleId} ">
        <input type = "submit" value = "Add to watchlist!">
      </form > `
    }
  }
}

module.exports = watchlistUtils