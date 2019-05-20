module.exports = {
  target: "root",
  flow: false,
  webpack: null,
  dll: true,
  dllName: "vendor",
  dllVendor: ["react", "react-dom", "react-router-dom", "react-loadable"],
  hashRouter: false,
  gzip: true,
};
