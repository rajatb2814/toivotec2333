import { setCssVariables } from "./misc.js";

/**
 * Applies the given app theme configuration to the application.
 *
 * @param {Object} appThemeConfig - The app theme configuration object.
 * @param {string} appThemeConfig.color.primary - The primary color of the app theme. Defaults to "#DDE2E5".
 * @param {string} appThemeConfig.color.secondary - The secondary color of the app theme. Defaults to "#E1D6AE".
 * @param {string} appThemeConfig.color.background - The background color of the app theme. Defaults to "#FFFFFF".
 * @return {void} This function does not return anything.
 */

window.crudCssVariables;
const applyAppThemeConfig = (appThemeConfig) => {
  const newAppThemeConfig = {
    color: {
      accent: appThemeConfig?.color?.primary || "#DDE2E5",
      header: "#FFFFFF",
      primary: appThemeConfig?.color?.primary || "#DDE2E5",
      sidebar: appThemeConfig?.color?.secondary || "#E1D6AE",
      secondary: appThemeConfig?.color?.secondary || "#E1D6AE",
      background: appThemeConfig?.color?.background || "#FFFFFF",
      typography: "#212429",
      headerBorder: "#DDE2E5",
    },
  };

  const newAppConfig = { ...config, config: newAppThemeConfig };

  crudCssVariables = {
    "--primary-color":
      tinycolor
        .mix(
          tinycolor(newAppConfig?.config?.color?.primary).toHexString(),
          "#FFFFFF",
          9
        )
        .toHexString() || "#DDE2E5",
    "--primary-medium-color": tinycolor
      .mix(
        tinycolor(newAppConfig?.config?.color?.primary).toHexString(),
        "#FFFFFF",
        50
      )
      .toHexString(),
    "--primary-light-color": tinycolor
      .mix(
        tinycolor(newAppConfig?.config?.color?.primary).toHexString(),
        "#FFFFFF",
        90
      )
      .toHexString(),
    "--secondary-color":
      tinycolor(newAppConfig?.config?.color?.secondary).toHexString() ||
      "#E1D6AE",
    "--accent-color":
      tinycolor(newAppConfig?.config?.color?.accent).toHexString() || "#DDE2E5",
    "--background-color":
      tinycolor(newAppConfig?.config?.color?.background).toHexString() ||
      "#FFFFFF",
    "--typography-color":
      tinycolor(newAppConfig?.config?.color?.typography).toHexString() ||
      "#212429",
    "--top-navbar-color": tinycolor(
      newAppConfig?.config?.color?.header
    ).isLight()
      ? tinycolor(newAppConfig?.config?.color?.typography).toHexString() ||
        "#212429"
      : "#FFFFFF",
    "--top-navbar-background-color":
      tinycolor(newAppConfig?.config?.color?.header).toHexString() || "#FFFFFF",
    "--top-navbar-border-color":
      tinycolor(newAppConfig?.config?.color?.headerBorder).toHexString() ||
      "#DDE2E5",
    "--side-navbar-color": tinycolor(
      newAppConfig?.config?.color?.sidebar
    ).isLight()
      ? tinycolor(newAppConfig?.config?.color?.typography).toHexString() ||
        "#212429"
      : "#FFFFFF",
    "--side-navbar-background-color":
      tinycolor(newAppConfig?.config?.color?.sidebar).toHexString() ||
      "#E1D6AE",
    "--side-navbar-hover-background-color": tinycolor(
      newAppConfig?.config?.color?.sidebar
    ).isLight()
      ? tinycolor
          .mix(
            tinycolor(newAppConfig?.config?.color?.sidebar).toHexString(),
            "#000000",
            6
          )
          .toHexString() || "#E1D6AE"
      : tinycolor
          .mix(
            tinycolor(newAppConfig?.config?.color?.sidebar).toHexString(),
            "#FFFFFF",
            6
          )
          .toHexString() || "#FFFFFF",
  };

  setCssVariables(crudCssVariables);
};

export { applyAppThemeConfig };
