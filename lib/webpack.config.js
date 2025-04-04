module.exports = {
    entry: "./lib/src/index.js",
    output: {
        path: __dirname + "/dist/",
        filename: "threejs-hex-map.js",
        library: "threejs-hex-map",
        libraryTarget: "amd"
    },
    externals: {
        "three": "three"
    },
    resolve: {
        modules: ["node_modules"]
    }
};
//# sourceMappingURL=webpack.config.js.map