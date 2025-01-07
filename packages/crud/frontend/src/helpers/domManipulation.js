/**
 * Sets the specified style property of the elements matching the given selector to the given value.
 *
 * @param {string} selector - The CSS selector to match the elements.
 * @param {string} styleProperty - The name of the style property to set.
 * @param {string|number} value - The value to set for the style property.
 * @return {void} This function does not return anything.
 */

const setElementStyle = (selector, styleProperty, value) => {
  let elements = $(selector);
  if (elements.length > 0) {
    elements.css(styleProperty, value);
  } else {
    console.error(`No elements found for selector '${selector}'.`);
  }
};
export { setElementStyle };
