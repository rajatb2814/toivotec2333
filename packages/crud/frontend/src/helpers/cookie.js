/**
 * Returns the value of a cookie with the given name.
 *
 * @param {string} cname - The name of the cookie.
 * @return {string} The value of the cookie, or an empty string if the cookie does not exist.
 */
const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  console.log(decodedCookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};
export { getCookie };
