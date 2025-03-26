// from guide https://byui-cse.github.io/cse340-ww-content/views/select-products-ajax.html
"use strict";

const tableRowTemplate = (row) => {
  return `
  <tr>
    <td>${row.inv_make} ${row.inv_model}</td>
    <td><a href='/inv/edit/${row.inv_id}' title="Click to update">Modify</a></td>
    <td><a href='/inv/delete/${row.inv_id}' title="Click to delete">Delete</a></td>
  </tr>
  `;
};

const tableTemplate = (data) => {
  return `
  <thead>
    <tr>
      <th colspan="3">Vehicle Name</th>
    </tr>
  </thead>
  <tbody>
    ${data.map(tableRowTemplate).join("")}
  </tbody>
  `;
};

// Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById("inventoryDisplay");
  let dataTable = tableTemplate(data);
  // Display the contents in the Inventory Management view
  inventoryDisplay.innerHTML = dataTable;
}

// Get a list of items in inventory based on the classification_id
let classificationList = document.querySelector("#classificationList");
classificationList.addEventListener("change", function () {
  let classification_id = classificationList.value;
  console.log(`classification_id is: ${classification_id}`);
  let classIdURL = "/inv/getInventory/" + classification_id;
  fetch(classIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network response was not OK");
    })
    .then(function (data) {
      console.log(data);
      buildInventoryList(data);
    })
    .catch(function (error) {
      console.log("There was a problem: ", error.message);
    });
});

//   function buildInventoryList(data) {
//   let inventoryDisplay = document.getElementById("inventoryDisplay");
// Set up the table labels
//    let dataTable = "<thead>";
//   dataTable += "<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>";
//   dataTable += "</thead>";
// Set up the table body
//   dataTable += "<tbody>";
// Iterate over all vehicles in the array and put each in a row
//   data.forEach(function (element) {
//     console.log(element.inv_id + ", " + element.inv_model);
//     dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
//     dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
//     dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
//   });
//   dataTable += "</tbody>";
//   inventoryDisplay.innerHTML = dataTable;
//  }
