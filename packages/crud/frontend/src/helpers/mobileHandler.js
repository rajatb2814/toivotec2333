/**
 * Handles the click event on a card and updates the details offcanvas body with the provided data for mobile devices.
 *
 * @param {Object} data - The data object containing the details to be displayed.
 * @return {void} This function does not return a value.
 */
function handleCardClick(data) {
  const ignore_meta_details = [
    "cardInfo",
    "title",
    "status_label",
    "status_color",
  ];
  $(".details-offcanvas-body").html(`
       ${data.title && `<h5 class="detail-title">${data?.title}</h5>`}
    
        ${data.status_label && `<span class="detail-status" style="background-color:${data.status_color};">${data.status_label}</span>`}
        ${Object.keys(data)
          .map((detail_key, index) => {
            if (!ignore_meta_details.includes(detail_key) && data[detail_key]) {
              return `
            <div class="general-details">
                <div class="detail-label">${detail_key}</div>
                <div class="detail-value">${data[detail_key]}</div>
            </div>
        `;
            }
          })
          .join("")}

        `);
}

export { handleCardClick };
