import { ZToast } from "../../services/toaster.js";
import { mapTableDataForResponsiveDevice } from "../../helpers/dataMapper.js";
import {
  flattenObject,
  debounce,
  getQueryParamValue,
  doesQueryParamExist,
  createPopperInstance,
  generateDetailViewUrl,
} from "../../helpers/misc.js";
import { makeApiCall } from "../../services/api.js";
import { setElementStyle } from "../../helpers/domManipulation.js";
import {
  showLoaderComponent,
  hideLoaderComponent,
} from "./TableSkeletonLoader.js";
import { applyAppThemeConfig } from "../../helpers/setAppThemeConfig.js";
import { handleCardClick } from "../../helpers/mobileHandler.js";
import { simpleRowAction } from "./RowAction.js";
import paginagionFirstIcon from "../../assets/svg/paginagionFirst.js";
import paginationLastIcon from "../../assets/svg/paginationLast.js";
import paginationNextIcon from "../../assets/svg/paginationNext.js";
import paginationPreviousIcon from "../../assets/svg/paginationPrevious.js";
import emptyTableSVG from "../../assets/svg/emptyTable.js";
import tableColumFilterIcon from "../../assets/svg/tableColumFilter.js";
import datepickerIcon from "../../assets/svg/datepicker.js";
import viewDetailIcon from "../../assets/svg/viewDetail.js";
import rowActionIcon from "../../assets/svg/rowAction.js";

window.window_size = "";

$(window).width() < 600 ? (window_size = "mobile") : (window_size = "desktop");


// Utility function to create table filter SVG icon with dynamic fill color
function createTableFilterActiveSvgIcon(fill) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M9.2545 7.97654C9.2545 7.77676 9.34794 7.48628 9.46539 7.32618L12.9732 2.54006C13.0893 2.37995 13.0333 2.25102 12.8437 2.25102H3.95702C3.76882 2.25102 3.71009 2.37853 3.82754 2.54006L7.33535 7.32618C7.45147 7.48487 7.54624 7.77533 7.54624 7.97654V13.4953C7.54624 13.6951 7.68638 13.7986 7.8639 13.7235L8.93702 13.2672C9.11321 13.1936 9.25469 12.9739 9.25469 12.7699L9.2545 7.97654ZM10.6213 12.7699C10.6213 13.5676 10.1381 14.32 9.44537 14.6147L8.37092 15.0709C7.29381 15.5271 6.17928 14.7209 6.17928 13.4953V8.11107L2.74904 3.42978C1.93619 2.32036 2.62624 0.800049 3.95699 0.800049H12.8437C14.1824 0.800049 14.8591 2.32743 14.0516 3.42978L10.6214 8.11107L10.6213 12.7699Z" fill="${fill}"/>
    </svg>
  `;
}

// $(".offcanvas").css("width", config.drawer_layout.width);

applyAppThemeConfig(app_theme_config);

let searchable = table_metadata?.columns
  ?.filter(
    (eachColumn) =>
      eachColumn?.searchable &&
      !(eachColumn?.type === "date") &&
      !(eachColumn?.type === "datetime") &&
      !(eachColumn?.type === "string" && eachColumn?.choices?.length)
  )
  .map((eachColumn) => eachColumn?.display_name);
let formattedColumns = table_metadata?.columns?.map((eachColumn) => {
  return {
    sTitle: eachColumn?.display_name || eachColumn?.name?.split("_").join(" "),
    data: eachColumn?.name,
    orderable:
      eachColumn?.sortable &&
      !(eachColumn?.type === "date") &&
      !(eachColumn?.type === "datetime") &&
      !(eachColumn?.type === "string" && eachColumn?.choices?.length),
    render: function (data, type, row, meta) {
      if (
        data &&
        data.toString().indexOf("<") === -1 &&
        data.toString().replace(/\s/g, "").length > 60
      ) {
        return `<div class="popper-box">
                    <div class="popper-label">
                        ${data}
                    </div>
                    <div class="popper-content">
                        <div class="popper-inner-content complete-hidden-scroll-style">
                            ${data}
                        </div> 
                        <div id="arrow" data-popper-arrow></div>
                    </div>
                </div>`;
      } else {
        return `<div class="max-width">${data}</div>`;
      }
    },
  };
});
let columns = table_metadata?.row_selector?.enabled
  ? [
      { sTitle: "", data: "", orderable: false },
      ...formattedColumns,
      { sTitle: "", data: "", orderable: false },
    ]
  : [...formattedColumns, { sTitle: "", data: "", orderable: false }];

window.attachTableDrawEvents = function () {
  $(document)
    .find(".table-date-range-picker")
    .each(function (index) {
      let colIdx = $(this).attr("data-colIdx");
      let options = table_metadata?.columns[colIdx - 1]?.config || {};
      let defaultValue = $(this).find(".date-range-label").text();
      let start =
        defaultValue === "Select"
          ? moment().subtract(29, "days")
          : $(this).data("daterangepicker")?.startDate;
      let end =
        defaultValue === "Select"
          ? moment()
          : $(this).data("daterangepicker")?.endDate;

      let cb = (start, end) => {
        let data = {
          start: start.format("YYYY-MM-DD"),
          end: end.format("YYYY-MM-DD"),
        };
        if (options?.singleDatePicker) {
          $(this).find(".date-range-label").html(start.format("DD MMM YY"));
        } else {
          $(this)
            .find(".date-range-label")
            .html(start.format("DD MMM YY") + " - " + end.format("DD MMM YY"));
        }
        $(this).find(".date-range-label").removeClass("date-range-placeholder");
        zangoTable.columns.adjust();
        zangoTable.columns(colIdx).search(JSON.stringify(data)).draw();
      };

      $(this).daterangepicker({
        alwaysShowCalendars: true,
        startDate: start,
        endDate: end,
        showDropdowns: true,
        locale: { format: "DD MMM YY", cancelLabel: "Clear" },
        applyButtonClasses: "date-picker-apply-button",
        ...options,
      });

      $(this).on("apply.daterangepicker", function (ev, picker) {
        $(document)
          .find(`#datepicker-${colIdx}`)
          .css("color", crudCssVariables["--primary-color"]);

        cb(picker.startDate, picker.endDate);
      });

      let datePicker = $(this);
      $(this).on("cancel.daterangepicker", function (ev, picker) {
        $(document).find(`#datepicker-${colIdx}`).css("color", "#6C747D");

        let data = { start: "", end: "" };
        $(this).find(".date-range-label").html("Select");
        datePicker.data("daterangepicker").setStartDate(new Date());
        datePicker.data("daterangepicker").setEndDate(new Date());
        $(this).find(".date-range-label").addClass("date-range-placeholder");
        zangoTable.columns.adjust();
        zangoTable.columns(colIdx).search(JSON.stringify(data)).draw();
      });

      // cb(start, end);
    });

  $(document).find(".table_select_all_row").removeClass("all_row_selected");

  // view detail and row action buttons handling
  $(document)
    .find("td.table-extra-cell.each-cell")
    .each(function () {
      let rowData = $(this).data("row-data");
      // view detail button if row actions are not available
      $(this).html(`<div class="each-row-action-box">
                      <button type="button" class="each-detail-view-button"  data-url="${rowData.detail_url}"  data-pk="${rowData.pk}">
                          ${viewDetailIcon}
                          View details
                      </button>
                  </div>
                `);

      // view detail and row actions buttons
      if (rowData?.row_actions?.length) {
        $(this).html(`<div class="each-row-action-box">
                    <div class="each-row-action-dropdown-box flex gap-2">
                            <button type="button" class="each-detail-view-button" data-url="${rowData.detail_url}" data-pk="${rowData.pk}">
                              ${viewDetailIcon}
                              View details
                            </button>
                        <button type="button" class="each-row-action-button">
                            ${rowActionIcon}
                        </button>
                        ${
                          rowData?.row_actions?.length &&
                          `<ul class="each-row-action-dropdown">    
                        ${rowData?.row_actions
                          ?.map((eachAction) => {
                            return `<li class="each-row-action-dropdown-list">
                                        <button type="button" class="each-row-action-dropdown-option" data-key="${eachAction?.key}" data-type="${eachAction?.type}" data-option-data='${JSON.stringify(eachAction)}'>
                                            ${
                                              eachAction?.name
                                                ? `<span class="label">${eachAction?.name}</span>`
                                                : ""
                                            }
                                            ${
                                              eachAction?.description
                                                ? `<span class="description">${eachAction?.description}</span>`
                                                : ""
                                            }
                                            
                                        </button>    
                                    </li>`;
                          })
                          .join("")}
                        </ul>`
                        }
                    </div>
                </div>`);
      }
    });

  // detail view handling

  // Create a URLSearchParams object from the current URL

  let updatedUrl;

  // Reopen detail view if the "pk" query parameter exists
  if (doesQueryParamExist("pk")) {
    updatedUrl = generateDetailViewUrl({
      pk: getQueryParamValue("pk"),
      view: "detail",
      action: "render",
    });
  }

  window.detailViewModal = new bootstrap.Offcanvas(
    document.getElementById("offcanvasDetailsIframe")
  );

  $(".each-cell a").on("click", function (event) {
    event.preventDefault();

    let noframe = $(this).attr("data-no-iframe");
    let href = $(this).attr("href");

    if (noframe !== undefined) {
      window.open(href, "_blank").focus();
    } else {
      if ($("#offcanvaslinkIframe").length == 0) {
        $("#offcanvas-container").append(`
        <div style="width: calc(100%) !important; height: calc(100%); bottom: 0; right: 0; position: absolute; z-index: 5;" class="offcanvas offcanvas-end" data-bs-backdrop="false" tabindex="-1" id="offcanvaslinkIframe" aria-labelledby="offcanvaslinkIframeLabel">
            <button type="button" style="position: absolute; top: 8px; right: 8px;" class="btn-close" id="linkIframeClose" data-bs-dismiss="offcanvas" aria-label="Close">
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
            </button>
            <div class="offcanvas-body" style="padding: 0;">
              <iframe id="linkIframe" frameBorder="0" tabindex="-1" src="" style="width: 100%; height: 100%; border: none; outline: none; border:none;"></iframe>
            </div>
        </div>`);
      }
      document.getElementById("linkIframe").src = href;
      let linkIframeModal = new bootstrap.Offcanvas(
        document.getElementById("offcanvaslinkIframe")
      );
      linkIframeModal.show();

    }

  });

  $("#detailViewIframeClose").on("click", function (event) {
    event.preventDefault();
    document.getElementById("detailViewIframe").src = "";
    zangoTable.ajax.reload(null, false);
    $("#offcanvasDetailsIframe").hide();
    detailViewModal.hide();
  });

  function getQueryParamsFromUrl(url) {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      const queryObject = {};
      params.forEach((value, key) => {
          queryObject[key] = value;
      });
      return queryObject;
  }

  function mergeQueryParams(params1, params2) {
      return { ...params1, ...params2 };
  }

  // Event listener for the detail view button
  $(document)
  .find(".each-detail-view-button")
  .on("click", function () {
    const dataUrl = $(this).attr("data-url");
    const currentUrl = window.location.href; // Get the full current URL
    let apiEndpoint;

    // Check if the data-url is a full URL
    if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
      apiEndpoint = dataUrl; 
    } else if (dataUrl.startsWith('/')) {
      // If data-url starts with '/', append it to the current domain
      const currentOrigin = window.location.origin; 
      apiEndpoint = currentOrigin + dataUrl; 
    } else {
      // If data-url doesn't start with '/', keep the whole URL and append the data-url
      const currentUrlWithoutQuery = currentUrl.split('?')[0]; 
      apiEndpoint = currentUrlWithoutQuery + dataUrl; 
    }

    // If the data-url is not a full URL and doesn't start with '/'
    if (!dataUrl.startsWith('http://') && !dataUrl.startsWith('https://')) {
      const currentUrlQueryParams = getQueryParamsFromUrl(currentUrl);
      const apiQueryParams = getQueryParamsFromUrl(apiEndpoint);

      // Merge query params
      const mergedParams = mergeQueryParams(apiQueryParams, currentUrlQueryParams);

      apiEndpoint = apiEndpoint.split('?')[0]; // Remove existing query params from apiEndpoint
      apiEndpoint += '?' + $.param(mergedParams); // Append the merged params
    }

    // Set the iframe src and show the modal
    document.getElementById("detailViewIframe").src = apiEndpoint;
    $("#offcanvasDetailsIframe").show();
    detailViewModal.show();
  });

  const handleResize = () => {
    detailViewModal.show()
  }

    function isOffcanvasOpen() {
        return $("#offcanvasDetailsIframe").hasClass('show');
    }

    $(window).on('resize', function() {
        if (isOffcanvasOpen()) {
          handleResize()
            console.log('Offcanvas is open.');
        } else {
            console.log('Offcanvas is closed.');
        }
    });




  $(document).on("mouseup", function (e) {
    let container = $(".each-row-action-box");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      let is_visible = container
        .find(".each-row-action-dropdown")
        .attr("data_is_visible");
      if (is_visible !== "true") {
        container
          .find(".each-row-action-dropdown")
          .attr("data-is-visible", false)
          .hide();
      }
    }
  });

  // row action dropdown
  $(document)
    .find(".each-row-action-dropdown-box")
    .each(function (index) {
      let button = $(this).find(".each-row-action-button")[0];
      let tooltip = $(this).find(".each-row-action-dropdown")[0];
      createPopperInstance(button, tooltip);

      let container = $(".dataTables_scrollBody");
      let elementToCheck = $(this).find(".each-row-action-button");

      let observer = new IntersectionObserver((entries) => {
        let is_visible = $(this)
          .find(".each-row-action-dropdown")
          .attr("data-is-visible");
        let isIntersecting = entries[0].isIntersecting;

        if (is_visible && !isIntersecting) {
          $(this)
            .find(".each-row-action-dropdown")
            .attr("data-is-visible", false)
            .hide();
        }
      });

      observer.observe(elementToCheck[0]);
    });

  // show hide row action box
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
      $(".each-row-action-dropdown").parents("tr").css("z-index", "0");
      $(this)
        .parents(".each-row-action-box")
        .find(".each-row-action-dropdown")
        .attr("data-is-visible", true)
        .show();
      $(this).parents("tr").css({ "z-index": "3", position: "relative" });
    });

  $(document)
    .find(".popper-box")
    .each(function (index) {
      let button = $(this).find(".popper-label")[0];
      let tooltip = $(this).find(".popper-content")[0];

      createPopperInstance(button, tooltip);
    });

  $(document)
    .find(".popper-label")
    .on("mouseenter focus", function (event) {
      event.preventDefault();
      $(".popper-content").hide();
      $(this).parents(".popper-box").find(".popper-content").show();
      $(document)
        .find(".popper-box")
        .parents("tr")
        .css({ "z-index": "0", position: "relative" });
      $(this).parents("tr").css({ "z-index": "3", position: "relative" });
    });

  $(document)
    .find(".popper-content")
    .on("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    });

  $(document).on("click", function (event) {
    $(".popper-content").hide();
  });

  $(document)
    .find(".column-filter-box")
    .on("click", function (event) {
      event.stopImmediatePropagation();
    });

  // $(document)
  //   .find(".column-filter-box")
  //   .each(function (index) {
  //     let button = $(this).find(".column-filter-label")[0];
  //     let tooltip = $(this).find(".column-filter-content")[0];

  //     // createPopperInstance(button, tooltip);
  //   });

  $(document)
    .find(".column-filter-label")
    .on("mouseenter focus", function (event) {
      event.preventDefault();
      $(".column-filter-content").hide();
      $(".column-filter-select").select2("close");

      $(this)
        .parents(".column-filter-box")
        .find(".column-filter-content")
        .show();
      $(".each-row-action-dropdown").parents("tr").css("z-index", "0");
      $(this).parents("tr").css({ "z-index": "3", position: "relative" });
    });

  $(document)
    .find(".column-filter-content")
    .on("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    });

  // daterangepicker
  $(document).on("click", function (event) {
    $(".column-filter-content").hide();
  });

  $(document)
    .find(".daterangepicker")
    .on("click", function (event) {
      event.stopImmediatePropagation();
    });

  $(document)
    .find(".select2-container")
    .on("click", function (event) {
      let select2 = $(event.target).closest(".column-filter-select");
      select2.select2("open");
    });

  $(document)
    .find(".each-row-action-dropdown-option")
    .on("click", function (event) {
      let optionKey = $(this).attr("data-key");
      let optiontype = $(this).attr("data-type");
      let optionData = JSON.parse($(this).attr("data-option-data"));
      // let rowData = $(this).parents(".each-cell").data("row-data");
      let rowData = JSON.parse(
        $(this).parents(".each-cell").attr("data-frow-data")
      );

      if (optiontype === "simple") {
        $(document)
          .find(".row-action-simple-dialog-overlay")
          .css({ display: "flex" });
        $(document)
          .find(".row-action-simple-dialog-title")
          .html(optionData?.name);
        $(document)
          .find(".row-action-simple-dialog-description")
          .html(optionData?.confirmation_message);
        $(document).find(".row-action-simple-dialog-form").data({
          rowData: rowData,
          optionKey: optionKey,
          optiontype: optiontype,
        });
      } else {
        $(document).find("#row_actions_form_modal").css({ display: "flex" });

        let rowActionDrawerLayout = drawer_width[
          forms_metadata.row_action_forms[optionData?.name.toLowerCase()].layout
        ]
          ? drawer_width[
              forms_metadata.row_action_forms[optionData?.name.toLowerCase()]
                .layout
            ]
          : forms_metadata.row_action_forms[optionData?.name.toLowerCase()]
              .layout;

        if (rowActionDrawerLayout) {
          $(document)
            .find("#row_actions_form_modal .modal-content")
            .css("width", rowActionDrawerLayout?.toString());
        }

        $("#row_actions_form_modal #zelthy-dynamic-form").attr(
          "data-config",
          JSON.stringify({
            get_data: {
              is_api_based: true,
              url: `./?action_type=row&action_key=${optionKey}&pk=${rowData?.pk}&action=initialize_form`,
              static_config: {},
            },
            post_data: {
              http_method: "POST",
              url: `./?action_type=row&action_key=${optionKey}&pk=${rowData?.pk}&form_type=row_action_form`,
              payload_type: "FORMDATA",
            },
          })
        );
      }
    });

  $(document)
    .find(".download-button")
    .on("click", function (event) {
      event.preventDefault();
      $(".download-confirm-dialog").attr("data-is-visible", false);
      $(".download-confirm-dialog").hide();
      $(this)
        .parents(".table-static-action")
        .find(".download-confirm-dialog")
        .attr("data-is-visible", true)
        .show();
    });

  $("#row_actions_form_modal .modal-close").on("click", function () {
    $("#row_actions_form_modal #zelthy-dynamic-form").attr("data-config", "");
  });

  $(document).on("mouseup", function (e) {
    let container = $(".table-static-action");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      let is_visible = container
        .find(".download-confirm-dialog")
        .attr("data_is_visible");
      if (is_visible !== "true") {
        container.find(".download-confirm-dialog").hide();
      }
    }
  });

  $(document)
    .find(".table-static-action")
    .each(function (index) {
      let button = $(this).find(".download-button")[0];
      let tooltip = $(this).find(".download-confirm-dialog")[0];

      createPopperInstance(button, tooltip);
    });
};

let dataTableApiQueries = null;

function showTableLoader(processing) {
  if (processing) {
    $(document).find(".z-page-loader").css({ visibility: "visible" });
    var table = $(".dataTables_scrollHeadInner table");
    for (var i = 0; i < 10; i++) {
      var row = $("<tr>");
      for (var j = 0; j < columns.length; j++) {
        var rowData = $("<td>").html(`<div class="z-skeleton-loader"></div>`);
        row.append(rowData);
      }
      table.append(row);
    }
  } else {
    $(document).find(".z-skeleton-loader").closest("tr").remove();
    $(document).find(".z-page-loader").css({ visibility: "hidden" });
  }
}
window.onTableProcessing = debounce((processing) =>
  showTableLoader(processing)
);

window.zangoTable = $("#zangotable")
  .on("processing.dt", function (e, settings, processing) {
    $(document).find(".overlay-spinner").hide();
    // hideLoaderComponent()
    // $(document).find(".z-skeleton-loader").closest("tr").remove();
    // $(document).find(".z-page-loader").css({ visibility: "hidden" });
    // onTableProcessing(processing);
  })
  .DataTable({
    pagingType: "input",
    fixedColumns: {
      left: 0,
      right: 1,
    },
    // <img class="custom-empty-table-image" src="{% zstatic 'packages/crud/images/svg/empty-table.svg' %}">
    language: {
      emptyTable: emptyTableSVG,
      info: "Showing: _START_-_END_/_TOTAL_ entries",
      lengthMenu:
        window_size === "desktop"
          ? 'Counts per page <select class="custom-table-page-count">' +
            '<option value="10">10</option>' +
            '<option value="25">25</option>' +
            '<option value="50">50</option>' +
            '<option value="100">100</option>' +
            "</select>"
          : "",
      paginate: {
        first: paginagionFirstIcon,
        last: paginationLastIcon,
        next: paginationNextIcon,
        previous: paginationPreviousIcon,
      },
    },
    paging: true,
    scrollX: true,
    dom: '<"table-top" ><"table-search-box"><"overlay-spinner">t<"table-bottom" <"table-info" i> <"table-pagination-box" lp> >',
    columns: columns,
    columnDefs: [
      {
        defaultContent: "",
        className: "each-cell",
        targets: "_all",
      },
      table_metadata?.row_selector?.enabled
        ? {
            className: "select-checkbox",
            targets: [0],
          }
        : {},
      {
        className: "table-extra-cell",
        targets: [-1],
      },
    ],
    select: table_metadata?.row_selector?.enabled
      ? {
          style: "multi",
          selector: "td:first-child",
        }
      : false,
    order: [],
    processing: true,
    serverSide: true,
    ajax: async function (data, callback) {
      showLoaderComponent(columns);
      const flattenedObject = flattenObject(data);

      dataTableApiQueries = flattenedObject;
      dataTableApiQueries["view"] = "table";
      dataTableApiQueries["action"] = "get_table_data";


      let url = `./?${new URLSearchParams(flattenedObject)}`;
      let responseData = await makeApiCall(url);


      // const testResult = mapData(responseData?.data , table_metadata?.columns);

      if (window_size === "mobile") {
        const mappedCardData = mapTableDataForResponsiveDevice(
          responseData,
          table_metadata
        );
        let cardContainer = $(".cards-container");
        cardContainer.empty();

        mappedCardData.map((cardData, index) => {
          let cardInfo = cardData?.cardInfo;
          cardContainer.append(`
                                <div class="card" data-bs-toggle="offcanvas" data-cardindex="${index}" data-bs-target="#offcanvasBottom">
                                    ${cardData?.title && ` <span class="title">${cardData?.title}</span>`}
                                    <div class="card-info-container">
                                        ${
                                          Object.keys(cardInfo).length > 0 &&
                                          Object.keys(cardInfo)
                                            .map((key) => {
                                              let columnInfo =
                                                table_metadata?.columns?.filter(
                                                  ({ name }) => name === key
                                                );
                                              return `<div class="card-info">
                                                        <div class="card-info-label">${columnInfo[0]?.display_name}:</div>
                                                        <div class="card-info-value">${cardInfo[key]}</div>
                                                    </div>`;
                                            })
                                            .join("")
                                        }
                                    </div>
                                    ${cardData.status_label && `<div class="card-status" style="background-color:${cardData.status_color};"> ${cardData.status_label} </div>`}
                                </div>
                              `);
        });
        if (mappedCardData.length > 0) {
          $(".card").on("click", function () {
            let index = $(this).data("cardindex");
            let cardData = mappedCardData[index];
            handleCardClick(cardData);
          });
        }
      }

      let newData = {
        data: responseData?.data,
        draw: data?.draw,
        recordsFiltered: responseData?.recordsTotal,
        recordsTotal: responseData?.recordsTotal,
      };

      hideLoaderComponent();
      return callback(newData);
    },

    createdRow: function (row, data, dataIndex) {
      $(row)
        .find("td")
        .each(function (index) {
          $(this).data("row-data", data);
          $(this).attr("data-frow-data", JSON.stringify(data));
        });
    },
    initComplete: function () {
      const tableAPI = this.api();
      const isRowSelectEnable = table_metadata?.row_selector?.enabled;

      $(document)
        .find(".custom-table-page-count")
        .select2({ minimumResultsForSearch: -1 })
        .val("10");
      // $(document).find(".custom-table-page-count").val("10");
      // $(document).find(".custom-table-page-count").trigger("change");

      let totalColumns = tableAPI.columns().count();
      let columnFilter = `<tr>
                            ${Array(totalColumns)
                              .fill(0)
                              .map((_, i) => {
                                return `<th  class="each-filter-cell" rowspan="1" colspan="1" aria-label=""></th>`;
                              })
                              .join("")}
                        </tr>`;

      // Add column filters if available
      const isColumnFilterAvailable = table_metadata.columns.some(
        (col) =>
          (col.searchable && col.type === "string" && col.choices?.length) ||
          (col.searchable && ["datetime", "date"].includes(col.type))
      );

      if (isColumnFilterAvailable) {
        $(
          ".dataTables_scrollHead table.stripe.hover.order-column.dataTable.no-footer thead"
        ).append(columnFilter);
      }

      let filterIndex = isRowSelectEnable ? 1 : 0;
      tableAPI.columns().every(function (colIdx) {
        const isSelectableColumn = isRowSelectEnable ? colIdx !== 0 : true;
        const isExcludedColumn = colIdx !== totalColumns - 1;
        const isValidColumn = isSelectableColumn && isExcludedColumn;

        if (!isValidColumn) return; // Skip invalid columns

        const column = this;
        const columnMetadata =
          table_metadata?.columns[colIdx - filterIndex] || {};
        const isSearchable = columnMetadata.searchable;
        const isStringColumn = columnMetadata.type === "string";
        const hasChoices = columnMetadata.choices?.length > 0;
        const isDateColumn = ["date", "datetime"].includes(columnMetadata.type);

        // Common filter box HTML
        const columnFilterBoxHtml = `
            <div class="column-filter-box popper-box-${colIdx}" style="top: 0px;">
                <div class="column-filter-label popper-label-${colIdx}">
                    ${tableColumFilterIcon}
                </div>
            </div>
        `;

        const columnCell = $(`thead tr:eq(0) .each-cell`).eq(colIdx);

        if (isSearchable) {
          if (isStringColumn && hasChoices) {
            // Append filter box and create select element
            columnCell.append(columnFilterBoxHtml);

            const select2 = $(`
                <select id="column-filter-select-${colIdx}" class="column-filter-select">
                    <option value="">Select</option>
                </select>
            `)
              .on("change", function () {
                const selectedValue = $(this).val();
                if (column.search() !== selectedValue) {
                  column.search(selectedValue).draw();
                }
              })
              .on("select2:close", function () {
                $(this).select2({
                  placeholder: "",
                  width: "100%",
                  dropdownAutoWidth: true,
                  allowClear: true,
                  closeOnSelect: false,
                  templateResult: function (data) {
                    return data.text;
                  },
                  templateSelection: function (data) {
                    return $(
                      `<span id="select-2-filter-icon-${colIdx}" >` +
                        filterIcon +
                        `</span>`
                    );
                  },
                  dropdownCssClass: "custom-select2-dropdown",
                });
              })
              .on("select2:open", function (e) {
                // Find the dropdown container and append the clear button
                if (!$(".select2-clear-btn").length) {
                  // Ensure clear button is only added once
                  let dropdown = $(".select2-results");
                  dropdown.append(clearButton);
                }
              });

            $(document).on("click", ".select2-clear-btn", function () {
              $(`#column-filter-select-${colIdx}`).val(null).trigger("change"); // Clear the selection
              $(`#column-filter-select-${colIdx}`).select2("close"); // Close dropdown after clearing
            });

            // Append options and initialize Select2
            columnMetadata.choices.forEach(({ id, label }) => {
              select2.append(`<option value="${id}">${label}</option>`);
            });

            let filterIcon = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M9.2545 7.97654C9.2545 7.77676 9.34794 7.48628 9.46539 7.32618L12.9732 2.54006C13.0893 2.37995 13.0333 2.25102 12.8437 2.25102H3.95702C3.76882 2.25102 3.71009 2.37853 3.82754 2.54006L7.33535 7.32618C7.45147 7.48487 7.54624 7.77533 7.54624 7.97654V13.4953C7.54624 13.6951 7.68638 13.7986 7.8639 13.7235L8.93702 13.2672C9.11321 13.1936 9.25469 12.9739 9.25469 12.7699L9.2545 7.97654ZM10.6213 12.7699C10.6213 13.5676 10.1381 14.32 9.44537 14.6147L8.37092 15.0709C7.29381 15.5271 6.17928 14.7209 6.17928 13.4953V8.11107L2.74904 3.42978C1.93619 2.32036 2.62624 0.800049 3.95699 0.800049H12.8437C14.1824 0.800049 14.8591 2.32743 14.0516 3.42978L10.6214 8.11107L10.6213 12.7699Z" fill="currentColor"/>
                            </svg>
                          `;

            let clearButton = `
                              <li class="select2-clear-btn">
                                <button type="button" style="background: transparent; border: none; cursor: pointer; display: flex; align-items: center;">
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_1420_291)">
                                    <path d="M8.75343 0.732516L5.25123 4.23472C5.10787 4.37807 4.88046 4.37807 4.74925 4.23472L1.24657 0.732516C1.10321 0.589161 0.875798 0.589161 0.744589 0.732516C0.601235 0.87587 0.601235 1.10329 0.744589 1.23449L4.24727 4.73718C4.39063 4.88053 4.39063 5.10795 4.24727 5.23915L0.732516 8.75343C0.589161 8.89679 0.589161 9.1242 0.732516 9.25541C0.87587 9.39876 1.10329 9.39876 1.23449 9.25541L4.73718 5.75273C4.88053 5.60937 5.10795 5.60937 5.23915 5.75273L8.75343 9.26748C8.89679 9.41084 9.1242 9.41084 9.25541 9.26748C9.39877 9.12413 9.39877 8.89671 9.25541 8.76551L5.76492 5.25075C5.62157 5.1074 5.62157 4.87998 5.76492 4.74877L9.2676 1.24609C9.41096 1.10274 9.41096 0.87532 9.2676 0.744111C9.12425 0.600757 8.8973 0.600757 8.75348 0.732437L8.75343 0.732516Z" fill="${crudCssVariables["--primary-color"]}" stroke="${crudCssVariables["--primary-color"]}" stroke-width="0.4"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_1420_291">
                                    <rect width="10" height="10" fill="${crudCssVariables["--primary-color"]}"/>
                                    </clipPath>
                                    </defs>
                                  </svg>
                                  <span style="margin-left: 8px; font-size: 12px; font-weight: 500; color: ${crudCssVariables["--primary-color"]};">Clear selection</span>
                                </button>
                              </li>
                            `;

            $(`.popper-label-${colIdx}`).html(select2);
            select2.select2({
              placeholder: "",
              width: "resolve",
              dropdownAutoWidth: true,
              allowClear: true,
              templateResult: function (data) {
                return data.text;
              },
              templateSelection: function (data) {
                return $(
                  `<span id="select-2-filter-icon-${colIdx}">` +
                    filterIcon +
                    `</span>`
                );
              },
              dropdownCssClass: "custom-select2-dropdown",
            });
          } else if (isDateColumn) {
            // Append filter box and create datepicker element

            columnCell.append(`
              <div class="column-filter-box datepicker-filter-box popper-box-${colIdx}">
                <div class="column-filter-label popper-label-${colIdx}">
                    ${tableColumFilterIcon}
                </div>
              </div>`);

            const datepicker = $(`
                <div id="datepicker-${colIdx}" style="color: #6C747D" class="table-date-range-picker" data-colIdx="${colIdx}">
                    ${datepickerIcon}
                </div>
            `);

            $(`.popper-label-${colIdx}`).html(datepicker);
          }
        }
      });

      // zangoTable.columns.adjust().draw();

      $("th.select-checkbox.each-cell:first-child").html(
        `<button id="table_select_all_row" type="button" class="table_select_all_row"></button>`
      );
      $(".table_select_all_row").on("click", function () {
        if ($(this).hasClass("all_row_selected")) {
          $(this).removeClass("all_row_selected");
          zangoTable.rows().deselect();
        } else {
          $(this).addClass("all_row_selected");
          zangoTable.rows().select();
        }
      });

      zangoTable.on("select deselect", function (e, dt, type, indexes) {
        if (type === "row") {
          let data = zangoTable.rows({ selected: true }).data().pluck("pk");
          let count = zangoTable.rows({ selected: true }).count();
          if (count > 0) {
            $(".table-action").css({ display: "flex" });
          } else {
            $(".table-action").hide();
          }
        }
      });
      $(".table-search-box").html(`
          <div class="table-search-input-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <g clip-path="url(#clip0_2358_618)">
                  <path d="M13.9647 13.0221C15.0263 11.7505 15.6646 10.1148 15.6646 8.33314C15.6646 4.28923 12.375 1 8.33388 1C4.28957 1 1 4.28923 1 8.33314C1 12.3762 4.28957 15.6663 8.33388 15.6663C10.1158 15.6663 11.7516 15.0265 13.0233 13.9666L17.8612 18.8039C17.9909 18.9336 18.1612 19 18.333 19C18.5033 19 18.6752 18.9344 18.8049 18.8039C19.065 18.5438 19.065 18.122 18.8049 17.8619L13.9647 13.0221ZM8.33388 14.3321C5.02631 14.3321 2.33431 11.6403 2.33431 8.3331C2.33431 5.02587 5.02631 2.33413 8.33388 2.33413C11.6414 2.33413 14.3335 5.02587 14.3335 8.3331C14.3335 11.6403 11.6414 14.3321 8.33388 14.3321Z" fill="black" stroke="black" stroke-width="0.2"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_2358_618">
                  <rect width="20" height="20" fill="white"/>
                  </clipPath>
                  </defs>
              </svg>
          
              <input id='table_search' type="text" placeholder="${
                window_size === "mobile"
                  ? "Search"
                  : "Search by " +
                    searchable
                      ?.map((eachSeachable) => eachSeachable.toLowerCase())
                      ?.join(", ")
              }"/>
          </div>
          ${
            has_export_permission
              ? `<div class="table-static-action">
                  <button type="button" class="download-button">
                    <span>Download</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.408 12.9034C18.7349 12.9034 19 13.1658 19 13.4895V15.6002C19 17.4776 17.4623 19 15.566 19H4.43404C2.53774 19 1 17.4776 1 15.6002V13.4895C1 13.1658 1.26509 12.9034 1.59204 12.9034C1.91899 12.9034 2.18408 13.1658 2.18408 13.4895V15.6002C2.18408 16.8302 3.19166 17.8278 4.43408 17.8278H15.566C16.8084 17.8278 17.816 16.8302 17.816 15.6002V13.4895C17.816 13.1658 18.081 12.9034 18.408 12.9034ZM9.99998 2.00008C10.3136 2.00008 10.5709 2.24164 10.5906 2.54723L10.592 2.58621V12.2574L13.1485 9.89548C13.3771 9.68386 13.73 9.68664 13.9557 9.89409L13.9853 9.92402C14.199 10.1503 14.1962 10.4997 13.9867 10.7232L13.9564 10.7524L10.4077 14.0317C10.3965 14.0422 10.3859 14.0512 10.3747 14.061C10.3712 14.0631 10.3684 14.0658 10.3656 14.0679C10.3585 14.0735 10.3508 14.0791 10.3438 14.0839C10.3388 14.0874 10.3339 14.0909 10.3283 14.0944C10.3234 14.0979 10.3184 14.1013 10.3128 14.1041C10.3079 14.1076 10.303 14.1104 10.2973 14.1139C10.2896 14.1181 10.2819 14.1222 10.2734 14.1264L10.2643 14.1313C10.2573 14.1348 10.2495 14.1382 10.2425 14.1417C10.2369 14.1438 10.232 14.1459 10.227 14.148C10.22 14.1508 10.2137 14.1536 10.2073 14.1563L10.1898 14.1619C10.1848 14.164 10.1799 14.1654 10.1743 14.1668C10.1673 14.1689 10.1602 14.171 10.1525 14.173C10.1335 14.1786 10.1131 14.1828 10.0934 14.1856C10.0885 14.1863 10.0829 14.187 10.078 14.1877L10.0386 14.1918L9.99993 14.1925C9.9697 14.1925 9.93946 14.1904 9.90923 14.1863L9.88181 14.1814C9.7004 14.2176 9.50492 14.1696 9.35939 14.0352L5.80655 10.7523C5.56749 10.5316 5.55484 10.1606 5.77772 9.92395C6.00062 9.68727 6.37538 9.67474 6.61443 9.89541L9.40803 12.4765V2.58614C9.40803 2.26244 9.67303 2.00008 9.99998 2.00008Z" fill="black" stroke="black" stroke-width="0.3"/>
                    </svg>
                  </button>
                  <div class="download-confirm-dialog" id="downloadDialog">
                    <div class="download-confirm-dialog-outer">
                      <div class="download-confirm-dialog-messages">
                        <p>
                          The report will be available in <strong>‘My Downloads’</strong> in <strong>30 min</strong>.
                        </p>
                        <p>
                          Confirm if you want to proceed with download?
                        </p>
                      </div> 
                      <button type="button" class="download-confirm-dialog-button">
                        Download
                      </button>   
                    </div>
                  </div>
              </div>`
              : ""
          }

          <div class="table-action">
            ${table_metadata?.actions?.table
              ?.map(({ name, key, icon }) => {
                return `<button type="button" class="each-table-action-button" data-key="${key}">
                          ${name ? `<span>${name}</span>` : ""} 
                          ${
                            icon
                              ? `<img src="${icon}" alt="${name} icon"/>`
                              : ""
                          }
                        </button>`;
              })
              .join("")}
          </div>
      `);

      $(document)
        .find(".download-confirm-dialog-button")
        .on("click", async function () {
          setElementStyle("#downloadDialog", "display", "block");
          delete dataTableApiQueries["draw"];
          dataTableApiQueries["view"] = "table";
          dataTableApiQueries["action"] = "export_table";

          let url = `./?${new URLSearchParams(dataTableApiQueries)}`;
          let responseData = await makeApiCall(url);

          if (responseData?.success) {
            ZToast(
              "success",
              "Download Confirmation",
              responseData?.response?.message,
              3000
            );
            setElementStyle("#downloadDialog", "display", "none");
          } else {
            ZToast(
              "error",
              "Server Error",
              responseData?.response?.message,
              3000
            );
          }
        });

      $(document)
        .find(".each-table-action-button")
        .on("click", function () {
          let buttonKey = $(this).attr("data-key");
          let data = zangoTable.rows({ selected: true }).data().pluck("pk");
          let count = zangoTable.rows({ selected: true }).count();
          let allSelectedIds = Array(count)
            .fill(0)
            .map((_, i) => data[i]);
        });

      function searchInTable(value) {
        zangoTable.search(value).draw();
      }
      const searchFieldChange = debounce((value) => searchInTable(value), 500);

      $(document)
        .find("#table_search")
        .on("change keyup paste", function () {
          let searchValue = $(this).val();
          searchFieldChange(searchValue);
        });

      new $.fn.dataTable.FixedHeader(zangoTable, {
        headerOffset: $(".table-search-box").outerHeight(),
        header: true,
        footer: false,
      });

      function resizePaginationInputWidth() {
        let value = $(document).find(".paginate_input").val();
        if (value) {
          $(document)
            .find(".paginate_input")
            .css({ width: `${value.length + 5}ch` });
        }
      }

      resizePaginationInputWidth();

      $(document)
        .find(".paginate_input")
        .on("change keypress", function () {
          resizePaginationInputWidth();
        });

      $(".row-action-simple-dialog-form").on("submit", function () {
        event.preventDefault();

        let rowData = $(this).data("rowData");
        let optionKey = $(this).data("optionKey");

        let formData = new FormData();
        formData.append("pk", rowData?.pk);

        simpleRowAction(
          formData,
          optionKey,
          zangoTable,
          ".row-action-simple-dialog-overlay"
        );
      });

      $(".row-action-simple-dialog-form")
        .find(".close-button")
        .on("click", function () {
          $(this).data("optionKey", "");
          $(".row-action-simple-dialog-overlay").css({ display: "none" });
        });

      attachTableDrawEvents();

      // for handling 70 char condition and custom sort icons
      $("th.each-cell").each((index, cell) => {
        if ($(cell).children().length === 0) {
          // if column header has more than 70 char then break the line
          let cellData = $(cell).html();
          let cellDataLength = cellData?.length;
          if (cellData && cellDataLength > 70) {
            $(cell).css("white-space", "break-spaces");
          }
        }
        if ($(cell).hasClass("sorting")) {
          $(cell).append(`<div class="asc_desc_sort_wrapper">
                        <div id="asc_sort">
                            <svg id="asc_sort_deactive" xmlns="http://www.w3.org/2000/svg" width="8" height="7" viewBox="0 0 8 7" fill="currentColor">
                                <path d="M0.635294 6.22853H7.3776C7.60357 6.22853 7.80305 6.10905 7.89604 5.90957C7.98902 5.7101 7.97604 5.47061 7.84305 5.29762L4.45188 0.896015C4.23889 0.61653 3.74695 0.61653 3.53449 0.896015L0.169781 5.29762C0.0367943 5.47061 0.0103031 5.71009 0.116794 5.90957C0.209781 6.10905 0.409259 6.22853 0.63523 6.22853H0.635294ZM4 2.19889L6.19428 5.07167H1.80571L4 2.19889Z" fill="currentColor"/>
                            </svg>
                            <svg id="asc_sort_active" style="display: none;" xmlns="http://www.w3.org/2000/svg" width="8" height="7" viewBox="0 0 8 7" fill="${crudCssVariables["--primary-color"]}">
                                <path d="M0.635294 6.22841H7.3776C7.60357 6.22841 7.80305 6.10893 7.89604 5.90945C7.98902 5.70997 7.97604 5.47049 7.84305 5.2975L4.45188 0.895893C4.23889 0.616408 3.74695 0.616408 3.53449 0.895893L0.169781 5.2975C0.0367943 5.47049 0.0103031 5.70997 0.116794 5.90945C0.209781 6.10893 0.409323 6.22841 0.635294 6.22841Z" fill="${crudCssVariables["--primary-color"]}"/>
                            </svg>
                        </div>
                        <div id="desc_sort">
                            <svg id="desc_sort_deactive" xmlns="http://www.w3.org/2000/svg" width="8" height="7" viewBox="0 0 8 7" fill="currentColor">
                                <path d="M7.36479 0.757812H0.635378C0.409406 0.757812 0.209926 0.877293 0.116942 1.07677C0.0239571 1.27624 0.0369419 1.51573 0.169929 1.68872L3.53463 6.09086C3.64113 6.23735 3.81412 6.31683 3.98658 6.31683C4.15957 6.31683 4.33256 6.23683 4.43852 6.09086L7.80322 1.68872C7.93621 1.51573 7.9627 1.27625 7.85621 1.07677C7.79024 0.890799 7.59075 0.757812 7.36478 0.757812H7.36479ZM4.00008 4.78745L1.8058 1.91467H6.20793L4.00008 4.78745Z" fill="currentColor"/>
                            </svg>
                            <svg id="desc_sort_active" style="display: none;" xmlns="http://www.w3.org/2000/svg" width="8" height="7" viewBox="0 0 8 7" fill="${crudCssVariables["--primary-color"]}">
                                <path d="M7.36466 0.757812H0.635256C0.409284 0.757812 0.209804 0.877293 0.11682 1.07677C0.023835 1.27624 0.0368198 1.51573 0.169807 1.68872L3.53451 6.09085C3.641 6.23735 3.814 6.31683 3.98645 6.31683C4.15944 6.31683 4.33243 6.23683 4.4384 6.09085L7.8031 1.68872C7.93609 1.51573 7.96258 1.27625 7.85609 1.07677C7.79011 0.890799 7.59064 0.757812 7.36466 0.757812Z" fill="${crudCssVariables["--primary-color"]}"/>
                            </svg>
                        </div>
                    </div>`);
        }
      });
    },
  });

zangoTable.on("draw.dt", function () {
  $("th.each-cell").each((index, cell) => {
    if ($(cell).hasClass("sorting_asc")) {
      $(cell)
        .children("div")
        .children("div")
        .children("#asc_sort_active")
        .css("display", "block");
      $(cell)
        .children("div")
        .children("div")
        .children("#asc_sort_deactive")
        .css("display", "none");
    } else {
      $(cell)
        .children("div")
        .children("div")
        .children("#asc_sort_active")
        .css("display", "none");
      $(cell)
        .children("div")
        .children("div")
        .children("#asc_sort_deactive")
        .css("display", "block");
    }
    if ($(cell).hasClass("sorting_desc")) {
      $(cell)
        .children("div")
        .children("div")
        .children("#desc_sort_active")
        .css("display", "block");
      $(cell)
        .children("div")
        .children("div")
        .children("#desc_sort_deactive")
        .css("display", "none");
    } else {
      $(cell)
        .children("div")
        .children("div")
        .children("#desc_sort_active")
        .css("display", "none");
      $(cell)
        .children("div")
        .children("div")
        .children("#desc_sort_deactive")
        .css("display", "block");
    }
  });
  attachTableDrawEvents();
});

var inputElements = document.getElementsByName("csrfmiddlewaretoken");
let tableCardContainer = $(".dataTables_scroll");
tableCardContainer.append(` <div class="cards-container">`);

$(document)
  .find(".modal-close")
  .on("click", function () {
    let modalId = $(this).data("modal");
    $(`#${modalId}`).css({ display: "none" });
  });
