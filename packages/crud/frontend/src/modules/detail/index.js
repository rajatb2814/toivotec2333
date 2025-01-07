import { ZToast } from "../../services/toaster.js";
import { makeApiCall } from "../../services/api.js";
import {
  getQueryParamValue,
  doesQueryParamExist
} from "../../helpers/misc.js";
import { getCookie } from "../../helpers/cookie.js";

import {
  applyAppThemeConfig,
} from "../../helpers/setAppThemeConfig.js";


applyAppThemeConfig(app_theme_config);

$(document).ready(function () {
  // let detailViewModal = new bootstrap.Offcanvas(
  //   document.getElementById("detailViewModal")
  // );
  // detailViewModal.show();

   showCloseBtn = function() {
    console.log("close button displayed");
    window.parent.document.getElementById(
      "detailViewIframeClose"
    ).style.display = "block";
  }


  function handleResize() {
    // detailViewModal.show();
  }

  $(window).resize(handleResize);

  // Current URL
  const currentUrl = window.location.href;

  // Create a URLSearchParams object from the current URL
  const urlSearchParams = new URLSearchParams(window.location.search);

  $("#close-detail-view").on("click", function () {
    // Remove a specific query parameter
    urlSearchParams.delete("pk");
    urlSearchParams.delete("view");
    urlSearchParams.delete("action");

    // Create a new URL with the updated query parameters
    const updatedUrl = `${currentUrl.split("?")[0]}?${urlSearchParams.toString()}`;

    // Update the URL without reloading the page
    window.history.pushState({ path: updatedUrl }, "", updatedUrl);
    window.location.reload();
  });

  // fetch detailview data
  async function fetchAndSetDetailView(pk) {
    // Add or update a query parameter
    urlSearchParams.set("pk", pk);

    // Create a new URL with the updated query parameters
    const updatedUrl = `${currentUrl.split("?")[0]}?${urlSearchParams.toString()}`;

    // Update the URL without reloading the page
    window.history.pushState({ path: updatedUrl }, "", updatedUrl);

    try {
      // update detail view url, type, payload here
      let url = `./?pk=${pk}&action=fetch_item_details&view=detail`;
      let result = await makeApiCall(url, "GET", {
        "X-CSRFToken": getCookie("csrftoken"),
      });

      if (result.success) {
        return result.response;
      } else {
        if (result.response.message) {
          ZToast("error", "Error", result.response.message, 3000);
        } else {
          ZToast("error", "Error", "Something went wrong", 3000);
        }
      }
    } catch (error) {
      ZToast("error", "Error", "Something went wrong", 3000);
      return true; // update with actual error
    }
  }



  // create detail view
  function createDetailView(pk, data) {
    function getValueFromEnum(key, value, jsonData) {
      if (
        !jsonData ||
        !jsonData.json_schema ||
        !jsonData.json_schema.properties[key]
      ) {
        return null; // If the necessary structure is not present, return null
      }

      const enumArray = jsonData.json_schema.properties[key].enum;
      const enumNamesArray = jsonData.json_schema.properties[key].enumNames;

      const index = enumArray.indexOf(value);

      if (index !== -1 && index < enumNamesArray.length) {
        return enumNamesArray[index];
      }

      return null; // If value not found in enum array or index exceeds enumNamesArray length, return null
    }

    function getFieldValues(jsonData) {
      const formData = jsonData.form_data;
      const fieldValues = {};

      for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
          const value = formData[key];
          if (
            jsonData.json_schema.properties[key] &&
            jsonData.json_schema.properties[key].enum &&
            jsonData.json_schema.properties[key].enumNames
          ) {
            fieldValues[key] = getValueFromEnum(key, value, jsonData);
          } else {
            fieldValues[key] = value; // If enum and enumNames keys don't exist, keep the original value
          }
        }
      }

      return fieldValues;
    }

    function copyToClipboard(text) {
        // Create a temporary textarea element
        const textarea = document.createElement("textarea");

        // Set the value of the textarea to the text to be copied
        textarea.value = text;

        // Append the textarea to the document body (required for copying)
        document.body.appendChild(textarea);

        // Select the text content in the textarea
        textarea.select();

        // Execute the copy command
        document.execCommand("copy");

        textarea.style.display = "none"

        ZToast("success", "Copy", "Link copied successfully!", 3000);

        // Remove the textarea from the document
        document.body.removeChild(textarea);
    }

    const primaryColor = crudCssVariables["--primary-color"] 

    $("#detailViewBody-title").html("");
    $("#detailViewBody-general-details").html("");
    $("#detailViewBody-data-2").html("");
    $("#detailViewTimeline").html("");
    $("#detailview-call-btn").html("");
    $("#detailViewBody-title").append(`
                        <div class="d-flex" style="gap: 32px; align-items: center;">
                            <div style="color: black; font-size: 22px; font-family: Source Sans Pro; font-weight: 600; line-height: 28px; word-wrap: break-word; display: flex; gap: 6px; align-items: center;">
                              <span> ${data?.title} </span> 
                              <span id="copy-to-clipboard" style="cursor: pointer">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.1062 9.82419L15.175 11.7562C14.8445 12.0859 14.3046 12.0867 13.9734 11.7562C13.6422 11.425 13.6422 10.8851 13.9734 10.5539L15.9046 8.62185C16.5125 8.01481 16.8468 7.21169 16.8476 6.36005C16.8476 5.56161 16.5578 4.79833 16.0312 4.21165C15.4789 3.59603 14.6914 3.24447 13.814 3.22025C13.782 3.22025 13.7499 3.21947 13.7171 3.21947C12.7757 3.21947 11.8624 3.59525 11.1983 4.25853L9.43738 6.01947C9.10614 6.35071 8.56706 6.34993 8.23504 6.01947C8.07489 5.85853 7.9866 5.64525 7.9866 5.41791C7.9866 5.19135 8.07566 4.97729 8.23504 4.81635L9.99598 3.05541C11.01 2.04213 12.425 1.48509 13.8584 1.52103C15.2068 1.55775 16.4272 2.10931 17.2944 3.07415C18.1014 3.97259 18.5459 5.14055 18.5459 6.35935C18.5459 7.66559 18.0351 8.89539 17.1062 9.82419Z" fill="${primaryColor}" />
                                <path d="M11.7546 15.1766L9.98273 16.9492C8.97179 17.9602 7.58113 18.5164 6.13033 18.4789C4.78501 18.4422 3.56713 17.8899 2.70213 16.9242C1.89745 16.0258 1.45369 14.861 1.45369 13.6414C1.44197 12.3368 1.94979 11.1032 2.88493 10.1688L4.81617 8.23761C4.97711 8.07667 5.18961 7.98917 5.41695 7.98917C5.64351 7.98917 5.85757 8.07823 6.01851 8.23761C6.17867 8.39854 6.26695 8.61183 6.26695 8.83917C6.26695 9.06573 6.17789 9.27979 6.01851 9.44073L4.08727 11.372C3.47789 11.9813 3.14665 12.786 3.15445 13.6338C3.15445 14.4384 3.44351 15.2041 3.96851 15.79C4.51929 16.404 5.30445 16.7556 6.17711 16.779C7.13649 16.7947 8.09821 16.429 8.78171 15.7462L10.5536 13.9743C10.8833 13.6439 11.4239 13.6431 11.7552 13.9743C12.0856 14.3056 12.0856 14.8454 11.7544 15.1767L11.7546 15.1766Z" fill="${primaryColor}"/>
                                <path d="M6.2016 12.5938L12.5922 6.20239C12.7578 6.03676 12.975 5.95395 13.193 5.95395C13.4102 5.95395 13.6281 6.03676 13.7938 6.20239C14.125 6.53363 14.125 7.07349 13.7938 7.40473L7.40316 13.7961C7.08206 14.1172 6.5227 14.1172 6.2016 13.7961C6.04144 13.6352 5.95316 13.4219 5.95316 13.1946C5.95238 12.968 6.04144 12.7547 6.2016 12.5938Z" fill="${primaryColor}" />
                                </svg>
                              </span> 
                            </div>
                            ${
                              Object.keys(data?.workflow_details).length &&
                              data?.workflow_details?.next_transitions
                                ?.length !== 0
                                ? `<div class="detail-view-context">
                                <button type="button" id="detail-view-context-button">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="Frame 122">
                                            <circle id="Ellipse 8" cx="10" cy="16" r="2" transform="rotate(-90 10 16)" fill="#6C747D"/>
                                            <circle id="Ellipse 9" cx="10" cy="10" r="2" transform="rotate(-90 10 10)" fill="#6C747D"/>
                                            <circle id="Ellipse 10" cx="10" cy="4" r="2" transform="rotate(-90 10 4)" fill="#6C747D"/>
                                        </g>
                                    </svg>
                                </button>
                            </div>`
                                : ""
                            }
                        </div>
            `);

    $("#copy-to-clipboard").on('click', function(){
      copyToClipboard(window.location.href)
    })

    $("#detailViewBody-general-details").append(` 
                         ${
                           typeof data?.workflow_details?.next_transitions ===
                             "object" &&
                           Object?.keys(
                             data?.workflow_details?.next_transitions
                           ).length !== 0
                             ? `<ul class="each-detail-view-dropdown" id="detail-view-context-dropdown">
                                <li class="each-detail-view-dropdown-list">
                                    ${data?.workflow_details?.next_transitions
                                      ?.map((workflow) => {
                                        return `<button type="button" class="each-detail-view-dropdown-option detail-view-workflow" data-pk=${pk} data-workflow=${encodeURIComponent(JSON.stringify(workflow))} data-type="form">
                                                    <span class="label" style="display: flex; gap: 4px;">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M13.408 7.39172L8.52801 2.51171C8.19175 2.17546 7.64801 2.17546 7.32801 2.51171C6.99175 2.84797 6.99175 3.39171 7.32801 3.71171L10.768 7.15171H3.15233C2.68858 7.15171 2.3042 7.53546 2.3042 7.99984C2.3042 8.46359 2.68794 8.84797 3.15233 8.84797H10.7523L7.32801 12.288C6.99175 12.6242 6.99175 13.168 7.32801 13.488C7.48801 13.648 7.71175 13.7442 7.93614 13.7442C8.15988 13.7442 8.36801 13.6642 8.54426 13.488L13.4406 8.59165C13.6006 8.43165 13.6968 8.20791 13.6968 7.98352C13.6643 7.77602 13.568 7.55172 13.408 7.39172Z" fill="black"/>
                                                        </svg> 
                                                        ${workflow?.display_name}
                                                    </span>
                                                    <span class="description">${workflow?.description}</span>
                                                </button>`;
                                      })
                                      .join("")}
                                </li>
                            </ul>`
                             : ""
                         }
                        ${
                          data?.workflow_details?.current_status_meta
                            ? `<div style="padding-left: 8px; padding-right: 8px; padding-top: 5px; padding-bottom: 5px; background: ${data.workflow_details?.current_status_meta?.status_color ? data.workflow_details?.current_status_meta?.status_color : "#c7ced3"}; border-radius: 13px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: inline-flex">
                            <div style="color: white; font-size: 11px; font-family: Lato; font-weight: 700; text-transform: uppercase; line-height: 16px; letter-spacing: 0.40px; word-wrap: break-word">${data.workflow_details?.current_status_meta?.status_label}</div>
                        </div>`
                            : ""
                        }
            `);

    $("#detailViewBody-data-2").append(`
                       <div style="width: 100%; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 32px; display: inline-flex; margin-top: 32px;">
                        ${
                          data?.workflow_details?.tag_details?.length
                            ? `<div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 12px; display: flex">
                            <div style="justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                                <div style="color: #6C747D; font-size: 12px; font-family: Lato; font-weight: 700; text-transform: uppercase; line-height: 20px; letter-spacing: 0.60px; word-wrap: break-word">Tags</div>
                            </div>
                            <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 10px; display: flex">
                                ${data?.workflow_details?.tag_details
                                  ?.map((tag) => {
                                    return `<div style="justify-content: flex-start; align-items: center; gap: 56px; display: inline-flex">
                                                <div class="detailview-switch-label">${tag?.tag_label}</div>
                                                <input type="checkbox" class="detailview-custom-switch" ${(tag?.state === "enabled" && !tag?.is_disable_allowed) || (tag?.state === "disabled" && !tag?.is_enable_allowed) ? "disabled" : ""} ${tag?.state === "enabled" ? "checked" : ""} id=${tag?.name} />
                                                <label class="detailview-label" data-tag-name=${tag?.name} data-switch-status=${(tag?.state === "enabled" && !tag?.is_disable_allowed) || (tag?.state === "disabled" && !tag?.is_enable_allowed)} for=${tag?.name}>
                                                    <div class="detailview-ball"></div>
                                                </label>
                                            </div>`;
                                  })
                                  .join("")}
                            </div>
                        </div>`
                            : ""
                        }

                        <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
                            <div style="color: #6C747D; font-size: 12px; font-family: Lato; font-weight: 700; text-transform: uppercase; line-height: 20px; letter-spacing: 0.60px; word-wrap: break-word; margin-bottom:4px;">General Details</div>
                                ${Object?.keys(data?.general_details?.fields)
                                  ?.map((field) => {
                                    return `<div style="justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex">
                                                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex; min-width: 210px; max-width: 210px;">
                                                    <div style="color: #A3ABB1; font-size: 14px; font-family: Lato; font-weight: 400; line-height: 20px; letter-spacing: 0.20px; word-wrap: break-word">${data.general_details?.fields[field]?.display_name}:</div>
                                                </div>
                                                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                                                    <div style="color: #212429; font-size: 14px; font-family: Lato; font-weight: 700; line-height: 20px; letter-spacing: 0.20px; word-wrap: break-word">${data.general_details?.fields[field]?.value}</div>
                                                </div>
                                            </div>`;
                                  })
                                  .join("")}    
                        </div>
                    </div>
            `);

    $("#detailview-call-btn").html(`
                <div>
                    ${
                      data.telephony_details
                        ? `
                            ${
                              data.telephony_details.phone_number &&
                              data.telephony_details.call_enabled
                                ? `
                                    <button type="button" id="place-call-from-detail" data-phone-number="${data.telephony_details.phone_number}" class="page-add-button">
                                        <span class="page-add-button-label">
                                            Call patient
                                        </span>
                                    </button>
                                `
                                : ""
                            }
                        `
                        : ""
                    } 
                </div>
            `);

    // append main detail

    // append timeline detail
    $("#detailViewTimeline").html(`
                ${
                  Object?.keys(data?.workflow_details).length !== 0 &&
                  data?.configurations?.show_activity_timeline
                    ? `<div style="height: 100%; overflow: auto; position: relative;" id="timeline-container">
                    <ol class="timeline">
                        <div class="timeline-heading">Activity Timeline
                        </div>
                        <div class="detail-view-timeline-filter-container">
                            <div class="detail-view-timeline-filter active" data-filter="statuses">
                                Status
                            </div>
                            ${
                              data.workflow_details?.workflow_transactions?.tags
                                ?.length !== 0
                                ? `<div class="detail-view-timeline-filter" data-filter="tags">
                                Tags
                            </div>`
                                : ""
                            }
                        </div>

                        <div id="timeline-body">
                            ${
                              data.workflow_details?.workflow_transactions
                                ?.statuses
                                ? data.workflow_details?.workflow_transactions?.statuses
                                    ?.map((transaction) => {
                                      let labelsArray =
                                        transaction?.form?.ui_schema[
                                          "ui:order"
                                        ] || [];

                                
                                      return `<li class="timeline-item">
                                            <span class="timeline-item-icon | faded-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <g clip-path="url(#clip0_5250_781)">
                                                        <path d="M8.42791 2.73569C9.31132 2.57584 10.1851 2.57584 11.0673 2.73569C11.1406 2.74771 11.2152 2.75372 11.2885 2.75372C11.8726 2.75372 12.3894 2.33544 12.4976 1.74169C12.6178 1.07341 12.1743 0.433996 11.5036 0.311412C10.3317 0.0986701 9.15866 0.0986701 7.98916 0.311412C7.32088 0.431602 6.87497 1.07104 6.99516 1.74169C7.11535 2.40997 7.75479 2.85587 8.42543 2.73569L8.42791 2.73569Z" fill="white"/>
                                                        <path d="M3.97241 3.48934C3.45198 3.04944 2.67675 3.11433 2.23684 3.63357C1.85223 4.08911 1.51087 4.57228 1.22121 5.07708C0.931548 5.57828 0.682751 6.11674 0.479612 6.67684C0.248843 7.31625 0.580573 8.02179 1.22121 8.25256C1.35943 8.30184 1.49766 8.32588 1.63709 8.32588C2.14189 8.32588 2.61546 8.01218 2.79454 7.51098C2.94478 7.08911 3.13349 6.68286 3.35103 6.30785C3.56617 5.93283 3.8246 5.56988 4.11426 5.22492C4.55417 4.70449 4.48927 3.92926 3.97003 3.48935L3.97241 3.48934Z" fill="white"/>
                                                        <path d="M4.11653 14.7755C3.82686 14.4341 3.56846 14.0675 3.35329 13.6925C3.13815 13.3175 2.95065 12.9113 2.7968 12.4894C2.56603 11.85 1.86169 11.517 1.22108 11.7478C0.581663 11.9786 0.248709 12.6829 0.479479 13.3235C0.678999 13.8836 0.928986 14.4221 1.22108 14.9233C1.51074 15.4245 1.85209 15.9112 2.23671 16.3668C2.4795 16.6564 2.82806 16.8043 3.17782 16.8043C3.45787 16.8043 3.74031 16.7093 3.97108 16.5122C4.49151 16.0723 4.5552 15.2971 4.11531 14.7766L4.11653 14.7755Z" fill="white"/>
                                                        <path d="M18.1697 15.0985C18.2033 15.0396 18.243 14.982 18.2779 14.9231C18.3151 14.8582 18.3512 14.7909 18.386 14.7259C18.398 14.7043 18.4101 14.6827 18.4233 14.661C18.4762 14.5625 18.5242 14.4639 18.5735 14.3654C18.6012 14.3101 18.6264 14.2572 18.6541 14.2019C18.6817 14.1406 18.7093 14.0793 18.7406 14.0144C18.7803 13.9279 18.8175 13.8389 18.8548 13.75C18.8644 13.7259 18.8728 13.7043 18.8824 13.6791C19.344 12.5409 19.5988 11.3005 19.5988 9.99876C19.5988 8.69707 19.3343 7.35574 18.8079 6.13107C18.8019 6.11544 18.7899 6.10342 18.7839 6.0878C18.6336 5.74045 18.4666 5.40149 18.2791 5.0782C17.9894 4.577 17.6456 4.09023 17.2634 3.63469C16.8235 3.11426 16.0483 3.05057 15.5279 3.49046C15.0074 3.93035 14.9437 4.7056 15.3836 5.22603C15.6733 5.56738 15.9317 5.93397 16.1469 6.30895C16.3656 6.68397 16.5495 7.09021 16.7033 7.51209C16.7033 7.5181 16.7094 7.52171 16.7094 7.52772C16.993 8.31858 17.1372 9.1491 17.1372 10.0013C17.1372 10.8534 16.9834 11.7092 16.707 12.4845V12.4905C16.636 12.69 16.5531 12.8847 16.4666 13.0746C16.457 13.0926 16.4509 13.1118 16.4425 13.1299C16.3656 13.2993 16.2791 13.4616 16.1877 13.619C16.1637 13.6647 16.1348 13.708 16.1108 13.7549C16.0243 13.8991 15.9329 14.0409 15.8368 14.1827C15.8055 14.2284 15.7719 14.2717 15.7418 14.3186C15.6433 14.4568 15.5387 14.589 15.4305 14.7212C14.3416 16.0253 12.8115 16.952 11.0699 17.2657C10.8548 17.3053 10.6396 17.333 10.4233 17.3522H10.3956C9.74297 17.4111 9.09152 17.3799 8.43528 17.2633C7.7646 17.1407 7.12758 17.5866 7.005 18.2573C6.88481 18.9255 7.32832 19.565 7.999 19.6875C8.58312 19.7921 9.17448 19.8474 9.7562 19.8474C9.91005 19.8474 10.0639 19.8438 10.2177 19.8354C10.3103 19.8318 10.4028 19.8234 10.4942 19.8174C10.5495 19.8137 10.6048 19.8113 10.66 19.8053C10.7766 19.7933 10.8944 19.7813 11.011 19.7657C11.0422 19.7621 11.0699 19.7597 11.0999 19.7537C11.2225 19.7356 11.3463 19.7164 11.4689 19.6948C11.4846 19.6948 11.4966 19.6911 11.5122 19.6887H11.5218C13.7862 19.2765 15.7861 18.0854 17.2261 16.4051C17.2381 16.393 17.2538 16.3834 17.2658 16.3678C17.6047 15.9711 17.9052 15.5457 18.1708 15.1094C18.1708 15.1094 18.1744 15.1034 18.1768 15.0998L18.1697 15.0985Z" fill="white"/>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_5250_781">
                                                        <rect width="20" height="20" fill="white"/>
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </span>
                                            <div class="timeline-item-wrapper">
                                                <div style="width: 100%; height: 100%; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: inline-flex">
                                                    <div class="timeline-details-head">${transaction.created_at}</div>
                                                    <div style="width: 100%; color: #212429; font-size: 12px; font-family: Lato; font-weight: 700; line-height: 16px; letter-spacing: 0.20px; word-wrap: break-word">Status Changed ${transaction?.from_state_meta?.status_label !== null ? `from ${transaction?.from_state_meta?.status_label}` : ""}  to ${transaction?.to_state_meta?.status_label}</div>
                                                    ${
                                                      labelsArray
                                                        ? `<div class="timeline-details-container timeline-accordion-panel">
                                                        ${labelsArray
                                                          ?.map((key) => {
                                                            // Check if the key exists in jsonSchema.properties
                                                            if (
                                                              transaction?.form
                                                                ?.json_schema
                                                                ?.properties &&
                                                              transaction?.form
                                                                ?.json_schema
                                                                ?.properties[
                                                                key
                                                              ]
                                                            ) {
                                                              // Get the title from jsonSchema.properties
                                                              const title =
                                                                transaction
                                                                  ?.form
                                                                  ?.json_schema
                                                                  ?.properties[
                                                                  key
                                                                ]?.title;

                                                              let fieldValues =
                                                                getFieldValues(
                                                                  transaction?.form
                                                                );
                                                              const value =
                                                                fieldValues[
                                                                  key
                                                                ];
                                                              return `<div class="timeline-detail-block">
                                                                            <div class="timeline-details-head">${title}</div>
                                                                            <div class="timeline-details-data">${value}</div>
                                                                        </div>`;
                                                            } else {
                                                              console.log(
                                                                `Key '${key}' does not exist`
                                                              );
                                                            }
                                                          })
                                                          .join("")}
                                                    </div>`
                                                        : ""
                                                    }
                                                    ${labelsArray?.length > 0 ? `<div class="timeline-more-detaild-btn timeline-accordion">Read more</div>` : ""}
                                                    <div class="timeline-details-head">${transaction?.actor}</div>
                                                </div>
                                            </div>
                                        </li>`;
                                    })
                                    .join("")
                                : "No data available"
                            }
                        </div>
                    </ol>
                    <div id="timeline-scroll-to-top" style="position: fixed; bottom: 30px; right: 20px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="inherit">
                            <path d="M7.39184 2.59224L2.51184 7.47224C2.17558 7.80849 2.17558 8.35224 2.51184 8.67224C2.84809 9.00849 3.39184 9.00849 3.71184 8.67224L7.15184 5.23224L7.15184 12.8479C7.15184 13.3117 7.53558 13.696 7.99997 13.696C8.46371 13.696 8.84809 13.3123 8.84809 12.8479V5.24792L12.2881 8.67224C12.6244 9.00849 13.1681 9.00849 13.4881 8.67224C13.6481 8.51224 13.7443 8.28849 13.7443 8.06411C13.7443 7.84037 13.6643 7.63224 13.4881 7.45598L8.59177 2.55966C8.43177 2.39966 8.20803 2.3034 7.98365 2.3034C7.77614 2.3359 7.55184 2.43223 7.39184 2.59224Z" fill="inherit"/>
                        </svg>
                    </div>
                </div>`
                    : ""
                }
            `);

    function handleAccordian() {
      // handle timeline accordion
      var acc = document.getElementsByClassName("timeline-accordion");

      for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
          var panel = this.previousElementSibling;
          if (panel.style.display === "flex") {
            panel.style.display = "none";
            this.innerHTML = "Read more";
          } else {
            panel.style.display = "flex";
            panel.style.flexDirection = "column";
            panel.style.alignItems = "flex-start";
            panel.style.justifyContent = "flex-start";
            this.innerHTML = "Read less";
          }
        });
      }
    }

    handleAccordian();

    $(".each-detail-view-dropdown-option").on("click", function () {
      window.parent.document.getElementById("detailViewIframeClose").style.display = "none"
    });

    $("#detailViewTagsDrawer #detailViewModalClose").on("click", function() {
      window.parent.document.getElementById(
        "detailViewIframeClose"
      ).style.display = "block";
    })

      $(
        ".row-action-simple-dialog-ctas .confirm-btn, .row-action-simple-dialog-ctas .close-button"
      ).on("click", function () {
        window.parent.document.getElementById(
          "detailViewIframeClose"
        ).style.display = "block";
      });

    $(".detail-view-timeline-filter").on("click", function () {
      let filter = $(this).attr("data-filter");

      let prevFilter = $(".detail-view-timeline-filter.active").attr(
        "data-filter"
      );
      let selectedFilter = $(this).attr("data-filter");

      if (prevFilter !== selectedFilter) {
        $(".detail-view-timeline-filter").removeClass("active");
        $(this).addClass("active");

        function getTimeline(filter) {
          $("#timeline-body").html(`
                            ${
                              data.workflow_details?.workflow_transactions[
                                filter
                              ]
                                ? data.workflow_details?.workflow_transactions[
                                    filter
                                  ]
                                    ?.map((transaction) => {
                                      let labelsArray =
                                        (transaction?.form?.form_data &&
                                          Object.keys(
                                            transaction?.form?.form_data
                                          )) ||
                                        [];

                                      return `<li class="timeline-item">
                                            <span class="timeline-item-icon | faded-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <g clip-path="url(#clip0_5250_781)">
                                                        <path d="M8.42791 2.73569C9.31132 2.57584 10.1851 2.57584 11.0673 2.73569C11.1406 2.74771 11.2152 2.75372 11.2885 2.75372C11.8726 2.75372 12.3894 2.33544 12.4976 1.74169C12.6178 1.07341 12.1743 0.433996 11.5036 0.311412C10.3317 0.0986701 9.15866 0.0986701 7.98916 0.311412C7.32088 0.431602 6.87497 1.07104 6.99516 1.74169C7.11535 2.40997 7.75479 2.85587 8.42543 2.73569L8.42791 2.73569Z" fill="white"/>
                                                        <path d="M3.97241 3.48934C3.45198 3.04944 2.67675 3.11433 2.23684 3.63357C1.85223 4.08911 1.51087 4.57228 1.22121 5.07708C0.931548 5.57828 0.682751 6.11674 0.479612 6.67684C0.248843 7.31625 0.580573 8.02179 1.22121 8.25256C1.35943 8.30184 1.49766 8.32588 1.63709 8.32588C2.14189 8.32588 2.61546 8.01218 2.79454 7.51098C2.94478 7.08911 3.13349 6.68286 3.35103 6.30785C3.56617 5.93283 3.8246 5.56988 4.11426 5.22492C4.55417 4.70449 4.48927 3.92926 3.97003 3.48935L3.97241 3.48934Z" fill="white"/>
                                                        <path d="M4.11653 14.7755C3.82686 14.4341 3.56846 14.0675 3.35329 13.6925C3.13815 13.3175 2.95065 12.9113 2.7968 12.4894C2.56603 11.85 1.86169 11.517 1.22108 11.7478C0.581663 11.9786 0.248709 12.6829 0.479479 13.3235C0.678999 13.8836 0.928986 14.4221 1.22108 14.9233C1.51074 15.4245 1.85209 15.9112 2.23671 16.3668C2.4795 16.6564 2.82806 16.8043 3.17782 16.8043C3.45787 16.8043 3.74031 16.7093 3.97108 16.5122C4.49151 16.0723 4.5552 15.2971 4.11531 14.7766L4.11653 14.7755Z" fill="white"/>
                                                        <path d="M18.1697 15.0985C18.2033 15.0396 18.243 14.982 18.2779 14.9231C18.3151 14.8582 18.3512 14.7909 18.386 14.7259C18.398 14.7043 18.4101 14.6827 18.4233 14.661C18.4762 14.5625 18.5242 14.4639 18.5735 14.3654C18.6012 14.3101 18.6264 14.2572 18.6541 14.2019C18.6817 14.1406 18.7093 14.0793 18.7406 14.0144C18.7803 13.9279 18.8175 13.8389 18.8548 13.75C18.8644 13.7259 18.8728 13.7043 18.8824 13.6791C19.344 12.5409 19.5988 11.3005 19.5988 9.99876C19.5988 8.69707 19.3343 7.35574 18.8079 6.13107C18.8019 6.11544 18.7899 6.10342 18.7839 6.0878C18.6336 5.74045 18.4666 5.40149 18.2791 5.0782C17.9894 4.577 17.6456 4.09023 17.2634 3.63469C16.8235 3.11426 16.0483 3.05057 15.5279 3.49046C15.0074 3.93035 14.9437 4.7056 15.3836 5.22603C15.6733 5.56738 15.9317 5.93397 16.1469 6.30895C16.3656 6.68397 16.5495 7.09021 16.7033 7.51209C16.7033 7.5181 16.7094 7.52171 16.7094 7.52772C16.993 8.31858 17.1372 9.1491 17.1372 10.0013C17.1372 10.8534 16.9834 11.7092 16.707 12.4845V12.4905C16.636 12.69 16.5531 12.8847 16.4666 13.0746C16.457 13.0926 16.4509 13.1118 16.4425 13.1299C16.3656 13.2993 16.2791 13.4616 16.1877 13.619C16.1637 13.6647 16.1348 13.708 16.1108 13.7549C16.0243 13.8991 15.9329 14.0409 15.8368 14.1827C15.8055 14.2284 15.7719 14.2717 15.7418 14.3186C15.6433 14.4568 15.5387 14.589 15.4305 14.7212C14.3416 16.0253 12.8115 16.952 11.0699 17.2657C10.8548 17.3053 10.6396 17.333 10.4233 17.3522H10.3956C9.74297 17.4111 9.09152 17.3799 8.43528 17.2633C7.7646 17.1407 7.12758 17.5866 7.005 18.2573C6.88481 18.9255 7.32832 19.565 7.999 19.6875C8.58312 19.7921 9.17448 19.8474 9.7562 19.8474C9.91005 19.8474 10.0639 19.8438 10.2177 19.8354C10.3103 19.8318 10.4028 19.8234 10.4942 19.8174C10.5495 19.8137 10.6048 19.8113 10.66 19.8053C10.7766 19.7933 10.8944 19.7813 11.011 19.7657C11.0422 19.7621 11.0699 19.7597 11.0999 19.7537C11.2225 19.7356 11.3463 19.7164 11.4689 19.6948C11.4846 19.6948 11.4966 19.6911 11.5122 19.6887H11.5218C13.7862 19.2765 15.7861 18.0854 17.2261 16.4051C17.2381 16.393 17.2538 16.3834 17.2658 16.3678C17.6047 15.9711 17.9052 15.5457 18.1708 15.1094C18.1708 15.1094 18.1744 15.1034 18.1768 15.0998L18.1697 15.0985Z" fill="white"/>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_5250_781">
                                                        <rect width="20" height="20" fill="white"/>
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </span>
                                            <div class="timeline-item-wrapper">
                                                <div style="width: 100%; height: 100%; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: inline-flex">
                                                    
                                                    <div class="timeline-details-head">${transaction.created_at}</div>
                                                    <div style="width: 100%; color: #212429; font-size: 12px; font-family: Lato; font-weight: 700; line-height: 16px; letter-spacing: 0.20px; word-wrap: break-word">
                                                       ${filter === "statuses" ? `Status Changed ${transaction?.from_state_meta?.status_label !== null ? `from ${transaction?.from_state_meta?.status_label}` : ""}  to ${transaction?.to_state_meta?.status_label}` : `${transaction?.to_state == "enabled" ? `Tag Applied: ${transaction?.transition_label}` : `Tag Removed: ${transaction?.transition_label}`}`}
                                                    </div>
                                                    
                                                    <div class="timeline-details-container timeline-accordion-panel">
                                                        ${labelsArray
                                                          .map((key) => {
                                                            // Check if the key exists in jsonSchema.properties
                                                            if (
                                                              transaction?.form
                                                                ?.json_schema
                                                                .properties &&
                                                              transaction?.form
                                                                ?.json_schema
                                                                .properties[key]
                                                            ) {
                                                              // Get the title from jsonSchema.properties
                                                              const title =
                                                                transaction
                                                                  ?.form
                                                                  ?.json_schema
                                                                  .properties[
                                                                  key
                                                                ].title;

                                                              let fieldValues =
                                                                getFieldValues(
                                                                  transaction?.form
                                                                );
                                                              const value =
                                                                fieldValues[
                                                                  key
                                                                ];
                                                              return `<div class="timeline-detail-block">
                                                                            <div class="timeline-details-head">${title}</div>
                                                                            <div class="timeline-details-data">${value}</div>
                                                                        </div>`;
                                                            } else {
                                                              console.log(
                                                                `Key '${key}' does not exist in jsonSchema.properties`
                                                              );
                                                            }
                                                          })
                                                          .join("")}
                                                    </div>
                                                    ${labelsArray.length > 0 ? `<div class="timeline-more-detaild-btn timeline-accordion">Read more</div>` : ""}
                                                    <div class="timeline-details-head">${transaction.actor}</div>
                                                </div>
                                            </div>
                                        </li>`;
                                    })
                                    .join("")
                                : "No data available"
                            }
                        `);
        }

        $("#timeline-body").empty();
        getTimeline(filter);
        handleAccordian();
      }
    });

    // Scroll to the top of the div
    var $scrollableDiv = $("#timeline-container");
    var $scrollToTopBtn = $("#timeline-scroll-to-top");
    $scrollToTopBtn.fadeOut();

    // Show the button when the user scrolls down in the div
    $scrollableDiv.scroll(function () {
      if ($scrollableDiv.scrollTop() > 20) {
        $scrollToTopBtn.fadeIn();
      } else {
        $scrollToTopBtn.fadeOut();
      }
    });

    // Scroll to the top when the button is clicked
    $scrollToTopBtn.click(function () {
      $scrollableDiv.animate({ scrollTop: 0 }, "slow");
    });

    let detailViewContextButton = document.getElementById(
      "detail-view-context-button"
    );
    let detailViewContextMenu = document.getElementById(
      "detail-view-context-dropdown"
    );
    // createPopperInstance(detailViewContextButton, detailViewContextMenu, {
    //   placement: "bottom-start",
    //   modifiers: [
    //     {
    //       name: "offset",
    //       options: {
    //         offset: [-20, 0],
    //       },
    //     },
    //   ],
    // });

    let popperInstance = Popper.createPopper(
      detailViewContextButton,
      detailViewContextMenu,
      {
        placement: "bottom-start",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [-20, 0],
            },
          },
        ],
      }
    );

    $("#detail-view-context-button").on("click", function (event) {
      detailViewContextMenu.classList.toggle("show");
      if (popperInstance) {
        popperInstance?.update();
      }
    });

    // Click event handler for the entire document
    $(document).on("click", function (event) {
      // Check if the click was outside the popover or trigger element
      if (
        !$(event.target).closest(
          "#detail-view-context-dropdown, #detail-view-context-button"
        ).length
      ) {
        // Close the popover
        $("#detail-view-context-dropdown").removeClass("show");
      }
    });

    $(".detail-view-workflow").on("click", function () {
      let workflowData = JSON.parse(
        decodeURIComponent($(this).attr("data-workflow"))
      );
      let pk = $(this).attr("data-pk");

      if (workflowData.is_form_based) {
        const tagsDrawer = document.getElementById("detailViewTagsDrawer");
        var bsOffcanvas = new bootstrap.Offcanvas(tagsDrawer);
        bsOffcanvas.show();

       

        ZelthyRJSF("#detailViewTagsDrawer .zelthy-dynamic-form", {
          get_data: {
            is_api_based: true,
            url: `./?view=workflow&action=initialize_form&pk=${pk}&transition_name=${workflowData?.name}&transition_type=status`,
            static_config: {},
          },
          post_data: {
            http_method: "POST",
            url: `./?view=workflow&action=process_transition&pk=${pk}&transition_name=${workflowData?.name}&transition_type=status`,
            payload_type: "FORMDATA",
            invoke_after_submit: showCloseBtn.toString()
          },
        });
      } else {
        function isNullOrEmpty(value) {
          return value === null || value === undefined || value === "";
        }
        $(document)
          .find(".row-action-simple-dialog-overlay")
          .css({ display: "flex" });
        $(document)
          .find(".row-action-simple-dialog-description")
          .html(
            !isNullOrEmpty(workflowData?.confirmation_message)
              ? workflowData?.confirmation_message
              : "Are you sure you want to perform this action?"
          );

        // non form based workflow handling
        $(".row-action-simple-dialog-form .confirm-btn").on(
          "click",
          async function () {
            if ($(this).attr("disabled") === undefined) {
              $(this).attr("disabled", true);
              $(this).css("opacity", "0.6");
              try {

                let url = `./?pk=${pk}&view=workflow&action=process_transition&pk=${pk}&transition_name=${workflowData.name}`;
                let result = await makeApiCall(url, "POST", {
                  "X-CSRFToken": getCookie("csrftoken"),
                });
                if (result.success) {
                  window.location.reload();
                  return result.response;
                } else {
                  $(this).removeAttr("disabled");
                  if (result.response.message) {
                    ZToast("error", "Error", result.response.message, 3000);
                  } else {
                    ZToast("error", "Error", "Something went wrong", 3000);
                  }
                }
              } catch (error) {
                ZToast("error", "Error", "Something went wrong", 3000);
                return true; // update with actual error
              }
            }
          }
        );
      }
    });

    $(".row-action-simple-dialog-form")
      .find(".close-button")
      .on("click", function () {
        $(".row-action-simple-dialog-overlay").css({ display: "none" });
      });

    if ($("#place-call-from-detail")) {
      $("#place-call-from-detail").on("click", function () {
        const phoneNumber = $(this).attr("data-phone-number");
        PlaceNiceCall(phoneNumber);
      });
    }
  }

  // load detailview
  async function loadDetailView(pk) {
    $(document).find(".z-page-loader").css({ visibility: "visible" });
    $("#detailViewBody-title").html(
      `<div class="z-skeleton-loader" style="width: 14em; height: 28px;"></div>`
    );

    $("#detailViewBody-data-2").html(
      `
        <div class="z-skeleton-loader" style="width: 10em; margin-top: 30px; margin-bottom: 26px;"></div>
        <div class="z-skeleton-loader" style="width: 18em; margin: 8px 6px;"></div>
        <div class="z-skeleton-loader" style="width: 18em; margin: 8px 6px;"></div>
        <div class="z-skeleton-loader" style="width: 18em; margin: 8px 6px;"></div>
        <div class="z-skeleton-loader" style="width: 18em; margin: 8px 6px;"></div>
        <div class="z-skeleton-loader" style="width: 18em; margin: 8px 6px;"></div>
        `
    );
    $("#detailViewTimeline").html(`
        <div class="z-skeleton-loader" style="width: 8em; height: 24px; margin: 32px 12px;"></div>
        <div class="z-skeleton-loader" style="width: 12em; margin: 8px 12px; margin-top: 24px;"></div>
        <div class="z-skeleton-loader" style="width: 12em; margin: 8px 12px;"></div>
        <div class="z-skeleton-loader" style="width: 12em; margin: 8px 12px;"></div>
      `);

    let response = await fetchAndSetDetailView(pk);
    await createDetailView(pk, response);

    // handle detailview tags drawer
    $(".detailview-label").on("click", function (event) {
      const detailViewSwitch = this;
      const tagsData = response?.workflow_details?.tag_details.find(
        (tag) => tag.name === $(this).attr("data-tag-name")
      );

      switch (tagsData.state) {
        case "disabled":
          if (tagsData.enable.is_form_based && tagsData.is_enable_allowed) {
            const tagsDrawer = document.getElementById("detailViewTagsDrawer");
            var bsOffcanvas = new bootstrap.Offcanvas(tagsDrawer);
            bsOffcanvas.show();

            ZelthyRJSF("#detailViewTagsDrawer .zelthy-dynamic-form", {
              get_data: {
                is_api_based: true,
                url: `./?view=workflow&action=initialize_form&pk=${pk}&transition_name=${tagsData.name}&transition_type=tag&transition_state=${tagsData.state == "enabled" ? "disabled" : "enabled"}`,
                static_config: {},
              },
              post_data: {
                http_method: "POST",
                url: `./?view=workflow&action=process_transition&pk=${pk}&transition_name=${tagsData.name}&transition_type=tag&transition_state=${tagsData.state == "enabled" ? "disabled" : "enabled"}`,
                payload_type: "FORMDATA",
                invoke_after_submit: showCloseBtn.toString(),
              },
            });

            $(".offcanvas-backdrop").on("click", function (event) {
              // Check if the click target is the backdrop
              if ($(event.target).hasClass("offcanvas-backdrop")) {
                // Prevent the offcanvas from closing
                event.stopPropagation();
              }
            });

            // Handle detail view tags switch if modal closed without any update
            $("#detailViewTagsDrawer #detailViewModalClose").on(
              "click",
              async function () {
                
                if (tagsData.state == "enabled") {
                  $(detailViewSwitch).prev().prop("checked", true);
                } else {
                  $(detailViewSwitch).prev().prop("checked", false);
                }
              }
            );
          } else {
            function isNullOrEmpty(value) {
              return value === null || value === undefined || value === "";
            }

            if (tagsData.is_enable_allowed) {
              $(document)
                .find(".row-action-simple-dialog-overlay")
                .css({ display: "flex" });
              $(document)
                .find(".row-action-simple-dialog-description")
                .html(
                  !isNullOrEmpty(tagsData?.enable?.confirmation_message)
                    ? tagsData?.enable?.confirmation_message
                    : "Are you sure you want to perform this action?"
                );
              // Handle detail view tags switch if modal closed without any update
              $(".row-action-simple-dialog-form .close-button").on(
                "click",
                async function () {
                  if (tagsData.state == "enabled") {
                    $(detailViewSwitch).prev().prop("checked", true);
                  } else {
                    $(detailViewSwitch).prev().prop("checked", false);
                  }
                }
              );
            }

            $(".row-action-simple-dialog-form .confirm-btn").on(
              "click",
              async function () {
                if ($(this).attr("disabled") === undefined) {
                  $(this).attr("disabled", true);
                  $(this).css("opacity", "0.6");
                  try {
                    let url = `./?view=workflow&action=process_transition&pk=${pk}&transition_name=${tagsData.name}&transition_type=tag&transition_state=${tagsData.state == "enabled" ? "disabled" : "enabled"}`;
                    let result = await makeApiCall(url, "POST", {
                      "X-CSRFToken": getCookie("csrftoken"),
                    });
                    
                    if (result.success) {
                      window.location.reload();
                      return result.response;
                    } else {
                      $(this).removeAttr("disabled");
                      if (result.response.message) {
                        ZToast("error", "Error", result.response.message, 3000);
                      } else {
                        ZToast("error", "Error", "Something wen wrong", 3000);
                      }
                    }
                  } catch (error) {
                    return true; // update with actual error
                  }
                }
              }
            );
          }
          break;
        case "enabled":
          if (tagsData.disable.is_form_based && tagsData.is_disable_allowed) {
            const tagsDrawer = document.getElementById("detailViewTagsDrawer");
            var bsOffcanvas = new bootstrap.Offcanvas(tagsDrawer);
            bsOffcanvas.show();

            ZelthyRJSF("#detailViewTagsDrawer .zelthy-dynamic-form", {
              get_data: {
                is_api_based: true,
                url: `./?view=workflow&action=initialize_form&pk=${pk}&transition_name=${tagsData.name}&transition_type=tag&transition_state=${tagsData.state == "enabled" ? "disabled" : "enabled"}`,
                static_config: {},
              },
              post_data: {
                http_method: "POST",
                url: `./?view=workflow&action=process_transition&pk=${pk}&transition_name=${tagsData.name}&transition_type=tag&transition_state=${tagsData.state == "enabled" ? "disabled" : "enabled"}`,
                payload_type: "FORMDATA",
                invoke_after_submit: showCloseBtn.toString(),
              },
            });
          } else {
            function isNullOrEmpty(value) {
              return value === null || value === undefined || value === "";
            }

            if (tagsData.is_disable_allowed) {
              $(document)
                .find(".row-action-simple-dialog-overlay")
                .css({ display: "flex" });
              $(document)
                .find(".row-action-simple-dialog-description")
                .html(
                  !isNullOrEmpty(tagsData?.disable?.confirmation_message)
                    ? tagsData?.disable?.confirmation_message
                    : "Are you sure you want to perform this action?"
                );
              // Handle detail view tags switch if modal closed without any update
              $(".row-action-simple-dialog-form .close-button").on(
                "click",
                async function () {
                  if (tagsData.state == "enabled") {
                    $(detailViewSwitch).prev().prop("checked", true);
                  } else {
                    $(detailViewSwitch).prev().prop("checked", false);
                  }
                }
              );
            }
            $(".row-action-simple-dialog-form .confirm-btn").on(
              "click",
              async function () {
                if ($(this).attr("disabled") === undefined) {
                  $(this).attr("disabled", true);
                  $(this).css("opacity", "0.6");
                  try {
                    let url = `./?view=workflow&action=process_transition&pk=${pk}&transition_name=${tagsData.name}&transition_type=tag&transition_state=${tagsData.state == "enabled" ? "disabled" : "enabled"}`;
                    let result = await makeApiCall(url, "POST", {
                      "X-CSRFToken": getCookie("csrftoken"),
                    });
                  
                    if (result.success) {
                      window.location.reload();
                      return result.response;
                    } else {
                      $(this).removeAttr("disabled");
                      if (result.response.message) {
                        alert(result.response.message);
                      } else {
                        alert("An error occurred.");
                      }
                    }
                  } catch (error) {
                    return true; // update with actual error
                  }
                }
              }
            );
          }
          break;

        default:
          break;
      }
    });
  }



  // if detail view is already opend before refreshing reopen detailview
  if (doesQueryParamExist("pk")) {
    const DetailViewPK = getQueryParamValue("pk");

    loadDetailView(DetailViewPK);
  }

  $(document)
    .find(".each-detail-view-button")
    .on("click", function (event) {
      loadDetailView($(this).attr("data-pk"));

      // Add or update a query parameter
      urlSearchParams.set("pk", $(this).attr("data-pk"));

      // Create a new URL with the updated query parameters
      const updatedUrl = `${currentUrl.split("?")[0]}?${urlSearchParams.toString()}`;

      // Update the URL without reloading the page
      window.history.pushState({ path: updatedUrl }, "", updatedUrl);
    });
});
