const root = document.querySelector(":root");

/**
 * Sets CSS variables on the root element based on the provided object.
 *
 * @param {Object} vars - An object containing CSS variable names as keys and their corresponding values.
 * @return {void} This function does not return anything.
 */

const setCssVariables = (obj) =>
  Object.entries(obj).forEach((v) => root.style.setProperty(v[0], v[1]));

/**
 * Flattens a nested object into a single level object with keys representing the nested structure.
 *
 * @param {Object} obj - The object to be flattened.
 * @param {string} [parentKey=""] - The parent key of the current object.
 * @return {Object} The flattened object.
 */

function flattenObject(obj, parentKey = "") {
  let result = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let fullKey = parentKey ? `${parentKey}[${key}]` : key;
      if (typeof obj[key] === "object") {
        Object.assign(result, flattenObject(obj[key], fullKey));
      } else {
        result[fullKey] = obj[key];
      }
    }
  }

  return result;
}

/**
 * Creates a debounced function that delays invoking the provided function until after `timeout` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param {function} func - The function to debounce.
 * @param {number} [timeout=300] - The number of milliseconds to delay.
 * @return {function} The debounced function.
 */

const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

/**
 * Retrieves the value of a specific query parameter from the current URL.
 *
 * @param {string} param - The name of the query parameter to retrieve.
 * @return {string|null} The value of the query parameter, or null if it does not exist.
 */

const getQueryParamValue = (param) => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get(param);
};

/**
 * Checks if a specific query parameter exists in the current URL.
 *
 * @param {string} param - The name of the query parameter to check.
 * @return {boolean} True if the query parameter exists, false otherwise.
 */

const doesQueryParamExist = (param) => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.has(param);
};

/**
 * Creates a Popper instance for a tooltip attached to a button element.
 *
 * @param {HTMLElement} buttonElement - The button element the tooltip is attached to.
 * @param {HTMLElement} tooltipElement - The tooltip element to be positioned.
 * @param {Object} [options={}] - Additional options for the Popper instance.
 * @return {void}
 */

const createPopperInstance = (buttonElement, tooltipElement, options = {}) => {
  let button = buttonElement;
  let tooltip = tooltipElement;

  if (button && tooltip) {
    let defaultOptions = {
      strategy: "fixed",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [10, 0],
          },
        },
      ],
    };

    let popperOptions = $.extend(true, defaultOptions, options);

    let popperInstance = Popper.createPopper(button, tooltip, popperOptions);
    popperInstance.setOptions({ placement: "bottom-end" });

    $(document).on("click", function () {
      if (popperInstance) {
        popperInstance.update();
      }
    });
  } else {
    console.error("Button or tooltip element not found.");
  }
};

/**
 * Sets the dynamic form configuration for the specified selector.
 *
 * @param {string} selector - The CSS selector to match the element.
 * @param {object} config - The configuration object to be set.
 * @return {void} This function does not return anything.
 */

const setDynamicFormConfig = (selector, config) => {
  let element = $(selector);
  if (element.length > 0) {
    element.attr("data-config", JSON.stringify(config));
  } else {
    console.error(`Element not found for selector: '${selector}'`);
  }
};

function generateDetailViewUrl(params) {
  const currentUrl = window.location.href;
  const urlSearchParams = new URLSearchParams(window.location.search);

  // Add or update query parameters based on the passed object
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      urlSearchParams.set(key, params[key]);
    }
  }

  // Return the updated URL
  return `${currentUrl.split("?")[0]}?${urlSearchParams.toString()}`;
}

export {
  setCssVariables,
  flattenObject,
  debounce,
  getQueryParamValue,
  doesQueryParamExist,
  createPopperInstance,
  setDynamicFormConfig,
  generateDetailViewUrl,
};
