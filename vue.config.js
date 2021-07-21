module.exports = {
  publicPath: "./",
  devServer: {
    open: true, 
    host: "localhost",
    port: 8080,
    https: false,
    hotOnly: false, 
    proxy: {
      "/api": {
        // target: "http://112.90.80.168:6068",
        target:"http://82.156.230.142:10900",
        ws: true,
        changOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
      "/location/": {
        // target: "http://112.90.80.168:6068",
        target:"http://82.156.230.142:10003",
        ws: true,
        changOrigin: true,
        pathRewrite: {
          "^/location": "",
        },
      },
      "/imgs":{
        target:"http://152.136.229.63/img",
        ws:true,
        changOrigin:true,
        pathRewrite:{
          "^/imgs":""
        }
      },
    },
  },
};
