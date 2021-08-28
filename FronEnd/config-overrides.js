const { override, fixBabelImports, addLessLoader, addWebpackAlias, overrideDevServer } = require("customize-cra");
// // const path = require("path");
//
// const supportMjs = () => (webpackConfig) => {
//     // console.log('supportMjs', webpackConfig.output)
//     webpackConfig.output.path = '/Users/anton/Documents/Projects/mobile-inspections/dynamicdq-api/src/main/resources/react-app'
//     webpackConfig.module.rules.push({
//         test: /\.mjs$/,
//         include: /node_modules/,
//         type: 'javascript/auto',
//     });
//     return webpackConfig;
// };
//
// module.exports = {
//     webpack: override(
//         fixBabelImports("import", {
//             libraryName: "antd",
//             libraryDirectory: "es",
//             style: true
//         }),
//         addLessLoader({
//             javascriptEnabled: true,
//             modifyVars: {
//                 "@font-size-base": "12px"
//             }
//         }),
//         supportMjs()
//         // addWebpackAlias({
//         //     ["rt-design"]: path.resolve("/Users/anton/Documents/air-tech/react-tech-design")
//         // }),
//     ),
//     devServer: overrideDevServer(
//         // dev server plugin
//         (devServerConfig) => ({...devServerConfig, writeToDisk: false})
//     )
// };

module.exports = override(
    fixBabelImports("import", {
        libraryName: "antd",
        libraryDirectory: "es",
        style: true
    }),
    addLessLoader({
        javascriptEnabled: true,
        // modifyVars: variables
    })
);
