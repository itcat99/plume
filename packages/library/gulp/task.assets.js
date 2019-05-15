const assetsExt = process.env.PLUME_ASSETSEXT;

function assets() {
  const extArr = assetsExt.split(",");
  console.log(extArr);
}
module.exports = assets;
