/**
 * Executes a simple row action by making an API call with the provided data.
 *
 * @param {Object} formData - The data to be sent with the API call.
 * @param {string} optionKey - The key of the action to be performed.
 * @param {Object} zangoTable - The table object used for drawing.
 * @param {string} overlaySelector - The selector for the overlay element.
 * @return {Promise<void>} A promise that resolves when the action is complete.
 */
const simpleRowAction = async (
  formData,
  optionKey,
  zangoTable,
  overlaySelector
) => {
  try {
    let url = `./?action_type=row&action_key=${optionKey}`;
    let result = await makeApiCall(url);

    if (result.success) {
      $(this).data("optionKey", "");
      $(overlaySelector).css({ display: "none" });
      zangoTable.draw();
    } else {
      let errorMessage = result.response?.message || "An error occurred.";
      alert(errorMessage);
      $(overlaySelector).css({ display: "none" });
      zangoTable.draw();
    }
  } catch (error) {
    console.error("Error:", error);
    $(overlaySelector).css({ display: "none" });
    zangoTable.draw();
  }
};

export { simpleRowAction };