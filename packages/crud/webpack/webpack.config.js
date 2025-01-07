const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env) => {
  let buildType = env.NODE_ENV_BUILD;
  let entryPoint;
  let filename;

  function getVersionedFileName(filename) {
    const manifestPath = path.resolve(__dirname, "../manifest.json");
    const manifest = require(manifestPath);

    if (manifest && manifest.version) {
      switch (buildType) {
        case "table":
          return `crud.table.v${manifest.version}.min.js`;
        case "detail":
          return `crud.detail.v${manifest.version}.min.js`;
        case "standalone-form":
          return `crud.standalone_form.v${manifest.version}.min.js`;
        default:
          console.log("Please specify build type");
      }
    }

    console.error(
      `Error: Unable to read version from manifest.json at path: ${manifestPath}`
    );
    return filename; // Default filename if version is not available
  }

  switch (buildType) {
    case "table":
      entryPoint = "../frontend/table.js";
      filename = "crud.table.min.js";
      break;
    case "detail":
      entryPoint = "../frontend/detail.js";
      filename = "crud.detail.min.js";
      break;
    case "standalone-form":
      entryPoint = "./webpack.standalone_form.js";
      filename = "crud.standalone_form.min.js";
      break;
    default:
      console.log("Please specify build type");
  }
  return {
    entry: entryPoint,
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: "svg-inline-loader",
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: false, // Disable compression
            mangle: true, // Enable minification
          },
        }),
      ],
    },
    output: {
      filename: getVersionedFileName(filename),
      path: path.resolve(__dirname, "../static/js"),
    },
    mode: "production",
  };
};
