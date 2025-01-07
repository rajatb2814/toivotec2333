import { getCookie } from "../helpers/cookie.js";
import { hideLoaderComponent } from "../modules/table/TableSkeletonLoader.js";
const makeApiCall = async (url, method = "GET", headers = {}, body = null) => {
  try {
    let options = {
      method: method,
      headers: {
        ...headers,
        "X-CSRFToken": getCookie("csrftoken"),
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
      options.headers["Content-Type"] = "application/json";
    }

    let response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    let data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    hideLoaderComponent();
    console.error("There has been a problem with your fetch operation:", error);
    return error;
  }
};

export { makeApiCall };
