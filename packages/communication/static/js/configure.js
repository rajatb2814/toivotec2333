const querystring = window.location.search;
const urlParams = new URLSearchParams(querystring);
const token = urlParams.get("token");
$(document).ready(function () {
  $(document)
    .find(".new-smtp-imap-button")
    .attr(
      "data-z-form-config",
      JSON.stringify({
        get_data: {
          is_api_based: true,
          url: `/communication/email/configure/api/?action=initialize_form&token=${token}`,
          static_config: {},
        },
        post_data: {
          http_method: "POST",
          url: `/communication/email/configure/api/?action=create_config&token=${token}`,
          payload_type: "FORMDATA",
        },
      })
    );
  // Fetch Package Details
  fetch(`/communication/configure/api/?action=fetch_configs&token=${token}`)
    .then((response) => response.json())
    .then(({ success, response }) => {
      if (success) {
        $(document).find(".intro-detail-section").find(".packages-table")
          .html(`<tr>
                            <td class="each-cell each-cell-label">Email</td>
                                <td class="each-cell each-cell-toggle">
                                    <label class="switch">
                                        <span class="switch-label">${
                                          response?.email?.active
                                            ? "Active"
                                            : "Inactive"
                                        }</span>
                                        <input type="checkbox" class="switch-checkbox" ${
                                          response?.email?.active
                                            ? "checked"
                                            : ""
                                        } data-id="email">
                                        <span class="slider round"></span>
                                    </label>
                                </td>
                                <td class="each-cell each-cell-last"></td>
                            </tr>
                            <tr>
                                <td class="each-cell each-cell-label">SMS</td>
                                <td class="each-cell each-cell-toggle">
                                    <label class="switch">
                                        <span class="switch-label">${
                                          response?.sms?.active
                                            ? "Active"
                                            : "Inactive"
                                        }</span>
                                        <input type="checkbox" class="switch-checkbox" ${
                                          response?.sms?.active ? "checked" : ""
                                        } data-id="sms">
                                        <span class="slider round"></span>
                                    </label>
                                </td>
                                <td class="each-cell each-cell-last"></td>
                            </tr>
                            <tr>
                                <td class="each-cell each-cell-label">Telephony</td>
                                <td class="each-cell each-cell-toggle">
                                    <label class="switch">
                                        <span class="switch-label">${
                                          response?.telephony?.active
                                            ? "Active"
                                            : "Active"
                                        }</span>
                                        <input type="checkbox" class="switch-checkbox" ${
                                          response?.telephony?.active
                                            ? "checked"
                                            : "checked"
                                        } disabled data-id="telephony">
                                        <span class="slider round"></span>
                                    </label>
                                </td>
                                <td class="each-cell each-cell-last"></td>
                        </tr>
                        <tr>
                            <td class="each-cell each-cell-label">Video Call</td>
                            <td class="each-cell each-cell-toggle">
                                <label class="switch">
                                    <span class="switch-label">Active</span>
                                    <input type="checkbox" class="switch-checkbox" checked disabled data-id="video_call">
                                    <span class="slider round"></span>
                                </label>
                            </td>
                            <td class="each-cell each-cell-last"></td>
                        </tr>
                        <tr>
                            <td class="each-cell each-cell-label">iMessage</td>
                            <td class="each-cell each-cell-toggle">
                                <label class="switch">
                                    <span class="switch-label">${
                                      response?.ims?.active
                                        ? "Active"
                                        : "Inactive"
                                    }</span>
                                        <input type="checkbox" class="switch-checkbox" ${
                                          response?.ims?.active ? "checked" : ""
                                        } data-id="ims">
                                    <span class="slider round"></span>
                                </label>
                            </td>
                            <td class="each-cell each-cell-last"></td>
                        </tr>`);

        $(document).find(".package-tabs").find(".side-section-padding")
          .html(`<ul class="nav nav-tabs" id="myTab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active nav-link-first" id="email-tab" data-bs-toggle="tab"
                                    data-bs-target="#email" type="button" role="tab" aria-controls="email"
                                    aria-selected="true" ${
                                      response?.email?.active ? "" : "disabled"
                                    }>Email</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="sms-tab" data-bs-toggle="tab" data-bs-target="#sms"
                                    type="button" role="tab" aria-controls="sms" aria-selected="false" ${
                                      response?.sms?.active ? "" : "disabled"
                                    }>SMS</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="telephony-tab" data-bs-toggle="tab" data-bs-target="#telephony"
                                    type="button" role="tab" aria-controls="telephony"
                                    aria-selected="false" ${
                                      response?.telephony?.active
                                        ? ""
                                        : ""
                                    }>Telephony</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="video_call-tab" data-bs-toggle="tab"
                                    data-bs-target="#video_call" type="button" role="tab" aria-controls="video_call"
                                    aria-selected="false" >Video Call</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="imessage-tab" data-bs-toggle="tab" data-bs-target="#imessage"
                                    type="button" role="tab" aria-controls="imessage" aria-selected="false"
                                    ${
                                      response?.ims?.active ? "" : "disabled"
                                    }>iMessage</button>
                            </li>
                        </ul>`);

        Object.keys(response).forEach(function (key, index) {
          let targetPane = sessionStorage.getItem("targetPane");
          if (targetPane) {
            $(`.nav-link${targetPane}-tab:not([disabled])`).click();
          } else {
            if (response[key] && response[key]?.active === true) {
              $(`#${key}-tab`).click();
              return;
            }
          }
        });

        let emailRows = response?.email?.configs
          ?.map((eachData) => {
            return `<tr>
                                <td class="first-cell each-cell">${
                                  eachData?.key
                                }</td>
                                <td class="each-cell">${eachData?.provider}</td>
                                <td class="each-cell">
                                    ${
                                      eachData?.is_active
                                        ? `<span
                                        class="each-cell-status each-cell-status-active">
                                        Active
                                    </span>`
                                        : `<span
                                        class="each-cell-status each-cell-status-inactive">
                                        Inactive
                                    </span>`
                                    }
                                    
                                </td>
                                <td class="each-cell each-cell-last">
                                    ${
                                      eachData?.is_default
                                        ? `<span class="default-row" >Default</span>`
                                        : `<button type="button" class="action-button make-default-button" data-each-row=${JSON.stringify(
                                            eachData
                                          )} data-type="email" ${
                                            eachData?.is_active
                                              ? ""
                                              : "disabled"
                                          }>
                                        Make Default
                                    </button>`
                                    }
                                </td>
                                <td class="each-cell each-cell-last">
                                    <div class="each-row-action-box">
                                        <div class="each-row-action-dropdown-box">
                                            <button type="button" class="each-row-action-button">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                    viewBox="0 0 20 20" fill="none">
                                                    <circle cx="10" cy="16" r="2" transform="rotate(-90 10 16)"
                                                        fill="#6C747D" />
                                                    <circle cx="10" cy="10" r="2" transform="rotate(-90 10 10)"
                                                        fill="#6C747D" />
                                                    <circle cx="10" cy="4" r="2" transform="rotate(-90 10 4)"
                                                        fill="#6C747D" />
                                                </svg>
                                            </button>
                                            <ul class="each-row-action-dropdown">
                                                <li class="each-row-action-dropdown-list">
                                                    <button type="button"
                                                        class="each-row-action-dropdown-option form-modal-button"
                                                        data-modal="package-dynamic-form-modal" data-key="" data-type=""
                                                        data-option-data='' data-z-form-config='{
                                                            "get_data":{
                                                               "is_api_based":false,
                                                               "url":"",
                                                               "static_config":{
                                                                  "form":{
                                                                     "json_schema":{
                                                                        "title":"Update Key",
                                                                        "type":"object",
                                                                        "properties":{
                                                                           "key":{
                                                                              "type":"string",
                                                                              "title":"Update Key",
                                                                              "default":"${
                                                                                eachData?.key
                                                                              }"
                                                                           },
                                                                           "active":{
                                                                                "type":"boolean",
                                                                                "title":"Is Active",
                                                                                "default":${
                                                                                  eachData?.is_active
                                                                                }
                                                                            },
                                                                           "type":{
                                                                              "type":"string",
                                                                              "title":"Type",
                                                                              "default": "email"
                                                                           }
                                                                        },
                                                                        "required":[
                                                                           "key"
                                                                        ]
                                                                     },
                                                                     "ui_schema":{
                                                                        "key":{
                                                                           "ui:widget":"TextFieldWidget",
                                                                           "ui:errorMessages":{
                                                                              "required":"This field is required."
                                                                           }
                                                                        },
                                                                        "active":{
                                                                            "ui:widget":"CheckboxFieldWidget"
                                                                        },
                                                                        "type":{
                                                                            "ui:widget":"hidden"
                                                                        }
                                                                     }
                                                                  }
                                                               }
                                                            },
                                                            "post_data":{
                                                               "http_method":"POST",
                                                               "url":"/communication/configure/api/?action=update_key&pk=${
                                                                 eachData?.pk
                                                               }&token=${token}",
                                                               "payload_type":"FORMDATA"
                                                            }
                                                         }'>
                                                        <span class="label">Update</span>
                                                        <span class="description">update key, active/iactive, make
                                                            default</span>
                                                    </button>
                                                </li>
                                                <li class="each-row-action-dropdown-list">
                                                    <button type="button"
                                                        class="each-row-action-dropdown-option form-modal-button"
                                                        data-modal="package-dynamic-form-modal" data-key="" data-type=""
                                                        data-option-data='' data-z-form-config='{
                                                            "get_data":{
                                                               "is_api_based":true,
                                                               "url":"/communication/email/configure/api/?action=get_update_schema&pk=${
                                                                 eachData?.pk
                                                               }&token=${token}",
                                                               "static_config":{}
                                                            },
                                                            "post_data":{
                                                               "http_method":"PUT",
                                                               "url":"/communication/email/configure/api/?action=update_config&pk=${
                                                                 eachData?.pk
                                                               }&token=${token}",
                                                               "payload_type":"FORMDATA"
                                                            }
                                                         }'>
                                                        <span class="label">Edit Config</span>
                                                        <span class="description"></span>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </td>
                            </tr>`;
          })
          .join("");

        if (emailRows?.length) {
          $(document)
            .find(".tab-content")
            .find("#email")
            .find(".each-package-table").html(`<tr>
                                <th class="first-cell each-header">Key</th>
                                <th class="each-header">Provider</th>
                                <th class="each-header" style="width: 100%;">Status</th>
                                <th class="each-header">Action</th>
                                <th class="each-header"></th>
                                </tr>`);

          $(document)
            .find(".tab-content")
            .find("#email")
            .find(".each-package-table")
            .append(emailRows);
        } else {
          $(document)
            .find(".tab-content")
            .find("#email")
            .find(".each-package-table").html(`
                                <div class="empty-state" id="emptyState">
                                    No data available.
                                </div>`);
        }

        let smsRows = response?.sms?.configs
          ?.map((eachData) => {
            return `<tr>
                                <td class="first-cell each-cell">${
                                  eachData?.key
                                }</td>
                                <td class="each-cell">${eachData?.provider}</td>
                                <td class="each-cell">
                                    ${
                                      eachData?.is_active
                                        ? `<span
                                        class="each-cell-status each-cell-status-active">
                                        Active
                                    </span>`
                                        : `<span
                                        class="each-cell-status each-cell-status-inactive">
                                        Inactive
                                    </span>`
                                    }
                                    
                                </td>
                                <td class="each-cell each-cell-last">
                                    ${
                                      eachData?.is_default
                                        ? `<span class="default-row" >Default</span>`
                                        : `<button type="button" class="action-button make-default-button" data-each-row=${JSON.stringify(
                                            eachData
                                          )} data-type="sms" ${
                                            eachData?.is_active
                                              ? ""
                                              : "disabled"
                                          }>
                                        Make Default
                                    </button>`
                                    }
                                </td>
                                <td class="each-cell each-cell-last"></td>
                            </tr>`;
          })
          .join("");

        if (smsRows?.length) {
          $(document)
            .find(".tab-content")
            .find("#sms")
            .find(".each-package-table").html(`<tr>
                                <th class="first-cell each-header">Key</th>
                                <th class="each-header">Provider</th>
                                <th class="each-header" style="width: 100%;">Status</th>
                                <th class="each-header">Action</th>
                                <th class="each-header"></th>
                                </tr>`);

          $(document)
            .find(".tab-content")
            .find("#sms")
            .find(".each-package-table")
            .append(smsRows);
        } else {
          $(document)
            .find(".tab-content")
            .find("#sms")
            .find(".each-package-table").html(`
                                <div class="empty-state" id="emptyState">
                                    No data available.
                                </div>`);
        }

        let telephonyRows = response?.telephony?.configs
          ?.map((eachData) => {
            return `<tr>
                                <td class="first-cell each-cell">${
                                  eachData?.key
                                }</td>
                                <td class="each-cell">${eachData?.provider}</td>
                                <td class="each-cell">
                                    ${
                                      eachData?.is_active
                                        ? `<span
                                        class="each-cell-status each-cell-status-active">
                                        Active
                                    </span>`
                                        : `<span
                                        class="each-cell-status each-cell-status-inactive">
                                        Inactive
                                    </span>`
                                    }
                                    
                                </td>
                                <td class="each-cell each-cell-last">
                                    ${
                                      eachData?.is_default
                                        ? `<span class="default-row" >Default</span>`
                                        : `<button type="button" class="action-button make-default-button" data-each-row=${JSON.stringify(
                                            eachData
                                          )} data-type="telephony" ${
                                            eachData?.is_active
                                              ? ""
                                              : "disabled"
                                          }>
                                        Make Default
                                    </button>`
                                    }
                                </td>
                                <td class="each-cell each-cell-last"></td>
                            </tr>`;
          })
          .join("");

        if (telephonyRows?.length) {
          $(document)
            .find(".tab-content")
            .find("#telephony")
            .find(".each-package-table").html(`<tr>
                                <th class="first-cell each-header">Key</th>
                                <th class="each-header">Provider</th>
                                <th class="each-header" style="width: 100%;">Status</th>
                                <th class="each-header">Action</th>
                                <th class="each-header"></th>
                                </tr>`);

          $(document)
            .find(".tab-content")
            .find("#telephony")
            .find(".each-package-table")
            .append(telephonyRows);
        } else {
          $(document)
            .find(".tab-content")
            .find("#telephony")
            .find(".each-package-table").html(`
                                <div class="empty-state" id="emptyState">
                                    No data available.
                                </div>`);
        }

        $(document)
          .find(".switch-checkbox")
          .on("change", function () {
            let id = $(this).attr("data-id");
            let isChecked = $(this).is(":checked");
            let formData = new FormData();
            formData.append("type", id);
            formData.append("active", isChecked);

            fetch(
              `/communication/configure/api/?action=set_active&token=${token}`,
              {
                method: "POST",
                body: formData,
              }
            )
              .then((response) => {
                if (response.ok) {
                  return response.json();
                }
                return Promise.reject(response);
              })
              .then(({ success, response }) => {
                if (success) {
                  if (isChecked) {
                    $(this)
                      .parents(".switch")
                      .find(".switch-label")
                      .html("Active");
                  } else {
                    $(this)
                      .parents(".switch")
                      .find(".switch-label")
                      .html("Inactive");
                  }
                  window.location.reload();
                }
              })
              .catch((response) => {
                console.log(response.status, response.statusText);
                response.json().then((json) => {
                  console.log(json);
                });
              });
          });

        $(document)
          .find(".form-modal-button")
          .on("click", function () {
            let modalId = $(this).data("modal");
            let zFormConfig = $(this).data("z-form-config");
            $(`#${modalId}`)
              .find(".zelthy-dynamic-form")
              .attr("data-config", JSON.stringify(zFormConfig));
            if ($(`#${modalId}`).is(":hidden")) {
              $(`#${modalId}`).css({ display: "flex" });
            } else {
              $(`#${modalId}`).css({ display: "none" });
            }
          });

        $(document)
          .find(".modal-close")
          .on("click", function () {
            let modalId = $(this).data("modal");
            $(`#${modalId}`)
              .find(".zelthy-dynamic-form")
              .attr("data-config", {});
            $(`#${modalId}`).css({ display: "none" });
            if (modalId === "row_actions_form_modal") {
              location.reload();
            }
          });

        $(document).on("mouseup", function (e) {
          let container = $(".each-row-action-box");
          if (!container.is(e.target) && container.has(e.target).length === 0) {
            let is_visible = container
              .find(".each-row-action-dropdown")
              .attr("data_is_visible");
            if (is_visible !== "true") {
              container.find(".each-row-action-dropdown").hide();
            }
          }
        });

        $(document)
          .find(".each-row-action-dropdown-box")
          .each(function (index) {
            let button = $(this).find(".each-row-action-button")[0];
            let tooltip = $(this).find(".each-row-action-dropdown")[0];

            let popperInstance = Popper.createPopper(button, tooltip, {
              strategy: "fixed",
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [10, 0],
                  },
                },
              ],
            });
            popperInstance.setOptions({ placement: "bottom-end" });
            $(document).on("click", function (event) {
              if (popperInstance) {
                popperInstance?.update();
              }
            });
          });

        $(document)
          .find("tr")
          .on("mouseenter click", function () {
            $(".each-row-action-box").each(function (index) {
              let is_visible = $(this)
                .find(".each-row-action-dropdown")
                .attr("data-is-visible");
              if (is_visible !== "true") {
                $(this).hide();
              } else {
                $(this).show();
              }
            });

            $(this).find(".each-row-action-box").css({ display: "flex" });
          });

        $(document)
          .find(".each-row-action-button")
          .on("click", function (event) {
            event.preventDefault();
            $(".each-row-action-dropdown").attr("data-is-visible", false);
            $(".each-row-action-dropdown").hide();
            $(this)
              .parents(".each-row-action-box")
              .find(".each-row-action-dropdown")
              .attr("data-is-visible", true)
              .show();
          });

        $(document)
          .find(".make-default-button")
          .on("click", function () {
            let eachRowData = JSON.parse($(this).attr("data-each-row"));
            let type = $(this).attr("data-type");
            let url = `/communication/configure/api/?action=make_default&pk=${eachRowData?.pk}&token=${token}`;
            let formData = new FormData();
            formData.append("provider", eachRowData?.provider);
            formData.append("type", type);
            fetch(url, {
              method: "POST",
              body: formData,
            })
              .then((response) => {
                if (response.ok) {
                  return response.json();
                }
                return Promise.reject(response);
              })
              .then(({ success, response }) => {
                if (success) {
                  window.location.reload();
                }
              })
              .catch((response) => {
                console.log(response.status, response.statusText);
                response.json().then((json) => {
                  console.log(json);
                });
              });
          });

        $(document)
          .find(".nav-tabs")
          .find(".nav-link")
          .on("click", function () {
            let targetPane = $(this).attr("data-bs-target");
            sessionStorage.setItem("targetPane", targetPane);
          });
      }
    })
    .catch((error) => {
      console.error(error);
    });
});
