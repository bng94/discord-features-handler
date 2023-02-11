module.exports = (client) => {
  process.on("unhandledRejection", (e) => {
    console.log(e);
  });
};
