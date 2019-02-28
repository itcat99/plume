const dev = async config => {
  const Koa = require('koa');
  const koaWebpack = require('koa-webpack');

  const app = new Koa();
  const middleware = await koaWebpack({
    config,
    hotClient: {
      port: config.devServer.port
    }
  });

  app.use(middleware);
  app.use(async (ctx) => {
    const filename = path.resolve(webpackConfig.output.path, 'index.html')
    ctx.response.type = 'html'
    ctx.response.body = middleware.devMiddleware.fileSystem.createReadStream(filename)
  });
}

module.exports = (config, mode) => {
  const isDev = mode === "development";
  const options = require("../webpack/webpack.config")(config, isDev);

  console.log("config: ", options);
  if (isDev) {
    dev(options)
      .then(() => console.log("> SUCCESSED!"))
      .catch(err => console.error("> FAILD: ", err));
  } else {
    const webpack = require("webpack");
  }
};