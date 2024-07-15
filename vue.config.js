const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  publicPath: "/",
  transpileDependencies: true,
  lintOnSave: false,
  pwa: {
    // name: "My App",
    // themeColor: "#4DBA87",
    // msTileColor: "#000000",
    // appleMobileWebAppCapable: "yes",
    // appleMobileWebAppStatusBarStyle: "black",

    // configure the workbox plugin
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "./src/service-worker.js",
      // ...other Workbox options...
    },
  },
  css: {
    sourceMap: true,
  },
  devServer: {
    proxy: {
      api: {
        target: "https://media.taiwan.net.tw",
        changeOrigin: true,
        pathRewrite: {
          api: "",
        },
        //   ws: true
      },
    },
  },
});
