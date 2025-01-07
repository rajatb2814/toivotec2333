/**
 * Maps the table data for a responsive device.
 *
 * @param {Object} responseData - The response data containing the table data.
 * @param {Object} tableMetadata - The metadata of the table.
 * @return {Array} The mapped table data for the responsive device.
 */

const mapTableDataForResponsiveDevice = (responseData, tableMetadata) => {
  if (responseData.data.length === 0) return [];
  const columns = tableMetadata.columns;

  const mappedData = responseData.data.map((dataItem) => {
    const mappedItem = {
      title: dataItem["field_title"] ? dataItem["field_title"] : "",
      status_color:
        dataItem["workflow_status"] &&
        dataItem["workflow_status"]["status_color"]
          ? dataItem["workflow_status"]["status_color"]
          : "",
      status_label:
        dataItem["workflow_status"] &&
        dataItem["workflow_status"]["status_label"]
          ? dataItem["workflow_status"]["status_label"]
          : "",
    };

    for (const column of columns) {
      const { name, display_name } = column;
      if (dataItem.hasOwnProperty(name) && display_name) {
        mappedItem[display_name] = dataItem[name];
      }
    }
    // Include primaryData if available
    mappedItem.cardInfo = {};
    for (const data of tableMetadata["card_primary_fields"]) {
      if (dataItem.hasOwnProperty(data)) {
        mappedItem.cardInfo[data] = dataItem[data];
      }
    }
    return mappedItem;
  });
  return mappedData;
};

export { mapTableDataForResponsiveDevice };
