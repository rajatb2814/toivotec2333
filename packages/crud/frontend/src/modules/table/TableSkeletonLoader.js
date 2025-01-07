/**
 * Displays a loader component by adding skeleton rows to a table.
 *
 * @param {Array} columns - An array of column objects representing the table structure.
 * @return {void} This function does not return anything.
 */

const showLoaderComponent = (columns) => {
  $(document).find(".z-page-loader").css({ visibility: "visible" });

  // Clear table body
  $(document).find("#zangotable tbody").html("");

  // Create skeleton rows
  const table = $(".dataTables_scrollHeadInner table");
  for (let i = 0; i < 10; i++) {
    const row = $("<tr>");
    for (let j = 0; j < columns.length; j++) {
      const rowData = $("<td>").html(`<div class="z-skeleton-loader"></div>`);
      row.append(rowData);
    }
    table.append(row);
  }
};

/**
 * Removes the skeleton loader rows from the table and hides the page loader.
 *
 * @return {void} This function does not return anything.
 */
const hideLoaderComponent = () => {
  $(document).find(".z-skeleton-loader").closest("tr").remove();
  $(document).find(".z-page-loader").css({ visibility: "hidden" });
};

export { showLoaderComponent, hideLoaderComponent };
